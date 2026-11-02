import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { clearAnswers, initialAnswers, loadAnswers, saveAnswers, type Answers } from './answers';

interface Ctx {
  a: Answers;
  set: (patch: Partial<Answers> | ((prev: Answers) => Partial<Answers>)) => void;
  reset: () => void;
}

const AnswersContext = createContext<Ctx | null>(null);

export function AnswersProvider({ children }: { children: ReactNode }) {
  const [a, setA] = useState<Answers>(loadAnswers);

  useEffect(() => saveAnswers(a), [a]);

  const set = useCallback<Ctx['set']>((patch) => {
    setA((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }, []);

  const reset = useCallback(() => {
    clearAnswers();
    setA(initialAnswers);
  }, []);

  return <AnswersContext.Provider value={{ a, set, reset }}>{children}</AnswersContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAnswers(): Ctx {
  const ctx = useContext(AnswersContext);
  if (!ctx) throw new Error('useAnswers outside AnswersProvider');
  return ctx;
}
