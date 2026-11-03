import type { TFunction } from 'i18next';
import { TextField } from '../components/fields';
import { YesNoQ } from '../flow/generic';
import type { Screen } from '../flow/types';
import type { Answers } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';

function DisclosedText({ label }: { label: string }) {
  const { a, set } = useAnswers();
  return <TextField label={label} multiline pdf value={a.landlordDisclosedText} onChange={(v) => set({ landlordDisclosedText: v })} />;
}

/**
 * Nur die Auskunft des Vermieters nach § 556g Abs. 1a BGB wird gefragt: Die Rüge muss sich darauf beziehen.
 * Ob eine Ausnahme (Neubau, Vormiete, Modernisierung) vorliegt, wissen Mieter:innen meist nicht – das erfragt die Rüge beim Vermieter.
 */
export function exceptionsScreens(a: Answers, t: TFunction): Screen[] {
  return [
    {
      id: 'exceptions.disclosed',
      chapter: 'exceptions',
      answered: !!a.landlordDisclosed,
      element: (
        <YesNoQ k="landlordDisclosed" title={t('exceptions.disclosed')} help={t('exceptions.disclosedHelp')} stayIf={(v) => v === 'ja'}>
          {a.landlordDisclosed === 'ja' && <DisclosedText label={t('exceptions.disclosedText')} />}
        </YesNoQ>
      ),
    },
  ];
}
