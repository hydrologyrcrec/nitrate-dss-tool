// app/page.tsx
'use client'

import dynamic from 'next/dynamic'
import Header from '../../components/Header'
import { StationProvider } from '@/app/contexts/StationContext';

const Map = dynamic(() => import('../../components/Map'), { ssr: false })

const AppSidebar = dynamic(() => import('../../components/AppSidebar').then(mod => mod.AppSidebar), {
  ssr: false,
})

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