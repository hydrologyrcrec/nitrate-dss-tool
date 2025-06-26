'use client';

import { useStationContext } from "@/app/contexts/StationContext";
import { excelLinks, waterQualityPointData } from "@/data/layer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronUp, Download, Droplets, Eye, FileSpreadsheet } from "lucide-react";
import { handleItemClick, isValidWaterQualityPoint, toggleLayer } from "./mapLayerUtils";

    // Function to handle map point clicks
export const handleMapPointClick = (pointName: string, setSelectedWaterQualityPoint: React.Dispatch<React.SetStateAction<WaterQualityPointKeys>>) => {
    if (isValidWaterQualityPoint(pointName)) {
        setSelectedWaterQualityPoint(pointName);
    }
    };

// Render Water Quality Point Selection
export const renderWaterQualitySection = () => {
    const { mapStateVars } = useStationContext();
    const selectedWaterQualityPoint = mapStateVars.selectedWaterQualityPoint;
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
              onClick={() => handleMapPointClick(point, mapStateVars.setSelectedWaterQualityPoint)}
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
export const renderCheckboxes = (group: LayerItem[]) => {
    const { mapStateVars } = useStationContext();
    const visibleLayers = mapStateVars.visibleLayers;
    const setVisibleLayers = mapStateVars.setVisibleLayers;
    return (
    <div className="space-y-1 pl-4 py-1">
      {group.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-sm">
          {item.type === 'excel' ? (
            // Excel files - clickable link with icon
            <button
              onClick={() => handleItemClick( item, visibleLayers, setVisibleLayers)}
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
                onChange={() => toggleLayer(item.file, visibleLayers, setVisibleLayers)}
              />
              {item.label}
            </>
          )}
        </div>
      ))}
    </div>
    )
};

// Render nested structure for Model Results and Scenarios - COMPLETE FUNCTION
export const renderNestedStructure = (group: LayerItem[]) => {
    const { mapStateVars } = useStationContext();
    const { visibleLayers, setVisibleLayers } = mapStateVars;
  
    return (
      <div className="space-y-1 pl-4 py-1">
        {group.map((item) => {
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
                          onChange={() => toggleLayer(item.file, visibleLayers, setVisibleLayers )}
                        />
                      )}
                      {item.component ? item.component : <p className='text-left'>{item.label}</p>}
                    </span>
                    <ChevronUp className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-8">
                    {item.children.map((child) => {
                      if (child.type === 'parent' && child.children) {
                        return (
                          <Collapsible key={child.label} className="group mt-1">
                            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm pb-2 font-medium hover:bg-muted/40 rounded transition">
                              <span className="flex items-center gap-2">
                                {child.component}
                              </span>
                              <ChevronUp className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-4 space-y-1">
                              {child.children.map((grandchild) => (
                                <div key={grandchild.label} className="flex items-center gap-2 text-sm py-1">
                                  {grandchild.type === 'excel' ? (
                                    <button
                                      onClick={() => handleItemClick(grandchild, visibleLayers, setVisibleLayers)}
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
                                        onChange={() => toggleLayer(grandchild.file, visibleLayers, setVisibleLayers)}
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
                        return (
                          <div key={child.label} className="flex items-center gap-2 text-sm py-1">
                            {child.type === 'excel' ? (
                              <button
                                onClick={() => handleItemClick(child, visibleLayers, setVisibleLayers)}
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
                                  onChange={() => toggleLayer(child.file, visibleLayers, setVisibleLayers)}
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
          }
  
          // Default fallback
          return (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              {item.type === 'excel' ? (
                <button
                  onClick={() => handleItemClick(item, visibleLayers, setVisibleLayers)}
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
                    onChange={() => toggleLayer(item.file, visibleLayers, setVisibleLayers)}
                  />
                  {item.label}
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

export const renderTiffCheckboxes = (group: FsmTF[]) => {
    const { mapStateVars } = useStationContext();
    const visibleTiff = mapStateVars.visibleTiff;
    const setVisibleTiff = mapStateVars.setVisibleTiff;
    return (
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
    )
  };    

export const renderSwGwCheckboxes = (group: { label: string; file: string, color: string, weight: number }[]) => {
    const { mapStateVars } = useStationContext();
    const visibleLayers = mapStateVars.visibleLayers;
    const setVisibleLayers = mapStateVars.setVisibleLayers;    
    return (
    <div className="space-y-1 pl-4 py-1">
      {group.map(({ label, file, color, weight }) => (
        <div key={label} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!visibleLayers[file]}
            disabled={!file}
            onChange={() => toggleLayer(file, visibleLayers, setVisibleLayers, color, weight)}
          />
          {label}
        </div>
      ))}
    </div>
    )
}