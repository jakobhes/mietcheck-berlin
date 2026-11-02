import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ExtLink, MonthField, Notice, Question } from '../components/fields';
import { monthStart } from '../data/dates';
import { MIETPREISBREMSE_START, selectFormVersion } from '../data/forms';
import { TextQ, YesNoQ } from '../flow/generic';
import type { Screen } from '../flow/types';
import type { Answers } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';
import { PrepIntro } from './StartStep';

/** Verträge gibt es erst seit der Mietpreisbremse (6/2015); der Mietbeginn kann im nächsten Jahr liegen */
const THIS_YEAR = new Date().getFullYear();

function ContractDate() {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  const date = monthStart(a.contractDate);
  const form = selectFormVersion(a.contractDate);
  return (
    <Question title={t('contract.contractDate')} help={t('contract.contractDateHelp')}>
      <MonthField value={a.contractDate} fromYear={2015} toYear={THIS_YEAR} onChange={(v) => set({ contractDate: v })} />
      {form && (
        <Notice kind="ok">
          {t('contract.formFound', { year: form.id })} <ExtLink href={form.sourceUrl}>{t('contract.formOriginal')}</ExtLink>
        </Notice>
      )}
      {date && date < MIETPREISBREMSE_START && <Notice kind="warn">{t('contract.tooEarly')}</Notice>}
    </Question>
  );
}

function RentStart() {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  return (
    <Question title={t('contract.rentStart')} help={t('contract.rentStartHelp')}>
      <MonthField value={a.rentStart} fromYear={2015} toYear={THIS_YEAR + 1} onChange={(v) => set({ rentStart: v })} />
    </Question>
  );
}

export function contractScreens(a: Answers, t: TFunction): Screen[] {
  const form = selectFormVersion(a.contractDate);
  const yesNo = (k: 'indexRent' | 'staffelRent' | 'municipal', help: string): Screen => ({
    id: `contract.${k}`,
    chapter: 'contract',
    answered: !!a[k],
    element: <YesNoQ k={k} title={t(`contract.${k}`)} help={t(help)} />,
  });
  return [
    { id: 'contract.intro', chapter: 'contract', intro: true, element: <PrepIntro /> },
    { id: 'contract.date', chapter: 'contract', answered: !!form, blocked: !form, element: <ContractDate /> },
    {
      id: 'contract.rentStart',
      chapter: 'contract',
      answered: !!a.rentStart,
      element: <RentStart />,
    },
    {
      id: 'contract.rent',
      chapter: 'contract',
      answered: !!a.rent,
      element: <TextQ k="rent" inputMode="decimal" suffix="€" title={t('contract.rent')} help={t('contract.rentHelp')} />,
    },
    yesNo('indexRent', 'contract.indexHelp'),
    yesNo('staffelRent', 'contract.staffelHelp'),
    yesNo('municipal', 'contract.municipalHelp'),
  ];
}
