import { Group, Stack } from '@mantine/core';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { CheckField, ChoiceField, ExtLink, OptionList, Question, TextField } from '../components/fields';
import { parseYear } from '../data/logic';
import type { FormVersion } from '../data/types';
import { TextQ, YesNoQ } from '../flow/generic';
import type { Screen } from '../flow/types';
import type { Answers } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';

const MIETSPIEGEL_URL = 'https://mietspiegel.berlin.de/';
const STRASSENVERZEICHNIS_2026 = 'https://www.berliner-mieterverein.de/downloads/mietspiegel-2026/mietspiegel-2026-strassenverzeichnis.pdf';

const EQUIPMENT = ['aussenWC', 'innenWC', 'badWC', 'sammelheizung', 'ofenheizung', 'fahrstuhl'] as const;

function Wohnlage({ form }: { form: FormVersion }) {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  return (
    <Question
      title={t('flat.wohnlage')}
      help={
        <>
          {t('flat.wohnlageHelp')} <ExtLink href={form.id === '2026' ? STRASSENVERZEICHNIS_2026 : MIETSPIEGEL_URL}>{t('flat.wohnlageLink')}</ExtLink>
        </>
      }
    >
      <ChoiceField value={a.wohnlage} onChange={(v) => set({ wohnlage: v })} options={(['einfache', 'mittlere', 'gute'] as const).map((w) => ({ value: w, label: t(`flat.${w}`) }))} />
    </Question>
  );
}

function RowColumn({ form }: { form: FormVersion }) {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  return (
    <Question
      title={`${t('flat.row')} (${t('common.optional')})`}
      help={
        <>
          {form.asksColumn ? t('flat.rowHelpCol', { year: form.id }) : t('flat.rowHelpRows', { year: form.id, rows: form.mietspiegelRows })}{' '}
          <ExtLink href={MIETSPIEGEL_URL}>{t('flat.mietspiegelLink')}</ExtLink>
        </>
      }
    >
      <Group grow align="flex-start">
        <TextField label={form.asksColumn ? t('flat.row') : undefined} value={a.row} onChange={(v) => set({ row: v })} />
        {form.asksColumn && <TextField label={t('flat.column')} value={a.column} onChange={(v) => set({ column: v })} />}
      </Group>
    </Question>
  );
}

function Equipment() {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  return (
    <Question title={t('flat.equipment')} help={t('flat.equipmentHelp')}>
      <Stack gap="sm">
        {EQUIPMENT.map((k) => (
          <CheckField key={k} label={t(`flat.${k}`)} checked={a.equipment[k]} onChange={(v) => set((p) => ({ equipment: { ...p.equipment, [k]: v } }))} />
        ))}
      </Stack>
    </Question>
  );
}

function Position() {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  return (
    <Question title={t('flat.position')}>
      <ChoiceField value={a.position} onChange={(v) => set({ position: v })} options={(['Vorderhaus', 'Seitenflügel', 'Hinterhaus'] as const).map((p) => ({ value: p, label: t(`flat.${p}`) }))} />
    </Question>
  );
}

function FloorSide() {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  return (
    <Question title={`${t('flat.floor')} · ${t('flat.side')}`}>
      <TextField label={t('flat.floor')} inputMode="numeric" value={a.floor} onChange={(v) => set({ floor: v })} />
      <OptionList
        label={t('flat.side')}
        value={a.side}
        onChange={(v) => set({ side: v === a.side ? '' : v })}
        options={(['links', 'mitte', 'rechts'] as const).map((s) => ({ value: s, label: t(`flat.${s}`) }))}
      />
    </Question>
  );
}

function ModernizedWhen() {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  return a.modernizedOld === 'ja' ? <TextField label={t('flat.modernizedWhen')} value={a.modernizedWhen} onChange={(v) => set({ modernizedWhen: v })} /> : null;
}

export function flatScreens(form: FormVersion, a: Answers, t: TFunction): Screen[] {
  const year = parseYear(a.buildYear);
  const s = (id: string, answered: boolean, element: Screen['element']): Screen => ({ id: `flat.${id}`, chapter: 'flat', answered, element });
  return [
    s('buildYear', !!a.buildYear, <TextQ k="buildYear" inputMode="numeric" title={t('flat.buildYear')} help={t('flat.buildYearHelp')} />),
    ...(year !== undefined && year >= 1973 && year <= 1990 ? [s('east', !!a.east, <YesNoQ k="east" title={t('flat.east')} help={t('flat.eastHelp')} />)] : []),
    s('area', !!a.area, <TextQ k="area" inputMode="decimal" suffix="m²" title={t('flat.area')} help={t('flat.areaHelp')} />),
    s('wohnlage', !!a.wohnlage, <Wohnlage form={form} />),
    s('row', !!a.row, <RowColumn form={form} />),
    s('equipment', Object.values(a.equipment).some(Boolean), <Equipment />),
    s('position', !!a.position, <Position />),
    s('floor', !!(a.floor || a.side), <FloorSide />),
    s('attic', !!a.attic, <YesNoQ k="attic" title={t('flat.attic')} />),
    s(
      'modernizedOld',
      !!a.modernizedOld,
      <YesNoQ k="modernizedOld" title={t('flat.modernizedOld')} stayIf={(v) => v === 'ja'}>
        <ModernizedWhen />
      </YesNoQ>,
    ),
    s('smallHouse', !!a.smallHouse, <YesNoQ k="smallHouse" title={t('flat.smallHouse')} />),
  ];
}
