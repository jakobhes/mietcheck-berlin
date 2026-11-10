import { Group, Stack } from '@mantine/core';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { CheckField, Question, TextField } from '../components/fields';
import type { FormVersion } from '../data/types';
import { ChapterIntro } from '../flow/chapters';
import type { Screen } from '../flow/types';
import { wantsPruefbogen, type Answers } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';

function usePersons() {
  const { a, set } = useAnswers();
  return {
    a,
    set,
    tenant: (k: keyof Answers['tenant']) => (v: string) => set((p) => ({ tenant: { ...p.tenant, [k]: v } })),
    landlord: (k: keyof Answers['landlord']) => (v: string) => set((p) => ({ landlord: { ...p.landlord, [k]: v } })),
    flat: (k: keyof Answers['flat']) => (v: string) => set((p) => ({ flat: { ...p.flat, [k]: v } })),
  };
}

function Tenant() {
  const { t } = useTranslation();
  const { a, set, tenant } = usePersons();
  return (
    <Question title={t('persons.tenantQ')}>
      <Stack gap="md">
        <TextField label={t('persons.name')} pdf autoComplete="name" autoFocus value={a.tenant.name} onChange={tenant('name')} />
        <TextField label={t('persons.street')} pdf autoComplete="street-address" value={a.tenant.street} onChange={tenant('street')} />
        <Group grow align="flex-start">
          <TextField label={t('persons.zip')} inputMode="numeric" autoComplete="postal-code" value={a.tenant.zip} onChange={tenant('zip')} />
          <TextField label={t('persons.city')} pdf autoComplete="address-level2" value={a.tenant.city} onChange={tenant('city')} />
        </Group>
        <CheckField label={t('persons.flatDiffers')} checked={a.flatDiffers} onChange={(v) => set({ flatDiffers: v })} />
      </Stack>
    </Question>
  );
}

function Contact({ form }: { form: FormVersion }) {
  const { t } = useTranslation();
  const { a, tenant } = usePersons();
  return (
    <Question title={t('persons.contactQ')}>
      <Stack gap="md">
        <TextField type="email" label={t('persons.email')} autoComplete="email" value={a.tenant.email} onChange={tenant('email')} />
        <TextField type="tel" label={t('persons.phone')} autoComplete="tel" value={a.tenant.phone} onChange={tenant('phone')} />
        <TextField label={t('persons.reachable')} value={a.tenant.reachable} onChange={tenant('reachable')} />
        {form.asksMemberNo && wantsPruefbogen(a) && <TextField label={t('persons.memberNo')} value={a.tenant.memberNo} onChange={tenant('memberNo')} />}
      </Stack>
    </Question>
  );
}

function FlatAddress() {
  const { t } = useTranslation();
  const { a, flat } = usePersons();
  return (
    <Question title={t('persons.flat')}>
      <Stack gap="md">
        <TextField label={t('persons.street')} pdf autoFocus value={a.flat.street} onChange={flat('street')} />
        <Group grow align="flex-start">
          <TextField label={t('persons.zip')} inputMode="numeric" value={a.flat.zip} onChange={flat('zip')} />
          <TextField label={t('persons.city')} pdf value={a.flat.city} onChange={flat('city')} />
        </Group>
        <TextField label={`${t('persons.flatDetail')} (${t('common.optional')})`} pdf value={a.flat.detail} onChange={flat('detail')} />
      </Stack>
    </Question>
  );
}

function Landlord() {
  const { t } = useTranslation();
  const { a, landlord } = usePersons();
  return (
    <Question title={t('persons.landlord')}>
      <Stack gap="md">
        <TextField label={t('persons.landlordName')} pdf autoFocus value={a.landlord.name} onChange={landlord('name')} />
        <TextField label={t('persons.street')} pdf value={a.landlord.street} onChange={landlord('street')} />
        <Group grow align="flex-start">
          <TextField label={t('persons.zip')} inputMode="numeric" value={a.landlord.zip} onChange={landlord('zip')} />
          <TextField label={t('persons.city')} pdf value={a.landlord.city} onChange={landlord('city')} />
        </Group>
      </Stack>
    </Question>
  );
}

/** Name und vollständige Anschrift – sonst fehlen sie im Prüfbogen bzw. im Briefkopf der Rüge */
const complete = (...fields: string[]) => fields.every((f) => !!f.trim());

export function personsScreens(form: FormVersion, a: Answers, t: TFunction): Screen[] {
  const { tenant, flat, landlord } = a;
  return [
    { id: 'persons.intro', chapter: 'persons', intro: true, element: <ChapterIntro chapter="persons" title={t('persons.title')} lead={t('persons.intro')} /> },
    { id: 'persons.tenant', chapter: 'persons', answered: complete(tenant.name, tenant.street, tenant.zip, tenant.city), required: true, element: <Tenant /> },
    { id: 'persons.contact', chapter: 'persons', answered: !!(a.tenant.email || a.tenant.phone), element: <Contact form={form} /> },
    ...(a.flatDiffers ? [{ id: 'persons.flat', chapter: 'persons', answered: complete(flat.street, flat.zip, flat.city), required: true, element: <FlatAddress /> } as Screen] : []),
    { id: 'persons.landlord', chapter: 'persons', answered: complete(landlord.name, landlord.street, landlord.zip, landlord.city), required: true, element: <Landlord /> },
  ];
}
