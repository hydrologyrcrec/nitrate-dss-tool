// contexts/StationContext.tsx
'use client';

import React, { createContext, useRef, useReducer, useContext } from 'react';

export interface StationLink {
    label: string;
    type: string;
    url: string;
  }
  
export interface Station {
    id: string;
    name: string;
    lat: number;
    lng: number;
    links: StationLink[];
  }

export interface State {
    stations: Station[];
    surfaceWaterStations: Station[];
    drawState: boolean;
    dataDisplayState: boolean;
    resultsDisplayState: boolean;
  }

export interface StationContextValue {
    state: State;
    dispatch: React.Dispatch<Action>;
    stationListRef: React.RefObject<HTMLUListElement | null>;
  }  

type Action =
  | { type: 'SET_STATIONS'; payload: Station[] }
  | { type: 'CLEAR_STATIONS' }
  | { type: 'TOGGLE_DRAW_STATE'; payload: boolean }
  | { type: 'SET_SURFACE_WATER_STATIONS'; payload: Station[] }
  | { type: 'TOGGLE_DATA_STATE'; payload: boolean }
  | { type: 'TOGGLE_RESULTS_STATE'; payload: boolean };

const initialState: State = {
  stations: [],
  surfaceWaterStations: [],
  drawState: false,
  dataDisplayState: false,
  resultsDisplayState: false
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_STATIONS':
      return { ...state, stations: action.payload };
    case 'CLEAR_STATIONS':
      return { ...state, stations: [] };
    case 'TOGGLE_DRAW_STATE':
      return { ...state, drawState: action.payload };
    case 'TOGGLE_DATA_STATE':
      return { ...state, dataDisplayState: action.payload };
    case 'TOGGLE_RESULTS_STATE':
      return { ...state, resultsDisplayState: action.payload };
    case 'SET_SURFACE_WATER_STATIONS':
      return { ...state, surfaceWaterStations: action.payload };
    default:
      return state;
  }
};

export const StationContext = createContext<StationContextValue | null>(null);

export const StationProvider = ({ children }: { children: React.ReactNode }) => {
  const stationListRef = useRef<HTMLUListElement | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StationContext.Provider value={{ state, dispatch, stationListRef }}>
      {children}
    </StationContext.Provider>
  );
};

export const useStationContext = () => {
  const context = useContext(StationContext);
  if (!context) {
    throw new Error('useStationContext must be used within a StationProvider');
  }
  return context;
};