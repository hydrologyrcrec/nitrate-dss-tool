// components/Header.tsx
'use client'

export default function Header() {
  const handleClick = () => {
    const drawBtn = document.querySelector(
      '.leaflet-draw-toolbar a.leaflet-draw-draw-polygon'
    ) as HTMLElement | null
    drawBtn?.click()
  }

  return (
    <header className="top-header">
      <h1>Hydrology AI Tool</h1>
      <button onClick={handleClick}>Draw a Polygon</button>
    </header>
  )
}