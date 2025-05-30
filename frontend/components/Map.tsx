// components/Map.tsx
'use client'

import { useContext, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import { apiUrl } from './apiurl'
import { useStationContext } from '@/app/contexts/StationContext';
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
})

export default function Map() {
  const mapRef = useRef<L.Map | null>(null)
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup())
  const { state, dispatch } = useStationContext();

  useEffect(() => {
    if (mapRef.current) return;
  
    mapRef.current = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(mapRef.current);
  
    drawnItemsRef.current.addTo(mapRef.current);
  
    const DrawControl = (L.Control as any).Draw;
  
    const drawControl = new DrawControl({
      edit: { featureGroup: drawnItemsRef.current },
      draw: {
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polygon: true,
      },
    });
  
    mapRef.current.addControl(drawControl);
  
    mapRef.current.on('draw:created', async (e: any) => {
      drawnItemsRef.current.clearLayers();
      const layer = e.layer;
      drawnItemsRef.current.addLayer(layer);
      const latlngs = layer.getLatLngs()[0];
      const coordinates = latlngs.map((p: any) => [p.lng, p.lat]);
      const response = await apiUrl.post('/api/stations-in-polygon', { coordinates });
      const data = response.data;
      dispatch({ type: 'SET_STATIONS', payload: data });
      data.forEach((station: any) => {
        L.marker([station.lat, station.lng])
          .addTo(mapRef.current!)
          .bindPopup(`<b>${station.name}</b>`);
      });
    });
  }, []);
  
  return <div id="map" className='h-full w-full'></div>
}