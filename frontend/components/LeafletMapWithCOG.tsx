'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import COGViewer from './CogTiffViewer';
import 'leaflet/dist/leaflet.css';

export default function LeafletMapWithCOG() {
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
      <COGViewer url="https://fsm-geo-tiff-data.s3.us-east-2.amazonaws.com/Drainage_cog_v2.tif" />
    </MapContainer>
  );
}
