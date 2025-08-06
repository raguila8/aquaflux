const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const NETWORK = process.env.NEXT_PUBLIC_NETWORK === 'base-sepolia' ? 'base-sepolia' : 'base-mainnet';
const ALCHEMY_RPC_URL = `https://${NETWORK}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

interface TokenBalance {
  symbol: string;
  balance: number;
  valueInUSD: number;
}

interface BalancerPoolPosition {
  poolId: string;
  poolName: string;
  totalValueUSD: number;
  tokens: TokenBalance[];
}

interface FluxPriceData {
  timestamp: number;
  price: number;
  totalSupply: number;
  baseTokensValue: number;
  balancerPoolsValue: number;
}

/**
 * Get current prices for multiple tokens from Alchemy
 */
export async function getTokenPrices(addresses: string[]): Promise<Record<string, number>> {
  try {
    const response = await fetch(`https://api.g.alchemy.com/prices/v1/${NETWORK}/tokens/by-address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ALCHEMY_API_KEY}`,
      },
      body: JSON.stringify({
        addresses: addresses.map(addr => ({
          network: NETWORK,
          address: addr
        }))
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch token prices');
    }

    const data = await response.json();
    const prices: Record<string, number> = {};
    
    for (const token of data.data) {
      prices[token.address.toLowerCase()] = token.prices[0]?.value || 0;
    }
    
    return prices;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
}

/**
 * Get all token balances for a wallet including ETH
 */
export async function getWalletTokenBalances(address: string): Promise<TokenBalance[]> {
  try {
    const balances: TokenBalance[] = [];
    
    // Get ETH balance using JSON-RPC
    const ethBalanceResponse = await fetch(ALCHEMY_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1
      })
    });
    
    const ethBalanceData = await ethBalanceResponse.json();
    const ethValue = parseInt(ethBalanceData.result, 16) / 1e18;
    
    // Get ETH price
    const ethPriceResponse = await fetch('https://api.g.alchemy.com/prices/v1/tokens/by-symbol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ALCHEMY_API_KEY}`,
      },
      body: JSON.stringify({
        symbols: ['ETH']
      })
    });
    
    const ethPriceData = await ethPriceResponse.json();
    const ethPrice = ethPriceData.data?.[0]?.prices?.[0]?.value || 0;
    
    balances.push({
      symbol: 'ETH',
      balance: ethValue,
      valueInUSD: ethValue * ethPrice
    });
    
    // Get ERC20 token balances using alchemy_getTokenBalances
    const tokenBalancesResponse = await fetch(ALCHEMY_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        params: [address],
        id: 2
      })
    });
    
    const tokenBalancesData = await tokenBalancesResponse.json();
    const tokenBalances = tokenBalancesData.result?.tokenBalances || [];
    
    if (tokenBalances.length > 0) {
      // Get token metadata and prices
      const tokenAddresses = tokenBalances
        .filter((tb: any) => parseInt(tb.tokenBalance || '0', 16) > 0)
        .map((tb: any) => tb.contractAddress);
      
      if (tokenAddresses.length > 0) {
        const prices = await getTokenPrices(tokenAddresses);
        
        for (const tokenBalance of tokenBalances) {
          if (parseInt(tokenBalance.tokenBalance || '0', 16) === 0) continue;
          
          try {
            // Get token metadata
            const metadataResponse = await fetch(ALCHEMY_RPC_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'alchemy_getTokenMetadata',
                params: [tokenBalance.contractAddress],
                id: 3
              })
            });
            
            const metadataData = await metadataResponse.json();
            const metadata = metadataData.result;
            const balance = parseInt(tokenBalance.tokenBalance || '0', 16) / Math.pow(10, metadata?.decimals || 18);
            const price = prices[tokenBalance.contractAddress.toLowerCase()] || 0;
            
            balances.push({
              symbol: metadata?.symbol || 'UNKNOWN',
              balance,
              valueInUSD: balance * price
            });
          } catch (error) {
            console.error('Error fetching token metadata:', error);
          }
        }
      }
    }
    
    return balances;
  } catch (error) {
    console.error('Error fetching wallet balances:', error);
    return [];
  }
}

/**
 * Calculate FLUX token price based on total value / total supply
 * Price = (Base tokens value + Balancer v3 pools value) / Total FLUX supply
 */
export async function calculateFluxPrice(
  walletAddress: string,
  totalFluxSupply: number
): Promise<FluxPriceData> {
  try {
    // Get all base tokens value
    const tokenBalances = await getWalletTokenBalances(walletAddress);
    const baseTokensValue = tokenBalances.reduce((sum, token) => sum + token.valueInUSD, 0);
    
    // TODO: Integrate with Balancer v3 to get pool positions value
    // For now, we'll use a placeholder
    const balancerPoolsValue = 0;
    
    // Calculate total value and price per FLUX token
    const totalValue = baseTokensValue + balancerPoolsValue;
    const price = totalFluxSupply > 0 ? totalValue / totalFluxSupply : 0;
    
    return {
      timestamp: Date.now(),
      price,
      totalSupply: totalFluxSupply,
      baseTokensValue,
      balancerPoolsValue
    };
  } catch (error) {
    console.error('Error calculating FLUX price:', error);
    return {
      timestamp: Date.now(),
      price: 0,
      totalSupply: totalFluxSupply,
      baseTokensValue: 0,
      balancerPoolsValue: 0
    };
  }
}

/**
 * Store FLUX price history in localStorage for charting
 */
export function storePriceHistory(priceData: FluxPriceData): void {
  try {
    const key = 'flux_price_history';
    const existingData = localStorage.getItem(key);
    let history: FluxPriceData[] = existingData ? JSON.parse(existingData) : [];
    
    // Add new data point
    history.push(priceData);
    
    // Keep only last 30 days of data (assuming hourly updates)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    history = history.filter(point => point.timestamp > thirtyDaysAgo);
    
    localStorage.setItem(key, JSON.stringify(history));
  } catch (error) {
    console.error('Error storing price history:', error);
  }
}

/**
 * Get FLUX price history for charting
 */
export function getPriceHistory(days: number = 7): FluxPriceData[] {
  try {
    const key = 'flux_price_history';
    const data = localStorage.getItem(key);
    if (!data) return [];
    
    const history: FluxPriceData[] = JSON.parse(data);
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    return history.filter(point => point.timestamp > cutoffTime);
  } catch (error) {
    console.error('Error getting price history:', error);
    return [];
  }
}

/**
 * Calculate 24-hour price change percentage
 */
export function calculate24HourChange(currentPrice: number): { percentage: number; trend: 'positive' | 'negative' | 'neutral' } {
  const history = getPriceHistory(2);
  
  if (history.length < 2) {
    return { percentage: 0, trend: 'neutral' };
  }
  
  const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
  const previousPrice = history
    .filter(point => point.timestamp <= twentyFourHoursAgo)
    .sort((a, b) => b.timestamp - a.timestamp)[0]?.price;
  
  if (!previousPrice || previousPrice === 0) {
    return { percentage: 0, trend: 'neutral' };
  }
  
  const change = ((currentPrice - previousPrice) / previousPrice) * 100;
  
  return {
    percentage: Math.abs(change),
    trend: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'
  };
}