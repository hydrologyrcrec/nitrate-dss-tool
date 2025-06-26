'use client';

import { excelLinks } from "@/data/layer";
import { BadgeInfo, BrickWall, LoaderPinwheel, Map, Package, PenLine, RefreshCw, Sparkle, TrendingUpDown } from "lucide-react";

// Updated data structure with new hierarchy
export const allGeoJSONLayers = {
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
            { label: 'Irrigation', file: 'irrigation.geojson', type: 'geojson' as const },
            {
            label: 'Fertilization',
            component: (
                <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />Fertilization
                </span>
            ),
            type: 'parent' as const,
            file: '',
            children: [
                { label: 'Pasture', file: 'fertpast.geojson', type: 'geojson' as const },
                { label: 'Nodes', file: 'nodes.geojson', type: 'geojson' as const},
            ]
            },
            {
            label: 'Results (N)',
            component: (
                <span className="flex items-center gap-2">
                <TrendingUpDown className="h-4 w-4" />Results (N)
                </span>
            ),
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
        { label: 'Fertilizer Management', file: 'N-OBS.json', type: 'geojson' as const },
        { label: 'Irrigation Management', file: '', type: 'geojson' as const },
        { label: 'Pasture Management', file: '', type: 'geojson' as const },
    ],
    };

export const bmpHeaders = [
    { title: 'Study Area', data: allGeoJSONLayers.studyArea, icon: <PenLine className="h-4 w-4"/> },
    { title: 'Wells', data: allGeoJSONLayers.wells, icon: <BrickWall className="h-4 w-4"/>},
    { title: 'Maps', data: allGeoJSONLayers.maps, icon: <Map className="h-4 w-4"/> },
    { title: 'Model Setup', data: allGeoJSONLayers.modelSetup, icon: <Package className="h-4 w-4"/>},
    { title: 'Model Results', data: allGeoJSONLayers.modelResults, icon: <Sparkle className="h-4 w-4"/>},
    { title: 'Scenarios', data: allGeoJSONLayers.scenarios, icon: <LoaderPinwheel className="h-4 w-4"/>},
];
    