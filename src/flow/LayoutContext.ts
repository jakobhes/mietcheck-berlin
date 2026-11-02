import { createContext, useContext } from 'react';

/**
 * single  – Handy: genau eine Frage pro Bildschirm
 * stacked – Desktop: mehrere Fragen als Karten auf einer Seite
 */
export type Layout = 'single' | 'stacked';

export const LayoutContext = createContext<Layout>('single');

export function useLayout(): Layout {
  return useContext(LayoutContext);
}
