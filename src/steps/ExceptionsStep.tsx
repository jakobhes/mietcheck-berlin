import { Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { CheckField, ChoiceField, Question } from '../components/fields';
import type { Screen } from '../flow/types';
import { LANDLORD_EXCEPTIONS, type Answers } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';

function ExceptionChoices({ label }: { label: string }) {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  return (
    <Stack gap="xs">
      <Text fw={600}>{label}</Text>
      {LANDLORD_EXCEPTIONS.map((k) => (
        <CheckField
          key={k}
          label={t(`exceptions.${k}`)}
          checked={a.landlordExceptions[k]}
          onChange={(v) => set((p) => ({ landlordExceptions: { ...p.landlordExceptions, [k]: v } }))}
        />
      ))}
    </Stack>
  );
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
      {a.landlordDisclosed === 'ja' && <ExceptionChoices label={t('exceptions.which')} />}
    </Question>
  );
}

/**
 * Nur die Auskunft des Vermieters nach § 556g Abs. 1a BGB wird gefragt: Die Rüge muss sich darauf beziehen.
 * Ob eine Ausnahme (Neubau, Vormiete, Modernisierung) tatsächlich vorliegt, wissen Mieter:innen meist nicht – das erfragt die Rüge beim Vermieter.
 */
export function exceptionsScreens(a: Answers): Screen[] {
  return [
    {
      id: 'exceptions.disclosed',
      chapter: 'exceptions',
      // bei „ja“ gehört die behauptete Ausnahme in die Rüge
      answered: !!a.landlordDisclosed && (a.landlordDisclosed !== 'ja' || LANDLORD_EXCEPTIONS.some((k) => a.landlordExceptions[k])),
      required: true,
      element: <Disclosed />,
    },
  ];
}
