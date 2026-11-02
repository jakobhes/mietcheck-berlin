import { describe, expect, it } from 'vitest';
import { FORMS, selectFormVersion } from './forms';
import { addMonths, formatDateDe, isApplicable, parseNumber, refundRule, suggestEnergyMerkmal } from './logic';
import featDe from '../i18n/features/de';
import featEn from '../i18n/features/en';
import featAr from '../i18n/features/ar';
import uiDe from '../i18n/ui/de';
import uiEn from '../i18n/ui/en';
import uiAr from '../i18n/ui/ar';

describe('selectFormVersion', () => {
  const cases: [string, string | undefined][] = [
    ['2015-05-31', undefined],
    ['2015-06-01', '2015'],
    ['2016-08-31', '2015'],
    ['2016-09-01', '2017'],
    ['2018-08-31', '2017'],
    ['2018-09-01', '2019'],
    ['2020-08-31', '2019'],
    ['2020-09-01', '2021'],
    ['2022-08-31', '2021'],
    ['2022-09-01', '2023'],
    ['2023-08-31', '2023'],
    ['2023-09-01', '2024'],
    ['2025-08-31', '2024'],
    ['2025-09-01', '2026'],
    ['2026-11-02', '2026'],
    // nur Monat und Jahr
    ['2015-05', undefined],
    ['2015-06', '2015'],
    ['2025-08', '2024'],
    ['2025-09', '2026'],
  ];
  it.each(cases)('%s → %s', (date, expected) => {
    expect(selectFormVersion(date)?.id).toBe(expected);
  });

  it('rejects malformed dates', () => {
    expect(selectFormVersion('1.9.2023')).toBeUndefined();
  });
});

describe('form catalogs', () => {
  it('has unique merkmal ids per form', () => {
    for (const f of FORMS) {
      const ids = f.groups.flatMap((g) => g.merkmale.map((m) => m.id));
      expect(new Set(ids).size, `duplicate id in ${f.id}`).toBe(ids.length);
    }
  });

  it('has five groups everywhere', () => {
    for (const f of FORMS) expect(f.groups.map((g) => g.id)).toEqual(['bad', 'kueche', 'wohnung', 'gebaeude', 'umfeld']);
  });

  it('has year-specific differences', () => {
    const ids = (y: string) => new Set(FORMS.find((f) => f.id === y)!.groups.flatMap((g) => g.merkmale.map((m) => m.id)));
    expect(ids('2024').has('umfeld_citylage')).toBe(true);
    expect(ids('2026').has('umfeld_citylage')).toBe(false);
    expect(ids('2026').has('wohnung_eg_kein_einbruchschutz')).toBe(true);
    expect(ids('2023').has('kueche_keine_wandfliesen')).toBe(false);
    expect(ids('2015').has('wohnung_kein_kabel')).toBe(true);
  });
});

