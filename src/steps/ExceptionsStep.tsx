import { useTranslation } from 'react-i18next';
import { ChoiceField, Question, TextField } from '../components/fields';
import type { Screen } from '../flow/types';
import type { Answers } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';

function DisclosedText({ label }: { label: string }) {
  const { a, set } = useAnswers();
  return <TextField label={label} multiline pdf value={a.landlordDisclosedText} onChange={(v) => set({ landlordDisclosedText: v })} />;
}

function Disclosed() {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  return (
    <Question title={t('exceptions.disclosed')} help={t('exceptions.disclosedHelp')}>
      <ChoiceField
        value={a.landlordDisclosed}
        stayIf={(v) => v === 'ja'}
        onChange={(v) => set({ landlordDisclosed: v })}
        options={[
          { value: 'ja', label: t('common.yes') },
          { value: 'nein', label: t('common.no') },
          { value: 'unsicher', label: t('common.unsure') },
        ]}
      />
      {a.landlordDisclosed === 'ja' && <DisclosedText label={t('exceptions.disclosedText')} />}
    </Question>
  );
}

/**
 * Nur die Auskunft des Vermieters nach § 556g Abs. 1a BGB wird gefragt: Die Rüge muss sich darauf beziehen.
 * Ob eine Ausnahme (Neubau, Vormiete, Modernisierung) vorliegt, wissen Mieter:innen meist nicht – das erfragt die Rüge beim Vermieter.
 */
export function exceptionsScreens(a: Answers): Screen[] {
  return [
    {
      id: 'exceptions.disclosed',
      chapter: 'exceptions',
      // bei „ja“ gehört der Wortlaut der Auskunft in die Rüge
      answered: !!a.landlordDisclosed && (a.landlordDisclosed !== 'ja' || !!a.landlordDisclosedText.trim()),
      required: true,
      element: <Disclosed />,
    },
  ];
}
