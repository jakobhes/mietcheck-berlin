/**
 * Vertragsdatum und Mietbeginn werden als Monat („2024-03“) erfasst – alle Stichtage fallen auf einen Monatsersten.
 * Gibt den ersten Tag des Monats bzw. das volle Datum (ältere Eingaben) als ISO-Datum zurück, sonst ''.
 */
export function monthStart(s: string): string {
  if (/^\d{4}-\d{2}$/.test(s)) return `${s}-01`;
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
}
