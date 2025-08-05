import { Viewport } from 'next'
import { RouteProvider } from '@/components/providers/route-provder'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { SidebarLayout } from './SidebarLayout'

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
        <ThemeProvider>
          <div className='bg-primary flex flex-col lg:flex-row'>
            <SidebarLayout>{children}</SidebarLayout>
          </div>
        </ThemeProvider>
      </RouteProvider>
    </div>
  )
}
