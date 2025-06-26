// components/Header.tsx
'use client'

import { useRouter } from "next/navigation";
import { apiUrl } from "./ApiUrl";

export default function Header() {
  const router = useRouter();
  const handleDrawClick = () => {
    const drawBtn = document.querySelector(
      '.leaflet-draw-toolbar a.leaflet-draw-draw-polygon'
    ) as HTMLElement | null
    drawBtn?.click()
  }

  const handleLogout = async () => {
    await apiUrl.post(`/api/auth/logout`, {
      credentials: "include",
    });
    const response = await fetch("/api/clear-cookies", {
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
    <header className="z-30 fixed top-0 left-0 w-full bg-[#076b8d] h-[60px] text-white flex items-center justify-between">
      <h1 className="text-3xl ml-4">Range AI</h1>
      <div className="flex gap-4 pr-6">
        <button className="cursor-pointer bg-[#007bff] text-white border-none px-3 py-2 rounded text-base hover:bg-[#0056b3]" onClick={handleDrawClick}>Draw a Polygon</button>
        <button className="cursor-pointer bg-[red] text-white border-none px-3 py-2 rounded text-base hover:bg-red-700 " onClick={handleLogout}> Logout </button>
      </div>
    </header>
  )
}