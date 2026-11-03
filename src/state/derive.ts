import { isApplicable, parseNumber, parseYear, type ConditionContext } from '../data/logic';
import { calculateRent, findMietspiegelField, type RentCalculation } from '../data/mietspiegel';
import type { FormVersion, Merkmal, MerkmalGroup } from '../data/types';
import type { Answers } from './answers';

export function conditionContext(a: Answers): ConditionContext {
  const sonder: ConditionContext['sonder'] = {};
  for (const [k, v] of Object.entries(a.sonder)) sonder[k as keyof typeof sonder] = v === 'ja';
  return {
    buildYear: parseYear(a.buildYear),
    east: a.east === 'ja' ? true : a.east === 'nein' ? false : undefined,
    sonder,
  };
}

export type MerkmalState = 'yes' | 'no' | 'unsure' | 'open' | 'excluded';

export function merkmalState(m: Merkmal, a: Answers, ctx: ConditionContext): MerkmalState {
  if (!isApplicable(m.cond, ctx)) return 'excluded';
  return a.features[m.id] ?? 'open';
}

/** Merkmal zählt als angekreuzt */
export function counts(m: Merkmal, a: Answers, ctx: ConditionContext): boolean {
  return merkmalState(m, a, ctx) === 'yes';
}

export interface GroupStats {
  group: MerkmalGroup;
  minus: Merkmal[];
  plus: Merkmal[];
  unsure: Merkmal[];
  tendency: 'minus' | 'plus' | 'neutral';
}

export function groupStats(form: FormVersion, a: Answers): GroupStats[] {
  const ctx = conditionContext(a);
  return form.groups.map((group) => {
    const minus = group.merkmale.filter((m) => m.sign === '-' && counts(m, a, ctx));
    const plus = group.merkmale.filter((m) => m.sign === '+' && counts(m, a, ctx));
    const unsure = group.merkmale.filter((m) => merkmalState(m, a, ctx) === 'unsure');
    const tendency = minus.length > plus.length ? 'minus' : plus.length > minus.length ? 'plus' : 'neutral';
    return { group, minus, plus, unsure, tendency };
  });
}

/** Zulässige Miete nach Mietspiegeltabelle und Orientierungshilfe, soweit die Tabelle erfasst ist */
export function rentCalculation(form: FormVersion, a: Answers): RentCalculation | undefined {
  const area = parseNumber(a.area);
  const field = findMietspiegelField(form.id, a.wohnlage, parseYear(a.buildYear), area);
  const sonder = (Object.keys(a.sonder) as (keyof Answers['sonder'])[]).filter((id) => a.sonder[id] === 'ja');
  return field && area ? calculateRent(field, groupStats(form, a), area, sonder) : undefined;
}

export function flatAddressLine(a: Answers): string {
  const street = a.flatDiffers ? a.flat.street : a.tenant.street;
  const zip = a.flatDiffers ? a.flat.zip : a.tenant.zip;
  const city = a.flatDiffers ? a.flat.city : a.tenant.city;
  return [street, [zip, city].filter(Boolean).join(' ')].filter(Boolean).join(', ');
}

export function flatDetailLine(a: Answers): string {
  if (a.flatDiffers && a.flat.detail) return a.flat.detail;
  const parts = [a.position, a.floor ? `${a.floor}. OG` : '', a.side].filter(Boolean);
  return parts.join(', ');
}

export function equipmentList(a: Answers): string[] {
  const labels: Record<keyof Answers['equipment'], string> = {
    aussenWC: 'Außen-WC',
    innenWC: 'Innen-WC',
    badWC: 'Bad/WC',
    sammelheizung: 'Sammelheizung',
    ofenheizung: 'Ofenheizung',
    fahrstuhl: 'Fahrstuhl',
  };
  return (Object.keys(labels) as (keyof Answers['equipment'])[]).filter((k) => a.equipment[k]).map((k) => labels[k]);
}

/** Text der Folgefrage-Antwort inkl. Lärmart */
export function followUpAnswer(m: Merkmal, a: Answers): string {
  if (!m.followUp) return '';
  const text = a.followUps[m.followUp]?.trim() ?? '';
  if (m.followUp === 'laerm') {
    const arten = [
      a.laermArt.strasse && 'Straßenverkehrslärm',
      a.laermArt.schiene && 'Schienenverkehrslärm',
      a.laermArt.flug && 'Fluglärm',
    ].filter(Boolean);
    return [arten.length ? `Starke Beeinträchtigung durch ${arten.join(', ')}` : '', text].filter(Boolean).join('; ');
  }
  return text;
}

/**
 * Die PDF-Standardschrift kann nur den Zeichensatz WinAnsi (≈ Latin-1) darstellen.
 * Andere Zeichen (z. B. arabische Schrift) würden im PDF als „?“ erscheinen.
 */
export function hasNonLatin(s: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /[^\u0000-ÿŒœŠšŸŽžƒ–-…‰‹›€™]/.test(s);
}
