import { VAULT_ADDRESS } from '@/config/constants';

const BALANCER_API_URL = 'https://api-v3.balancer.fi';
const BALANCER_API_URL_TEST = 'https://test-api-v3.balancer.fi';

// Using the production API by default
const API_URL = process.env.NEXT_PUBLIC_NETWORK === 'base-sepolia' ? BALANCER_API_URL_TEST : BALANCER_API_URL;

// Chain mapping for Balancer API
const CHAIN_MAP: Record<string, string> = {
  'base': 'BASE',
  'base-mainnet': 'BASE',
  'base-sepolia': 'BASE_SEPOLIA',
  'base-testnet': 'BASE_SEPOLIA'
};

interface BalancerPoolToken {
  address: string;
  symbol: string;
  balance: string;
  priceRate: string;
}

interface BalancerPool {
  id: string;
  name: string;
  address: string;
  type: string;
  totalLiquidity: string;
  poolTokens: BalancerPoolToken[];
}

interface UserPoolBalance {
  poolId: string;
  balance: string;
  pool: BalancerPool;
}

interface BalancerPosition {
  poolId: string;
  poolName: string;
  userBalance: number;
  totalValueUSD: number;
  poolTokens: {
    symbol: string;
    balance: number;
    valueUSD: number;
  }[];
}

/**
 * GraphQL query to get user pool balances
 */
const getUserPoolBalancesQuery = `
  query GetUserPoolBalances($userAddress: String!, $chain: GqlChain!) {
    userGetPoolBalances(
      address: $userAddress
      chains: [$chain]
    ) {
      poolId
      balance
      pool {
        id
        name
        address
        type
        dynamicData {
          totalLiquidity
        }
        poolTokens {
          address
          symbol
          balance
          priceRate
        }
      }
    }
  }
`;

/**
 * GraphQL query to get pool details
 */
const getPoolDetailsQuery = `
  query GetPoolDetails($poolId: String!, $chain: GqlChain!) {
    poolGetPool(
      id: $poolId
      chain: $chain
    ) {
      id
      name
      address
      type
      dynamicData {
        totalLiquidity
        totalShares
        aprItems {
          title
          type
          apr
        }
      }
      poolTokens {
        address
        symbol
        balance
        priceRate
        weight
      }
    }
  }
`;

/**
 * GraphQL query to get token prices
 */
const getTokenPricesQuery = `
  query GetTokenPrices($addresses: [String!]!, $chain: GqlChain!) {
    tokenGetCurrentPrices(
      addresses: $addresses
      chain: $chain
    ) {
      address
      price
      updatedAt
    }
  }
`;

/**
 * Execute a GraphQL query against Balancer API
 */
async function executeGraphQLQuery(query: string, variables: Record<string, any>): Promise<any> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    if (!response.ok) {
      throw new Error(`Balancer API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error('GraphQL query failed');
    }

    return data.data;
  } catch (error) {
    console.error('Error executing GraphQL query:', error);
    throw error;
  }
}

/**
 * Get user's pool positions from Balancer v3
 */
export async function getUserBalancerPositions(userAddress: string): Promise<BalancerPosition[]> {
  try {
    const chain = CHAIN_MAP[process.env.NEXT_PUBLIC_NETWORK || 'base'] || 'BASE';
    
    // Get user pool balances
    const data = await executeGraphQLQuery(getUserPoolBalancesQuery, {
      userAddress: userAddress.toLowerCase(),
      chain
    });

    if (!data || !data.userGetPoolBalances) {
      return [];
    }

    const positions: BalancerPosition[] = [];

    for (const userBalance of data.userGetPoolBalances) {
      if (parseFloat(userBalance.balance) === 0) continue;

      const pool = userBalance.pool;
      const totalLiquidity = parseFloat(pool.dynamicData?.totalLiquidity || '0');
      const userBalanceNum = parseFloat(userBalance.balance);
      
      // Calculate user's share of the pool
      const userShare = userBalanceNum; // This is already the user's BPT balance
      
      // Parse pool tokens
      const poolTokens = pool.poolTokens.map((token: BalancerPoolToken) => {
        const balance = parseFloat(token.balance || '0');
        const priceRate = parseFloat(token.priceRate || '1');
        
        // Calculate token value (simplified - may need adjustment based on pool type)
        const valueUSD = balance * priceRate;
        
        return {
          symbol: token.symbol,
          balance,
          valueUSD
        };
      });

      // Calculate total position value
      // For weighted pools, the user's share of total liquidity
      const totalValueUSD = (userShare / 1e18) * totalLiquidity; // Assuming BPT has 18 decimals

      positions.push({
        poolId: pool.id,
        poolName: pool.name,
        userBalance: userBalanceNum,
        totalValueUSD,
        poolTokens
      });
    }

    return positions;
  } catch (error) {
    console.error('Error fetching Balancer positions:', error);
    return [];
  }
}

/**
 * Get total value of user's Balancer v3 positions
 */
export async function getUserBalancerTotalValue(userAddress: string): Promise<number> {
  try {
    const positions = await getUserBalancerPositions(userAddress);
    return positions.reduce((total, position) => total + position.totalValueUSD, 0);
  } catch (error) {
    console.error('Error calculating Balancer total value:', error);
    return 0;
  }
}

/**
 * Get pool APRs and performance metrics
 */
export async function getPoolAPRs(poolId: string): Promise<any> {
  try {
    const chain = CHAIN_MAP[process.env.NEXT_PUBLIC_NETWORK || 'base'] || 'BASE';
    
    const data = await executeGraphQLQuery(getPoolDetailsQuery, {
      poolId,
      chain
    });

    if (!data || !data.poolGetPool) {
      return null;
    }

    return data.poolGetPool.dynamicData?.aprItems || [];
  } catch (error) {
    console.error('Error fetching pool APRs:', error);
    return [];
  }
}

/**
 * Get token prices from Balancer
 */
export async function getBalancerTokenPrices(tokenAddresses: string[]): Promise<Record<string, number>> {
  try {
    const chain = CHAIN_MAP[process.env.NEXT_PUBLIC_NETWORK || 'base'] || 'BASE';
    
    const data = await executeGraphQLQuery(getTokenPricesQuery, {
      addresses: tokenAddresses.map(addr => addr.toLowerCase()),
      chain
    });

    if (!data || !data.tokenGetCurrentPrices) {
      return {};
    }

    const prices: Record<string, number> = {};
    for (const token of data.tokenGetCurrentPrices) {
      prices[token.address.toLowerCase()] = parseFloat(token.price || '0');
    }

    return prices;
  } catch (error) {
    console.error('Error fetching token prices from Balancer:', error);
    return {};
  }
}

/**
 * Get historical pool data for charting
 */
export async function getPoolHistoricalData(poolId: string, days: number = 30): Promise<any[]> {
  // This would require additional GraphQL queries for historical data
  // For now, returning empty array as placeholder
  return [];
}