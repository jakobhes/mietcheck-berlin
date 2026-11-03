import type { TFunction } from 'i18next';
import { YesNoField, Question } from '../components/fields';
import type { FormVersion, SonderMerkmal } from '../data/types';
import { ChapterIntro } from '../flow/chapters';
import type { Screen } from '../flow/types';
import { featureText } from '../i18n';
import type { Answers } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';
import { useTranslation } from 'react-i18next';

function SonderQuestion({ s }: { s: SonderMerkmal }) {
  const { t, i18n } = useTranslation();
  const { a, set } = useAnswers();
  const text = featureText(i18n.language, s.id, s.de);
  return (
    <Question
      title={text.q}
      lead={text.help}
      help={
        <>
          <p lang="de" dir="ltr">
            <em>{s.de}</em>
          </p>
          <p>
            {t('sonder.surcharges')}: {s.zuschlaege}
          </p>
        </>
      }
    >
      <YesNoField value={a.sonder[s.id] ?? ''} onChange={(v) => set((p) => ({ sonder: { ...p.sonder, [s.id]: v } }))} />
    </Question>
  );
}

export function sonderScreens(form: FormVersion, a: Answers, t: TFunction): Screen[] {
  if (!form.sonder) return [];
  return [
    { id: 'sonder.intro', chapter: 'sonder', intro: true, element: <ChapterIntro chapter="sonder" title={t('sonder.title')} lead={t('sonder.intro')} questions={form.sonder.length} /> },
    ...form.sonder.map((s): Screen => ({ id: `sonder.${s.id}`, chapter: 'sonder', answered: !!a.sonder[s.id], required: true, element: <SonderQuestion s={s} /> })),
  ];
}
