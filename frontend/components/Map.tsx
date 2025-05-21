// components/Map.tsx
'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
})

export default function Map() {
  const mapRef = useRef<L.Map | null>(null)
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup())

  useEffect(() => {
    if (mapRef.current) return

    mapRef.current = L.map('map').setView([20, 0], 2)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(mapRef.current)

    drawnItemsRef.current.addTo(mapRef.current)
    const DrawControl = (L.Control as any).Draw

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
    })
    mapRef.current.addControl(drawControl)
    mapRef.current?.on('draw:created', async (e: any) => {
      drawnItemsRef.current.clearLayers()
      const layer = e.layer
      drawnItemsRef.current.addLayer(layer)
      const latlngs = layer.getLatLngs()[0]
      const coordinates = latlngs.map((p: any) => [p.lng, p.lat])

      const response = await fetch(
        'https://nitrate-dss-tool-rtln.onrender.com/api/stations-in-polygon',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ coordinates }),
        }
      )
      const data = await response.json()
      const list = document.getElementById('station-items')
      if (list) list.innerHTML = ''

      data.forEach((station: any) => {
        L.marker([station.lat, station.lng])
          .addTo(mapRef.current!)
          .bindPopup(`<b>${station.name}</b>`)

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

  return <div id="map" style={{ flex: 3 }}></div>
}