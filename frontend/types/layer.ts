// Type definitions for better type safety
interface WaterQualityPoint {
  name: string;
  viewLink: string;
  downloadLink: string;
  description: string;
  status: string;
}

type WaterQualityPointKeys = 'SW1' | 'SW2' | 'SW4' | 'SW5' | 'SW6' | 'SW7' | 'SW8' | 'SW9' | 'SW10' | 'Grove';

interface LayerItem {
  label: string;
  file: string;
  type: 'geojson' | 'raster' | 'excel' | 'parent' | 'waterQuality';
  children?: LayerItem[];
  icon?: React.ReactNode;
  component?: React.ReactNode;
}

interface FsmTF {
  label: string; 
  file: string;
}