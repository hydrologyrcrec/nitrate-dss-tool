'use client'

import { useState } from 'react'
import { loadGeoJSON, addRasterLayer, removeRasterLayer } from '@/components/Map'
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronUp , Database, Map, ChartNoAxesCombined, Package, BrickWall, Waves, Layers, LoaderPinwheel, PenLine, Sparkle, MapPinned, Eye } from "lucide-react";
import StationList from './StationList';
import SWStationList from "./SwStationList";
import { useStationContext } from "@/app/contexts/StationContext";
import dynamic from 'next/dynamic';

const LeafletMapWithCOG = dynamic(() => import('@/components/LeafletMapWithCOG'), {
  ssr: false,
});

const allGeoJSONLayers = {
  studyArea: [
    { label: 'Boundary', file: 'boundary.geojson' },
    { label: 'Buck Island Boundary', file: 'buck_island_boundary.geojson' },
  ],
  wells: [
    { label: 'Pumping', file: 'pumping.geojson' },
    { label: 'Observation', file: 'observation.geojson' },
  ],
  maps: [
    { label: 'Topography', file: 'topography' }, // Raster
    { label: 'River', file: 'river.geojson' },
    { label: 'K', file: 'k.geojson' },
    { label: 'Bedrock (Raster)', file: 'bedrock' }, // Raster
    { label: 'Initial Starting Head', file: 'initial_starting_head.geojson' },
  ],
  modelSetup: [
    { label: 'Boundary Condition', file: 'boundary_condition.geojson' },
    { label: 'GRID', file: 'grid.geojson' },
    { label: 'Inflow', file: 'inflow.geojson' },
    { label: 'Outflow', file: 'outflow.geojson' },
  ],
  modelResults: [
    { label: 'Groundwater Elevation - Steady State', file: 'steadystate.geojson' },
    { label: 'Groundwater Elevation - Transient', file: 'transient.geojson' },
    { label: 'Water Quality', file: 'water_quality.geojson' },
  ],
  scenarios: [
    { label: 'Existing Condition - Fertilization', file: 'fertpast.geojson' },
    { label: 'Existing Condition - Irrigation', file: 'irrigation.geojson' },
    { label: 'Fertilizer Management', file: '' },
    { label: 'Irrigation Management', file: '' },
    { label: 'Pasture Management', file: '' },
  ],
}

const bmpHeaders = [
  { title: 'Study Area', data: allGeoJSONLayers.studyArea, icon: <PenLine className="h-4 w-4"/> },
  { title: 'Wells', data: allGeoJSONLayers.wells, icon: <BrickWall className="h-4 w-4"/>},
  { title: 'Maps', data: allGeoJSONLayers.maps, icon: <Map className="h-4 w-4"/> },
  { title: 'Model Setup', data: allGeoJSONLayers.modelSetup, icon: <Package className="h-4 w-4"/>},
  { title: 'Model Results', data: allGeoJSONLayers.modelResults, icon: <Sparkle className="h-4 w-4"/>},
  { title: 'Scenarios', data: allGeoJSONLayers.scenarios, icon: <LoaderPinwheel className="h-4 w-4"/>},
]

const fsmTiffFiles = [
  {label: 'Drainage', file: 'Drainage_cog_v2.tif'},
  {label: 'Flood Inventory', file: 'Flood_inventory_cog_v1.tif'},
]

interface fsmTF {
  label: string; 
  file: string
}

