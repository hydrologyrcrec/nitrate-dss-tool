"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import georaster from "georaster";

export default function COGViewer({ url }: { url: string }) {
  const map = useMap();

  useEffect(() => {
    let layer: any;

    georaster(url as any)
      .then((georasterData) => {
        layer = new GeoRasterLayer({
          georaster: georasterData,
          resolution: 64,
          pixelValuesToColorFn: (values) => {
            const val = values[0]; // single-band
            const noData = georasterData.noDataValue ?? 0;
        
            if (val === noData || isNaN(val)) {
              return 'rgba(0, 0, 0, 0)'; // transparent background
            }
        
            const scaled = Math.round((val / 255) * 255);
            return `rgb(${scaled}, ${scaled}, ${scaled})`;
          },
          opacity: 1.0, // keep 1 if you're handling transparency manually
        });

        layer.addTo(map);
        map.fitBounds(layer.getBounds());
      })
      .catch(console.error);

    return () => {
      if (layer) map.removeLayer(layer); // 🧹 clean up
    };
  }, [url, map]);

  return null;
}