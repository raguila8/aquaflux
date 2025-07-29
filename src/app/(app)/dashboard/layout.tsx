import { Viewport } from 'next'
import { RouteProvider } from '@/components/providers/route-provder'
import { ThemeProvider } from '@/components/providers/theme-provider'

export const viewport: Viewport = {
  colorScheme: 'dark',
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='bg-primary'>
      <RouteProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </RouteProvider>
    </div>
  )
}
