import { useTranslation } from 'react-i18next';
import { YesNoField } from '../components/fields';
import type { FormVersion } from '../data/types';
import { featureText } from '../i18n';
import { useAnswers } from '../state/AnswersContext';

export function SonderStep({ form }: { form: FormVersion }) {
  const { t, i18n } = useTranslation();
  const { a, set } = useAnswers();
  return (
    <section className="step">
      <h2>{t('sonder.title')}</h2>
      <p className="lead">{t('sonder.intro')}</p>
      {form.sonder?.map((s) => {
        const text = featureText(i18n.language, s.id, s.de);
        return (
          <div key={s.id} className="sonder">
            <YesNoField
              label={text.q}
              help={
                <>
                  <p>{text.help}</p>
                  <p lang="de" dir="ltr">
                    <em>{s.de}</em>
                  </p>
                  <p>
                    {t('sonder.surcharges')}: {s.zuschlaege}
                  </p>
                </>
              }
              value={a.sonder[s.id] ?? ''}
              onChange={(v) => set((p) => ({ sonder: { ...p.sonder, [s.id]: v } }))}
            />
          </div>
        );
      })}
    </section>
  );
}
