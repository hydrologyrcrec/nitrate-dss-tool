'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import { apiUrl } from './apiurl'
import { useStationContext } from '@/app/contexts/StationContext';

import parseGeoraster from 'georaster'
import GeoRasterLayer from 'georaster-layer-for-leaflet'

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

let map: L.Map | null = null
let geoLayers: Record<string, L.GeoJSON> = {}
let rasterLayers: Record<string, any> = {}
let markerClusterGroup: L.MarkerClusterGroup | null = null

export function loadGeoJSON(filename: string, visible: boolean) {
  if (!map) return

  const existingLayer = geoLayers[filename]
  if (existingLayer) {
    if (!visible) {
      map.removeLayer(existingLayer)
    } else {
      existingLayer.addTo(map)
    }
    return
  }

  fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5008"}/geojson/${filename}`)
    .then((res) => {
      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        return res.json()
      } else {
        throw new Error(`[${filename}] is not a GeoJSON file.`)
      }
    })
    .then((geojsonData) => {
      const layer = L.geoJSON(geojsonData, {
        style: {
          color: 'blue',
          weight: 2,
          fillOpacity: 0.2,
        },
        onEachFeature: (feature, layer) => {
          const props = feature.properties
          if (props) {
            const popupContent = Object.entries(props)
              .map(([key, val]) => `<b>${key}</b>: ${val}`)
              .join('<br>')
            layer.bindPopup(popupContent)
          }
        },
        pointToLayer: (feature, latlng) =>
          L.circleMarker(latlng, {
            radius: 5,
            fillColor: '#007BFF',
            color: '#fff',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          }),
      })

      geoLayers[filename] = layer
      if (visible) {
        layer.addTo(map!)
        try {
          map!.fitBounds(layer.getBounds())
        } catch {}
      }
    })
    .catch((err) => console.error('Failed to load GeoJSON:', err.message))
}

interface ExtendedGeoRaster {
  noDataValue?: number;
  mins?: number[];
  maxs?: number[];
}

export function addRasterLayer(name: string, url: string) {
  if (!map || rasterLayers[name]) return

  fetch(url)
    .then(res => res.arrayBuffer())
    .then(parseGeoraster)
    .then(georaster => {
      const extended = georaster as ExtendedGeoRaster

      const layer = new GeoRasterLayer({
        georaster,
        opacity: 0.6,
        pixelValuesToColorFn: (values: number[]): string => {
          const val = values[0]
          const min = extended.mins?.[0] ?? 0
          const max = extended.maxs?.[0] ?? 255
          const noData = extended.noDataValue

          if (val === noData || isNaN(val)) {
            return 'rgba(0,0,0,0)' 
          }

          const scale = (val - min) / (max - min)
          const intensity = Math.max(0, Math.min(255, Math.round(scale * 255)))
          return `rgba(${intensity}, ${intensity}, ${intensity}, 1)`
        }
      })

      rasterLayers[name] = layer
      layer.addTo(map!)
    })
    .catch(err => console.error(`Failed to load raster: ${name}`, err))
}

export function removeRasterLayer(name: string) {
  if (!map || !rasterLayers[name]) return
  map.removeLayer(rasterLayers[name])
  delete rasterLayers[name]
}

export default function Map() {
  const mapRef = useRef<L.Map | null>(null)
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup())
  const { state, dispatch } = useStationContext();
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (mapRef.current) return;
  
    map = mapRef.current = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(mapRef.current)

    drawnItemsRef.current.addTo(mapRef.current)

    const drawControl = new (L.Control as any).Draw({
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
      dispatch({ type: 'TOGGLE_DRAW_STATE', payload: false});
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
      dispatch({ type: 'TOGGLE_DRAW_STATE', payload: true});
      dispatch({ type: 'TOGGLE_DATA_STATE', payload: true});
      dispatch({ type: 'TOGGLE_RESULTS_STATE', payload: true});
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
  }, [dispatch]);
  
  return <div id="map" className='h-full w-full'></div>
}
