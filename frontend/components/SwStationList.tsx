'use client';

import { useStationContext } from '@/app/contexts/StationContext';
import Image from 'next/image';

export default function SWStationList() {
  const { state } = useStationContext();

  if (!state.stations.length) {
    return (
      <p className="text-sm text-gray-500 p-2">
        No results to display. Draw a polygon to view results.
      </p>
    );
  }

  return (
    <ul id="station-items">
      {state.surfaceWaterStations.map((station) => (
        <li key={station.id}>
          <p className='flex gap-4 pb-2 text-sm font-semibold'><Image src="/leaflet/images/marker-icon-red.png" alt='red-marker' width={16} height={24} className='h-6 w-4' />{station.name}</p>
          {Array.isArray(station.links) && station.links.length > 0 ? (
            <ul>
              {station.links.map((link, index) => (
                <li key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>{' '}
                  <span style={{ color: '#666', fontSize: '0.85rem' }}>
                    ({link.type})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '0.9rem', color: '#777' }}>
              Results Link Unavailable.
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}