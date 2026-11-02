/**
 * Erzeugt den ausgefüllten Prüfbogen 169A im Aufbau des BMV-Originals der jeweiligen Version.
 * Es wird kein Original-PDF verwendet; Struktur und Wortlaut stammen aus src/data/forms.ts.
 */
import { rgb } from 'pdf-lib';
import { formatDateDe } from '../data/logic';
import type { FormVersion, Merkmal } from '../data/types';
import type { Answers, YesNo } from '../state/answers';
import { conditionContext, followUpAnswer, merkmalState } from '../state/derive';
import { DARK, GREY, LIGHT, Layout, MM } from './layout';

const SIZE = 9.5;

function yn(v: YesNo): { label: string; checked: boolean }[] {
  return [
    { label: 'ja', checked: v === 'ja' },
    { label: 'nein', checked: v === 'nein' },
  ];
}

function value(v: string): string {
  return v.trim() || '______________';
}

export async function buildPruefbogen(form: FormVersion, a: Answers, today: string): Promise<Uint8Array> {
  const year = form.id;
  const l = await Layout.create();

  /* ---------------- Kopf ---------------- */
  const codeW = l.bold.widthOfTextAtSize(form.formCode, 13);
  l.textAt(form.formCode, l.right - codeW, l.y, codeW + 1, { size: 13, bold: true });
  l.text('Berliner Mieterverein e.V.', { size: 15, bold: true, width: l.width * 0.6 });
  l.text(`Datum: ${formatDateDe(today)}`, { size: SIZE, align: 'right' });
  l.gap(4);

  const titleW = l.width - 20;
  const subtitle = `Dieser Prüfbogen gilt für alle Mietvertragsabschlüsse ab ${formatDateDe(form.validFrom)}${form.validTo ? ` bis ${formatDateDe(form.validTo)}` : ''}.`;
  const titleH = l.measure(form.titleDe, { size: 14, bold: true, width: titleW }) + l.measure(subtitle, { size: 8.5, width: titleW }) + 18;
  const boxTop = l.y;
  l.box(l.left, boxTop, l.width, titleH, LIGHT);
  l.y = boxTop - 8;
  l.text(form.titleDe, { size: 14, bold: true, align: 'center', x: l.left + 10, width: titleW });
  l.gap(2);
  l.text(subtitle, { size: 8.5, align: 'center', x: l.left + 10, width: titleW });
  l.y = boxTop - titleH - 10;

  l.text('Den ausgefüllten Fragebogen nebst Listen zur Spanneneinordnung zusammen mit dem Mietvertrag (Kopie) an den Berliner Mieterverein schicken:', {
    size: SIZE,
    bold: true,
  });
  l.text(form.sendTo.post.join(', ') + (form.sendTo.email ? ` – oder per E-Mail an ${form.sendTo.email}` : ''), { size: SIZE });
  l.gap(8);

  /* ---------------- I. Angaben ---------------- */
  const qx = l.left + 18;
  const q = (nr: string, text: string) => {
    l.ensure(28);
    const y0 = l.y;
    l.textAt(nr, l.left, y0, 16, { size: SIZE, bold: true });
    l.text(text, { size: SIZE, x: qx, bold: true });
  };
  const ans = (text: string) => l.text(text, { size: SIZE, x: qx + 8 });
  /** Ja/Nein-Frage in einer Zeile: „Frage   [ ] ja  [x] nein“ */
  const ynLine = (label: string, v: YesNo) => {
    l.ensure(SIZE * 1.4);
    const w = l.regular.widthOfTextAtSize(l.clean(label), SIZE);
    l.textAt(label, qx + 8, l.y, w + 2, { size: SIZE });
    l.choices(yn(v), qx + 8 + w + 12, SIZE);
  };

  l.text('I. Angaben zum Mietvertrag und zur Wohnung', { size: 11, bold: true });
  l.gap(3);
  q('1)', 'Wann haben Sie den Mietvertrag abgeschlossen?');
  ans(value(formatDateDe(a.contractDate)) + (a.rentStart ? ` (Mietbeginn: ${formatDateDe(a.rentStart)})` : ''));
  q('2)', 'Wann wurde das Gebäude, in dem sich Ihre Wohnung befindet, (bezugsfertig) erbaut? (bei Dachgeschossausbau: Baualter der Wohnung)');
  const yb = Number(a.buildYear);
  ans(value(a.buildYear) + (yb >= 1973 && yb <= 1990 && a.east ? ` (${a.east === 'ja' ? 'Ost' : 'West'})` : ''));
  q('3)', `In welche Wohnlageklasse (laut Mietspiegel ${year}) muss die Wohnung eingeordnet werden?`);
  l.choices(
    (['einfache', 'mittlere', 'gute'] as const).map((w) => ({ label: w, checked: a.wohnlage === w })),
    qx + 8,
    SIZE,
  );
  q('4)', 'Wohnungsgröße');
  ans(`${value(a.area)} m²`);
  if (form.asksColumn) {
    q('5)', 'Wie muss die von Ihnen bewohnte Wohnung im Mietspiegel eingeordnet werden?');
    ans(`Zeile: ${value(a.row)}     Spalte: ${value(a.column)}`);
  } else {
    q('5)', `In welche der ${form.mietspiegelRows} Zeilen des Mietspiegels muss Ihre Wohnung eingeordnet werden?`);
    ans(`Zeile: ${value(a.row)}`);
  }
  q('6)', 'Ausstattung (Wenn die Ausstattung vom Mieter eingebaut wurde, bitte gesondert vermerken!)');
  l.choices(
    [
      { label: 'Außen-WC', checked: a.equipment.aussenWC },
      { label: 'Innen-WC', checked: a.equipment.innenWC },
      { label: 'Bad/WC', checked: a.equipment.badWC },
      { label: 'Sammelheizung', checked: a.equipment.sammelheizung },
      { label: 'Ofenheizung', checked: a.equipment.ofenheizung },
      { label: 'Fahrstuhl', checked: a.equipment.fahrstuhl },
    ],
    qx + 8,
    SIZE,
  );
  if (a.equipmentTenantNote.trim()) ans(`Vom Mieter eingebaut: ${a.equipmentTenantNote.trim()}`);
  q('7)', 'Wie hoch ist die mietvertraglich vereinbarte Nettokaltmiete (Miete ohne Vorauszahlungen für Heiz- und Betriebskosten)?');
  ans(`${value(a.rent)} € / Monat`);
  q('8)', form.id <= '2023' ? 'Wurden in der Wohnung/im Haus Modernisierungsmaßnahmen (mit öffentlichen Mitteln) durchgeführt? Wenn ja, welche?' : 'Wurden in der Wohnung/im Haus Modernisierungsmaßnahmen durchgeführt? Wenn ja, welche?');
  ans(a.modernization.trim() || '–');
  q('9)', 'Index- oder Staffelmiete');
  ynLine('Ist eine Indexmiete vereinbart?', a.indexRent);
  ynLine('Ist eine Staffelmiete vereinbart?', a.staffelRent);
  l.gap(4);

  q('II.', 'Ist Ihr neuer Vermieter eines der sechs städtischen Wohnungsunternehmen (degewo AG; GESOBAU AG; Gewobag Wohnungsbau-AG; HOWOGE Wohnungsbaugesellschaft mbH; STADT UND LAND Wohnbauten-GmbH; WBM Wohnungsbaugesellschaft Berlin-Mitte mbH)?');
  l.choices(yn(a.municipal), qx + 8, SIZE);
  l.gap(4);

  q('III.', 'Spanneneinordnung');
  l.text(
    'Die zusätzlichen Merkmale sind auf der beigefügten Orientierungshilfe wahrheitsgemäß und vollständig angekreuzt, wobei nur solche Ausstattungen berücksichtigt sind, die nicht vom Mieter selbst mit Genehmigung des Vermieters und ausschließlich auf eigene Kosten vorgenommen wurden. Weitere Besonderheiten stehen unter „Weitere Bemerkungen“.',
    { size: 8.5, x: qx + 8 },
  );
  l.gap(4);

  q('IV.', 'Wohnungslage');
  l.choices(
    (['Vorderhaus', 'Seitenflügel', 'Hinterhaus'] as const).map((p) => ({ label: p, checked: a.position === p })),
    qx + 8,
    SIZE,
  );
  ans(`Stockwerk: ${value(a.floor)} Etage; ${a.side || 'links / rechts'}`);
  ynLine('Dachgeschosswohnung?', a.attic);
  ynLine(`Modernisierter Altbau?${a.modernizedOld === 'ja' && a.modernizedWhen ? ` (wann? ${a.modernizedWhen})` : ''}`, a.modernizedOld);
  ynLine('1- bzw. 2-Familienhaus bzw. Reihenhaus?', a.smallHouse);
  l.gap(4);

  q('V.', 'Energieverbrauchskennwert oder Endenergiebedarfskennwert');
  ans(
    a.energyValue.trim()
      ? `${a.energyValue.trim()} kWh/(m²a) – ${a.energyKind === 'bedarf' ? 'Endenergiebedarfskennwert' : 'Energieverbrauchskennwert'}${a.energyDecentralWater ? ', ohne (dezentrales) Warmwasser' : ''}`
      : 'nicht bekannt – Heizkostenabrechnung bzw. Energieausweis liegt bei bzw. wird nachgereicht',
  );
  l.gap(4);

  q('VI.', 'Im Hinblick auf § 5 Wirtschaftsstrafgesetz: Waren Sie gezwungen, diese Wohnung trotz der hohen Miete anzumieten, weil günstiger Wohnraum nicht zur Verfügung stand? Könnten Sie die Erfolglosigkeit anderweitiger Wohnungsbewerbungen beweisen?');
  l.choices(yn(a.wistg), qx + 8, SIZE);
  l.gap(4);

  q('VII.', 'Ihre Daten');
  const t = a.tenant;
  ans(`Name: ${value(t.name)}${form.asksMemberNo ? `     Mitgliedsnummer: ${t.memberNo || '–'}` : ''}`);
  ans(`Anschrift: ${value([t.street, [t.zip, t.city].filter(Boolean).join(' ')].filter(Boolean).join(', '))}`);
  ans(`E-Mail: ${value(t.email)}`);
  ans(`Telefon: ${value(t.phone)}${t.reachable ? `, erreichbar am günstigsten um ${t.reachable} Uhr` : ''}`);
  if (a.flatDiffers) {
    ans(`Anschrift der zu prüfenden Wohnung: ${[a.flat.street, [a.flat.zip, a.flat.city].filter(Boolean).join(' '), a.flat.detail].filter(Boolean).join(', ')}`);
  }
  l.gap(6);
  l.text(
    'Ihre hier angegebenen persönlichen Daten werden zur Überprüfung der Miethöhe bis auf Widerruf verarbeitet und gespeichert. Selbstverständlich werden Ihre Kontaktdaten vertraulich behandelt und nicht an Dritte weitergegeben. Widerspruchsrecht: Sie können jederzeit und ohne Angabe von Gründen von Ihrem Widerspruchsrecht Gebrauch machen und die Bearbeitung und Speicherung der im Rahmen der Mietpreisüberprüfung übersandten Daten mit Wirkung für die Zukunft abändern oder gänzlich widerrufen. Das kann formlos per E-Mail an bmv@berliner-mieterverein.de erfolgen.',
    { size: 7.5, color: DARK },
  );

  /* ---------------- 2015: Sondermerkmale ---------------- */
  if (form.sonder) {
    l.newPage();
    l.text('Baualtersspezifische Sondermerkmale (Mietspiegel 2015)', { size: 13, bold: true });
    l.gap(4);
    for (const s of form.sonder) {
      l.ensure(36);
      const y0 = l.y;
      const h = l.textAt(s.de, l.left, y0, l.width - 110, { size: SIZE });
      l.textAt(`Zuschläge: ${s.zuschlaege}`, l.left, y0 - h, l.width - 110, { size: 7.5, color: DARK });
      const v = a.sonder[s.id] ?? '';
      l.textAt('vorhanden', l.right - 95, y0, 90, { size: 8, bold: true });
      l.checkbox(l.right - 95, y0 - 13, v === 'ja');
      l.textAt('ja', l.right - 83, y0 - 12, 30, { size: 8.5 });
      l.checkbox(l.right - 55, y0 - 13, v === 'nein');
      l.textAt('nein', l.right - 43, y0 - 12, 40, { size: 8.5 });
      l.y = y0 - Math.max(h + 12, 30);
      l.hline(l.y + 4, l.left, l.right, 0.3, GREY);
    }
    l.gap(6);
    l.text(
      'Beachten Sie: Wenn bei Vorliegen eines oder mehrerer Sondermerkmale der Oberwert des entsprechenden Mietspiegelfeldes überschritten oder der Unterwert unterschritten wird, ist dies der verbindliche ortsübliche Wert nach dem Berliner Mietspiegel. Eine Spanneneinordnung mithilfe der Orientierungshilfe ist dann nicht mehr zulässig.',
      { size: 8, color: DARK },
    );
  }

  /* ---------------- Orientierungshilfe ---------------- */
  l.newPage();
  l.text('Orientierungshilfe für die Spanneneinordnung', { size: 15, bold: true });
  l.text(
    'Soweit der Mieter selbst Ein- oder Umbauten in der Wohnung und am Haus vorgenommen hat, ist dies bei den jeweiligen Ausstattungsmerkmalen ausdrücklich vermerkt. Es muss in diesem Fall bei der Spanneneinordnung auf den Zustand vor den Ein- oder Umbauten abgestellt werden.',
    { size: 8.5, italic: true },
  );
  l.gap(6);

  const ctx = conditionContext(a);
  const colW = (l.width - 6) / 2;
  const cbW = 14;

  function cell(m: Merkmal | undefined, x: number, yTop: number, render: boolean): number {
    if (!m) return 0;
    const state = merkmalState(m, a, ctx);
    const excluded = state === 'excluded';
    const notes: string[] = [];
    if (excluded) notes.push('entfällt für dieses Baujahr / wegen Sondermerkmal');
    if (state === 'yes' && a.selfInstalled[m.id]) notes.push('vom Mieter selbst eingebaut – nicht berücksichtigen');
    if (state === 'unsure') notes.push('Mieter:in unsicher – bitte prüfen');
    const fu = state === 'yes' || state === 'unsure' ? followUpAnswer(m, a) : '';
    if (fu) notes.push(`Angabe: ${fu}`);
    const tw = colW - cbW - 8;
    const color = excluded ? rgb(0.55, 0.55, 0.55) : undefined;
    let h = render ? l.textAt(m.de, x + cbW + 4, yTop - 3, tw, { size: 8, lineHeight: 9.6, color }) : l.measure(m.de, { size: 8, lineHeight: 9.6, width: tw });
    for (const n of notes) {
      h += render
        ? l.textAt(n, x + cbW + 4, yTop - 3 - h, tw, { size: 7.5, italic: true, lineHeight: 9, color: rgb(0.1, 0.2, 0.55) })
        : l.measure(n, { size: 7.5, italic: true, lineHeight: 9, width: tw });
    }
    if (render) l.checkbox(x + 4, yTop - 4, state === 'yes' && !a.selfInstalled[m.id], 8);
    return h + 6;
  }

  form.groups.forEach((g, gi) => {
    const minus = g.merkmale.filter((m) => m.sign === '-');
    const plus = g.merkmale.filter((m) => m.sign === '+');
    l.ensure(70);
    l.text(g.titleDe, { size: 12.5, bold: true });
    l.gap(2);

    // Tabellenkopf
    const headH = 16;
    l.box(l.left, l.y, colW, headH, GREY);
    l.box(l.left + colW + 6, l.y, colW, headH, GREY);
    l.textAt('Wohnwertmindernde Merkmale (-)', l.left + 4, l.y - 3, colW - 8, { size: 9, bold: true });
    l.textAt('Wohnwerterhöhende Merkmale (+)', l.left + colW + 10, l.y - 3, colW - 8, { size: 9, bold: true });
    l.y -= headH;

    const rows = Math.max(minus.length, plus.length);
    for (let i = 0; i < rows; i++) {
      const h = Math.max(cell(minus[i], l.left, l.y, false), cell(plus[i], l.left + colW + 6, l.y, false), 14);
      if (l.y - h < l.bottom) {
        l.newPage();
        l.text(`${g.titleDe} (Fortsetzung)`, { size: 10, bold: true });
      }
      const y0 = l.y;
      l.box(l.left, y0, colW, h, undefined);
      l.box(l.left + colW + 6, y0, colW, h, undefined);
      cell(minus[i], l.left, y0, true);
      cell(plus[i], l.left + colW + 6, y0, true);
      l.y = y0 - h;
    }

    for (const note of g.notesDe ?? []) {
      l.gap(2);
      l.text(note, { size: 7.5, color: DARK });
    }
    l.ensure(26);
    l.gap(2);
    l.box(l.left, l.y, l.width, 22, LIGHT);
    l.textAt('Nur von der Beraterin oder dem Berater auszufüllen:', l.left + 4, l.y - 2, l.width - 8, { size: 7, color: DARK });
    l.textAt(`Zwischenergebnis ${gi + 1}`, l.left + 4, l.y - 11, l.width - 8, { size: 8.5, bold: true });
    l.y -= 22;
    l.gap(12);
  });

  /* ---------------- Weitere Bemerkungen ---------------- */
  l.ensure(80);
  l.text('Weitere Bemerkungen:', { size: 13, bold: true });
  l.gap(2);
  const remarks: string[] = [];
  if (a.remarks.trim()) remarks.push(a.remarks.trim());
  const unsure = form.groups.flatMap((g) => g.merkmale.filter((m) => merkmalState(m, a, ctx) === 'unsure'));
  if (unsure.length) {
    remarks.push('Bei folgenden Merkmalen ist sich die Mieterin/der Mieter unsicher (nicht angekreuzt):\n' + unsure.map((m) => `- ${m.de}`).join('\n'));
  }
  const self = form.groups.flatMap((g) => g.merkmale.filter((m) => a.features[m.id] === 'yes' && a.selfInstalled[m.id]));
  if (self.length) {
    remarks.push('Vom Mieter selbst eingebaut / bezahlt (nicht angekreuzt):\n' + self.map((m) => `- ${m.de}`).join('\n'));
  }
  if (remarks.length) {
    l.text(remarks.join('\n\n'), { size: SIZE });
  } else {
    for (let i = 0; i < 6; i++) {
      l.gap(16);
      l.hline(l.y, l.left, l.right, 0.4, GREY);
    }
  }

  /* ---------------- Fußzeilen ---------------- */
  l.footers((page, i, total) => {
    const f = l.regular;
    const s1 = `Berliner Mietspiegel ${year}`;
    page.drawText(s1, { x: l.left, y: 10 * MM, size: 8, font: l.bold });
    const s2 = `Seite ${i + 1} von ${total}`;
    page.drawText(s2, { x: l.right - f.widthOfTextAtSize(s2, 8), y: 10 * MM, size: 8, font: f });
    const s3 = 'Ausgefüllt mit „MietCheck Berlin“ nach dem Prüfbogen 169A des Berliner Mietervereins – kein Originalvordruck.';
    page.drawText(l.clean(s3), { x: l.left, y: 6.5 * MM, size: 6.5, font: f, color: DARK });
  });

  return l.save();
}
