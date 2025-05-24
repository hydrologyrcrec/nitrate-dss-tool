// components/Header.tsx
'use client'

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const handleDrawClick = () => {
    const drawBtn = document.querySelector(
      '.leaflet-draw-toolbar a.leaflet-draw-draw-polygon'
    ) as HTMLElement | null
    drawBtn?.click()
  }

  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    if(response.ok){
      const data = await response.json();
      if (data.success) {
        router.push("/");
      }
    }
  }

  return (
    <header className="top-header">
      <h1>Hydrology AI Tool</h1>
      <div className="flex gap-4">
        <button onClick={handleDrawClick}>Draw a Polygon</button>
        <button id="logout" onClick={handleLogout}> Logout </button>
      </div>
    </header>
  )
}