import clsx from 'clsx'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Nebula',
    default: 'Seamless Collaboration Tools for Modern Teams - Nebula',
  },
  description:
    "Unlock the potential of remote work with Nebula's advanced collaboration ecosystem. Designed for modern teams, Nebula streamlines communication, simplifies projects, and secures your data.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={clsx('scroll-smooth', GeistSans.variable, GeistMono.variable)}
    >
      <body className='bg-zinc-950 antialiased'>{children}</body>
    </html>
  )
}
