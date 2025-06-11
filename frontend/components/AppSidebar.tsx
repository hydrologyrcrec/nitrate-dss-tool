'use client'

import { useState } from 'react'
import { loadGeoJSON, addRasterLayer, removeRasterLayer } from '@/components/Map'
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronUp , Database, Map, ChartNoAxesCombined, Package, BrickWall, LandPlot, Layers, LoaderPinwheel, PenLine, Sparkle, MapPinned, Eye, Wrench, FileSpreadsheet, Download, MapPin, Droplets, BadgeInfo, TrendingUpDown } from "lucide-react";
import StationList from './StationList';
import SWStationList from "./SwStationList";
import { useStationContext } from "@/app/contexts/StationContext";
import LeafletMapWithCOG from '@/components/LeafletMapWithCOG';

// Google Drive links for Excel files - CLEANED UP
const excelLinks = {
  calibration: 'https://docs.google.com/spreadsheets/d/175ex1CvdwvZDivJEmDpACAjtiv7vtdti/edit?usp=sharing&ouid=100448471119553937842&rtpof=true&sd=true',
  validation: 'https://docs.google.com/spreadsheets/d/1q9kC2yq43Ny3kaW-aI0KIB-kyNHTSdrj/edit?usp=sharing&ouid=100448471119553937842&rtpof=true&sd=true',
  transient: 'https://docs.google.com/spreadsheets/d/1RS4yEa7PnYqwsS5O_hrACBUn8Xs9K6N4/edit?usp=sharing&ouid=100448471119553937842&rtpof=true&sd=true',
  quality: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit?usp=sharing&ouid=100448471119553937842&rtpof=true&sd=true',
} as const;

// Type definitions for better type safety
interface WaterQualityPoint {
  name: string;
  viewLink: string;
  downloadLink: string;
  description: string;
  status: string;
}

type WaterQualityPointKeys = 'SW1' | 'SW2' | 'SW4' | 'SW5' | 'SW6' | 'SW7' | 'SW8' | 'SW9' | 'SW10' | 'Grove';

// Updated Water Quality Data Links - Multi-Sheet Structure
const waterQualityPointData: Record<WaterQualityPointKeys, WaterQualityPoint> = {
  'SW1': {
    name: 'SW1',
    viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=80388670',
    downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=80388670',
    description: 'High nitrate levels (6-7 mg/L)',
    status: 'Active Monitoring'
  },
  'SW2': {
    name: 'SW2',
    viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=1395270900',
    downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=1395270900',
    description: 'High nitrate levels (4-7 mg/L)',
    status: 'Active Monitoring'
  },
  'SW4': {
    name: 'SW4',
    viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=45723149',
    downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=45723149',
    description: 'Low nitrate levels',
    status: 'Active Monitoring'
  },
  'SW5': {
    name: 'SW5',
    viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=1738159344',
    downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=1738159344',
    description: 'Very low nitrate levels',
    status: 'Active Monitoring'
  },
  'SW6': {
    name: 'SW6',
    viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=1101431023',
    downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=1101431023',
    description: 'Low nitrate levels',
    status: 'Active Monitoring'
  },
  'SW7': {
    name: 'SW7',
    viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=1996146960',
    downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=1996146960',
    description: 'Very low nitrate levels',
    status: 'Active Monitoring'
  },
  'SW8': {
    name: 'SW8',
    viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=835797608',
    downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=835797608',
    description: 'Very low nitrate levels',
    status: 'Active Monitoring'
  },
  'SW9': {
    name: 'SW9',
    viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=512927320',
    downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=512927320',
    description: 'Very low nitrate levels',
    status: 'Active Monitoring'
  },
  'SW10': {
    name: 'SW10',
    viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=196383291',
    downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=196383291',
    description: 'Very low nitrate levels',
    status: 'Active Monitoring'
  },
  'Grove': {
    name: 'Grove',
    viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=1066857637',
    downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=1066857637',
    description: 'Very low nitrate levels',
    status: 'Active Monitoring'
  }
};

interface LayerItem {
  label: string;
  file: string;
  type: 'geojson' | 'raster' | 'excel' | 'parent' | 'waterQuality';
  children?: LayerItem[];
  icon?: React.ReactNode;
  component?: React.ReactNode;
}

