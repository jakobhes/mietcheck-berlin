import { describe, expect, it } from 'vitest';
import type { GroupStats } from '../state/derive';
import { calculateRent, findMietspiegelField } from './mietspiegel';

const stats = (...tendencies: GroupStats['tendency'][]) => tendencies.map((tendency) => ({ tendency }) as GroupStats);

describe('Mietspiegel 2026', () => {
  it('finds the row by Wohnlage, Baujahr and Wohnfläche', () => {
    expect(findMietspiegelField('2026', 'einfache', 1966, 34.99)?.field.row).toBe('22');
    expect(findMietspiegelField('2026', 'einfache', 1966, 60)?.field.row).toBe('26');
    expect(findMietspiegelField('2026', 'einfache', 1966, 84.9)?.field.row).toBe('26');
    expect(findMietspiegelField('2026', 'einfache', 1966, 85)?.field.row).toBe('27');
    expect(findMietspiegelField('2026', 'mittlere', 1972, 50)?.field.row).toBe('89');
    expect(findMietspiegelField('2026', 'gute', 1965, 90)?.field.row).toBe('154');
  });

  it('2024: Stresemannstraße 72 liegt laut Mieterverein in Zeile 17', () => {
    expect(findMietspiegelField('2024', 'einfache', 1966, 50)?.field.row).toBe('17');
    expect(findMietspiegelField('2024', 'einfache', 1966, 60)?.field).toMatchObject({ row: '19', lower: 5.22, mean: 5.87, upper: 7.18 });
  });

  it('bis 2023: Matrix mit Zeile A–L und Spalte 4', () => {
    expect(findMietspiegelField('2023', 'einfache', 1966, 39.9)).toMatchObject({ column: '4', field: { row: 'A', mean: 7.24 } });
    expect(findMietspiegelField('2021', 'mittlere', 1966, 45)?.field).toMatchObject({ row: 'E', mean: 6.05 });
    expect(findMietspiegelField('2019', 'gute', 1966, 75)?.field).toMatchObject({ row: 'I', mean: 6.65 });
    expect(findMietspiegelField('2017', 'einfache', 1966, 90)?.field).toMatchObject({ row: 'J', lower: 4.8, mean: 5.29, upper: 6.14 });
  });

  it('returns nothing outside the recorded tables', () => {
    expect(findMietspiegelField('2026', 'einfache', 1964, 60)).toBeUndefined();
    expect(findMietspiegelField('2026', '', 1966, 60)).toBeUndefined();
    expect(findMietspiegelField('2026', 'einfache', 1966, undefined)).toBeUndefined();
  });

  it('nets the groups against each other (Beispiel 10.4 B: 3 × plus, 2 × minus → +20 %)', () => {
    const field = { table: '9.2', wohnlage: 'mittlere' as const, buildFrom: 1919, buildTo: 1949, field: { row: '81', minArea: 60, lower: 5.9, mean: 7.3, upper: 9.55 } };
    const calc = calculateRent(field, stats('plus', 'plus', 'plus', 'minus', 'minus'), 60);
    expect(calc.ovmPerSqm).toBe(7.75);
  });

  it('subtracts towards the lower value when mindernde Gruppen überwiegen', () => {
    const field = findMietspiegelField('2026', 'einfache', 1966, 72)!;
    // Zeile 26: 5,54 / 6,35 / 7,55 → 2 × minus: 6,35 − 0,4 × 0,81 = 6,026 → 6,03
    const calc = calculateRent(field, stats('minus', 'minus', 'neutral', 'neutral', 'neutral'), 72);
    expect(calc.balance).toBe(-2);
    expect(calc.ovmPerSqm).toBe(6.03);
    expect(calc.ovm).toBe(434.16);
    expect(calc.maxRent).toBe(477.58);
  });

  it('reaches the bounds of the range', () => {
    const field = findMietspiegelField('2026', 'einfache', 1966, 72)!;
    expect(calculateRent(field, stats('minus', 'minus', 'minus', 'minus', 'minus'), 72).ovmPerSqm).toBe(5.54);
    expect(calculateRent(field, stats('plus', 'plus', 'plus', 'plus', 'plus'), 72).ovmPerSqm).toBe(7.55);
  });
});

describe('Mietspiegel 2015 mit Sondermerkmalen (Nr. 11.3)', () => {
  const plus = (n: number) => stats(...(Array.from({ length: 5 }, (_, i) => (i < n ? 'plus' : 'neutral')) as GroupStats['tendency'][]));

  it('Beispiel D: Sondermerkmale + Orientierungshilfe, begrenzt auf den Oberwert', () => {
    const field = { wohnlage: 'gute' as const, column: '1', buildFrom: 0, buildTo: 1918, field: { row: 'I', minArea: 60, lower: 4.84, mean: 5.98, upper: 7.49 }, sonder: { sm_parkett: 0.56, sm_modernes_bad: 0.34 } };
    const calc = calculateRent(field, plus(4), 85, ['sm_parkett', 'sm_modernes_bad']);
    expect(calc.base).toBe(6.88);
    expect(calc.adjustment).toBe(1.21);
    expect(calc.capped).toBe(true);
    expect(calc.ovmPerSqm).toBe(7.49);
  });

  it('Beispiel C: Sondermerkmale allein dürfen den Oberwert überschreiten', () => {
    const field = { wohnlage: 'einfache' as const, column: '3', buildFrom: 1950, buildTo: 1964, field: { row: 'G', minArea: 60, lower: 4.52, mean: 5.09, upper: 6.07 }, sonder: { sm_kueche: 1.04, sm_modernes_bad: 0.28 } };
    const calc = calculateRent(field, plus(2), 65, ['sm_kueche', 'sm_modernes_bad']);
    expect(calc.sonderBeyondRange).toBe(true);
    expect(calc.ovmPerSqm).toBe(6.41);
  });

  it('Excelsior 2015: Spalte 4, nur Küche und Bad zählen als Sondermerkmal', () => {
    const field = findMietspiegelField('2015', 'einfache', 1966, 72)!;
    expect(field.field).toMatchObject({ row: 'G', lower: 4.4, mean: 4.7, upper: 5.24 });
    const calc = calculateRent(field, stats('minus', 'neutral', 'neutral', 'neutral', 'neutral'), 72, ['sm_kueche', 'sm_aufzug']);
    expect(calc.sonderItems).toEqual([{ id: 'sm_kueche', amount: 0.5 }]);
    // 4,70 + 0,50 = 5,20; −20 % × 0,30 = −0,06 → 5,14
    expect(calc.ovmPerSqm).toBe(5.14);
  });
});
