import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { initialHouse, storeHouse } from '../house/activation';
import { applyHouse, type HousePreset } from '../house/presets';
import { clearAnswers, initialAnswers, loadAnswers, saveAnswers, type Answers } from './answers';

interface Ctx {
  /** Antworten inkl. der festen Werte des Hauses (falls Haus-Modus aktiv) */
  a: Answers;
  set: (patch: Partial<Answers> | ((prev: Answers) => Partial<Answers>)) => void;
  reset: () => void;
  house?: HousePreset;
  setHouse: (house: HousePreset | undefined) => void;
}

const AnswersContext = createContext<Ctx | null>(null);

export function AnswersProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<Answers>(loadAnswers);
  const [house, setHouseState] = useState(initialHouse);

  useEffect(() => saveAnswers(raw), [raw]);

  const set = useCallback<Ctx['set']>((patch) => {
    setRaw((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }, []);

  const reset = useCallback(() => {
    clearAnswers();
    setRaw(initialAnswers);
  }, []);

  const setHouse = useCallback((h: HousePreset | undefined) => {
    storeHouse(h);
    setHouseState(h);
  }, []);

  const a = useMemo(() => applyHouse(raw, house), [raw, house]);

  return <AnswersContext.Provider value={{ a, set, reset, house, setHouse }}>{children}</AnswersContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAnswers(): Ctx {
  const ctx = useContext(AnswersContext);
  if (!ctx) throw new Error('useAnswers outside AnswersProvider');
  return ctx;
}
