import { useTranslation } from 'react-i18next';
import { CheckField, Choice, Notice, TextField } from '../components/fields';
import { parseNumber, suggestEnergyMerkmal, type EnergyKind } from '../data/logic';
import { MEDIA } from '../data/media';
import type { FormVersion } from '../data/types';
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

export function EnergyStep({ form }: { form: FormVersion }) {
  const { t, i18n } = useTranslation();
  const { a, set } = useAnswers();
  const value = parseNumber(a.energyValue);
  const suggested = value !== undefined ? suggestEnergyMerkmal(form.id, value, a.energyKind, a.energyDecentralWater) : undefined;
  const merkmal = form.groups.flatMap((g) => g.merkmale).find((m) => m.id === suggested);

  const update = (patch: Partial<Answers>) => set((prev) => {
    const next = { ...prev, ...patch };
    return { ...patch, ...applySuggestion(form, next) };
  });

  const scale = MEDIA.energie_minus_1?.[0];

  return (
    <section className="step">
      <h2>{t('energy.title')}</h2>
      <p className="lead">{t('energy.intro')}</p>
      {scale && (
        <figure className="media-illustration wide">
          <img src={scale.src} alt={scale.alt} />
        </figure>
      )}
      <TextField label={t('energy.value')} help={t('energy.valueHelp')} inputMode="decimal" suffix="kWh/(m²a)" value={a.energyValue} onChange={(v) => update({ energyValue: v })} />
      <Choice<EnergyKind>
        label={t('energy.kind')}
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
    </section>
  );
}
