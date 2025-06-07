'use client'

import { useContext, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import { apiUrl } from './apiurl'
import { StationListRefContext } from '@/app/contexts/StationListContext'

import parseGeoraster from 'georaster'
import GeoRasterLayer from 'georaster-layer-for-leaflet'

delete (L.Icon.Default.prototype as any)._getIconUrl
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

  fetch(`http://localhost:5008/geojson/${filename}`)
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

export function addRasterLayer(name: string, url: string) {
  if (!map || rasterLayers[name]) return

  fetch(url)
    .then(res => res.arrayBuffer())
    .then(parseGeoraster)
    .then(georaster => {
      const layer = new GeoRasterLayer({
        georaster,
        opacity: 0.6,
        pixelValuesToColorFn: values => {
          const val = values[0]
          if (val === georaster.noDataValue || isNaN(val)) return null
          const scale = (val - georaster.mins[0]) / (georaster.maxs[0] - georaster.mins[0])
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
  const stationListRef = useContext(StationListRefContext)

  useEffect(() => {
    if (mapRef.current) return

    map = L.map('map').setView([27.2, -81.3], 10)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map)

    drawnItemsRef.current.addTo(map)

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
    })
    map.addControl(drawControl)

    map.on('draw:created', async (e: any) => {
      drawnItemsRef.current.clearLayers()
      const layer = e.layer
      drawnItemsRef.current.addLayer(layer)
      const latlngs = layer.getLatLngs()[0]
      const coordinates = latlngs.map((p: any) => [p.lng, p.lat])

      if (markerClusterGroup) {
        map.removeLayer(markerClusterGroup)
      }

      markerClusterGroup = L.markerClusterGroup()
      map!.addLayer(markerClusterGroup)

      const response = await apiUrl.post('/api/stations-in-polygon', { coordinates })
      const data = response.data
      const list = stationListRef?.current
      if (list) list.innerHTML = ''

      data.forEach((station: any) => {
        const marker = L.marker([station.lat, station.lng])
          .bindPopup(`<b>${station.name}</b>`)
        markerClusterGroup!.addLayer(marker)

        const li = document.createElement('li')
        const linksHTML = Array.isArray(station.links) && station.links.length > 0
          ? `<ul>${station.links.map(
              (link: any) =>
                `<li><a href="${link.url}" target="_blank">${link.label}</a> <span style='color:#666;font-size:0.85rem;'>(${link.type})</span></li>`
            ).join('')}</ul>`
          : `<p style='font-size: 0.9rem; color: #777;'>No data links available.</p>`

        li.innerHTML = `<strong>${station.name}</strong>${linksHTML}`
        list?.appendChild(li)
      })
    })
  }, [])

  return <div id="map" className="h-full w-full"></div>
}
