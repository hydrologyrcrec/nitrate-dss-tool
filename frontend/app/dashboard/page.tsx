// app/page.tsx
'use client'

import dynamic from 'next/dynamic'
import Header from '../../components/Header'
import { AppSidebar } from '@/components/AppSidebar'
import { StationProvider } from '@/app/contexts/StationContext';

const Map = dynamic(() => import('../../components/Map'), { ssr: false })

export default function Home() {
  return (
    <StationProvider>
      <Header />
      <div className="page-container">
        <Map />
        <AppSidebar />
      </div>
    </StationProvider>
  )
}