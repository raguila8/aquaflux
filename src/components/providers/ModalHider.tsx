'use client'

import { useEffect, useState } from 'react'

export function ModalHider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Add data attribute to body to control modal visibility
    document.body.setAttribute('data-modal-loading', 'true')
    
    // Wait for everything to initialize
    const timer = setTimeout(() => {
      setIsReady(true)
      document.body.removeAttribute('data-modal-loading')
    }, 1200)

    return () => {
      clearTimeout(timer)
      document.body.removeAttribute('data-modal-loading')
    }
  }, [])

  return (
    <>
      {/* Inject critical CSS that uses the data attribute */}
      <style jsx global>{`
        /* Hide all wallet modal elements when loading */
        body[data-modal-loading="true"] w3m-modal,
        body[data-modal-loading="true"] wcm-modal,
        body[data-modal-loading="true"] w3m-router,
        body[data-modal-loading="true"] wcm-router,
        body[data-modal-loading="true"] [data-w3m-modal],
        body[data-modal-loading="true"] [data-wcm-modal],
        body[data-modal-loading="true"] .wcm-overlay,
        body[data-modal-loading="true"] .w3m-overlay,
        body[data-modal-loading="true"] [class*="w3m-"],
        body[data-modal-loading="true"] [class*="wcm-"] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
        
        /* Also hide any backdrop or overlay divs during load */
        body[data-modal-loading="true"] > div[style*="z-index: 99999"],
        body[data-modal-loading="true"] > div[style*="z-index: 10000"],
        body[data-modal-loading="true"] > div[style*="position: fixed"][style*="inset: 0"] {
          display: none !important;
        }
      `}</style>
      
      {children}
    </>
  )
}