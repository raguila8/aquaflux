import type { SocialObjects, Clients } from './types.ts'
const alphaWallet = () => <img src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/alpha-wallet.svg" alt="Alpha Wallet" />
const bybit = () => <img src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/bybit.svg" alt="Bybit" />
const coinbase = () => <img src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/coinbase.svg" alt="Coinbase" />
const coolWallet = () => <img src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/cool-wallet.svg" alt="Cool Wallet" />
const exodus = () => <img src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/exodus.svg" alt="Exodus" />
const metamask = () => <img src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/metamask.svg" alt="MetaMask" />
const myetherwallet = () => <img src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/myetherwallet.svg" alt="MyEtherWallet" />
const safe = () => <img src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/safe.svg" alt="Safe" />
const safepal = () => <img src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/safepal.svg" alt="SafePal" />
const trezor = () => <img src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/trezor.svg" alt="Trezor" />

import twitterIcon from '@/icons/nucleo/twitter.svg'
import discordIcon from '@/icons/nucleo/discord.svg'
import telegramIcon from '@/icons/nucleo/telegram.svg'

export const SOCIALS: SocialObjects = [
  {
    name: 'twitter',
    href: '#',
    label: 'Follow for updates',
    ariaLabel: 'Follow on Twitter',
    icon: twitterIcon,
  },
  {
    name: 'discord',
    href: '#',
    label: 'Join our community',
    ariaLabel: 'Join our Discord',
    icon: discordIcon,
  },
  {
    name: 'telegram',
    href: 'https://t.me/aquaflux_tech',
    label: 'Connect with our chat',
    ariaLabel: 'Follow on Telegram',
    icon: telegramIcon,
  },
]

export const CLIENTS: Clients = [
  { name: 'Alpha Wallet', logo: alphaWallet },
  { name: 'Trezor', logo: trezor },
  { name: 'bybit', logo: bybit },
  { name: 'SafePal', logo: safepal },
  { name: 'Coinbase', logo: coinbase },
  { name: 'Metamask', logo: metamask },
  { name: 'Cool Wallet', logo: coolWallet },
  { name: 'Exodus', logo: exodus },
  { name: 'MyEtherWallet', logo: myetherwallet },
  { name: 'Safe', logo: safe },
]