describe('translations', () => {
  const allIds = new Set<string>();
  for (const f of FORMS) {
    f.groups.forEach((g) => g.merkmale.forEach((m) => allIds.add(m.id)));
    f.sonder?.forEach((s) => allIds.add(s.id));
  }
  it.each([
    ['de', featDe],
    ['en', featEn],
    ['ar', featAr],
  ])('every merkmal has %s texts', (_lang, texts) => {
    const missing = [...allIds].filter((id) => !texts[id]?.q || !texts[id]?.help);
    expect(missing).toEqual([]);
  });

  function keys(obj: object, prefix = ''): string[] {
    return Object.entries(obj).flatMap(([k, v]) => (typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
  }
  it('ui strings have the same keys in all languages', () => {
    expect(keys(uiEn).sort()).toEqual(keys(uiDe).sort());
    expect(keys(uiAr).sort()).toEqual(keys(uiDe).sort());
  });
});

describe('conditions', () => {
  it('maxYear / minYear / notBetween', () => {
    expect(isApplicable({ maxYear: 2001 }, { buildYear: 2001 })).toBe(true);
    expect(isApplicable({ maxYear: 2001 }, { buildYear: 2002 })).toBe(false);
    expect(isApplicable({ minYear: 1950 }, { buildYear: 1949 })).toBe(false);
    expect(isApplicable({ notBetween: [2016, 2022] }, { buildYear: 2018 })).toBe(false);
    expect(isApplicable({ notBetween: [2016, 2022] }, { buildYear: 2023 })).toBe(true);
  });
  it('unknown build year keeps the merkmal', () => {
    expect(isApplicable({ maxYear: 1990 }, {})).toBe(true);
  });
  it('east 1973–1990', () => {
    expect(isApplicable({ notEast7390: true }, { buildYear: 1980, east: true })).toBe(false);
    expect(isApplicable({ notEast7390: true }, { buildYear: 1980, east: false })).toBe(true);
    expect(isApplicable({ notEast7390: true }, { buildYear: 1995, east: true })).toBe(true);
  });
  it('2015 sondermerkmal exclusion', () => {
    expect(isApplicable({ unlessSonder: 'sm_kueche' }, { sonder: { sm_kueche: true } })).toBe(false);
    expect(isApplicable({ unlessSonder: 'sm_kueche' }, { sonder: {} })).toBe(true);
  });
});

describe('energy suggestion', () => {
  it('picks the highest matching level', () => {
    expect(suggestEnergyMerkmal('2026', 250, 'verbrauch', false)).toBe('energie_minus_3');
    expect(suggestEnergyMerkmal('2026', 150, 'verbrauch', false)).toBe('energie_minus_1');
    expect(suggestEnergyMerkmal('2026', 130, 'verbrauch', false)).toBeUndefined();
    expect(suggestEnergyMerkmal('2026', 70, 'verbrauch', false)).toBe('energie_plus_3');
    expect(suggestEnergyMerkmal('2026', 110, 'verbrauch', false)).toBe('energie_plus_1');
  });
  it('applies bedarf +20 % and decentral +20 kWh', () => {
    expect(suggestEnergyMerkmal('2026', 150, 'bedarf', false)).toBeUndefined(); // Grenze 174
    expect(suggestEnergyMerkmal('2026', 130, 'verbrauch', true)).toBe('energie_minus_1'); // 150 > 145
  });
});

describe('refund rule', () => {
  it('contracts before 1.4.2020', () => {
    expect(refundRule('2020-03-31', '2020-05-01', '2020-06-01').kind).toBe('fromRuegeOld');
  });
  it('30 months from rent start', () => {
    expect(refundRule('2024-01-10', '2024-02-01', '2026-08-01')).toEqual({ kind: 'fromStart', deadline: '2026-08-01' });
    expect(refundRule('2024-01-10', '2024-02-01', '2026-08-02')).toEqual({ kind: 'fromRuegeLate', deadline: '2026-08-01' });
  });
  it('month-only dates count from the first of the month', () => {
    expect(refundRule('2020-03', '2020-04', '2020-06-01').kind).toBe('fromRuegeOld');
    expect(refundRule('2024-01', '2024-02', '2026-08-01')).toEqual({ kind: 'fromStart', deadline: '2026-08-01' });
    expect(refundRule('2024-01', '', '2026-08-01')).toEqual({ kind: 'fromRuegeLate', deadline: '2026-07-01' });
  });
  it('formats month-only dates', () => {
    expect(formatDateDe('2024-03')).toBe('März 2024');
    expect(formatDateDe('2024-03-15')).toBe('15.03.2024');
  });
  it('addMonths clamps month ends', () => {
    expect(addMonths('2023-08-31', 30)).toBe('2026-02-28');
  });
});

describe('parseNumber', () => {
  it.each([
    ['1.234,56', 1234.56],
    ['850', 850],
    ['12,5 €', 12.5],
    ['67.5', 67.5],
    ['', undefined],
  ])('%s', (input, out) => expect(parseNumber(input)).toBe(out));
});
