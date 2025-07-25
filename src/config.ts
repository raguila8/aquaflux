import type { SocialObjects, Clients } from './types.ts'
import alphaWallet from './images/logos/alpha-wallet.svg'
import bybit from './images/logos/bybit.svg'
import coinbase from './images/logos/coinbase.svg'
import coolWallet from './images/logos/cool-wallet.svg'
import exodus from './images/logos/exodus.svg'
import metamask from './images/logos/metamask.svg'
import myetherwallet from './images/logos/myetherwallet.svg'
import safe from './images/logos/safe.svg'
import safepal from './images/logos/safepal.svg'
import trezor from './images/logos/trezor.svg'

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
    href: '#',
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
