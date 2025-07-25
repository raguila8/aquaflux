import { FC, SVGProps } from 'react'

export type SocialObjects = {
  name: SocialMedia
  href: string
  label: string
  ariaLabel: string
  icon: FC<SVGProps<SVGSVGElement>>
}[]

export type SocialMedia =
  | 'github'
  | 'dribbble'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'mail'
  | 'x'
  | 'twitch'
  | 'whatsApp'
  | 'snapchat'
  | 'pinterest'
  | 'tikTok'
  | 'codePen'
  | 'discord'
  | 'gitLab'
  | 'reddit'
  | 'skype'
  | 'steam'
  | 'telegram'
  | 'mastodon'
  | 'twitter'
  | 'youtube'

export type Clients = {
  name: string
  logo: FC<SVGProps<SVGSVGElement>>
}[]
