/**
 * Mietspiegeltabellen und Berechnung der ortsüblichen Vergleichsmiete
 * (Spanneneinordnung nach der Orientierungshilfe zum Berliner Mietspiegel).
 *
 * Erfasst sind bisher nur die Felder, die der Haus-Modus braucht: Bezugsfertigkeit 1965–1972
 * (Excelsior, Baujahr 1966), jeweils für alle drei Wohnlagen.
 * Quellen: Berliner Mietspiegel 2026 (Nr. 9.1–9.3) und die Mietspiegeltabellen 2017–2024
 * aus dem Archiv unter https://mietspiegel.berlin.de/berliner-mietspiegel/archiv/, Mietspiegel 2015
 * (Nr. 9 und 10.1) unter https://www.berliner-mieterverein.de/uploads/2015/05/senbroschuere120515.pdf
 * Bis 2023 ist die Tabelle eine Matrix (Zeile A–L nach Wohnlage und Wohnfläche, Spalte nach
 * Bezugsfertigkeit), ab 2024 gibt es je Wohnlage eine Tabelle mit durchnummerierten Zeilen.
 */
import type { GroupStats } from '../state/derive';
import type { FormId, SonderId } from './types';

type Wohnlage = 'einfache' | 'mittlere' | 'gute';

export interface MietspiegelRow {
  row: string;
  /** Wohnfläche ab (einschließlich) */
  minArea: number;
  /** Wohnfläche bis unter */
  maxArea?: number;
  lower: number;
  mean: number;
  upper: number;
}

interface Band {
  wohnlage: Wohnlage;
  /** ab 2024: Nummer der Tabelle im Mietspiegel, z. B. „9.1“ */
  table?: string;
  /** bis 2023: Spalte der Matrix */
  column?: string;
  buildFrom: number;
  buildTo: number;
  rows: MietspiegelRow[];
  /** nur 2015: Zu-/Abschläge der baualtersspezifischen Sondermerkmale in €/m² (Nr. 10.1) */
  sonder?: Partial<Record<SonderId, number>>;
}

const r = (row: string | number, minArea: number, maxArea: number | undefined, lower: number, mean: number, upper: number): MietspiegelRow => ({
  row: String(row),
  minArea,
  maxArea,
  lower,
  mean,
  upper,
});

/** Matrix bis 2023, Spalte 4 (1965–1972): Zeilen A–L = je Größenklasse einfach/mittel/gut, Werte [Unterwert, Mittelwert, Oberwert] */
type Matrix = Record<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L', [number, number, number]>;

const AREAS: [number, number | undefined][] = [
  [0, 40],
  [40, 60],
  [60, 90],
  [90, undefined],
];

function matrix1965(m: Matrix, sonder?: Band['sonder']): Band[] {
  const keys = Object.keys(m) as (keyof Matrix)[];
  return (['einfache', 'mittlere', 'gute'] as const).map((wohnlage, w) => ({
    wohnlage,
    column: '4',
    buildFrom: 1965,
    buildTo: 1972,
    sonder,
    rows: AREAS.map(([min, max], i) => {
      const key = keys[i * 3 + w];
      const [lower, mean, upper] = m[key];
      return r(key, min, max, lower, mean, upper);
    }),
  }));
}

