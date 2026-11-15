import { describe, expect, it } from 'vitest';
import { getForm } from '../data/forms';
import { initialAnswers, type Answers } from '../state/answers';
import { applyHouse, HOUSES, isPrefilled, isSonderPrefilled, presetFeatures } from './presets';

const ids2026 = new Set(getForm('2026').groups.flatMap((g) => g.merkmale.map((m) => m.id)));
const excelsior = HOUSES.excelsior;

describe.each(Object.values(HOUSES))('house $id', (house) => {
  it.each(Object.entries(house.variants))('%s lists only known, non-overlapping 2026 ids', (_v, { yes, ask }) => {
    expect([...yes, ...ask].filter((id) => !ids2026.has(id))).toEqual([]);
    expect(yes.filter((id) => ask.includes(id))).toEqual([]);
  });
});

describe('Excelsior', () => {
  const a = (patch: Partial<Answers>): Answers => ({ ...initialAnswers, ...patch });

  it('leaves answers untouched without house or variant', () => {
    const raw = a({ features: { bad_dielen: 'yes' } });
    expect(applyHouse(raw, undefined)).toBe(raw);
    expect(applyHouse(raw, excelsior).features).toEqual({ bad_dielen: 'yes' });
    expect(applyHouse(raw, excelsior).buildYear).toBe('1966');
  });

  it('answers index and graduated rent with no – nobody in the house has them', () => {
    const fixed = applyHouse(a({}), excelsior);
    expect(fixed.indexRent).toBe('nein');
    expect(fixed.staffelRent).toBe('nein');
    expect(excelsior.hiddenScreens).toEqual(expect.arrayContaining(['contract.indexRent', 'contract.staffelRent']));
  });

  it('unrenoviert: only the unblackened merkmale stay open', () => {
    const f = presetFeatures(excelsior, 'unrenoviert', '2026');
    const open = [...ids2026].filter((id) => !(id in f));
    expect(open).toHaveLength(38);
    expect(f.gebaeude_treppenhaus_schlecht).toBe('unsure');
    expect(f.gebaeude_fahrradraum).toBe('yes');
    expect(f.umfeld_keine_fahrradplaetze).toBe('no');
    expect(f.bad_hochwertig).toBe('no');
    expect(f.energie_minus_1).toBe('yes');
    expect(f.energie_minus_2).toBe('no');
  });

  it('renoviert: fewer questions, renovated equipment is ticked', () => {
    const f = presetFeatures(excelsior, 'renoviert', '2026');
    expect([...ids2026].filter((id) => !(id in f))).toHaveLength(13);
    expect(f.kueche_einbaukueche).toBe('yes');
    expect(f.wohnung_waermeschutzfenster).toBe('yes');
    expect(f.kueche_dunstabzug).toBe('no');
    expect(f.bad_kein_waschbecken).toBe('no');
  });

  it('prefilled answers override stored ones, open ones keep the user answer', () => {
    const out = applyHouse(a({ houseVariant: 'renoviert', features: { bad_klein: 'yes', kueche_einbaukueche: 'no' } }), excelsior);
    expect(out.features.bad_klein).toBe('yes');
    expect(out.features.kueche_einbaukueche).toBe('yes');
  });

  it('merkmale only in older forms: citylage/vernachlässigt fixed, others still asked', () => {
    const raw = a({ houseVariant: 'unrenoviert', contractDate: '2020-01-01' });
    expect(isPrefilled(excelsior, raw, 'umfeld_citylage')).toBe(true);
    expect(applyHouse(raw, excelsior).features.umfeld_vernachlaessigt).toBe('no');
    expect(isPrefilled(excelsior, raw, 'wohnung_kaltwasserzaehler')).toBe(false);
    expect(isPrefilled(excelsior, raw, 'gebaeude_aufzug')).toBe(true);
    expect(isPrefilled(undefined, raw, 'gebaeude_aufzug')).toBe(false);
  });

  it('2015: Sondermerkmale per variant, the rest is asked', () => {
    const unrenoviert = a({ houseVariant: 'unrenoviert', contractDate: '2016-01-01' });
    expect(applyHouse(unrenoviert, excelsior).sonder).toEqual({ sm_parkett: 'nein', sm_dusche: 'nein', sm_isolierverglasung: 'nein', sm_aufzug: 'ja' });
    expect(isSonderPrefilled(excelsior, unrenoviert, 'sm_kueche')).toBe(false);
    expect(isSonderPrefilled(excelsior, unrenoviert, 'sm_kleines_bad')).toBe(false);
    const renoviert = applyHouse(a({ houseVariant: 'renoviert', contractDate: '2016-01-01', sonder: { sm_kueche: 'nein' } }), excelsior);
    expect(renoviert.sonder.sm_kueche).toBe('ja');
    expect(renoviert.sonder.sm_modernes_bad).toBe('ja');
    expect(isSonderPrefilled(excelsior, a({}), 'sm_aufzug')).toBe(false);
  });

  it('2015: merkmale only in that form', () => {
    const f = presetFeatures(excelsior, 'unrenoviert', '2015');
    expect(f.umfeld_muell).toBe('yes');
    expect(f.umfeld_muell_gepflegt).toBe('no');
    expect(f.wohnung_kein_kabel).toBe('no');
    expect(f.wohnung_breitband).toBe('no');
    expect('bad_einhebelmischer' in f).toBe(false);
  });

  it('only the Prüfbogen, central heating fixed', () => {
    const fixed = applyHouse(a({ documents: 'beide', equipment: { ...initialAnswers.equipment, badWC: true } }), excelsior);
    expect(fixed.documents).toBe('pruefbogen');
    expect(fixed.equipment.sammelheizung).toBe(true);
    expect(fixed.equipment.badWC).toBe(true);
  });

  it('noise: a window to Stresemannstraße means road traffic noise', () => {
    const yes = applyHouse(a({ houseVariant: 'unrenoviert', features: { umfeld_laerm: 'yes' } }), excelsior);
    expect(yes.laermArt.strasse).toBe(true);
    expect(yes.followUps.laerm).toContain('Stresemannstraße');
    const no = applyHouse(a({ houseVariant: 'unrenoviert', features: { umfeld_laerm: 'no' } }), excelsior);
    expect(no.followUps.laerm).toBeUndefined();
  });

  it('energy level follows the thresholds of the form', () => {
    expect(presetFeatures(excelsior, 'renoviert', '2023').energie_minus_1).toBe('yes'); // > 155
    const f2015 = presetFeatures(excelsior, 'renoviert', '2015'); // > 170
    expect(Object.entries(f2015).filter(([id, v]) => id.startsWith('energie_') && v === 'yes')).toEqual([]);
  });

  it('energy value only where measured', () => {
    expect(applyHouse(a({ houseNo: '72' }), excelsior).energyValue).toBe('160');
    expect(applyHouse(a({ houseNo: '74' }), excelsior).energyValue).toBe('');
  });
});
