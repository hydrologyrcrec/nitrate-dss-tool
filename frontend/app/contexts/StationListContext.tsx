import { createContext } from 'react';

export const StationListRefContext = createContext<React.RefObject<HTMLUListElement | null> | null>(null);