// Token Addresses on Base
export const FLUX_TOKEN_ADDRESS = "0xB6a9D1E420B0DbAa3d137D8aa3D97927f04eA8F9";
export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const VAULT_ADDRESS = "0x9EE4d24dB1104bDF818391efCB8CCBa8Ff206159";

// API Keys and URLs
export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "WsRl4toSVOL8xSY2QQcrgpQ6MCHb-8cQ";
export const ALCHEMY_RPC_URL = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
export const ALCHEMY_WS_URL = `wss://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
export const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;