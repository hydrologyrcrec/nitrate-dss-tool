'use client'

import dynamic from 'next/dynamic'
import Header from '../../components/Header'
import { useRef } from 'react'
import { StationListRefContext } from '@/app/contexts/StationListContext'

// Dynamically import Map with SSR disabled
const Map = dynamic(() => import('../../components/Map'), { ssr: false })

// Dynamically import AppSidebar with SSR disabled
const AppSidebar = dynamic(() => import('../../components/app-sidebar').then(mod => mod.AppSidebar), {
  ssr: false,
})

export default function Home() {
  const stationListRef = useRef<HTMLUListElement | null>(null)

  return (
    <StationListRefContext.Provider value={stationListRef}>
      <Header />
      <div className="page-container">
        <Map />
        <AppSidebar />
      </div>
    </StationListRefContext.Provider>
  )
}
