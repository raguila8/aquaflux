import { ALCHEMY_RPC_URL, FLUX_TOKEN_ADDRESS, USDC_ADDRESS } from '@/config/constants';

interface TokenBalance {
  contractAddress: string;
  tokenBalance: string;
  error?: string;
}

interface TokenMetadata {
  decimals: number;
  logo: string | null;
  name: string;
  symbol: string;
}

interface AlchemyTokenBalanceResponse {
  jsonrpc: string;
  id: number;
  result: {
    address: string;
    tokenBalances: TokenBalance[];
    pageKey?: string;
  };
}

interface AlchemyTokenMetadataResponse {
  jsonrpc: string;
  id: number;
  result: TokenMetadata;
}

/**
 * Get token balances for a wallet address using Alchemy's Token API
 */
export async function getTokenBalances(walletAddress: string): Promise<TokenBalance[]> {
  try {
    // Skip Alchemy calls if no API key is available
    if (!ALCHEMY_RPC_URL) {
      console.warn('Alchemy API key not configured, token balances unavailable');
      return [];
    }
    
    const response = await fetch(ALCHEMY_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        params: [
          walletAddress,
          [FLUX_TOKEN_ADDRESS, USDC_ADDRESS], // Specific tokens to query
        ],
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AlchemyTokenBalanceResponse = await response.json();
    
    if (data.result && data.result.tokenBalances) {
      return data.result.tokenBalances;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching token balances:', error);
    return [];
  }
}

/**
 * Get metadata for a specific token
 */
export async function getTokenMetadata(contractAddress: string): Promise<TokenMetadata | null> {
  try {
    // Skip Alchemy calls if no API key is available
    if (!ALCHEMY_RPC_URL) {
      console.warn('Alchemy API key not configured, token metadata unavailable');
      return null;
    }
    
    const response = await fetch(ALCHEMY_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenMetadata',
        params: [contractAddress],
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AlchemyTokenMetadataResponse = await response.json();
    
    if (data.result) {
      return data.result;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return null;
  }
}

/**
 * Convert hex balance to decimal string
 */
export function hexToDecimal(hex: string, decimals: number): string {
  if (!hex || hex === '0x0') return '0';
  
  try {
    const balance = BigInt(hex);
    const divisor = BigInt(10 ** decimals);
    const wholePart = balance / divisor;
    const fractionalPart = balance % divisor;
    
    if (fractionalPart === BigInt(0)) {
      return wholePart.toString();
    }
    
    // Format with proper decimal places
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const trimmedFractional = fractionalStr.replace(/0+$/, ''); // Remove trailing zeros
    
    if (trimmedFractional === '') {
      return wholePart.toString();
    }
    
    return `${wholePart}.${trimmedFractional}`;
  } catch (error) {
    console.error('Error converting hex to decimal:', error);
    return '0';
  }
}

/**
 * Get formatted token balances with metadata
 */
export async function getFormattedTokenBalances(walletAddress: string) {
  try {
    const balances = await getTokenBalances(walletAddress);
    const formattedBalances = [];

    for (const balance of balances) {
      const metadata = await getTokenMetadata(balance.contractAddress);
      
      if (metadata) {
        const formattedBalance = hexToDecimal(
          balance.tokenBalance,
          metadata.decimals
        );
        
        formattedBalances.push({
          contractAddress: balance.contractAddress,
          balance: formattedBalance,
          symbol: metadata.symbol,
          name: metadata.name,
          decimals: metadata.decimals,
          logo: metadata.logo,
        });
      }
    }

    return formattedBalances;
  } catch (error) {
    console.error('Error getting formatted token balances:', error);
    return [];
  }
}

/**
 * Get FLUX token balance for a wallet
 */
export async function getFluxBalance(walletAddress: string): Promise<string> {
  try {
    const balances = await getTokenBalances(walletAddress);
    const fluxBalance = balances.find(
      b => b.contractAddress.toLowerCase() === FLUX_TOKEN_ADDRESS.toLowerCase()
    );
    
    if (fluxBalance && fluxBalance.tokenBalance !== '0x0') {
      const metadata = await getTokenMetadata(FLUX_TOKEN_ADDRESS);
      if (metadata) {
        return hexToDecimal(fluxBalance.tokenBalance, metadata.decimals);
      }
    }
    
    return '0';
  } catch (error) {
    console.error('Error fetching FLUX balance:', error);
    return '0';
  }
}

/**
 * Get USDC token balance for a wallet
 */
export async function getUsdcBalance(walletAddress: string): Promise<string> {
  try {
    const balances = await getTokenBalances(walletAddress);
    const usdcBalance = balances.find(
      b => b.contractAddress.toLowerCase() === USDC_ADDRESS.toLowerCase()
    );
    
    if (usdcBalance && usdcBalance.tokenBalance !== '0x0') {
      const metadata = await getTokenMetadata(USDC_ADDRESS);
      if (metadata) {
        return hexToDecimal(usdcBalance.tokenBalance, metadata.decimals);
      }
    }
    
    return '0';
  } catch (error) {
    console.error('Error fetching USDC balance:', error);
    return '0';
  }
}