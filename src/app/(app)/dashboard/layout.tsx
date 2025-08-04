import { Viewport } from 'next'
import { RouteProvider } from '@/components/providers/route-provder'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AquafluxSidebar } from '@/components/application/app-navigation/sidebar-navigation/aquaflux-sidebar'

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
            <AquafluxSidebar />
            <main className='min-w-0 flex-1 lg:pt-2'>
              <div className='border-secondary bg-secondary_subtle/60 flex h-full min-h-[calc(100vh_-_8px)] flex-col gap-8 px-6 pt-8 pb-12 shadow-xs lg:rounded-tl-[32px] lg:border-t lg:border-l lg:px-8 lg:pt-10'>
                <div className='mx-auto flex h-full w-full max-w-6xl flex-col gap-8'>
                  {children}
                </div>
              </div>
            </main>
          </div>
        </ThemeProvider>
      </RouteProvider>
    </div>
  )
}