export function AppSidebar() {
    const { state, dispatch } = useStationContext();
    const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({})
    const [visibleTiff, setVisibleTiff] = useState<string | null>(null);

    const toggleLayer = (filename: string) => {
      const updated = { ...visibleLayers, [filename]: !visibleLayers[filename] }
      setVisibleLayers(updated)
  
      const isVisible = updated[filename]
  
      if (filename === 'topography') {
        const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5008"}/tiffs/Top1_web.tif`
        isVisible ? addRasterLayer('topography', url) : removeRasterLayer('topography')
      } else if (filename === 'bedrock') {
        const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5008"}/tiffs/Bedrock1_web.tif`
        isVisible ? addRasterLayer('bedrock', url) : removeRasterLayer('bedrock')
      } else if (filename) {
        loadGeoJSON(filename, isVisible)
      }
    }
  
    const renderCheckboxes = (group: { label: string; file: string }[]) => (
      <div className="space-y-1 pl-4 py-1">
        {group.map(({ label, file }) => (
          <div key={label} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!visibleLayers[file]}
              disabled={!file}
              onChange={() => toggleLayer(file)}
            />
            {label}
          </div>
        ))}
      </div>
    )

    const renderTiffCheckboxes = (group: fsmTF[]) => (
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
    <SidebarProvider className="z-30 fixed top-[60px] right-0 max-w-1/4 h-[100vh] overflow-scroll bg-white">
        {visibleTiff && (
          <div className="w-full h-screen fixed top-[60px] left-0 z-10">
            <LeafletMapWithCOG file={visibleTiff} />
          </div>
        )}
      <Sidebar side="right" className="w-1/4 fixed top-[60px] right-0 overflow-scroll bg-white">
        <SidebarMenu className="pt-4 bg-white overflow-scroll h-screen">
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
                                <Collapsible className="group/collapsible">
                                  <SidebarMenuSubItem>
                                    <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 pt-2 rounded-md hover:bg-muted/60 transition">
                                        <span className="flex items-center justify-center gap-2"><Eye className="h-4 w-4" /><p className="text-sm">View</p></span>
                                        <ChevronDown className="h-4 w-4 ml-2" />
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

            <Collapsible className="group/collapsible" open={state.drawState} onOpenChange={() => dispatch({ type: "TOGGLE_DRAW_STATE", payload: !state.drawState })}>
                <SidebarMenuItem >
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                    <span className="flex items-center justify-center gap-2"><Waves className="h-4 w-4" /> Surface & Ground Water</span>
                        <ChevronUp className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuSub>
                                    <Collapsible className="group/collapsible" open={state.dataDisplayState}  onOpenChange={(open) => dispatch({ type: "TOGGLE_DATA_STATE", payload: open })}>
                                        <SidebarMenuSubItem>
                                        <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                            <span className="flex items-center justify-center gap-2"><ChartNoAxesCombined className="h-4 w-4" /><p className="text-sm">AI Prediction Results</p></span>
                                            <ChevronDown className="h-4 w-4 ml-2" />
                                        </CollapsibleTrigger>
                                        <SidebarMenuSub>
                                        <CollapsibleContent className='max-h-screen overflow-scroll'>
                                           <SWStationList />
                                        </CollapsibleContent>
                                        </SidebarMenuSub>
                                        </SidebarMenuSubItem>
                                    </Collapsible>
                                    <Collapsible className="group/collapsible" open={state.resultsDisplayState} onOpenChange={(open) => dispatch({ type: "TOGGLE_RESULTS_STATE", payload: open })}>
                                        <SidebarMenuSubItem>
                                        <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                            <span className="flex items-center justify-center gap-2"><Database className="h-4 w-4" /><p className="text-sm">AI Prediction Data</p></span>
                                            <ChevronDown className="h-4 w-4 ml-2" />
                                        </CollapsibleTrigger>
                                        <SidebarMenuSub>
                                        <CollapsibleContent className='max-h-screen overflow-scroll'>
                                           <StationList />
                                        </CollapsibleContent>
                                        </SidebarMenuSub>
                                        </SidebarMenuSubItem>
                                    </Collapsible>
                                </SidebarMenuSub>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </CollapsibleContent>
                </SidebarMenuItem >
            </Collapsible>


          {/* BMP Modeling Study */}
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
                          <Collapsible key={title}>
                            <CollapsibleTrigger className="flex justify-between w-full text-sm px-2 py-2 font-semibold">
                              <span className="flex items-center justify-center gap-2">{icon}<p className="text-sm">{title}</p></span>
                              <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                            <SidebarMenuSub>
                            <CollapsibleContent>
                              {renderCheckboxes(data)}
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
