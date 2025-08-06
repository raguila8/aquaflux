import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const VAULT_ADDRESS = '0x9EE4d24dB1104bDF818391efCB8CCBa8Ff206159';
const WEBHOOK_SECRET = process.env.ALCHEMY_WEBHOOK_SECRET || '';
const WEBHOOK_AUTH_TOKEN = process.env.ALCHEMY_WEBHOOK_AUTH_TOKEN || '';
const VAULT_DATA_FILE = path.join(process.cwd(), 'transactions', 'data', 'vault-transactions.json');

interface AlchemyWebhookEvent {
  webhookId: string;
  id: string;
  createdAt: string;
  type: string;
  event: {
    network: string;
    activity: Array<{
      fromAddress: string;
      toAddress: string;
      value: number;
      asset: string;
      category: string;
      rawContract: {
        address?: string;
        decimal?: string;
        value?: string;
      };
      hash: string;
      typeTraceAddress?: string;
      blockNum: string;
      log?: {
        address: string;
        topics: string[];
        data: string;
        blockNumber: string;
        transactionHash: string;
        transactionIndex: string;
        blockHash: string;
        logIndex: string;
        removed: boolean;
      };
    }>;
  };
}

function verifyWebhookSignature(
  signature: string | null,
  body: string,
  authToken: string | null
): boolean {
  // Check auth token first (if provided by Alchemy)
  if (authToken && WEBHOOK_AUTH_TOKEN) {
    if (authToken !== WEBHOOK_AUTH_TOKEN) {
      console.error('Invalid webhook auth token');
      return false;
    }
  }

  // If no signature header but we have a secret, verify with HMAC
  if (WEBHOOK_SECRET && signature) {
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    hmac.update(body, 'utf8');
    const digest = hmac.digest('hex');
    
    if (signature !== digest) {
      console.error('Invalid webhook signature');
      return false;
    }
  }

  // If neither auth token nor secret is configured, allow for testing
  if (!WEBHOOK_SECRET && !WEBHOOK_AUTH_TOKEN) {
    console.warn('Warning: No webhook authentication configured');
    return true;
  }

  return true;
}

async function ensureDataDir() {
  const dir = path.dirname(VAULT_DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
}

async function loadVaultData() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(VAULT_DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return {
        lastCheckedBlock: 0,
        lastFetchTime: 0,
        transactions: []
      };
    }
    throw error;
  }
}

async function saveVaultData(data: any) {
  await ensureDataDir();
  await fs.writeFile(VAULT_DATA_FILE, JSON.stringify(data, null, 2));
}

function formatTransaction(activity: any) {
  const isDeposit = activity.toAddress?.toLowerCase() === VAULT_ADDRESS.toLowerCase();
  const isWithdrawal = activity.fromAddress?.toLowerCase() === VAULT_ADDRESS.toLowerCase();
  
  let value = '0';
  let tokenSymbol = 'ETH';
  let tokenAddress = '';

  if (activity.rawContract?.value) {
    const decimal = parseInt(activity.rawContract.decimal || '18');
    value = (parseInt(activity.rawContract.value, 16) / Math.pow(10, decimal)).toString();
    tokenAddress = activity.rawContract.address || '';
  } else if (activity.value) {
    value = activity.value.toString();
  }

  if (activity.asset && activity.asset !== 'ETH') {
    tokenSymbol = activity.asset;
  }

  return {
    hash: activity.hash,
    type: isDeposit ? 'deposit' : isWithdrawal ? 'withdrawal' : 'transfer',
    from: activity.fromAddress,
    to: activity.toAddress,
    value,
    tokenSymbol,
    tokenAddress,
    blockNumber: activity.blockNum,
    timestamp: Date.now(),
    category: activity.category
  };
}

const connectedClients = new Set<ReadableStreamDefaultController>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-alchemy-signature');
    const authToken = request.headers.get('x-alchemy-token') || 
                     request.headers.get('authorization')?.replace('Bearer ', '') || null;
    
    if (!verifyWebhookSignature(signature, body, authToken)) {
      console.error('Webhook verification failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const webhookData: AlchemyWebhookEvent = JSON.parse(body);
    
    console.log('Received webhook:', {
      webhookId: webhookData.webhookId,
      type: webhookData.type,
      network: webhookData.event.network,
      activities: webhookData.event.activity.length
    });

    const vaultData = await loadVaultData();
    const newTransactions = [];

    for (const activity of webhookData.event.activity) {
      const tx = formatTransaction(activity);
      
      const isDuplicate = vaultData.transactions.some(
        (t: any) => t.hash === tx.hash
      );
      
      if (!isDuplicate) {
        vaultData.transactions.unshift(tx);
        newTransactions.push(tx);
      }
    }

    if (newTransactions.length > 0) {
      vaultData.lastFetchTime = Date.now();
      await saveVaultData(vaultData);

      const sseMessage = JSON.stringify({
        type: 'new_transactions',
        data: newTransactions,
        timestamp: Date.now()
      });

      connectedClients.forEach(controller => {
        try {
          controller.enqueue(`data: ${sseMessage}\n\n`);
        } catch (error) {
          connectedClients.delete(controller);
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      processed: newTransactions.length,
      total: webhookData.event.activity.length
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      connectedClients.add(controller);
      
      controller.enqueue(`data: ${JSON.stringify({
        type: 'connected',
        timestamp: Date.now()
      })}\n\n`);

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(': heartbeat\n\n');
        } catch {
          clearInterval(heartbeat);
          connectedClients.delete(controller);
        }
      }, 30000);

      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        connectedClients.delete(controller);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}