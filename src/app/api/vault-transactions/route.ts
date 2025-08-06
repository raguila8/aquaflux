import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const VAULT_DATA_FILE = path.join(process.cwd(), 'transactions', 'data', 'vault-transactions.json');

async function ensureDataDir() {
  const dir = path.dirname(VAULT_DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
}

export async function GET(request: NextRequest) {
  try {
    await ensureDataDir();
    const data = await fs.readFile(VAULT_DATA_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return NextResponse.json({
        lastCheckedBlock: 0,
        lastFetchTime: 0,
        transactions: []
      });
    }
    return NextResponse.json({ error: 'Failed to load vault data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDir();
    const data = await request.json();
    await fs.writeFile(VAULT_DATA_FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save vault data' }, { status: 500 });
  }
}