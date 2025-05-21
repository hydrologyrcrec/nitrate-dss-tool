// app/page.tsx
'use client'

import dynamic from 'next/dynamic'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

const Map = dynamic(() => import('../components/Map'), { ssr: false })

export default function Home() {
  return (
    <div>
      <Header />
      <div className="page-container">
        <Map />
        <Sidebar />
      </div>
    </div>
  )
}