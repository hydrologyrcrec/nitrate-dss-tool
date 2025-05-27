// components/Sidebar.tsx
'use client'

import { useEffect } from 'react'

export default function Sidebar() {
  useEffect(() => {
    const headers = document.querySelectorAll('.section-header')
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const content = header.nextElementSibling as HTMLElement
        const isOpen = header.classList.toggle('open')
        content.style.maxHeight = isOpen ? content.scrollHeight + 'px' : '0'
        header.innerHTML = header.innerHTML.replace(isOpen ? '▶' : '▼', isOpen ? '▼' : '▶')
      })
    })
  }, [])

  return (
    <div id="station-list">
      <div className="sidebar-section">
        <div className="section-header">▶ View</div>
        <div className="section-content">
          <div className="subsection">
            <strong>Flood Susceptibility Mapping</strong>
            <br />
            <button className="view-btn">View</button>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-header">▶ Tools</div>
        <div className="section-content">
          <div className="subsection">AI Prediction</div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-header">▶ Resulted Stations</div>
        <div className="section-content">
          <ul id="station-items"></ul>
        </div>
      </div>
    </div>
  )
}