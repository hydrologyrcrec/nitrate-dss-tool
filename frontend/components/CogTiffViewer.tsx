// components/CogTiffViewer.tsx
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
        // For grayscale ramp
        const min = 1;
        const max = 8;

        // Optional: use this if you want grayscale ramp
        const grayscaleFn = (values: number[]) => {
          const val = values[0];
          const noData = georasterData.noDataValue ?? 0;

          if (val === noData || isNaN(val)) return 'rgba(0, 0, 0, 0)';
          const scaled = Math.round(((val - min) / (max - min)) * 255);
          return `rgb(${scaled}, ${scaled}, ${scaled})`;
        };

        // Recommended: Use custom class-based colors
        const classColorFn = (values: number[]) => {
          const val = values[0];
          const noData = georasterData.noDataValue ?? 0;

          if (val === noData || isNaN(val)) return 'rgba(0, 0, 0, 0)';

          const colors: Record<number, string> = {
            1: "#313695",
            2: "#4575b4",
            3: "#74add1",
            4: "#abd9e9",
            5: "#fee090",
            6: "#f46d43",
            7: "#d73027",
            8: "#a50026",
          };
          return colors[val] || 'rgba(0, 0, 0, 0)';
        };

        layer = new GeoRasterLayer({
          georaster: georasterData,
          resolution: 128, // sharper rendering
          // pixelValuesToColorFn: ([val]) => {
          //   if (val === 0 || isNaN(val)) return 'rgba(0,0,0,0)';
          //   const scaled = Math.round((val / 8) * 255); // assuming max 8
          //   return `rgb(${scaled},${scaled},${scaled})`;
          // },       
          pixelValuesToColorFn: ([val]) => {
            if (val === 0 || isNaN(val)) return 'rgba(0, 0, 0, 0)';
          
            const min = 0;
            const max = 1000;
          
            // Scale, then apply nonlinear gamma correction (darker shadows)
            const normalized = (val - min) / (max - min);
            const gammaCorrected = Math.pow(normalized, 0.7); // gamma < 1 = darker
            const scaled = Math.round(gammaCorrected * 255);
          
            return `rgb(${scaled}, ${scaled}, ${scaled})`;
          },                    
          opacity: 1.0,
        });

        layer.addTo(map);
        map.fitBounds(layer.getBounds());
      })
      .catch((error) => {
        if (error?.message?.includes("EPSG:32767")) {
          console.warn("Warning: Unrecognized projection EPSG:32767. Map may be misaligned.");
        } else {
          console.error(error);
        }
      });      

    return () => {
      if (layer) map.removeLayer(layer);
    };
  }, [url, map]);

  return null;
}
