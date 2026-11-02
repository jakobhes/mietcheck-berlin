/**
 * Rügeschreiben nach § 556g Abs. 2 BGB mit Auskunftsverlangen nach § 556g Abs. 3 BGB.
 * Briefaufbau angelehnt an DIN 5008 (Form B).
 */
import { formatDateDe, parseNumber, refundRule } from '../data/logic';
import type { FormVersion } from '../data/types';
import type { Answers } from '../state/answers';
import { equipmentList, flatAddressLine, flatDetailLine, groupStats } from '../state/derive';
import { Layout, MM } from './layout';

const SIZE = 10.5;

function euro(n: number): string {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Baut die Absätze des Briefes – getrennt vom Layout, damit sie testbar sind. */
export function ruegeParagraphs(form: FormVersion, a: Answers, today: string): { subject: string; salutation: string; paragraphs: (string | string[])[] } {
  const rent = parseNumber(a.rent);
  const area = parseNumber(a.area);
  const maxRent = parseNumber(a.maxRent);
  const deadline = formatDateDe(addDays(today, 14));
  const flat = [flatAddressLine(a), flatDetailLine(a)].filter(Boolean).join(', ');

  const subject = [
    'Rüge gemäß § 556g Abs. 2 BGB' + (a.demandInfo ? ' und Auskunftsverlangen gemäß § 556g Abs. 3 BGB' : ''),
    `Mietverhältnis über die Wohnung ${flat || '__________'}`,
    `Mietvertrag vom ${a.contractDate ? formatDateDe(a.contractDate) : '__________'}`,
  ].join('\n');

  const landlordName = a.landlord.name.trim();
  const salutation = /^(herr|frau)\s/i.test(landlordName)
    ? `Sehr geehrte${/^herr/i.test(landlordName) ? 'r' : ''} ${landlordName},`
    : 'Sehr geehrte Damen und Herren,';

  const p: (string | string[])[] = [];

  const perSqm = rent && area ? ` (entspricht ${euro(rent / area)} je m²)` : '';
  p.push(
    `mit Mietvertrag vom ${a.contractDate ? formatDateDe(a.contractDate) : '__________'} habe ich die oben genannte Wohnung` +
      (area ? ` mit einer Wohnfläche von ${a.area.trim()} m²` : '') +
      (a.rentStart ? ` ab ${a.rentStart.length > 7 ? 'dem ' : ''}${formatDateDe(a.rentStart)}` : '') +
      ` angemietet. Vereinbart ist eine Nettokaltmiete von ${rent ? euro(rent) : '__________'} monatlich${perSqm}.` +
      (a.staffelRent === 'ja' ? ' Es ist eine Staffelmiete vereinbart; die Rüge bezieht sich auf jede einzelne Staffel.' : '') +
      (a.indexRent === 'ja' ? ' Es ist eine Indexmiete vereinbart; die Rüge bezieht sich auf die Ausgangsmiete.' : ''),
  );

  p.push(
    'Hiermit rüge ich gemäß § 556g Abs. 2 BGB einen Verstoß gegen die Vorschriften über die zulässige Miethöhe bei Mietbeginn (§§ 556d ff. BGB). ' +
      'Die Wohnung liegt in Berlin und damit in einem Gebiet mit angespanntem Wohnungsmarkt im Sinne der Berliner Mietenbegrenzungsverordnung. ' +
      `Die vereinbarte Miete übersteigt die ortsübliche Vergleichsmiete nach dem Berliner Mietspiegel ${form.id} um mehr als 10 Prozent.`,
  );

  const facts: string[] = [];
  if (a.buildYear) facts.push(`Bezugsfertigkeit/Baualter: ${a.buildYear}${a.east === 'ja' ? ' (Ost)' : ''}`);
  if (a.wohnlage) facts.push(`Wohnlage: ${a.wohnlage}`);
  if (a.area) facts.push(`Wohnfläche: ${a.area.trim()} m²`);
  const eq = equipmentList(a);
  if (eq.length) facts.push(`Ausstattung: ${eq.join(', ')}`);
  if (a.row) facts.push(`Mietspiegelfeld: Zeile ${a.row}${form.asksColumn && a.column ? `, Spalte ${a.column}` : ''}`);
  if (a.energyValue) facts.push(`Energiekennwert: ${a.energyValue} kWh/(m²a)`);
  if (facts.length) {
    p.push(`Für die Einordnung in den Berliner Mietspiegel ${form.id} sind insbesondere folgende Angaben maßgeblich:`);
    p.push(facts);
  }

  const stats = groupStats(form, a);
  const minus = stats.flatMap((s) => s.minus);
  if (minus.length) {
    p.push('Die Wohnung weist nach der Orientierungshilfe zur Spanneneinordnung unter anderem folgende wohnwertmindernde Merkmale auf:');
    p.push(minus.map((m) => m.de.replace(/ \[bezieht sich[^\]]*\]/g, '')));
  }
  const minusGroups = stats.filter((s) => s.tendency === 'minus').map((s) => s.group.titleDe.replace(/^Merkmalgruppe \d: /, ''));
  if (minusGroups.length) {
    p.push(
      `In den Merkmalgruppen ${minusGroups.join(', ')} überwiegen die wohnwertmindernden Merkmale. Die Wohnung ist daher innerhalb der Spanne des Mietspiegelfeldes entsprechend unterhalb des Mittelwerts einzuordnen.`,
    );
  }

  if (maxRent) {
    const excess = rent ? rent - maxRent : undefined;
    p.push(
      `Die nach § 556d Abs. 1 BGB höchstzulässige Miete (ortsübliche Vergleichsmiete zuzüglich 10 Prozent) beträgt danach ${euro(maxRent)} netto kalt monatlich` +
        (excess && excess > 0 ? `; die vereinbarte Miete übersteigt diesen Betrag um ${euro(excess)} monatlich` : '') +
        `. Die Vereinbarung über die Miethöhe ist insoweit unwirksam (§ 556g Abs. 1 BGB). Ich fordere Sie auf, mir bis zum ${deadline} schriftlich zu bestätigen, dass die geschuldete Nettokaltmiete ${euro(maxRent)} monatlich beträgt.`,
    );
  } else {
    p.push(
      `Die Vereinbarung über die Miethöhe ist insoweit unwirksam, als die vereinbarte Miete die zulässige Miete (ortsübliche Vergleichsmiete zuzüglich 10 Prozent) übersteigt (§ 556g Abs. 1 BGB). Ich fordere Sie auf, mir bis zum ${deadline} schriftlich zu bestätigen, dass Sie nur noch die zulässige Miete verlangen, und mir deren Höhe mitzuteilen.`,
    );
  }

  const rule = a.contractDate ? refundRule(a.contractDate, a.rentStart, today) : undefined;
  if (rule?.kind === 'fromStart') {
    p.push(
      'Die Rüge erfolgt innerhalb von 30 Monaten nach Beginn des Mietverhältnisses. Ich fordere daher die über die zulässige Miete hinaus gezahlten Beträge ab Beginn des Mietverhältnisses gemäß § 556g Abs. 1 Satz 3, Abs. 2 BGB zurück.',
    );
  } else {
    p.push('Die nach Zugang dieser Rüge fällig werdenden Beträge, die die zulässige Miete übersteigen, fordere ich gemäß § 556g Abs. 1 Satz 3, Abs. 2 BGB zurück.');
  }
  p.push('Soweit ich die Miete bis zur Klärung weiterhin in voller Höhe zahle, geschieht dies ausschließlich unter dem Vorbehalt der Rückforderung.');

  if (a.landlordDisclosed === 'ja') {
    p.push(
      `Vor Vertragsschluss haben Sie mir gemäß § 556g Abs. 1a BGB Folgendes mitgeteilt: „${a.landlordDisclosedText.trim().replace(/[.!]+$/, '') || '__________'}“. ` +
        'Diese Rüge bezieht sich ausdrücklich auch auf diese Auskunft. Ich bestreite, dass die Voraussetzungen der von Ihnen genannten Ausnahme vorliegen bzw. dass sie die vereinbarte Miethöhe rechtfertigen, und bitte um entsprechende Nachweise.',
    );
  }

  if (a.demandInfo) {
    p.push(
      `Gemäß § 556g Abs. 3 BGB fordere ich Sie außerdem auf, mir bis zum ${deadline} Auskunft über alle Tatsachen zu erteilen, die für die Zulässigkeit der vereinbarten Miete maßgeblich sind, soweit diese nicht allgemein zugänglich sind und Sie hierüber unschwer Auskunft geben können, insbesondere:`,
    );
    p.push([
      'die Höhe der Miete, die die Vormieterin/der Vormieter zuletzt geschuldet hat (Vormiete, § 556e Abs. 1 BGB), sowie Zeitpunkt und Grund etwaiger Mieterhöhungen im letzten Jahr vor Beendigung des Vormietverhältnisses;',
      'ob und welche Modernisierungsmaßnahmen in den letzten drei Jahren vor Beginn des Mietverhältnisses durchgeführt wurden, mit Angabe der Kosten (§ 556e Abs. 2 BGB);',
      'ob die Wohnung nach dem 1. Oktober 2014 erstmals genutzt und vermietet wurde (§ 556f Satz 1 BGB);',
      'ob es sich um die erste Vermietung nach einer umfassenden Modernisierung handelt (§ 556f Satz 2 BGB).',
    ]);
  }

  p.push('Mit freundlichen Grüßen');
  return { subject, salutation, paragraphs: p };
}

