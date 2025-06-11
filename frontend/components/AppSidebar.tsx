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
import { ChevronUp , Database, Map, ChartNoAxesCombined, Package, BrickWall, LandPlot, Layers, LoaderPinwheel, PenLine, Sparkle, MapPinned, Eye, Wrench, LocateFixed } from "lucide-react";
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
    { label: 'Fertilizer Management', file: 'N-OBS.json' },
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

const swGwList = [
  {label: 'Surface Water', file: 'surface_water_stations.json', color: '#ca273e', weight: 5},
  {label: 'Ground Water', file: 'ground_water_wells.json', color: '#2b82cb', weight: 5},
]

interface fsmTF {
  label: string; 
  file: string
}

export function AppSidebar() {
    const { state, dispatch } = useStationContext();
    const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({})
    const [visibleTiff, setVisibleTiff] = useState<string | null>(null);

    const toggleLayer = (filename: string, color?: string, weight?: number) => {
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
        console.log("color and weight are: ", color, weight)
        if(color!=undefined && weight!=undefined) {
          const specialPropsDisplay : {prop: string, label: string} = { prop: 'Best_Model', label: 'Best Model' } 
          loadGeoJSON(filename, {visible: isVisible, color, weight, specialPropsDisplay: { prop: 'Best_Model', label: 'Best Model' },});          
        } else {
          loadGeoJSON(filename, {visible:isVisible})
        }
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

    const renderSwGwCheckboxes = (group: { label: string; file: string, color: string, weight: number }[]) => (
      <div className="space-y-1 pl-4 py-1">
        {group.map(({ label, file, color, weight }) => (
          <div key={label} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!visibleLayers[file]}
              disabled={!file}
              onChange={() => toggleLayer(file, color, weight)}
            />
            {label}
          </div>
        ))}
      </div>
    )
  
    return (
    <SidebarProvider className="z-30 fixed top-[60px] right-0 w-[380px] h-[200vh] overflow-scroll bg-white">
        {visibleTiff && (
          <div className="w-full h-screen fixed top-[60px] left-0 z-10">
            <LeafletMapWithCOG file={visibleTiff} />
          </div>
        )}
      <Sidebar side="right" className="w-[380px] fixed top-[60px] right-0 overflow-scroll bg-white pb-18">
        <SidebarMenu className="pt-4 bg-white overflow-scroll h-[100vh]">
            <Collapsible className="group/collapsible" open={state.aiToolToggle} onOpenChange={() => dispatch({ type: "TOGGLE_AI_TOOL", payload: !state.aiToolToggle })}>
                <SidebarMenuItem >
                    <CollapsibleTrigger className="group flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                    <span className="flex items-center justify-center gap-2"><Wrench className="h-4 w-4" /> AI Prediction Tool </span>
                        <ChevronUp className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenu>
                        <SidebarMenuSub>
                        <Collapsible open={state.drawState} onOpenChange={() => dispatch({ type: "TOGGLE_DRAW_STATE", payload: !state.drawState })}>
                            <CollapsibleTrigger className="group flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                <span className="flex items-center justify-center gap-2"><LandPlot className="h-4 w-4" /><span className='flex flex-col justify-center items-start'><p className="text-sm">Surface Water Discharge / </p><p className='text-sm'>Ground Water Level</p></span></span>
                                <ChevronUp className="h-4 w-4 ml-2 transition-transform group-data-[state=open]:rotate-180" />
                            </CollapsibleTrigger>
                            <SidebarMenuSub>
                            <CollapsibleContent className='max-h-screen overflow-scroll'>
                                  <SidebarMenu>
                                    <Collapsible open={state.dataDisplayState}  onOpenChange={(open) => dispatch({ type: "TOGGLE_DATA_STATE", payload: !state.dataDisplayState})}>
                                        <SidebarMenuSubItem >
                                        <CollapsibleTrigger className="group flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                            <span className="flex items-center justify-center gap-2"><Database className="h-4 w-4" /><p className="text-sm">Florida Stations (Data)</p></span>
                                            <ChevronUp className={`h-4 w-4 ml-2 transition-transform group-data-[state=${state.dataDisplayState? "open" : "close"}]:rotate-180`}/>
                                        </CollapsibleTrigger>
                                        <SidebarMenuSub>
                                        <CollapsibleContent className=' max-h-[50vh] h-fit overflow-scroll'>
                                          <StationList />
                                        </CollapsibleContent>
                                        </SidebarMenuSub>
                                        </SidebarMenuSubItem>
                                    </Collapsible>
                                    <Collapsible open={state.resultsParentDisplayState} onOpenChange={(open) => dispatch({ type: "TOGGLE_RESULTS_PARENT_STATE", payload: !state.resultsParentDisplayState })}>
                                        <SidebarMenuSubItem>
                                        <CollapsibleTrigger className="group flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                            <span className="flex items-center justify-center gap-2"><ChartNoAxesCombined className="h-4 w-4" /><p className="text-sm">AI Model (Results)</p></span>
                                            <ChevronUp className={`h-4 w-4 ml-2 transition-transform group-data-[state=${state.resultsParentDisplayState? "open" : "close"}]:rotate-180`}/>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className='max-h-screen overflow-scroll'>

                                        <SidebarMenuSub>
                                          <Collapsible open={state.resultsDisplayState.c1} onOpenChange={(open) => dispatch({ type: "TOGGLE_RESULTS_STATE", payload: {...state.resultsDisplayState, c1:!state.resultsDisplayState.c1} })}>
                                              <SidebarMenuSubItem >
                                              <CollapsibleTrigger className="group flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                                  <span className="flex items-center justify-center gap-2"><p className="text-sm">1. NBEATS Model (SW)</p></span>
                                                  <ChevronUp className={`h-4 w-4 ml-2 transition-transform group-data-[state=${state.resultsDisplayState.c1? "open" : "close"}]:rotate-180`}/>
                                              </CollapsibleTrigger>
                                              <SidebarMenuSub>
                                              <CollapsibleContent className='max-h-[50vh] h-fit overflow-scroll'>
                                                <SWStationList />
                                              </CollapsibleContent>
                                              </SidebarMenuSub>
                                              </SidebarMenuSubItem>
                                          </Collapsible>
                                          <Collapsible  open={state.resultsDisplayState.c2} onOpenChange={(open) => dispatch({ type: "TOGGLE_RESULTS_STATE", payload: {...state.resultsDisplayState, c2:!state.resultsDisplayState.c2} })}>
                                              <SidebarMenuSubItem>
                                              <CollapsibleTrigger className="group flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                                  <span className="flex items-center justify-center gap-2"><p className="text-sm">2. NHITS Model (GW)</p></span>
                                                  <ChevronUp className={`h-4 w-4 ml-2 transition-transform group-data-[state=${state.resultsDisplayState.c2? "open" : "close"}]:rotate-180`}/>
                                              </CollapsibleTrigger>
                                              <SidebarMenuSub>
                                              <CollapsibleContent className='max-h-screen overflow-scroll'>
                                              <p className='text-sm pt-2 text-neutral-500'>Coming Soon</p>
                                              </CollapsibleContent>
                                              </SidebarMenuSub>
                                              </SidebarMenuSubItem>
                                          </Collapsible>
                                          <Collapsible open={state.resultsDisplayState.c3} onOpenChange={(open) => dispatch({ type: "TOGGLE_RESULTS_STATE", payload: {...state.resultsDisplayState, c3:!state.resultsDisplayState.c3} })}>
                                              <SidebarMenuSubItem>
                                              <CollapsibleTrigger className="group flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                                  <span className="flex items-center justify-center gap-2"><p className="text-sm">3. Best Model Performance</p></span>
                                                  <ChevronUp className={`h-4 w-4 ml-2 transition-transform group-data-[state=${state.resultsDisplayState.c3? "open" : "close"}]:rotate-180`}/>
                                              </CollapsibleTrigger>
                                              <SidebarMenuSub>
                                              <CollapsibleContent className='max-h-screen overflow-scroll'>
                                              {renderSwGwCheckboxes(swGwList)}
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

            <Collapsible className="group/collapsible">
                <SidebarMenuItem >
                    <CollapsibleTrigger className="group flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                    <span className="flex items-center justify-center gap-2"><LocateFixed className="h-4 w-4" /> AI-Driven Risk Assessment Maps </span>
                        <ChevronUp className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenu>
                        <SidebarMenuSub>
                          <Collapsible>
                              <SidebarMenuItem >
                                  <CollapsibleTrigger className="group flex items-center justify-between w-full text-md font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                  <span className="flex items-center justify-center gap-2"><MapPinned className="h-4 w-4" /><p className="text-sm">Flood Susceptibility Mapping</p></span>
                                      <ChevronUp className="h-4 w-4 ml-2 transition-transform group-data-[state=open]:rotate-180" />
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                      <SidebarMenu>
                                        <SidebarMenuItem>
                                          <SidebarMenuSub>
                                              <Collapsible>
                                                <SidebarMenuSubItem>
                                                  <CollapsibleTrigger className="group flex items-center justify-between w-full text-lg font-semibold px-2 pt-2 rounded-md hover:bg-muted/60 transition">
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
                        </SidebarMenuSub>
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
                          <Collapsible key={title} className='group'>
                            <CollapsibleTrigger className="flex justify-between w-full text-sm px-2 py-2 font-semibold">
                              <span className="flex items-center justify-center gap-2">{icon}<p className="text-sm">{title}</p></span>
                              <ChevronUp className="h-4 w-4 ml-2 transition-transform group-data-[state=open]:rotate-180" />
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
