import { useTranslation } from 'react-i18next';
import { TextField, YesNoField } from '../components/fields';
import { useAnswers } from '../state/AnswersContext';

export function RemarksStep() {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  return (
    <section className="step">
      <h2>{t('remarks.title')}</h2>
      <TextField label={t('remarks.remarks')} help={t('remarks.remarksHelp')} multiline pdf value={a.remarks} onChange={(v) => set({ remarks: v })} />
      <YesNoField label={t('remarks.wistg')} help={t('remarks.wistgHelp')} value={a.wistg} onChange={(v) => set({ wistg: v })} />
    </section>
  );
}
