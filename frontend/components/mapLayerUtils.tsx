'use client'

import { loadGeoJSON, addRasterLayer, removeRasterLayer } from '@/components/Map'
import { waterQualityPointData } from '@/data/layer';



export const toggleLayer = (filename: string, visibleLayers: Record<string, boolean>, setVisibleLayers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>, color?: string, weight?: number) => {
    const updated = { ...visibleLayers, [filename]: !visibleLayers[filename] }
    setVisibleLayers(updated)

    const isVisible = updated[filename];

    if (filename === 'topography') {
    const url = `/api/tiffs/Top1_web.tif`;
    isVisible ? addRasterLayer('topography', url) : removeRasterLayer('topography');
    } else if (filename === 'bedrock') {
    const url = `/api/tiffs/Bedrock1_web.tif`;
    isVisible ? addRasterLayer('bedrock', url) : removeRasterLayer('bedrock');
    } else if (filename) {
    if(color!=undefined && weight!=undefined) {
        const specialPropsDisplay : {prop: string, label: string} = { prop: 'Best_Model', label: 'Best Model' } 
        loadGeoJSON(filename, {visible: isVisible, color, weight, specialPropsDisplay: { prop: 'Best_Model', label: 'Best Model' },});          
    } else {
        loadGeoJSON(filename, {visible:isVisible})
    }
    }
};

// Handle clicking on items (different behavior for Excel vs GeoJSON)
export const handleItemClick = (item: LayerItem, visibleLayers: Record<string, boolean>, setVisibleLayers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) => {
    if (item.type === 'excel') {
    // Open Excel file in new tab
    window.open(item.file, '_blank');
    } else if (item.type === 'geojson' || item.type === 'raster') {
    // Toggle layer visibility on map
    toggleLayer(item.file, visibleLayers, setVisibleLayers);
    }
};

// Helper function to check if a string is a valid water quality point key
export const isValidWaterQualityPoint = (point: string): point is WaterQualityPointKeys => {
    return point in waterQualityPointData;
};