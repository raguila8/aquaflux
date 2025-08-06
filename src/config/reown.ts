import { cookieStorage, createStorage, http } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, baseSepolia } from 'viem/chains'

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '4e651308c581781aebc91b3f479b7ab2'

export const networks = [base, baseSepolia] as const

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks: [...networks],
  transports: {
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'WsRl4toSVOL8xSY2QQcrgpQ6MCHb-8cQ'}`),
    [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'WsRl4toSVOL8xSY2QQcrgpQ6MCHb-8cQ'}`)
  }
})

export const config = wagmiAdapter.wagmiConfig