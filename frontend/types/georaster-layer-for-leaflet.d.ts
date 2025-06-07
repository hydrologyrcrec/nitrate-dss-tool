declare module "georaster-layer-for-leaflet" {
    import { Layer } from "leaflet";
    import { GeoRaster } from "georaster";
  
    interface GeoRasterLayerOptions {
      georaster: GeoRaster;
      resolution?: number;
      pixelValuesToColorFn?: (values: number[]) => string;
      debugLevel?: 0 | 1 | 2;
      zIndex?: number;
      opacity?: number;
      pane?: string;
    }
  
    export default class GeoRasterLayer extends Layer {
      constructor(options: GeoRasterLayerOptions);
      getBounds(): any;
    }
  }  