import React from 'react'
import Image from 'next/image'
import type { SocialObjects, Clients } from './types.ts'

const alphaWallet = (props: any) => (
  <Image 
    src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/alpha-wallet.svg" 
    alt="Alpha Wallet" 
    width={120} 
    height={40} 
    priority={false}
    loading="lazy"
    {...props} 
  />
)
const bybit = (props: any) => (
  <Image 
    src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/bybit.svg" 
    alt="Bybit" 
    width={120} 
    height={40} 
    priority={false}
    loading="lazy"
    {...props} 
  />
)
const coinbase = (props: any) => (
  <Image 
    src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/coinbase.svg" 
    alt="Coinbase" 
    width={120} 
    height={40} 
    priority={false}
    loading="lazy"
    {...props} 
  />
)
const coolWallet = (props: any) => (
  <Image 
    src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/cool-wallet.svg" 
    alt="Cool Wallet" 
    width={120} 
    height={40} 
    priority={false}
    loading="lazy"
    {...props} 
  />
)
const exodus = (props: any) => (
  <Image 
    src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/exodus.svg" 
    alt="Exodus" 
    width={120} 
    height={40} 
    priority={false}
    loading="lazy"
    {...props} 
  />
)
const metamask = (props: any) => (
  <Image 
    src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/metamask.svg" 
    alt="MetaMask" 
    width={120} 
    height={40} 
    priority={false}
    loading="lazy"
    {...props} 
  />
)
const myetherwallet = (props: any) => (
  <Image 
    src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/myetherwallet.svg" 
    alt="MyEtherWallet" 
    width={120} 
    height={40} 
    priority={false}
    loading="lazy"
    {...props} 
  />
)
const safe = (props: any) => (
  <Image 
    src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/safe.svg" 
    alt="Safe" 
    width={120} 
    height={40} 
    priority={false}
    loading="lazy"
    {...props} 
  />
)
const safepal = (props: any) => (
  <Image 
    src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/safepal.svg" 
    alt="SafePal" 
    width={120} 
    height={40} 
    priority={false}
    loading="lazy"
    {...props} 
  />
)
const trezor = (props: any) => (
  <Image 
    src="https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/logos/trezor.svg" 
    alt="Trezor" 
    width={120} 
    height={40} 
    priority={false}
    loading="lazy"
    {...props} 
  />
)

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
