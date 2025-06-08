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
import { ChevronDown, Database, Map, ChartNoAxesCombined, Package, Waves, Layers } from "lucide-react";
import StationList from './StationList';
import SWStationList from "./SwStationList";
import { useStationContext } from "@/app/contexts/StationContext";

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

export function AppSidebar() {
    const { state, dispatch } = useStationContext();
    const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({})

    const toggleLayer = (filename: string) => {
      const updated = { ...visibleLayers, [filename]: !visibleLayers[filename] }
      setVisibleLayers(updated)
  
      const isVisible = updated[filename]
  
      if (filename === 'topography') {
        const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5008"}/tiffs/Top1_web.tif`
        isVisible ? addRasterLayer('topography', url) : removeRasterLayer('topography')
      } else if (filename === 'bedrock') {
        const url = '${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5008"}/tiffs/Bedrock1_web.tif'
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
  
    return (
    <SidebarProvider className="z-30 fixed top-[60px] right-0 max-w-1/4 h-[100vh] overflow-scroll bg-white">
      <Sidebar side="right" className="w-1/4 fixed top-[60px] right-0 overflow-scroll bg-white">
        <SidebarMenu className="pt-4 bg-white overflow-scroll h-screen">
            <Collapsible className="group/collapsible">
                <SidebarMenuItem >
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                    <span className="flex items-center justify-center gap-2"><Map className="h-4 w-4" />Flood Susceptibility Mapping</span>
                        <ChevronDown className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton> <span className="text-sm text-gray-500 p-2"> Coming Soon </span></SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>

            <Collapsible className="group/collapsible" open={state.drawState} onOpenChange={() => dispatch({ type: "TOGGLE_DRAW_STATE", payload: !state.drawState })}>
                <SidebarMenuItem >
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                    <span className="flex items-center justify-center gap-2"><Waves className="h-4 w-4" /> Surface & Ground Water</span>
                        <ChevronDown className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuSub>
                                    <Collapsible className="group/collapsible" open={state.dataDisplayState}  onOpenChange={(open) => dispatch({ type: "TOGGLE_DATA_STATE", payload: open })}>
                                        <SidebarMenuSubItem>
                                        <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                            <span className="flex items-center justify-center gap-2"><ChartNoAxesCombined className="h-4 w-4" /><p className="text-sm">AI Prediction Results</p></span>
                                            <ChevronDown className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
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
                                            <ChevronDown className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
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
          <Collapsible defaultOpen>
            <SidebarMenuItem>
              <CollapsibleTrigger className="flex justify-between items-center w-full text-lg font-semibold px-2 py-2">
                <span className="flex items-center gap-2"><Layers className="h-4 w-4" />BMP Modeling Study</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {[
                    { title: 'Study Area', data: allGeoJSONLayers.studyArea },
                    { title: 'Wells', data: allGeoJSONLayers.wells },
                    { title: 'Maps', data: allGeoJSONLayers.maps },
                    { title: 'Model Setup', data: allGeoJSONLayers.modelSetup },
                    { title: 'Model Results', data: allGeoJSONLayers.modelResults },
                    { title: 'Scenarios', data: allGeoJSONLayers.scenarios },
                  ].map(({ title, data }) => (
                    <Collapsible key={title} defaultOpen>
                      <CollapsibleTrigger className="flex justify-between w-full text-sm px-2 py-2 font-semibold">
                        {title}
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {renderCheckboxes(data)}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </Sidebar>
    </SidebarProvider>
  )
}
