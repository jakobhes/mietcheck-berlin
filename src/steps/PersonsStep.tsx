import { useTranslation } from 'react-i18next';
import { CheckField, TextField } from '../components/fields';
import type { FormVersion } from '../data/types';
import type { Answers } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';

export function PersonsStep({ form }: { form: FormVersion }) {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  const tenant = (k: keyof Answers['tenant']) => (v: string) => set((p) => ({ tenant: { ...p.tenant, [k]: v } }));
  const landlord = (k: keyof Answers['landlord']) => (v: string) => set((p) => ({ landlord: { ...p.landlord, [k]: v } }));
  const flat = (k: keyof Answers['flat']) => (v: string) => set((p) => ({ flat: { ...p.flat, [k]: v } }));

  return (
    <section className="step">
      <h2>{t('persons.title')}</h2>
      <p className="lead">{t('persons.intro')}</p>

      <fieldset className="group">
        <legend>{t('persons.tenant')}</legend>
        <TextField label={t('persons.name')} pdf autoComplete="name" value={a.tenant.name} onChange={tenant('name')} />
        <TextField label={t('persons.street')} pdf autoComplete="street-address" value={a.tenant.street} onChange={tenant('street')} />
        <div className="row-2">
          <TextField label={t('persons.zip')} inputMode="numeric" autoComplete="postal-code" value={a.tenant.zip} onChange={tenant('zip')} />
          <TextField label={t('persons.city')} pdf autoComplete="address-level2" value={a.tenant.city} onChange={tenant('city')} />
        </div>
        <div className="row-2">
          <TextField type="email" label={t('persons.email')} autoComplete="email" value={a.tenant.email} onChange={tenant('email')} />
          <TextField type="tel" label={t('persons.phone')} autoComplete="tel" value={a.tenant.phone} onChange={tenant('phone')} />
        </div>
        <TextField label={t('persons.reachable')} value={a.tenant.reachable} onChange={tenant('reachable')} />
        {form.asksMemberNo && <TextField label={t('persons.memberNo')} value={a.tenant.memberNo} onChange={tenant('memberNo')} />}
      </fieldset>

      <CheckField label={t('persons.flatDiffers')} checked={a.flatDiffers} onChange={(v) => set({ flatDiffers: v })} />
      {a.flatDiffers && (
        <fieldset className="group">
          <legend>{t('persons.flat')}</legend>
          <TextField label={t('persons.street')} pdf value={a.flat.street} onChange={flat('street')} />
          <div className="row-2">
            <TextField label={t('persons.zip')} inputMode="numeric" value={a.flat.zip} onChange={flat('zip')} />
            <TextField label={t('persons.city')} pdf value={a.flat.city} onChange={flat('city')} />
          </div>
          <TextField label={t('persons.flatDetail')} pdf value={a.flat.detail} onChange={flat('detail')} />
        </fieldset>
      )}

      <fieldset className="group">
        <legend>{t('persons.landlord')}</legend>
        <TextField label={t('persons.landlordName')} pdf value={a.landlord.name} onChange={landlord('name')} />
        <TextField label={t('persons.street')} pdf value={a.landlord.street} onChange={landlord('street')} />
        <div className="row-2">
          <TextField label={t('persons.zip')} inputMode="numeric" value={a.landlord.zip} onChange={landlord('zip')} />
          <TextField label={t('persons.city')} pdf value={a.landlord.city} onChange={landlord('city')} />
        </div>
      </fieldset>
    </section>
  );
}
