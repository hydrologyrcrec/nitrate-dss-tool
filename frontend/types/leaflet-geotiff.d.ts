declare module 'leaflet-geotiff' {
    import * as L from 'leaflet';
  
    interface GeoTIFFLayerOptions extends L.GridLayerOptions {
      source: string;
      band?: number;
      displayMin?: number;
      displayMax?: number;
      clampLow?: boolean;
      clampHigh?: boolean;
      renderer?: any;
      colorScale?: string;
    }
  
    export namespace GeoTIFFLayer {
      class RGB extends L.GridLayer {
        constructor(options: GeoTIFFLayerOptions);
      }
    }
  }
  