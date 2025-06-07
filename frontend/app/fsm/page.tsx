'use client';

import dynamic from 'next/dynamic';

// Dynamically load entire map layout (MapContainer + COGViewer)
const LeafletMapWithCOG = dynamic(() => import('@/components/LeafletMapWithCOG'), {
  ssr: false,
});

export default function FSMPage() {
  return <LeafletMapWithCOG />;
}