const TABLES: Partial<Record<FormId, Band[]>> = {
  '2026': [
    {
      table: '9.1',
      wohnlage: 'einfache',
      buildFrom: 1965,
      buildTo: 1972,
      rows: [
        r(22, 0, 35, 6.64, 8.07, 10.23),
        r(23, 35, 40, 6.61, 7.72, 9.97),
        r(24, 40, 55, 6.23, 7.32, 9.53),
        r(25, 55, 60, 6.01, 6.99, 8.89),
        r(26, 60, 85, 5.54, 6.35, 7.55),
        r(27, 85, undefined, 5.45, 6.05, 6.97),
      ],
    },
    {
      table: '9.2',
      wohnlage: 'mittlere',
      buildFrom: 1965,
      buildTo: 1972,
      rows: [
        r(86, 0, 35, 6.8, 8.1, 13.01),
        r(87, 35, 40, 6.6, 7.78, 10.49),
        r(88, 40, 45, 6.7, 7.72, 10.01),
        r(89, 45, undefined, 5.77, 6.65, 8.74),
      ],
    },
    {
      table: '9.3',
      wohnlage: 'gute',
      buildFrom: 1965,
      buildTo: 1972,
      rows: [
        r(150, 0, 35, 7.19, 9.47, 14.79),
        r(151, 35, 40, 7.4, 9.07, 11.42),
        r(152, 40, 45, 6.8, 8.54, 11.1),
        r(153, 45, 90, 6.07, 7.56, 10.92),
        r(154, 90, undefined, 7.49, 10.0, 12.78),
      ],
    },
  ],
  '2024': [
    {
      table: '9.1',
      wohnlage: 'einfache',
      buildFrom: 1965,
      buildTo: 1972,
      rows: [r(17, 0, 55, 5.68, 6.76, 8.58), r(18, 55, 60, 5.37, 6.1, 7.72), r(19, 60, undefined, 5.22, 5.87, 7.18)],
    },
    {
      table: '9.2',
      wohnlage: 'mittlere',
      buildFrom: 1965,
      buildTo: 1972,
      rows: [
        r(70, 0, 35, 6.57, 7.36, 14.03),
        r(71, 35, 40, 6.45, 7.21, 9.73),
        r(72, 40, 45, 5.88, 7.07, 9.06),
        r(73, 45, undefined, 5.36, 6.13, 8.41),
      ],
    },
    {
      table: '9.3',
      wohnlage: 'gute',
      buildFrom: 1965,
      buildTo: 1972,
      rows: [
        r(132, 0, 35, 7.03, 9.45, 14.21),
        r(133, 35, 40, 6.84, 8.5, 11.45),
        r(134, 40, 90, 5.82, 7.14, 10.13),
        r(135, 90, undefined, 6.32, 8.99, 11.58),
      ],
    },
  ],
  '2023': matrix1965({
    A: [6.39, 7.24, 9.41],
    B: [6.27, 7.0, 8.78],
    C: [8.68, 9.49, 10.39],
    D: [5.39, 6.26, 7.47],
    E: [5.79, 6.38, 7.4],
    F: [5.64, 7.6, 10.66],
    G: [5.21, 5.81, 6.48],
    H: [5.42, 6.08, 6.82],
    I: [5.54, 7.08, 8.85],
    J: [5.21, 5.83, 6.45],
    K: [5.4, 5.75, 6.55],
    L: [8.03, 8.84, 9.48],
  }),
  '2021': matrix1965({
    A: [6.06, 6.87, 8.93],
    B: [5.95, 6.64, 8.33],
    C: [8.24, 9.0, 9.86],
    D: [5.11, 5.94, 7.09],
    E: [5.49, 6.05, 7.02],
    F: [5.35, 7.21, 10.11],
    G: [4.94, 5.51, 6.15],
    H: [5.14, 5.77, 6.47],
    I: [5.26, 6.72, 8.4],
    J: [4.94, 5.53, 6.12],
    K: [5.12, 5.46, 6.21],
    L: [7.62, 8.39, 8.99],
  }),
  '2019': matrix1965({
    A: [5.99, 6.8, 8.83],
    B: [5.89, 6.57, 8.24],
    C: [8.15, 8.9, 9.75],
    D: [5.05, 5.88, 7.01],
    E: [5.43, 5.98, 6.94],
    F: [5.29, 7.13, 10.0],
    G: [4.89, 5.45, 6.08],
    H: [5.08, 5.71, 6.4],
    I: [5.2, 6.65, 8.31],
    J: [4.89, 5.47, 6.05],
    K: [5.06, 5.4, 6.14],
    L: [7.54, 8.3, 8.89],
  }),
  '2017': matrix1965({
    A: [5.78, 6.58, 7.74],
    B: [5.71, 6.57, 8.36],
    C: [7.7, 8.83, 9.84],
    D: [5.13, 5.75, 7.01],
    E: [5.39, 5.72, 7.2],
    F: [6.17, 7.39, 9.0],
    G: [4.76, 5.22, 6.3],
    H: [5.05, 5.49, 6.59],
    I: [6.09, 6.9, 8.59],
    J: [4.8, 5.29, 6.14],
    K: [4.91, 5.53, 7.5],
    L: [6.99, 8.05, 8.54],
  }),
  '2015': matrix1965(
    {
      A: [5.13, 6.12, 7.27],
      B: [5.41, 6.27, 7.01],
      C: [6.32, 7.78, 8.98],
      D: [4.74, 5.13, 5.75],
      E: [5.09, 5.43, 5.86],
      F: [4.83, 6.57, 8.01],
      G: [4.4, 4.7, 5.24],
      H: [4.71, 5.21, 5.67],
      I: [5.54, 6.39, 7.67],
      J: [4.28, 4.77, 5.38],
      K: [4.56, 5.1, 5.88],
      L: [7.18, 7.82, 8.93],
    },
    { sm_kueche: 0.5, sm_modernes_bad: 0.12 },
  ),
};

