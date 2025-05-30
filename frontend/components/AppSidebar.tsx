  "use client";
import {
    Sidebar,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronDown, Wrench, TrendingUpDown, Database, Map, ChartNoAxesCombined, Package } from "lucide-react";
import StationList from './StationList';
import SWStationList from "./SwStationList";

export function AppSidebar() {
    return (
    <SidebarProvider className="z-30 fixed top-[60px] right-0 max-w-1/4 h-[100vh] overflow-scroll bg-white">
      <Sidebar side="right" className="w-1/4 fixed top-[60px] right-0 overflow-scroll bg-white">
        <SidebarMenu className="pt-4 bg-white overflow-scroll h-screen">
            <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem >
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                    <span className="flex items-center justify-center gap-2"><Map className="h-4 w-4" />Food Susceptibility Mapping</span>
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

            <Collapsible defaultOpen>
                <SidebarMenuItem >
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                    <span className="flex items-center justify-center gap-2"><Wrench className="h-4 w-4" /> Surface & Ground Water</span>
                        <ChevronDown className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuSub>
                                    <Collapsible>
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
                                    <Collapsible>
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

            {/* NEW SECTION: BMP MODELING STUDY */}
            <Collapsible defaultOpen className='mb-48'>
              <SidebarMenuItem className='overflow-scroll'>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                  <span className="flex items-center justify-center gap-2">
                    <Package className="h-4 w-4" />
                    BMP Modeling Study
                  </span>
                  <ChevronDown className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className='overflow-scroll'>
                  <SidebarMenuSub className='overflow-scroll'>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton className='font-semibold text-sm'>Study Area</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton className='font-semibold text-sm'>Wells</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton className='font-semibold text-sm'>Maps</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton className='font-semibold text-sm'>Model Setup</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

        </SidebarMenu>
      </Sidebar>
    </SidebarProvider>
    );
}
