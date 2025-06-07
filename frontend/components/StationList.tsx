'use client';

import { useStationContext } from '@/app/contexts/StationContext';
import Image from 'next/image';

export default function StationList() {
  const { state } = useStationContext();

  if (!state.stations.length) {
    return (
      <p className="text-sm text-gray-500 p-2">
        No data to display. Draw a polygon to view data.
      </p>
    );
  }

  return (
    <ul id="station-items">
      {state.stations.map((station) => (
        <li key={station.id}>
         <strong className='flex gap-4 pb-2'><Image src="leaflet/images/marker-icon.png" alt='normal-marker' className='h-6 w-4' />{station.name}</strong>
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
              Data Link Unavailable.
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}