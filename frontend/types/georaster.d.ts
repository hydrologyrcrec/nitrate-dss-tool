declare module "georaster" {
    export interface GeoRaster {
      noDataValue: number;
      pixelHeight: number;
      pixelWidth: number;
      xmin: number;
      xmax: number;
      ymin: number;
      ymax: number;
      projection: number | string;
      numberOfRasters: number;
      values: number[][][];
    }
  
    export default function parseGeoraster(arrayBuffer: ArrayBuffer): Promise<GeoRaster>;
  }  