import { useTranslation } from 'react-i18next';
import { ExtLink, Notice, TextField, YesNoField } from '../components/fields';
import { MIETPREISBREMSE_START, selectFormVersion } from '../data/forms';
import { useAnswers } from '../state/AnswersContext';

export function ContractStep() {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(a.contractDate);
  const form = valid ? selectFormVersion(a.contractDate) : undefined;

  return (
    <section className="step">
      <h2>{t('contract.title')}</h2>
      <TextField
        type="date"
        label={t('contract.contractDate')}
        help={t('contract.contractDateHelp')}
        value={a.contractDate}
        onChange={(v) => set({ contractDate: v })}
      />
      {valid && form && (
        <Notice kind="ok">
          {t('contract.formFound', { year: form.id })} <ExtLink href={form.sourceUrl}>{t('contract.formOriginal')}</ExtLink>
        </Notice>
      )}
      {valid && a.contractDate < MIETPREISBREMSE_START && <Notice kind="warn">{t('contract.tooEarly')}</Notice>}

      <TextField type="date" label={t('contract.rentStart')} help={t('contract.rentStartHelp')} value={a.rentStart} onChange={(v) => set({ rentStart: v })} />
      <TextField
        label={t('contract.rent')}
        help={t('contract.rentHelp')}
        inputMode="decimal"
        suffix="€"
        value={a.rent}
        onChange={(v) => set({ rent: v })}
      />
      <YesNoField label={t('contract.indexRent')} help={t('contract.indexHelp')} value={a.indexRent} onChange={(v) => set({ indexRent: v })} />
      <YesNoField label={t('contract.staffelRent')} help={t('contract.staffelHelp')} value={a.staffelRent} onChange={(v) => set({ staffelRent: v })} />
      <YesNoField label={t('contract.municipal')} help={t('contract.municipalHelp')} value={a.municipal} onChange={(v) => set({ municipal: v })} />
    </section>
  );
}
