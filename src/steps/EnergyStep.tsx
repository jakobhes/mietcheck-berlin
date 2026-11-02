import { Image } from '@mantine/core';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { CheckField, Notice, OptionList, Question, TextField } from '../components/fields';
import { parseNumber, suggestEnergyMerkmal, type EnergyKind } from '../data/logic';
import { MEDIA } from '../data/media';
import type { FormVersion } from '../data/types';
import { ChapterIntro } from '../flow/chapters';
import type { Screen } from '../flow/types';
import { featureText } from '../i18n';
import type { Answers } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';

const ENERGY_IDS = ['energie_minus_1', 'energie_minus_2', 'energie_minus_3', 'energie_plus_1', 'energie_plus_2', 'energie_plus_3'];

/** Setzt die Energie-Merkmale passend zum eingegebenen Kennwert. */
function applySuggestion(form: FormVersion, a: Answers): Partial<Answers> {
  const value = parseNumber(a.energyValue);
  if (value === undefined) return {};
  const suggested = suggestEnergyMerkmal(form.id, value, a.energyKind, a.energyDecentralWater);
  const features = { ...a.features };
  ENERGY_IDS.forEach((id) => (features[id] = id === suggested ? 'yes' : 'no'));
  return { features };
}

function useEnergy(form: FormVersion) {
  const { a, set } = useAnswers();
  const update = (patch: Partial<Answers>) =>
    set((prev) => {
      const next = { ...prev, ...patch };
      return { ...patch, ...applySuggestion(form, next) };
    });
  return { a, update };
}

function EnergyValue({ form }: { form: FormVersion }) {
  const { t } = useTranslation();
  const { a, update } = useEnergy(form);
  return (
    <Question title={t('energy.value')} help={t('energy.valueHelp')}>
      <TextField inputMode="decimal" suffix="kWh/(m²a)" autoFocus value={a.energyValue} onChange={(v) => update({ energyValue: v })} />
    </Question>
  );
}

function EnergyKindScreen({ form }: { form: FormVersion }) {
  const { t, i18n } = useTranslation();
  const { a, update } = useEnergy(form);
  const value = parseNumber(a.energyValue);
  const suggested = value !== undefined ? suggestEnergyMerkmal(form.id, value, a.energyKind, a.energyDecentralWater) : undefined;
  const merkmal = form.groups.flatMap((g) => g.merkmale).find((m) => m.id === suggested);
  return (
    <Question title={t('energy.kind')}>
      <OptionList<EnergyKind>
        value={a.energyKind}
        onChange={(v) => update({ energyKind: v })}
        options={[
          { value: 'verbrauch', label: t('energy.verbrauch') },
          { value: 'bedarf', label: t('energy.bedarf') },
        ]}
      />
      <CheckField label={t('energy.decentral')} checked={a.energyDecentralWater} onChange={(v) => update({ energyDecentralWater: v })} />
      {value !== undefined &&
        (merkmal ? (
          <Notice kind="ok">{t('energy.suggestion', { label: featureText(i18n.language, merkmal.id, merkmal.de).q })}</Notice>
        ) : (
          <Notice>{t('energy.noSuggestion')}</Notice>
        ))}
    </Question>
  );
}

export function energyScreens(form: FormVersion, a: Answers, t: TFunction): Screen[] {
  const scale = MEDIA.energie_minus_1?.[0];
  const hasValue = parseNumber(a.energyValue) !== undefined;
  return [
    {
      id: 'energy.intro',
      chapter: 'energy',
      intro: true,
      element: (
        <ChapterIntro chapter="energy" title={t('energy.title')} lead={t('energy.intro')}>
          {scale && <Image src={scale.src} alt={scale.alt} radius="md" maw={480} />}
        </ChapterIntro>
      ),
    },
    { id: 'energy.value', chapter: 'energy', answered: hasValue, element: <EnergyValue form={form} /> },
    ...(hasValue ? [{ id: 'energy.kind', chapter: 'energy', answered: true, element: <EnergyKindScreen form={form} /> } as Screen] : []),
  ];
}
