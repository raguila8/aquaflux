import { cookieStorage, createStorage, http } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, baseSepolia } from 'viem/chains'

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '4e651308c581781aebc91b3f479b7ab2'

export const networks = [base, baseSepolia] as const

// Get Alchemy API key or fallback to public RPC endpoints
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
const baseRpcUrl = alchemyApiKey 
  ? `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
  : 'https://mainnet.base.org' // Public Base RPC
const baseSepoliaRpcUrl = alchemyApiKey
  ? `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`
  : 'https://sepolia.base.org' // Public Base Sepolia RPC

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks: [...networks],
  transports: {
    [base.id]: http(baseRpcUrl),
    [baseSepolia.id]: http(baseSepoliaRpcUrl)
  }
})

export const config = wagmiAdapter.wagmiConfig