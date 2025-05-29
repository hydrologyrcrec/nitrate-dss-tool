// app/page.tsx
'use client'

import dynamic from 'next/dynamic'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import { useRef } from 'react'
import { StationListRefContext } from '@/app/contexts/StationListContext'

const Map = dynamic(() => import('../../components/Map'), { ssr: false })

export default function Home() {
  const stationListRef = useRef<HTMLUListElement | null>(null);
  return (
    <StationListRefContext.Provider value={stationListRef}>
      <Header />
      <div className="page-container">
        <Map />
        <Sidebar />
      </div>
    </StationListRefContext.Provider>
  )
}