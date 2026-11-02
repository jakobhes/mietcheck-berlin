import { monthStart } from './dates';
import { ENERGY_THRESHOLDS } from './forms';
import type { Condition, FormId, Merkmal, SonderId } from './types';

export interface ConditionContext {
  /** Jahr der Bezugsfertigkeit, falls bekannt */
  buildYear?: number;
  /** Bei Baujahr 1973–1990: liegt die Wohnung im ehemaligen Ostteil? */
  east?: boolean;
  /** 2015: Sondermerkmale, die laut Nutzer:in zutreffen */
  sonder?: Partial<Record<SonderId, boolean>>;
}

/**
 * Prüft, ob ein Merkmal laut Bedingungen überhaupt in Frage kommt.
 * Ist das Baujahr unbekannt, wird das Merkmal sicherheitshalber angezeigt.
 */
export function isApplicable(cond: Condition | undefined, ctx: ConditionContext): boolean {
  if (!cond) return true;
  const y = ctx.buildYear;
  if (y !== undefined) {
    if (cond.maxYear !== undefined && y > cond.maxYear) return false;
    if (cond.minYear !== undefined && y < cond.minYear) return false;
    if (cond.notBetween && y >= cond.notBetween[0] && y <= cond.notBetween[1]) return false;
    if (cond.notEast7390 && y >= 1973 && y <= 1990 && ctx.east === true) return false;
  }
  if (cond.unlessSonder && ctx.sonder?.[cond.unlessSonder]) return false;
  return true;
}

export function applicableMerkmale(merkmale: Merkmal[], ctx: ConditionContext): Merkmal[] {
  return merkmale.filter((x) => isApplicable(x.cond, ctx));
}

export function parseYear(s: string): number | undefined {
  const m = /(\d{4})/.exec(s);
  if (!m) return undefined;
  const y = Number(m[1]);
  return y >= 1600 && y <= 2100 ? y : undefined;
}

/** Deutsche Zahleneingabe „1.234,56“ oder „1234.56“ → number */
export function parseNumber(s: string): number | undefined {
  const t = s.trim().replace(/\s/g, '').replace(/€|m²|qm/gi, '');
  if (!t) return undefined;
  const normalized = t.includes(',') ? t.replace(/\./g, '').replace(',', '.') : t;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : undefined;
}

export type EnergyKind = 'verbrauch' | 'bedarf';

/**
 * Schlägt anhand des Energiekennwerts die passende Stufe vor (Merkmal-ID oder undefined).
 * Regeln laut Prüfbogen: Bedarfskennwert → Grenzen um 20 % erhöhen;
 * Kennwert ohne Warmwasser (dezentral) → 20 kWh/(m²a) aufschlagen.
 */
export function suggestEnergyMerkmal(
  formId: FormId,
  value: number,
  kind: EnergyKind,
  decentralHotWater: boolean,
): string | undefined {
  const t = ENERGY_THRESHOLDS[formId];
  const factor = kind === 'bedarf' ? 1.2 : 1;
  const v = value + (decentralHotWater ? 20 : 0);
  // höchste zutreffende Minus-Stufe zuerst
  for (let i = t.minus.length - 1; i >= 0; i--) {
    if (v > t.minus[i] * factor) return `energie_minus_${i + 1}`;
  }
  for (let i = t.plus.length - 1; i >= 0; i--) {
    if (v < t.plus[i] * factor) return `energie_plus_${i + 1}`;
  }
  return undefined;
}

/* -------------------------------------------------------------------------------- */
/* Rüge-Fristen (§ 556g Abs. 2 BGB)                                                  */
/* -------------------------------------------------------------------------------- */

/** Ab Vertragsschluss 1.4.2020 gilt die 30-Monats-Regel für die Rückforderung. */
export const RUECKWIRKUNG_AB = '2020-04-01';

export function addMonths(iso: string, months: number): string {
  const [y, mo, d] = iso.split('-').map(Number);
  const target = new Date(Date.UTC(y, mo - 1 + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d, lastDay));
  return target.toISOString().slice(0, 10);
}

export type RefundRule =
  /** Vertrag ab 1.4.2020, Rüge innerhalb von 30 Monaten nach Mietbeginn: Rückforderung ab Mietbeginn */
  | { kind: 'fromStart'; deadline: string }
  /** Vertrag ab 1.4.2020, aber 30 Monate verstrichen: nur ab Zugang der Rüge */
  | { kind: 'fromRuegeLate'; deadline: string }
  /** Vertrag vor 1.4.2020: nur ab Zugang der Rüge */
  | { kind: 'fromRuegeOld' };

export function refundRule(contractDate: string, rentStart: string, today: string): RefundRule {
  if (monthStart(contractDate) < RUECKWIRKUNG_AB) return { kind: 'fromRuegeOld' };
  // nur Monat bekannt → ab dem Monatsersten rechnen (frühestmögliche Frist, also auf der sicheren Seite)
  const start = monthStart(rentStart) || monthStart(contractDate);
  const deadline = addMonths(start, 30);
  return today <= deadline ? { kind: 'fromStart', deadline } : { kind: 'fromRuegeLate', deadline };
}

const MONTHS_DE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

/** „2024-03“ → „März 2024“, „2024-03-15“ → „15.03.2024“ */
export function formatDateDe(iso: string): string {
  if (/^\d{4}-\d{2}$/.test(iso)) return `${MONTHS_DE[Number(iso.slice(5)) - 1] ?? iso.slice(5)} ${iso.slice(0, 4)}`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

export { monthStart };

export function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
