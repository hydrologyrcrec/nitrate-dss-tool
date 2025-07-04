'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import COGViewer from './CogTiffViewer';
import 'leaflet/dist/leaflet.css';

export default function LeafletMapWithCOG({file}: {file: string}) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={3}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <COGViewer url={`${process.env.NEXT_PUBLIC_S3_URL}/cogs/${file}`} />
    </MapContainer>
  );
}
