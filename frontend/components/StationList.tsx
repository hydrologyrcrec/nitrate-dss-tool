'use client';

import { useStationContext } from '@/app/contexts/StationContext';

export default function StationList() {
  const { state } = useStationContext();

  if (!state.stations.length) {
    return (
      <p className="text-sm text-gray-500 p-2">
        No data found. Draw a polygon to fetch Data.
      </p>
    );
  }

  return (
    <ul id="station-items">
      {state.stations.map((station) => (
        <li key={station.id}>
          <strong>{station.name}</strong>
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
              No data links available.
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}