import { createContext, useContext } from 'react';

export const PresentationContext = createContext();

export function usePresentationContext() {
  return useContext(PresentationContext);
}
