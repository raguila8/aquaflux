import { AlchemyAccountsUIConfig, createConfig } from "@account-kit/react";
import { base, alchemy } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [
        {
          type: "external_wallets",
          walletConnect: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ? {
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
          } : undefined
        }
      ]
    ],
    addPasskeyOnSignup: false,
  },
};

export const config = createConfig(
  {
    transport: alchemy({ 
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "WsRl4toSVOL8xSY2QQcrgpQ6MCHb-8cQ",
    }),
    chain: base,
    ssr: true,
    enablePopupOauth: true,
  },
  uiConfig
);

export const queryClient = new QueryClient();

export const FLUX_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_FLUX_TOKEN_ADDRESS || "0xb6a9d1e420b0dbaa3d137d8aa3d97927f04ea8f9";
export const ALCHEMY_RPC_URL = `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "WsRl4toSVOL8xSY2QQcrgpQ6MCHb-8cQ"}`;
export const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "N6JDYEFIP3544JDTEBFT8VCT4Q8SV5V1IC";
export const VAULT_ADDRESS = "0x25f2F5C009700Afd6A7ce831B5f1006B20F101c1";
export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";