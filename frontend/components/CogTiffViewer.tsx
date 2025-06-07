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