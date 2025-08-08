'use client'

import { useEffect, useState } from 'react'

export function ModalHider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Mark as mounted after a short delay to ensure DOM is ready
    const mountTimer = requestAnimationFrame(() => {
      setIsMounted(true)
    })

    return () => {
      cancelAnimationFrame(mountTimer)
    }
  }, [])

  return (
    <>
      {/* Critical CSS injected immediately to prevent flash */}
      <style 
        dangerouslySetInnerHTML={{
          __html: `
            /* X-cloak pattern - hide elements until JS removes the attribute */
            [data-modal-cloak],
            [data-modal-cloak] * {
              display: none !important;
            }
            
            /* Hide all Reown/WalletConnect modal elements initially */
            w3m-modal:not([data-ready]),
            wcm-modal:not([data-ready]),
            w3m-router:not([data-ready]),
            wcm-router:not([data-ready]),
            [data-w3m-modal]:not([data-ready]),
            [data-wcm-modal]:not([data-ready]),
            .wcm-overlay:not([data-ready]),
            .w3m-overlay:not([data-ready]),
            appkit-modal:not([data-ready]),
            [class*="w3m-"]:not([data-ready]),
            [class*="wcm-"]:not([data-ready]),
            [class*="wui-"]:not([data-ready]) {
              opacity: 0 !important;
              visibility: hidden !important;
              pointer-events: none !important;
              transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
            }
            
            /* Show when ready */
            w3m-modal[data-ready],
            wcm-modal[data-ready],
            w3m-router[data-ready],
            wcm-router[data-ready],
            [data-w3m-modal][data-ready],
            [data-wcm-modal][data-ready],
            .wcm-overlay[data-ready],
            .w3m-overlay[data-ready],
            appkit-modal[data-ready],
            [class*="w3m-"][data-ready],
            [class*="wcm-"][data-ready],
            [class*="wui-"][data-ready] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }
            
            /* Hide any floating modals/overlays during initial load */
            body:not([data-app-ready]) > div[style*="z-index: 99999"],
            body:not([data-app-ready]) > div[style*="z-index: 10000"],
            body:not([data-app-ready]) > div[style*="position: fixed"][style*="inset: 0"],
            body:not([data-app-ready]) > div[style*="position: fixed"][style*="top: 0"][style*="left: 0"][style*="right: 0"][style*="bottom: 0"] {
              display: none !important;
            }
          `
        }}
      />
      
      {/* Script to manage ready state */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Mark body as loading initially
              document.body.setAttribute('data-modal-cloak', 'true');
              
              // Wait for DOM and scripts to load
              if (document.readyState === 'complete') {
                setTimeout(function() {
                  document.body.removeAttribute('data-modal-cloak');
                  document.body.setAttribute('data-app-ready', 'true');
                  
                  // Mark modal elements as ready
                  var modalElements = document.querySelectorAll('w3m-modal, wcm-modal, appkit-modal, [data-w3m-modal], [data-wcm-modal], [class*="w3m-"], [class*="wcm-"], [class*="wui-"]');
                  modalElements.forEach(function(el) {
                    el.setAttribute('data-ready', 'true');
                  });
                }, 100);
              } else {
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    document.body.removeAttribute('data-modal-cloak');
                    document.body.setAttribute('data-app-ready', 'true');
                    
                    // Mark modal elements as ready
                    var modalElements = document.querySelectorAll('w3m-modal, wcm-modal, appkit-modal, [data-w3m-modal], [data-wcm-modal], [class*="w3m-"], [class*="wcm-"], [class*="wui-"]');
                    modalElements.forEach(function(el) {
                      el.setAttribute('data-ready', 'true');
                    });
                  }, 100);
                });
              }
            })();
          `
        }}
      />
      
      {children}
    </>
  )
}