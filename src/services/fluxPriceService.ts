import { Alchemy, Network } from 'alchemy-sdk';
import { getUserBalancerTotalValue, getUserBalancerPositions } from './balancerV3Service';
import { FLUX_TOKEN_ADDRESS } from '@/config/constants';

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: process.env.NEXT_PUBLIC_NETWORK === 'base-sepolia' ? Network.BASE_SEPOLIA : Network.BASE_MAINNET,
};

const alchemy = new Alchemy(settings);
const NETWORK = process.env.NEXT_PUBLIC_NETWORK === 'base-sepolia' ? 'base-sepolia' : 'base-mainnet';
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

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

export interface FluxPriceData {
  timestamp: number;
  price: number;
  totalSupply: number;
  baseTokensValue: number;
  balancerPoolsValue: number;
  priceChange24h?: number;
  priceChangePercentage24h?: number;
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
    
    // Get ETH balance using SDK
    const ethBalance = await alchemy.core.getBalance(address);
    const ethValue = parseFloat(ethBalance.toString()) / 1e18;
    
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
    
    // Get ERC20 token balances using SDK
    const tokenBalances = await alchemy.core.getTokenBalances(address);
    
    if (tokenBalances.tokenBalances.length > 0) {
      // Get token metadata and prices
      const tokenAddresses = tokenBalances.tokenBalances
        .filter(tb => parseInt(tb.tokenBalance || '0') > 0)
        .map(tb => tb.contractAddress);
      
      if (tokenAddresses.length > 0) {
        const prices = await getTokenPrices(tokenAddresses);
        
        for (const tokenBalance of tokenBalances.tokenBalances) {
          if (parseInt(tokenBalance.tokenBalance || '0') === 0) continue;
          
          try {
            // Get token metadata using SDK
            const metadata = await alchemy.core.getTokenMetadata(tokenBalance.contractAddress);
            const balance = parseInt(tokenBalance.tokenBalance || '0') / Math.pow(10, metadata.decimals || 18);
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
 * Get total supply of FLUX tokens from the contract
 */
export async function getFluxTotalSupply(): Promise<number> {
  try {
    // ERC20 totalSupply method signature
    const totalSupplyMethod = '0x18160ddd';
    
    const result = await alchemy.core.call({
      to: FLUX_TOKEN_ADDRESS,
      data: totalSupplyMethod
    });
    
    // Convert hex result to number (assuming 18 decimals)
    const supplyBigInt = BigInt(result);
    const supply = Number(supplyBigInt) / 1e18;
    
    return supply;
  } catch (error) {
    console.error('Error fetching FLUX total supply:', error);
    // Default to a reasonable supply if we can't fetch it
    return 1000000; // 1M FLUX as default
  }
}

/**
 * Calculate FLUX token price based on total value / total supply
 * Price = (Base tokens value + Balancer v3 pools value) / Total FLUX supply
 */
export async function calculateFluxPrice(
  walletAddress: string,
  totalFluxSupply?: number
): Promise<FluxPriceData> {
  try {
    // Get total FLUX supply if not provided
    const fluxSupply = totalFluxSupply || await getFluxTotalSupply();
    
    // Get all base tokens value (including ETH)
    const tokenBalances = await getWalletTokenBalances(walletAddress);
    const baseTokensValue = tokenBalances.reduce((sum, token) => sum + token.valueInUSD, 0);
    
    // Get Balancer v3 pool positions value
    const balancerPoolsValue = await getUserBalancerTotalValue(walletAddress);
    
    // Calculate total value and price per FLUX token
    const totalValue = baseTokensValue + balancerPoolsValue;
    const price = fluxSupply > 0 ? totalValue / fluxSupply : 0;
    
    // Calculate 24h change
    const priceChange = calculate24HourChange(price);
    
    const priceData: FluxPriceData = {
      timestamp: Date.now(),
      price,
      totalSupply: fluxSupply,
      baseTokensValue,
      balancerPoolsValue,
      priceChange24h: priceChange.percentage,
      priceChangePercentage24h: priceChange.trend === 'positive' ? priceChange.percentage : -priceChange.percentage
    };
    
    // Store price for historical tracking
    storePriceHistory(priceData);
    
    return priceData;
  } catch (error) {
    console.error('Error calculating FLUX price:', error);
    const fluxSupply = totalFluxSupply || 1000000;
    return {
      timestamp: Date.now(),
      price: 0,
      totalSupply: fluxSupply,
      baseTokensValue: 0,
      balancerPoolsValue: 0,
      priceChange24h: 0,
      priceChangePercentage24h: 0
    };
  }
}

/**
 * Store FLUX price history in localStorage for charting
 * Stores daily snapshots for long-term tracking
 */
export function storePriceHistory(priceData: FluxPriceData): void {
  try {
    const key = 'flux_price_history';
    const dailyKey = 'flux_price_daily';
    
    // Store recent history (for real-time display)
    const existingData = localStorage.getItem(key);
    let history: FluxPriceData[] = existingData ? JSON.parse(existingData) : [];
    
    // Add new data point
    history.push(priceData);
    
    // Keep only last 7 days of detailed data
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    history = history.filter(point => point.timestamp > sevenDaysAgo);
    
    localStorage.setItem(key, JSON.stringify(history));
    
    // Store daily snapshot (one per day)
    const dailyData = localStorage.getItem(dailyKey);
    let dailyHistory: FluxPriceData[] = dailyData ? JSON.parse(dailyData) : [];
    
    // Check if we already have a snapshot for today
    const today = new Date().setHours(0, 0, 0, 0);
    const hasToday = dailyHistory.some(point => {
      const pointDate = new Date(point.timestamp).setHours(0, 0, 0, 0);
      return pointDate === today;
    });
    
    if (!hasToday) {
      // Add daily snapshot
      dailyHistory.push(priceData);
      
      // Keep only last 90 days of daily data
      const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
      dailyHistory = dailyHistory.filter(point => point.timestamp > ninetyDaysAgo);
      
      localStorage.setItem(dailyKey, JSON.stringify(dailyHistory));
    }
  } catch (error) {
    console.error('Error storing price history:', error);
  }
}

/**
 * Get FLUX price history for charting
 * Returns daily data for longer periods, hourly for shorter
 */
export function getPriceHistory(days: number = 7): FluxPriceData[] {
  try {
    if (days <= 7) {
      // Return detailed history for short periods
      const key = 'flux_price_history';
      const data = localStorage.getItem(key);
      if (!data) return [];
      
      const history: FluxPriceData[] = JSON.parse(data);
      const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
      
      return history.filter(point => point.timestamp > cutoffTime);
    } else {
      // Return daily snapshots for longer periods
      const dailyKey = 'flux_price_daily';
      const data = localStorage.getItem(dailyKey);
      if (!data) return [];
      
      const history: FluxPriceData[] = JSON.parse(data);
      const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
      
      return history.filter(point => point.timestamp > cutoffTime);
    }
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