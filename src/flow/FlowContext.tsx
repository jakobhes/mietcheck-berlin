import { createContext, useContext } from 'react';

interface FlowCtx {
  /** Desktop: nach einer Auswahl zur nächsten Fragekarte scrollen; auf dem Handy passiert nichts, man tippt selbst auf „Weiter“ */
  advance: () => void;
}

export const FlowContext = createContext<FlowCtx>({ advance: () => {} });

export function useFlow(): FlowCtx {
  return useContext(FlowContext);
}
