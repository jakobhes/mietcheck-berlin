import type { ReactNode } from 'react';
import { Question, TextField, YesNoField } from '../components/fields';
import type { Answers, YesNo } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';

type KeysOf<V> = { [K in keyof Answers]: Answers[K] extends V ? K : never }[keyof Answers];

/** Ja/Nein-Frage als eigener Bildschirm */
export function YesNoQ({ k, title, help, stayIf, children }: { k: KeysOf<YesNo>; title: ReactNode; help?: ReactNode; stayIf?: (v: 'ja' | 'nein') => boolean; children?: ReactNode }) {
  const { a, set } = useAnswers();
  return (
    <Question title={title} help={help}>
      <YesNoField value={a[k]} stayIf={stayIf} onChange={(v) => set({ [k]: v } as Partial<Answers>)} />
      {children}
    </Question>
  );
}

/** Eingabefeld als eigener Bildschirm */
export function TextQ({
  k,
  title,
  help,
  lead,
  children,
  ...field
}: {
  k: KeysOf<string>;
  title: ReactNode;
  help?: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  type?: 'text' | 'date';
  inputMode?: 'decimal' | 'numeric';
  suffix?: string;
  multiline?: boolean;
  pdf?: boolean;
}) {
  const { a, set } = useAnswers();
  return (
    <Question title={title} help={help} lead={lead}>
      <TextField {...field} value={a[k] as string} autoFocus onChange={(v) => set({ [k]: v } as Partial<Answers>)} />
      {children}
    </Question>
  );
}
