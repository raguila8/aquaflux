// Token Addresses on Base
export const FLUX_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_FLUX_TOKEN_ADDRESS || "0xb6a9d1e420b0dbaa3d137d8aa3d97927f04ea8f9";
export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const VAULT_ADDRESS = "0x9EE4d24dB1104bDF818391efCB8CCBa8Ff206159";

// API Keys and URLs - Using environment variables only, no fallback demo keys
export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
export const ALCHEMY_RPC_URL = ALCHEMY_API_KEY ? `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}` : null;
export const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;