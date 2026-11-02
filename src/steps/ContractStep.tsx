import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ExtLink, Notice, Question, TextField } from '../components/fields';
import { MIETPREISBREMSE_START, selectFormVersion } from '../data/forms';
import { TextQ, YesNoQ } from '../flow/generic';
import type { Screen } from '../flow/types';
import type { Answers } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';
import { PrepIntro } from './StartStep';

function ContractDate() {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(a.contractDate);
  const form = valid ? selectFormVersion(a.contractDate) : undefined;
  return (
    <Question title={t('contract.contractDate')} help={t('contract.contractDateHelp')}>
      <TextField type="date" value={a.contractDate} autoFocus onChange={(v) => set({ contractDate: v })} />
      {valid && form && (
        <Notice kind="ok">
          {t('contract.formFound', { year: form.id })} <ExtLink href={form.sourceUrl}>{t('contract.formOriginal')}</ExtLink>
        </Notice>
      )}
      {valid && a.contractDate < MIETPREISBREMSE_START && <Notice kind="warn">{t('contract.tooEarly')}</Notice>}
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
      element: <TextQ k="rentStart" type="date" title={t('contract.rentStart')} help={t('contract.rentStartHelp')} />,
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
