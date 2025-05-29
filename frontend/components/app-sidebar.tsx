"use client";
import { useContext } from 'react';
import { StationListRefContext } from '@/app/contexts/StationListContext';
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
import { ChevronDown, View, Wrench, TrendingUpDown, Database, Map, ChartNoAxesCombined } from "lucide-react";
export function AppSidebar() {
    const stationListRef = useContext(StationListRefContext);
    return (
    <SidebarProvider className="z-30 fixed top-[60px] right-0 max-w-1/4 overflow-clip">
      <Sidebar side="right" className="w-1/4 fixed top-[60px] right-0">
        <SidebarMenu className="pt-4">
            <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem >
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                    <span className="flex items-center justify-center gap-2"><View className="h-4 w-4" />View</span>
                        <ChevronDown className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton> <span className="flex gap-2 items-center justify-center font-semibold text-sm"> <Map className="h-4 w-4"/> Food Susceptibility Mapping </span></SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
            <Collapsible defaultOpen>
                <SidebarMenuItem >
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                    <span className="flex items-center justify-center gap-2"><Wrench className="h-4 w-4" />Tools (Surface & Ground Water)</span>
                        <ChevronDown className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuSub>
                                    <Collapsible>
                                        <SidebarMenuSubItem>
                                        <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                            <span className="flex items-center justify-center gap-2"><TrendingUpDown className="h-4 w-4" /><p className="text-sm">AI Prediction</p></span>
                                            <ChevronDown className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </CollapsibleTrigger>
                                        <SidebarMenuSub>
                                        <CollapsibleContent>
                                            <span className="text-sm">Coming Soon</span> 
                                        </CollapsibleContent>
                                        </SidebarMenuSub>
                                        </SidebarMenuSubItem>
                                    </Collapsible>
                                    <Collapsible>
                                        <SidebarMenuSubItem>
                                        <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                            <span className="flex items-center justify-center gap-2"><ChartNoAxesCombined className="h-4 w-4" /><p className="text-sm">Results</p></span>
                                            <ChevronDown className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </CollapsibleTrigger>
                                        <SidebarMenuSub>
                                        <CollapsibleContent>
                                            <span className="text-sm">Coming Soon</span> 
                                        </CollapsibleContent>
                                        </SidebarMenuSub>
                                        </SidebarMenuSubItem>
                                    </Collapsible>
                                    <Collapsible defaultOpen>
                                        <SidebarMenuSubItem>
                                        <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold px-2 py-2 rounded-md hover:bg-muted/60 transition">
                                            <span className="flex items-center justify-center gap-2"><Database className="h-4 w-4" /><p className="text-sm">Data</p></span>
                                            <ChevronDown className="h-4 w-4 ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </CollapsibleTrigger>
                                        <SidebarMenuSub>
                                        <CollapsibleContent className='max-h-screen overflow-scroll'>
                                            <ul id="station-items" ref={stationListRef}></ul>
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
        </SidebarMenu>
      </Sidebar>
      </SidebarProvider>
    );
  }
  