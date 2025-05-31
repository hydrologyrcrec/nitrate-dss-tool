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

const redIcon = new L.Icon({
  iconUrl: '/leaflet/images/marker-icon-red.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
})

export default function Map() {
  const mapRef = useRef<L.Map | null>(null)
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup())
  const { state, dispatch } = useStationContext();
  const markersRef = useRef<L.Marker[]>([]);

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
      markersRef.current.forEach((marker) => mapRef.current!.removeLayer(marker));
      markersRef.current = [];
      const layer = e.layer;
      drawnItemsRef.current.addLayer(layer);
      const latlngs = layer.getLatLngs()[0];
      const coordinates = latlngs.map((p: any) => [p.lng, p.lat]);
      const response = await apiUrl.post('/api/stations-in-polygon', { coordinates });
      const { ground_water, surface_water } = response.data;
      dispatch({ type: 'SET_STATIONS', payload: ground_water });
      dispatch({ type: 'SET_SURFACE_WATER_STATIONS', payload: surface_water });
      ground_water.forEach((station: any) => {
        const marker = L.marker([station.lat, station.lng])
          .addTo(mapRef.current!)
          .bindPopup(`<b>${station.name}</b>`);
        markersRef.current.push(marker);
      });
      surface_water.forEach((station: any) => {
        const marker = L.marker([station.lat, station.lng], { icon: redIcon })
          .addTo(mapRef.current!)
          .bindPopup(`<b>${station.name}</b>`);
        markersRef.current.push(marker);
      });
    });
  }, []);
  
  return <div id="map" className='h-full w-full'></div>
}