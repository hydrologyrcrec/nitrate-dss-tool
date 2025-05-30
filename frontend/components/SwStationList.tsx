'use client';

import { useStationContext } from '@/app/contexts/StationContext';

export default function SWStationList() {
  const { state } = useStationContext();

  if (!state.stations.length) {
    return (
      <p className="text-sm text-gray-500 p-2">
        No Results Found. Draw a polygon to View Results.
      </p>
    );
  }

  return (
    <ul id="station-items">
      {state.surfaceWaterStations.map((station) => (
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
              Results Link Unavailable.
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}