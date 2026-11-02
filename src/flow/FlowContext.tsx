import { createContext, useContext } from 'react';

interface FlowCtx {
  /** nach einer Auswahl automatisch zum nächsten Bildschirm wechseln */
  advance: () => void;
}

export const FlowContext = createContext<FlowCtx>({ advance: () => {} });

export function useFlow(): FlowCtx {
  return useContext(FlowContext);
}
