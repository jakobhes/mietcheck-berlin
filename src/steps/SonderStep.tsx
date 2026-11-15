import type { TFunction } from 'i18next';
import { Notice, YesNoField, Question } from '../components/fields';
import type { FormVersion, SonderId, SonderMerkmal } from '../data/types';
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

/** `prefilled`: Sondermerkmale, deren Antwort im Haus-Modus feststeht und die nicht gefragt werden */
export function sonderScreens(form: FormVersion, a: Answers, t: TFunction, prefilled: (id: SonderId) => boolean = () => false): Screen[] {
  if (!form.sonder) return [];
  const asked = form.sonder.filter((s) => !prefilled(s.id));
  const known = form.sonder.length - asked.length;
  return [
    {
      id: 'sonder.intro',
      chapter: 'sonder',
      intro: true,
      element: (
        <ChapterIntro chapter="sonder" title={t('sonder.title')} lead={t('sonder.intro')} questions={asked.length}>
          {known > 0 && <Notice kind="ok">{t('house.prefilled', { count: known })}</Notice>}
        </ChapterIntro>
      ),
    },
    ...asked.map((s): Screen => ({ id: `sonder.${s.id}`, chapter: 'sonder', answered: !!a.sonder[s.id], required: true, element: <SonderQuestion s={s} /> })),
  ];
}
