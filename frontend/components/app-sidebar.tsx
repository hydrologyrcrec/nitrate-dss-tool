'use client'

import { useContext, useState } from 'react'
import { loadGeoJSON, addRasterLayer, removeRasterLayer } from '@/components/Map'
import { StationListRefContext } from '@/app/contexts/StationListContext'
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible'
import {
  ChevronDown,
  View,
  Wrench,
  TrendingUpDown,
  Database,
  Map,
  ChartNoAxesCombined,
  Layers,
} from 'lucide-react'

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
  const stationListRef = useContext(StationListRefContext)
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({})

  const toggleLayer = (filename: string) => {
    const updated = { ...visibleLayers, [filename]: !visibleLayers[filename] }
    setVisibleLayers(updated)

    const isVisible = updated[filename]

    if (filename === 'topography') {
      const url = 'http://localhost:5008/tiffs/Top1_web.tif'
      isVisible ? addRasterLayer('topography', url) : removeRasterLayer('topography')
    } else if (filename === 'bedrock') {
      const url = 'http://localhost:5008/tiffs/Bedrock1_web.tif'
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
    <SidebarProvider className="z-30 fixed top-[60px] right-0 max-w-1/4 overflow-clip">
      <Sidebar side="right" className="w-1/4 fixed top-[60px] right-0 h-[calc(100vh-60px)] overflow-y-auto bg-white shadow-md rounded-none pr-3">
        <SidebarMenu className="pt-4">
          {/* View */}
          <Collapsible defaultOpen>
            <SidebarMenuItem>
              <CollapsibleTrigger className="flex justify-between items-center w-full text-lg font-semibold px-2 py-2">
                <span className="flex items-center gap-2"><View className="h-4 w-4" />View</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 py-2 text-sm flex gap-2 items-center">
                <Map className="h-4 w-4" /> Flood Susceptibility Mapping
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          {/* Tools */}
          <Collapsible defaultOpen>
            <SidebarMenuItem>
              <CollapsibleTrigger className="flex justify-between items-center w-full text-lg font-semibold px-2 py-2">
                <span className="flex items-center gap-2"><Wrench className="h-4 w-4" />Tools (Surface & Ground Water)</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <div className="px-4 py-2 text-sm flex items-center gap-2 text-muted-foreground">
                    <TrendingUpDown className="h-4 w-4" /> AI Prediction (Coming Soon)
                  </div>
                  <div className="px-4 py-2 text-sm flex items-center gap-2 text-muted-foreground">
                    <ChartNoAxesCombined className="h-4 w-4" /> Results (Coming Soon)
                  </div>
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex justify-between items-center w-full text-sm px-4 py-2 font-semibold">
                      <span className="flex items-center gap-2"><Database className="h-4 w-4" />Data</span>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="max-h-screen overflow-scroll pl-6 py-2">
                      <ul id="station-items" ref={stationListRef}></ul>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
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
