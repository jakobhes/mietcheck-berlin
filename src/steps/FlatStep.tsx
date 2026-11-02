import { useTranslation } from 'react-i18next';
import { CheckField, Choice, ExtLink, Field, TextField, YesNoField } from '../components/fields';
import { parseYear } from '../data/logic';
import type { FormVersion } from '../data/types';
import type { Answers } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';

const MIETSPIEGEL_URL = 'https://mietspiegel.berlin.de/';
const STRASSENVERZEICHNIS_2026 = 'https://www.berliner-mieterverein.de/downloads/mietspiegel-2026/mietspiegel-2026-strassenverzeichnis.pdf';

export function FlatStep({ form }: { form: FormVersion }) {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  const year = parseYear(a.buildYear);
  const eq = (k: keyof Answers['equipment']) => (
    <CheckField key={k} label={t(`flat.${k}`)} checked={a.equipment[k]} onChange={(v) => set((p) => ({ equipment: { ...p.equipment, [k]: v } }))} />
  );

  return (
    <section className="step">
      <h2>{t('flat.title')}</h2>
      <TextField label={t('flat.buildYear')} help={t('flat.buildYearHelp')} inputMode="numeric" value={a.buildYear} onChange={(v) => set({ buildYear: v })} />
      {year !== undefined && year >= 1973 && year <= 1990 && (
        <YesNoField label={t('flat.east')} help={t('flat.eastHelp')} value={a.east} onChange={(v) => set({ east: v })} />
      )}
      <TextField label={t('flat.area')} help={t('flat.areaHelp')} inputMode="decimal" suffix="m²" value={a.area} onChange={(v) => set({ area: v })} />

      <Choice
        label={t('flat.wohnlage')}
        help={
          <>
            {t('flat.wohnlageHelp')}{' '}
            <ExtLink href={form.id === '2026' ? STRASSENVERZEICHNIS_2026 : MIETSPIEGEL_URL}>{t('flat.wohnlageLink')}</ExtLink>
          </>
        }
        value={a.wohnlage}
        onChange={(v) => set({ wohnlage: v === a.wohnlage ? '' : v })}
        options={(['einfache', 'mittlere', 'gute'] as const).map((w) => ({ value: w, label: t(`flat.${w}`) }))}
      />

      <div className="row-2">
        <TextField
          label={`${t('flat.row')} (${t('common.optional')})`}
          help={
            <>
              {form.asksColumn ? t('flat.rowHelpCol', { year: form.id }) : t('flat.rowHelpRows', { year: form.id, rows: form.mietspiegelRows })}{' '}
              <ExtLink href={MIETSPIEGEL_URL}>{t('flat.mietspiegelLink')}</ExtLink>
            </>
          }
          value={a.row}
          onChange={(v) => set({ row: v })}
        />
        {form.asksColumn && <TextField label={`${t('flat.column')} (${t('common.optional')})`} value={a.column} onChange={(v) => set({ column: v })} />}
      </div>

      <Field label={t('flat.equipment')} help={t('flat.equipmentHelp')}>
        <div className="checks">{(['aussenWC', 'innenWC', 'badWC', 'sammelheizung', 'ofenheizung', 'fahrstuhl'] as const).map(eq)}</div>
      </Field>
      <TextField label={t('flat.equipmentTenantNote')} pdf value={a.equipmentTenantNote} onChange={(v) => set({ equipmentTenantNote: v })} />
      <TextField label={t('flat.modernization')} help={t('flat.modernizationHelp')} multiline pdf value={a.modernization} onChange={(v) => set({ modernization: v })} />

      <Choice
        label={t('flat.position')}
        value={a.position}
        onChange={(v) => set({ position: v === a.position ? '' : v })}
        options={(['Vorderhaus', 'Seitenflügel', 'Hinterhaus'] as const).map((p) => ({ value: p, label: t(`flat.${p}`) }))}
      />
      <div className="row-2">
        <TextField label={t('flat.floor')} inputMode="numeric" value={a.floor} onChange={(v) => set({ floor: v })} />
        <Choice
          label={t('flat.side')}
          value={a.side}
          onChange={(v) => set({ side: v === a.side ? '' : v })}
          options={(['links', 'mitte', 'rechts'] as const).map((s) => ({ value: s, label: t(`flat.${s}`) }))}
        />
      </div>
      <YesNoField label={t('flat.attic')} value={a.attic} onChange={(v) => set({ attic: v })} />
      <YesNoField label={t('flat.modernizedOld')} value={a.modernizedOld} onChange={(v) => set({ modernizedOld: v })} />
      {a.modernizedOld === 'ja' && <TextField label={t('flat.modernizedWhen')} value={a.modernizedWhen} onChange={(v) => set({ modernizedWhen: v })} />}
      <YesNoField label={t('flat.smallHouse')} value={a.smallHouse} onChange={(v) => set({ smallHouse: v })} />
    </section>
  );
}
