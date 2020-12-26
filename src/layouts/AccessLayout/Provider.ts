import { createContext } from 'react';

export interface AccessLayoutContextProps {
  isFull: boolean;
  toggleFull: () => void;
}

export const AccessLayoutContext = createContext<AccessLayoutContextProps>({
  toggleFull: () => {},
  isFull: false,
});