export interface MietspiegelField {
  wohnlage: Wohnlage;
  table?: string;
  column?: string;
  buildFrom: number;
  buildTo: number;
  field: MietspiegelRow;
  sonder?: Band['sonder'];
}

export function findMietspiegelField(formId: FormId, wohnlage: string, buildYear: number | undefined, area: number | undefined): MietspiegelField | undefined {
  if (buildYear === undefined || !area || area <= 0) return undefined;
  const band = TABLES[formId]?.find((b) => b.wohnlage === wohnlage && buildYear >= b.buildFrom && buildYear <= b.buildTo);
  const field = band?.rows.find((x) => area >= x.minArea && (x.maxArea === undefined || area < x.maxArea));
  if (!band || !field) return undefined;
  const { rows: _rows, ...rest } = band;
  return { ...rest, field };
}

export interface RentCalculation extends MietspiegelField {
  area: number;
  /** nur 2015: zutreffende Sondermerkmale mit Zu-/Abschlag je m² */
  sonderItems: { id: SonderId; amount: number }[];
  /** Mittelwert zuzüglich Sondermerkmale */
  base: number;
  /** Sondermerkmale allein überschreiten schon die Spanne – die Orientierungshilfe bleibt dann außer Betracht */
  sonderBeyondRange: boolean;
  /** Ergebnis auf den Spannenendwert begrenzt */
  capped: boolean;
  /** Merkmalgruppen mit Überwiegen der erhöhenden minus der mindernden (−5 … +5) */
  balance: number;
  /** Zu- bzw. Abschlag je m² gegenüber dem Mittelwert */
  adjustment: number;
  /** ortsübliche Vergleichsmiete je m² */
  ovmPerSqm: number;
  /** ortsübliche Vergleichsmiete für die Wohnung */
  ovm: number;
  /** zulässige Miete nach § 556d Abs. 1 BGB (ortsübliche Vergleichsmiete + 10 %) */
  maxRent: number;
}

const round2 = (n: number) => Math.round(n * 100 + Number.EPSILON) / 100;

/**
 * 2015 (Nr. 11.3): Schritt 1 Sondermerkmale auf den Mittelwert, Schritt 2 Orientierungshilfe, Schritt 3 Summe,
 * begrenzt auf die Spanne – außer die Sondermerkmale allein überschreiten die Spanne schon, dann gilt Schritt 1.
 *
 * Je Merkmalgruppe mit Überwiegen der erhöhenden Merkmale +20 % des Abstands Mittelwert → Oberwert,
 * mit Überwiegen der mindernden −20 % des Abstands Mittelwert → Unterwert. Die Gruppen werden gegeneinander
 * aufgerechnet (Beispiel im Mietspiegel 2026, Nr. 10.4 B: 3 × plus, 2 × minus → +20 %).
 */
export function calculateRent(field: MietspiegelField, stats: GroupStats[], area: number, sonder: SonderId[] = []): RentCalculation {
  const balance = stats.filter((s) => s.tendency === 'plus').length - stats.filter((s) => s.tendency === 'minus').length;
  const { lower, mean, upper } = field.field;
  const sonderItems = sonder.flatMap((id) => (field.sonder?.[id] ? [{ id, amount: field.sonder[id] }] : []));
  const base = round2(mean + sonderItems.reduce((n, x) => n + x.amount, 0));
  const sonderBeyondRange = base > upper || base < lower;
  const adjustment = sonderBeyondRange ? 0 : round2(balance >= 0 ? balance * 0.2 * (upper - mean) : balance * 0.2 * (mean - lower));
  const raw = round2(base + adjustment);
  const ovmPerSqm = sonderBeyondRange ? base : Math.min(upper, Math.max(lower, raw));
  const ovm = round2(ovmPerSqm * area);
  return { ...field, area, sonderItems, base, sonderBeyondRange, capped: ovmPerSqm !== raw, balance, adjustment, ovmPerSqm, ovm, maxRent: round2(ovm * 1.1) };
}
