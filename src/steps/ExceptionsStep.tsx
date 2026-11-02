import { useTranslation } from 'react-i18next';
import { Notice, TextField, YesNoField } from '../components/fields';
import { useAnswers } from '../state/AnswersContext';

export function ExceptionsStep() {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  return (
    <section className="step">
      <h2>{t('exceptions.title')}</h2>
      <p className="lead">{t('exceptions.intro')}</p>
      <YesNoField label={t('exceptions.newBuild')} help={t('exceptions.newBuildHelp')} value={a.exNewBuild} onChange={(v) => set({ exNewBuild: v })} />
      {a.exNewBuild === 'ja' && <Notice kind="warn">{t('exceptions.warnNewBuild')}</Notice>}
      <YesNoField label={t('exceptions.modernized')} help={t('exceptions.modernizedHelp')} value={a.exModernized} onChange={(v) => set({ exModernized: v })} />
      <YesNoField label={t('exceptions.previousRent')} help={t('exceptions.previousRentHelp')} value={a.exPreviousRent} onChange={(v) => set({ exPreviousRent: v })} />
      <YesNoField label={t('exceptions.socialHousing')} help={t('exceptions.socialHousingHelp')} value={a.exSocialHousing} onChange={(v) => set({ exSocialHousing: v })} />
      {a.exSocialHousing === 'ja' && <Notice kind="warn">{t('exceptions.warnSocial')}</Notice>}
      <YesNoField label={t('exceptions.disclosed')} help={t('exceptions.disclosedHelp')} value={a.landlordDisclosed} onChange={(v) => set({ landlordDisclosed: v })} />
      {a.landlordDisclosed === 'ja' && (
        <TextField label={t('exceptions.disclosedText')} multiline pdf value={a.landlordDisclosedText} onChange={(v) => set({ landlordDisclosedText: v })} />
      )}
    </section>
  );
}
