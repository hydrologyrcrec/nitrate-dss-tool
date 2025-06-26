'use client'

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
} from "@radix-ui/react-collapsible";
import { ChevronUp , Database, ChartNoAxesCombined, LandPlot, Layers, MapPinned, Eye, Wrench, LocateFixed } from "lucide-react";
import StationList from './StationList';
import SWStationList from "./SwStationList";
import { useStationContext } from "@/app/contexts/StationContext";
import LeafletMapWithCOG from '@/components/LeafletMapWithCog1';
import { bmpHeaders } from './DataLayout';
import { handleMapPointClick, renderCheckboxes, renderNestedStructure, renderSwGwCheckboxes, renderTiffCheckboxes } from './LayerRenderers';
import { fsmTiffFiles, swGwList } from '@/data/layer';


// Declare global interface for window object
declare global {
  interface Window {
    handleWaterQualityPointClick?: (pointName: string, setSelectedWaterQualityPoint: React.Dispatch<React.SetStateAction<WaterQualityPointKeys>>) => void;
  }
}

export function AppSidebar() {
    const { state, dispatch, mapStateVars } = useStationContext();
    const visibleLayers = mapStateVars.visibleLayers;
    const setVisibleLayers = mapStateVars.setVisibleLayers;
    const visibleTiff = mapStateVars.visibleTiff;
    const setVisibleTiff = mapStateVars.setVisibleTiff;

    // Expose function globally so map can call it
    if (typeof window !== 'undefined') {
      window.handleWaterQualityPointClick = handleMapPointClick;
    }
  
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