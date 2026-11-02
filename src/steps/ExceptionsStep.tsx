import type { TFunction } from 'i18next';
import { Notice, TextField } from '../components/fields';
import { ChapterIntro } from '../flow/chapters';
import { YesNoQ } from '../flow/generic';
import type { Screen } from '../flow/types';
import type { Answers } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';

function DisclosedText({ label }: { label: string }) {
  const { a, set } = useAnswers();
  return <TextField label={label} multiline pdf value={a.landlordDisclosedText} onChange={(v) => set({ landlordDisclosedText: v })} />;
}

export function exceptionsScreens(a: Answers, t: TFunction): Screen[] {
  const q = (k: 'exNewBuild' | 'exModernized' | 'exPreviousRent' | 'exSocialHousing' | 'landlordDisclosed', key: string, extra?: { warn?: string; textarea?: boolean }): Screen => ({
    id: `exceptions.${key}`,
    chapter: 'exceptions',
    answered: !!a[k],
    element: (
      <YesNoQ k={k} title={t(`exceptions.${key}`)} help={t(`exceptions.${key}Help`)} stayIf={extra ? (v) => v === 'ja' : undefined}>
        {extra?.warn && a[k] === 'ja' && <Notice kind="warn">{t(extra.warn)}</Notice>}
        {extra?.textarea && a[k] === 'ja' && <DisclosedText label={t('exceptions.disclosedText')} />}
      </YesNoQ>
    ),
  });
  return [
    { id: 'exceptions.intro', chapter: 'exceptions', intro: true, element: <ChapterIntro chapter="exceptions" title={t('exceptions.title')} lead={t('exceptions.intro')} questions={5} /> },
    q('exNewBuild', 'newBuild', { warn: 'exceptions.warnNewBuild' }),
    q('exModernized', 'modernized'),
    q('exPreviousRent', 'previousRent'),
    q('exSocialHousing', 'socialHousing', { warn: 'exceptions.warnSocial' }),
    q('landlordDisclosed', 'disclosed', { textarea: true }),
  ];
}