export async function buildRuege(form: FormVersion, a: Answers, today: string): Promise<Uint8Array> {
  const l = await Layout.create(undefined, { left: 25 * MM, right: 20 * MM, top: 20 * MM, bottom: 22 * MM });
  const t = a.tenant;
  const { subject, salutation, paragraphs } = ruegeParagraphs(form, a, today);

  // Absenderzeile + Anschriftfeld (DIN 5008 Form B: Anschriftfeld ab 45 mm von oben)
  const sender = [t.name, t.street, [t.zip, t.city].filter(Boolean).join(' ')].filter(Boolean);
  l.text(sender.join('\n') || 'Name\nStraße\nPLZ Ort', { size: SIZE });
  if (t.email || t.phone) l.text([t.phone && `Tel. ${t.phone}`, t.email].filter(Boolean).join(' · '), { size: 9 });

  l.y = l.top - 27 * MM;
  l.text(sender.join(', '), { size: 7, width: 85 * MM });
  l.hline(l.y + 1, l.left, l.left + 85 * MM, 0.3);
  l.gap(4);
  const ll = a.landlord;
  l.text([ll.name || 'Vermieter:in / Hausverwaltung', ll.street || 'Straße', [ll.zip, ll.city].filter(Boolean).join(' ') || 'PLZ Ort'].join('\n'), { size: SIZE });

  l.y = l.top - 75 * MM;
  l.text(`${t.city || 'Berlin'}, ${formatDateDe(today)}`, { size: SIZE, align: 'right' });
  l.gap(10);
  l.text(subject, { size: SIZE, bold: true });
  l.gap(10);
  l.text(salutation, { size: SIZE });
  l.gap(6);

  for (const para of paragraphs) {
    if (Array.isArray(para)) {
      for (const item of para) {
        l.ensure(14);
        const y0 = l.y;
        l.textAt('–', l.left + 4, y0, 10, { size: SIZE });
        l.text(item, { size: SIZE, x: l.left + 16 });
      }
      l.gap(6);
    } else {
      l.text(para, { size: SIZE });
      l.gap(6);
    }
  }

  l.ensure(60);
  l.gap(30);
  l.hline(l.y, l.left, l.left + 70 * MM, 0.5);
  l.gap(3);
  l.text(t.name || '(Unterschrift)', { size: 9 });

  l.footers((page, i, total) => {
    if (total < 2) return;
    const s = `Seite ${i + 1} von ${total}`;
    page.drawText(s, { x: l.right - l.regular.widthOfTextAtSize(s, 8), y: 10 * MM, size: 8, font: l.regular });
  });
  return l.save();
}

