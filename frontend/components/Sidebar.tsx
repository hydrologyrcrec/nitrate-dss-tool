// components/Sidebar.tsx
'use client'

import { useEffect } from 'react'
import { AppSidebar } from './app-sidebar'

export default function Sidebar() {
  useEffect(() => {
    const allToggles = document.querySelectorAll('.section-header, .section-subheader')

    allToggles.forEach(header => {
      header.addEventListener('click', () => {
        const content = header.nextElementSibling as HTMLElement
        const isOpen = header.classList.toggle('open')
        if (isOpen) {
          requestAnimationFrame(() => {
            content.style.maxHeight = content.scrollHeight + 'px';
          });
        } else {
          content.style.maxHeight = '0';
        }        
        header.innerHTML = header.innerHTML.replace(isOpen ? '▶' : '▼', isOpen ? '▼' : '▶')
      })
    })
  }, [])

  return (
    <>
    <AppSidebar></AppSidebar>
    </>
  )
}