// Updated data structure with new hierarchy
const allGeoJSONLayers = {
  studyArea: [
    { label: 'Boundary', file: 'boundary.geojson', type: 'geojson' as const },
    { label: 'Buck Island Boundary', file: 'buck_island_boundary.geojson', type: 'geojson' as const },
  ],
  wells: [
    { label: 'Pumping', file: 'pumping.geojson', type: 'geojson' as const },
    { label: 'Observation', file: 'observation.geojson', type: 'geojson' as const },
    { label: 'Water Quality', file: 'water_quality.geojson', type: 'geojson' as const },
  ],
  maps: [
    { label: 'Topography', file: 'topography', type: 'raster' as const },
    { label: 'River', file: 'river.geojson', type: 'geojson' as const },
    { label: 'K', file: 'k.geojson', type: 'geojson' as const },
    { label: 'Bedrock (Raster)', file: 'bedrock', type: 'raster' as const },
    { label: 'Initial Starting Head', file: 'initial_starting_head.geojson', type: 'geojson' as const },
  ],
  modelSetup: [
    { label: 'Boundary Condition', file: 'boundary_condition.geojson', type: 'geojson' as const },
    { label: 'GRID', file: 'grid.geojson', type: 'geojson' as const },
    { label: 'Inflow', file: 'inflow.geojson', type: 'geojson' as const },
    { label: 'Outflow', file: 'outflow.geojson', type: 'geojson' as const },
  ],
  // Updated Model Results with nested structure
  modelResults: [
    {
      label: 'Groundwater Elevation - Steady State',
      type: 'parent' as const,
      file: 'steadystate.geojson',
      children: [
        { label: 'Calibration', file: excelLinks.calibration, type: 'excel' as const },
        { label: 'Validation', file: excelLinks.validation, type: 'excel' as const },
      ]
    },
    {
      label: 'Groundwater Elevation - Transient',
      type: 'parent' as const,
      file: 'transient.geojson',
      children: [
        { label: 'Transient', file: excelLinks.transient, type: 'excel' as const },
      ]
    },
    {
      label: 'Water Quality',
      type: 'waterQuality' as const,
      file: '',
      children: [
        { label: 'Quality', file: excelLinks.quality, type: 'excel' as const },
      ]
    },
  ],
  // Updated Scenarios with new structure - YOUR REQUESTED CHANGES
  scenarios: [
    {
      label: 'Existing Condition',
      component: (
        <span className="flex items-center gap-2 pb-1">
          <BadgeInfo className="h-4 w-4" /> Existing Condition
        </span>
      ),
      type: 'parent' as const,
      file: '',
      children: [
        {
          label: 'Fertilization',
          type: 'parent' as const,
          file: '',
          children: [
            { label: 'Pasture', file: 'fertpast.geojson', type: 'geojson' as const },
            { label: 'Nodes', file: 'nodes.geojson', type: 'geojson' as const},
          ]
        },
        { label: 'Irrigation', file: 'irrigation.geojson', type: 'geojson' as const },
        {
          label: 'Results (N)',
          type: 'parent' as const,
          file: '',
          children: [
            { label: 'South Marsh East Lykes', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=349485447#gid=349485447', type: 'excel' as const },
            { label: 'W6', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=963640838#gid=963640838', type: 'excel' as const },
            { label: 'South Marsh Center', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=166517616#gid=166517616', type: 'excel' as const },
            { label: 'South Marsh West', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=1872081315#gid=1872081315', type: 'excel' as const },
            { label: '770 East', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=561784198#gid=561784198', type: 'excel' as const },
            { label: 'West Marsh Center', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=568891967#gid=568891967', type: 'excel' as const },
            { label: 'West Marsh South', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=752529518#gid=752529518', type: 'excel' as const },
            { label: 'Stargrass Field', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=712630543#gid=712630543', type: 'excel' as const },
            { label: 'West Marsh North', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=1765172736#gid=1765172736', type: 'excel' as const },
            { label: 'Tropical West', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=117893368#gid=117893368', type: 'excel' as const },
            { label: 'Bull Field North', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=2035059955#gid=2035059955', type: 'excel' as const },
            { label: 'Eucalyptus', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=641990813#gid=641990813', type: 'excel' as const },
            { label: 'Tropical East South', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=1925285281#gid=1925285281', type: 'excel' as const },
            { label: 'South Kuhn', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=989782872#gid=989782872', type: 'excel' as const },
            { label: 'WRP East Marsh North', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=1796455500#gid=1796455500', type: 'excel' as const },
            { label: 'Shop Field', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=32693183#gid=32693183', type: 'excel' as const },
            { label: 'East Marsh South', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=1807020016#gid=1807020016', type: 'excel' as const },
            { label: 'Grove', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=565410006#gid=565410006', type: 'excel' as const },
            { label: '800 Acres #1', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=656741039#gid=656741039', type: 'excel' as const },
            { label: 'S5', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=1345317116#gid=1345317116', type: 'excel' as const },
            { label: 'Ceiling #3', file: 'https://docs.google.com/spreadsheets/d/1mcsevtWNJWn7JdMHo7gjxzOnefCkhNNY/edit?gid=471606032#gid=471606032', type: 'excel' as const },
          ]
        }
      ]
    },
    { label: 'Fertilizer Management', file: '', type: 'geojson' as const },
    { label: 'Irrigation Management', file: '', type: 'geojson' as const },
    { label: 'Pasture Management', file: '', type: 'geojson' as const },
  ],
};

const bmpHeaders = [
  { title: 'Study Area', data: allGeoJSONLayers.studyArea, icon: <PenLine className="h-4 w-4"/> },
  { title: 'Wells', data: allGeoJSONLayers.wells, icon: <BrickWall className="h-4 w-4"/>},
  { title: 'Maps', data: allGeoJSONLayers.maps, icon: <Map className="h-4 w-4"/> },
  { title: 'Model Setup', data: allGeoJSONLayers.modelSetup, icon: <Package className="h-4 w-4"/>},
  { title: 'Model Results', data: allGeoJSONLayers.modelResults, icon: <Sparkle className="h-4 w-4"/>},
  { title: 'Scenarios', data: allGeoJSONLayers.scenarios, icon: <LoaderPinwheel className="h-4 w-4"/>},
];

const fsmTiffFiles = [
  {label: 'Drainage', file: 'Drainage_cog_v2.tif'},
  {label: 'Flood Inventory', file: 'Flood_inventory_cog_v1.tif'},
];

interface FsmTF {
  label: string; 
  file: string;
}

// Helper function to check if a string is a valid water quality point key
const isValidWaterQualityPoint = (point: string): point is WaterQualityPointKeys => {
  return point in waterQualityPointData;
};

// Declare global interface for window object
declare global {
  interface Window {
    handleWaterQualityPointClick?: (pointName: string) => void;
  }
}

export function AppSidebar() {
    const { state, dispatch } = useStationContext();
    const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({});
    const [visibleTiff, setVisibleTiff] = useState<string | null>(null);
    
    // State for selected water quality monitoring point
    const [selectedWaterQualityPoint, setSelectedWaterQualityPoint] = useState<WaterQualityPointKeys>('SW8');

    // Function to handle map point clicks
    const handleMapPointClick = (pointName: string) => {
      if (isValidWaterQualityPoint(pointName)) {
        setSelectedWaterQualityPoint(pointName);
      }
    };

    // Expose function globally so map can call it
    if (typeof window !== 'undefined') {
      window.handleWaterQualityPointClick = handleMapPointClick;
    }

    // Handle clicking on items (different behavior for Excel vs GeoJSON)
    const handleItemClick = (item: LayerItem) => {
      if (item.type === 'excel') {
        // Open Excel file in new tab
        window.open(item.file, '_blank');
      } else if (item.type === 'geojson' || item.type === 'raster') {
        // Toggle layer visibility on map
        toggleLayer(item.file);
      }
    };

    const toggleLayer = (filename: string) => {
      const updated = { ...visibleLayers, [filename]: !visibleLayers[filename] };
      setVisibleLayers(updated);
  
      const isVisible = updated[filename];
  
      if (filename === 'topography') {
        const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5008"}/tiffs/Top1_web.tif`;
        isVisible ? addRasterLayer('topography', url) : removeRasterLayer('topography');
      } else if (filename === 'bedrock') {
        const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5008"}/tiffs/Bedrock1_web.tif`;
        isVisible ? addRasterLayer('bedrock', url) : removeRasterLayer('bedrock');
      } else if (filename) {
        loadGeoJSON(filename, isVisible);
      }
    };

    // Render Water Quality Point Selection
    const renderWaterQualitySection = () => {
      const currentPointData = waterQualityPointData[selectedWaterQualityPoint];
      
      return (
        <div className="pl-8 py-1">
          {/* Point Selector */}
          <div className="text-sm mb-2">
            <span className="font-medium">Selected: {currentPointData.name}</span>
          </div>
          <div className="grid grid-cols-5 gap-1 mb-3">
            {(Object.keys(waterQualityPointData) as WaterQualityPointKeys[]).map((point) => (
              <button
                key={point}
                onClick={() => handleMapPointClick(point)}
                className={`text-xs px-1 py-1 rounded ${
                  selectedWaterQualityPoint === point
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {point}
              </button>
            ))}
          </div>
          
          {/* Data Access */}
          <div className="space-y-1">
            <button
              onClick={() => window.open(currentPointData.viewLink, '_blank')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm"
            >
              <Eye className="h-4 w-4" />
              View {currentPointData.name} (with Charts)
            </button>
            <button
              onClick={() => window.open(currentPointData.downloadLink, '_blank')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm"
            >
              <Download className="h-4 w-4" />
              Download {currentPointData.name}
            </button>
          </div>

          {/* Combined Quality File */}
          <div className="border-t pt-2 mt-3">
            <button
              onClick={() => window.open(excelLinks.quality, '_blank')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Quality (Combined - All Points)
            </button>
          </div>
        </div>
      );
    };

    // Render simple items (for backwards compatibility)
    const renderCheckboxes = (group: LayerItem[]) => (
      <div className="space-y-1 pl-4 py-1">
        {group.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm">
            {item.type === 'excel' ? (
              // Excel files - clickable link with icon
              <button
                onClick={() => handleItemClick(item)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                disabled={!item.file}
              >
                <FileSpreadsheet className="h-4 w-4" />
                {item.label}
              </button>
            ) : (
              // GeoJSON/Raster files - checkbox
              <>
                <input
                  type="checkbox"
                  checked={!!visibleLayers[item.file]}
                  disabled={!item.file}
                  onChange={() => toggleLayer(item.file)}
                />
                {item.label}
              </>
            )}
          </div>
        ))}
      </div>
    );

    // Render nested structure for Model Results and Scenarios - COMPLETE FUNCTION
    const renderNestedStructure = (group: LayerItem[]) => (
      <div className="space-y-1 pl-4 py-1">
        {group.map((item) => {
          // Special handling for Water Quality section
          if (item.type === 'waterQuality') {
            return (
              <Collapsible key={item.label} className="group">
                <div className="flex flex-col">
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium hover:bg-muted/40 rounded transition">
                    <span className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      {item.label}
                    </span>
                    <ChevronUp className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {renderWaterQualitySection()}
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          }

          if (item.type === 'parent' && item.children) {
            return (
              <Collapsible key={item.label} className="group">
                <div className="flex flex-col">
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm gap-3 font-medium hover:bg-muted/40 rounded transition">
                    <span className="flex justify-start items-center gap-2">
                      {item.file && (
                        <input
                          type="checkbox"
                          checked={!!visibleLayers[item.file]}
                          onChange={() => toggleLayer(item.file)}
                          className=""
                        />
                      )}
                      {item.component? item.component : <p className='text-left'>{item.label}</p>}
                    </span>
                    <ChevronUp className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-8">
                    {item.children.map((child) => {
                      if (child.type === 'parent' && child.children) {
                        // Nested parent (like "Results" under "Existing Condition" or "Nodes" under "Fertilization")
                        return (
                          <Collapsible key={child.label} className="group mt-1">
                            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm pb-2 font-medium hover:bg-muted/40 rounded transition">
                              <span className="flex items-center gap-2">
                                <TrendingUpDown className="h-4 w-4" />
                                {child.label}
                              </span>
                              <ChevronUp className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-4 space-y-1">
                              {child.children!.map((grandchild) => (
                                <div key={grandchild.label} className="flex items-center gap-2 text-sm py-1">
                                  {grandchild.type === 'excel' ? (
                                    <button
                                      onClick={() => handleItemClick(grandchild)}
                                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                      disabled={!grandchild.file}
                                    >
                                      <FileSpreadsheet className="h-4 w-4" />
                                      {grandchild.label}
                                    </button>
                                  ) : (
                                    <>
                                      <input
                                        type="checkbox"
                                        checked={!!visibleLayers[grandchild.file]}
                                        disabled={!grandchild.file}
                                        onChange={() => toggleLayer(grandchild.file)}
                                      />
                                      {grandchild.label}
                                    </>
                                  )}
                                </div>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        );
                      } else {
                        // Regular child item
                        return (
                          <div key={child.label} className="flex items-center gap-2 text-sm py-1">
                            {child.type === 'excel' ? (
                              <button
                                onClick={() => handleItemClick(child)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                disabled={!child.file}
                              >
                                <FileSpreadsheet className="h-4 w-4" />
                                {child.label}
                              </button>
                            ) : (
                              <>
                                <input
                                  type="checkbox"
                                  checked={!!visibleLayers[child.file]}
                                  disabled={!child.file}
                                  onChange={() => toggleLayer(child.file)}
                                />
                                {child.label}
                              </>
                            )}
                          </div>
                        );
                      }
                    })}
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          } else {
            // Regular item (backwards compatibility)
            return (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                {item.type === 'excel' ? (
                  <button
                    onClick={() => handleItemClick(item)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    disabled={!item.file}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    {item.label}
                  </button>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={!!visibleLayers[item.file]}
                      disabled={!item.file}
                      onChange={() => toggleLayer(item.file)}
                    />
                    {item.label}
                  </>
                )}
              </div>
            );
          }
        })}
      </div>
    );

    const renderTiffCheckboxes = (group: FsmTF[]) => (
      <div className="space-y-1 pl-4 py-1">
        {group.map(({ label, file }) => (
          <div key={label} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={visibleTiff === file}
              onChange={() => {
                setVisibleTiff(visibleTiff === file ? null : file);
              }}
            />
            {label}
          </div>
        ))}
      </div>
    );    
  
    return (
    <SidebarProvider className="z-30 fixed top-[60px] right-0 max-w-1/4 h-[200vh] overflow-scroll bg-white">
        {visibleTiff && (
          <div className="w-full h-screen fixed top-[60px] left-0 z-10">
            <LeafletMapWithCOG file={visibleTiff} />
          </div>
        )}
      <Sidebar side="right" className="w-1/4 fixed top-[60px] right-0 overflow-scroll bg-white pb-18">
        <SidebarMenu className="pt-4 bg-white overflow-scroll h-[100vh]">
            <Collapsible className="group/collapsible">
                <SidebarMenuItem >
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                    <span className="flex items-center justify-center gap-2"><MapPinned className="h-4 w-4" />Flood Susceptibility Mapping</span>
                        <ChevronUp className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <SidebarMenuSub>
                                <Collapsible className="group">
                                  <SidebarMenuSubItem>
                                    <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 pt-2 rounded-md hover:bg-muted/60 transition">
                                        <span className="flex items-center justify-center gap-2"><Eye className="h-4 w-4" /><p className="text-sm">View</p></span>
                                        <ChevronUp className="h-4 w-4 ml-2 transition-transform group-data-[state=open]:rotate-180" />
                                    </CollapsibleTrigger>
                                    <SidebarMenuSub>
                                    <CollapsibleContent className='max-h-screen overflow-scroll pt-2'>
                                        {renderTiffCheckboxes(fsmTiffFiles)}
                                    </CollapsibleContent>
                                    </SidebarMenuSub>
                                  </SidebarMenuSubItem>
                                </Collapsible>
                            </SidebarMenuSub>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>

            <Collapsible className="group/collapsible" open={state.aiToolToggle} onOpenChange={() => dispatch({ type: "TOGGLE_AI_TOOL", payload: !state.aiToolToggle })}>
                <SidebarMenuItem >
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                    <span className="flex items-center justify-center gap-2"><Wrench className="h-4 w-4" /> AI Prediction Tool </span>
                        <ChevronUp className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenu>
                        <SidebarMenuSub>
                        <Collapsible className="group" open={state.drawState} onOpenChange={() => dispatch({ type: "TOGGLE_DRAW_STATE", payload: !state.drawState })}>
                            <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                <span className="flex items-center justify-center gap-2"><LandPlot className="h-4 w-4" /><span className='flex flex-col justify-center items-start'><p className="text-sm">Surface Water Discharge / </p><p className='text-sm'>Ground Water Level</p></span></span>
                                <ChevronUp className="h-4 w-4 ml-2 transition-transform group-data-[state=open]:rotate-180" />
                            </CollapsibleTrigger>
                            <SidebarMenuSub>
                            <CollapsibleContent className='max-h-screen overflow-scroll'>
                                  <SidebarMenu>
                                    <Collapsible className='group' open={state.dataDisplayState}  onOpenChange={(open: boolean) => dispatch({ type: "TOGGLE_DATA_STATE", payload: open })}>
                                        <SidebarMenuSubItem >
                                        <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                            <span className="flex items-center justify-center gap-2"><Database className="h-4 w-4" /><p className="text-sm">Florida Stations (Data)</p></span>
                                            <ChevronUp className={`h-4 w-4 ml-2 transition-transform group-data-[state=${state.dataDisplayState? "open" : "close"}]:rotate-180`}/>
                                        </CollapsibleTrigger>
                                        <SidebarMenuSub>
                                        <CollapsibleContent className='h-[50vh] overflow-scroll'>
                                          <StationList />
                                        </CollapsibleContent>
                                        </SidebarMenuSub>
                                        </SidebarMenuSubItem>
                                    </Collapsible>
                                    <Collapsible className='group' open={state.resultsParentDisplayState} onOpenChange={(open: boolean) => dispatch({ type: "TOGGLE_RESULTS_PARENT_STATE", payload: open })}>
                                        <SidebarMenuSubItem>
                                        <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                            <span className="flex items-center justify-center gap-2"><ChartNoAxesCombined className="h-4 w-4" /><p className="text-sm">AI Model (Results)</p></span>
                                            <ChevronUp className={`h-4 w-4 ml-2 transition-transform group-data-[state=${state.resultsDisplayState? "open" : "close"}]:rotate-180`}/>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className='max-h-screen overflow-scroll'>

                                        <SidebarMenuSub>
                                          <Collapsible className='group-1' open={state.resultsDisplayState} onOpenChange={(open: boolean) => dispatch({ type: "TOGGLE_RESULTS_STATE", payload: open })}>
                                              <SidebarMenuSubItem >
                                              <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                                  <span className="flex items-center justify-center gap-2"><p className="text-sm">1. NBEATS Model (SW)</p></span>
                                                  <ChevronUp className={`h-4 w-4 ml-2 transition-transform group-data-[state=close}]:rotate-180`}/>
                                              </CollapsibleTrigger>
                                              <SidebarMenuSub>
                                              <CollapsibleContent className='h-[50vh] overflow-scroll'>
                                                <SWStationList />
                                              </CollapsibleContent>
                                              </SidebarMenuSub>
                                              </SidebarMenuSubItem>
                                          </Collapsible>
                                          <Collapsible className='group'>
                                              <SidebarMenuSubItem>
                                              <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                                  <span className="flex items-center justify-center gap-2"><p className="text-sm">2. NHITS Model (GW)</p></span>
                                                  <ChevronUp className={`h-4 w-4 ml-2 transition-transform group-data-[state=close]:rotate-180`}/>
                                              </CollapsibleTrigger>
                                              <SidebarMenuSub>
                                              <CollapsibleContent className='max-h-screen overflow-scroll'>
                                              <p className='text-sm pt-2 text-neutral-500'>Coming Soon</p>
                                              </CollapsibleContent>
                                              </SidebarMenuSub>
                                              </SidebarMenuSubItem>
                                          </Collapsible>
                                        </SidebarMenuSub>
                                        </CollapsibleContent>
                                        </SidebarMenuSubItem>
                                    </Collapsible>
                                  </SidebarMenu>
                            </CollapsibleContent>
                            </SidebarMenuSub>
                        </Collapsible>
                        </SidebarMenuSub>
                      </SidebarMenu>
                    </CollapsibleContent>
                </SidebarMenuItem >
            </Collapsible>


          {/* BMP Modeling Study - Updated with new structure */}
          <Collapsible className="group/collapsible" >
            <SidebarMenuItem>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                <span className="flex items-center gap-2"><Layers className="h-4 w-4" />BMP Modeling Study</span>
                <ChevronUp className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className='mb-20'>
                <SidebarMenu>
                  <SidebarMenuItem>
                      <SidebarMenuSub>
                        {bmpHeaders.map(({ title, data, icon }) => (
                          <Collapsible key={title} className='group'>
                            <CollapsibleTrigger className="flex justify-between w-full text-sm px-2 py-2 font-semibold">
                              <span className="flex items-center justify-center gap-2">{icon}<p className="text-sm">{title}</p></span>
                              <ChevronUp className="h-4 w-4 ml-2 transition-transform group-data-[state=open]:rotate-180" />
                            </CollapsibleTrigger>
                            <SidebarMenuSub>
                            <CollapsibleContent>
                              {/* Use nested structure for Model Results and Scenarios, simple for others */}
                              {title === 'Model Results' || title === 'Scenarios' 
                                ? renderNestedStructure(data)
                                : renderCheckboxes(data)
                              }
                            </CollapsibleContent>
                            </SidebarMenuSub>
                          </Collapsible>
                        ))}
                      </SidebarMenuSub>
                    </SidebarMenuItem>
                  </SidebarMenu>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </Sidebar>
    </SidebarProvider>
  )
}