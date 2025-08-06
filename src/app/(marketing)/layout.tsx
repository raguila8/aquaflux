import { Footer } from '@/components/shared/Footer'
import { Header } from '@/components/header/Header'
import "@/styles/reown-modal.css";
import { Toaster } from 'sonner'
import Script from 'next/script'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        id="service-worker"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `,
        }}
      />
      <Toaster 
        position="bottom-center"
        toastOptions={{
          className: 'sonner-toast',
          duration: 5000,
        }}
      />
      <Header />
      <main className='relative overflow-x-clip'>{children}</main>
      <Footer />
    </>
  )
}