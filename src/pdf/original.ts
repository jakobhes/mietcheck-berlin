/**
 * Füllt den Original-Prüfbogen 169A des BMV aus (public/forms/169A-<jahr>.pdf), statt ihn nachzubauen.
 * - 2015–2024 sind PDF-Formulare: Felder setzen, danach fest einbrennen (flatten).
 * - 2026 hat keine Formularfelder: Kreuze und Text werden an die vermessenen Stellen gezeichnet,
 *   Nichtzutreffendes wird wie im Bogen verlangt gestrichen.
 * Welche Stelle zu welcher Angabe gehört, steht in original-fields.json (aus Feldpositionen und Wortlaut erzeugt).
 */
import { PDFCheckBox, PDFDocument, PDFRadioGroup, PDFRef, PDFTextField, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { formatDateDe, parseNumber } from '../data/logic';
import type { RentCalculation } from '../data/mietspiegel';
import type { FormId, FormVersion, SonderId } from '../data/types';
import type { Answers } from '../state/answers';
import { conditionContext, merkmalState } from '../state/derive';
import { toWinAnsi } from './layout';
import fieldsJson from './original-fields.json';

/** Formularfeld: Name eines Kästchens bzw. Textfelds oder eine Option eines Optionsfelds */
type FieldRef = string | { radio: string; value: string };
/** Wort bzw. Kästchen auf der Seite (pt, von oben links); `mark: 'x'` = ankreuzen statt streichen */
interface Box {
  page: number;
  x: number;
  top: number;
  w: number;
  h: number;
  mark?: 'x';
}
/** Schreiblinie: Text beginnt bei `x` auf der Grundlinie `base` (pt von oben), höchstens `w` breit */
interface Spot {
  page: number;
  x: number;
  base: number;
  w: number;
}

type TextKey =
  | 'date'
  | 'contractDate'
  | 'buildYear'
  | 'area'
  | 'row'
  | 'column'
  | 'rent'
  | 'floor'
  | 'modernizedWhen'
  | 'energyValue'
  | 'name'
  | 'memberNo'
  | 'street'
  | 'zip'
  | 'zipCity'
  | 'address'
  | 'email'
  | 'phone'
  | 'reachable'
  | 'flatStreet'
  | 'flatZip'
  | 'flatAddress'
  | 'remarks';

interface AcroMapping {
  kind: 'acro';
  /** mehrere Feldnamen = Text wird auf mehrere Zeilenfelder verteilt */
  texts: Partial<Record<TextKey, string | string[]>>;
  choices: Record<string, FieldRef>;
  merkmale: Record<string, string>;
  sonder?: Partial<Record<SonderId, { ja: FieldRef; nein: FieldRef }>>;
}

interface OverlayMapping {
  kind: 'overlay';
  texts: Partial<Record<TextKey, Spot | Spot[]>>;
  choices: Record<string, Box>;
  merkmale: Record<string, Box>;
}

type Mapping = AcroMapping | OverlayMapping;

/** Antworten mit den abgeleiteten Merkmalen, die das Ausfüllen braucht */
type Filled = Answers & { merkmalYes: Set<string>; unsureMerkmale: string[] };

export const ORIGINAL_FIELDS = fieldsJson as Record<FormId, Mapping>;

const YES_NO = ['indexRent', 'staffelRent', 'municipal', 'attic', 'modernizedOld', 'smallHouse', 'wistg'] as const;
const INK = rgb(0, 0, 0);

export function originalUrl(form: FormVersion): string {
  return `${import.meta.env.BASE_URL}forms/169A-${form.id}.pdf`;
}

/** Original-PDF laden (im Browser) */
export async function loadOriginal(form: FormVersion): Promise<ArrayBuffer> {
  const res = await fetch(originalUrl(form));
  if (!res.ok) throw new Error(`Prüfbogen ${form.id} nicht gefunden (${res.status})`);
  return res.arrayBuffer();
}

/** Texte für die Schreibfelder */
function texts(a: Filled, today: string, withRemarks: boolean): Record<TextKey, string> {
  const t = a.tenant;
  const year = Number(a.buildYear);
  const zipCity = [t.zip, t.city].filter(Boolean).join(' ');
  const flatZipCity = [a.flat.zip, a.flat.city].filter(Boolean).join(' ');
  const unsure = withRemarks ? a.unsureMerkmale : [];
  return {
    date: formatDateDe(today),
    contractDate: formatDateDe(a.contractDate),
    buildYear: a.buildYear + (year >= 1973 && year <= 1990 && a.east ? ` (${a.east === 'ja' ? 'Ost' : 'West'})` : ''),
    area: a.area,
    row: a.row,
    column: a.column,
    rent: a.rent,
    floor: a.floor,
    modernizedWhen: a.modernizedOld === 'ja' ? a.modernizedWhen : '',
    energyValue: a.energyValue.trim() ? a.energyValue.trim() + (a.energyKind === 'bedarf' ? ' (Bedarf)' : '') : '',
    name: t.name,
    memberNo: t.memberNo,
    street: t.street,
    zip: t.zip,
    zipCity,
    address: [t.street, zipCity].filter(Boolean).join(', '),
    email: t.email,
    phone: t.phone,
    reachable: t.reachable,
    flatStreet: a.flatDiffers ? [a.flat.street, a.flat.detail].filter(Boolean).join(', ') : '',
    flatZip: a.flatDiffers ? a.flat.zip : '',
    flatAddress: a.flatDiffers ? [a.flat.street, flatZipCity, a.flat.detail].filter(Boolean).join(', ') : '',
    remarks: [
      withRemarks ? a.remarks.trim() : '',
      unsure.length ? `Bei folgenden Merkmalen ist sich die Mieterin/der Mieter unsicher (nicht angekreuzt):\n${unsure.map((m) => `- ${m}`).join('\n')}` : '',
    ]
      .filter(Boolean)
      .join('\n\n'),
  };
}

/** Gewählte Optionen als `<frage>.<antwort>`, z. B. `wohnlage.einfache`, `equipment.badWC`, `attic.nein` */
function selectedChoices(a: Answers): Set<string> {
  const keys: string[] = [];
  if (a.wohnlage) keys.push(`wohnlage.${a.wohnlage}`);
  if (a.position) keys.push(`position.${a.position}`);
  for (const [k, v] of Object.entries(a.equipment)) if (v) keys.push(`equipment.${k}`);
  for (const k of YES_NO) if (a[k]) keys.push(`${k}.${a[k]}`);
  return new Set(keys);
}

const prefix = (key: string) => key.slice(0, key.indexOf('.'));

/** Schriftgröße, damit `text` in `width` passt */
function fitSize(font: PDFFont, text: string, width: number, max = 10, min = 5): number {
  const w = font.widthOfTextAtSize(text, 1);
  return w === 0 ? max : Math.max(min, Math.min(max, (width - 4) / w));
}

/** Zeilenumbruch nach Breite (für Bemerkungen auf mehreren Linien) */
function wrap(font: PDFFont, text: string, width: number, size: number): string[] {
  const lines: string[] = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const word of para.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (line && font.widthOfTextAtSize(next, size) > width) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    lines.push(line);
  }
  return lines;
}

/** Schwarzes X mittig in ein Kästchen (PDF-Koordinaten: x/y unten links) */
function drawCross(page: PDFPage, x: number, y: number, w: number, h: number) {
  const s = Math.min(w, h) * 0.7;
  const cx = x + w / 2;
  const cy = y + h / 2;
  page.drawLine({ start: { x: cx - s / 2, y: cy - s / 2 }, end: { x: cx + s / 2, y: cy + s / 2 }, thickness: 1.2, color: INK });
  page.drawLine({ start: { x: cx - s / 2, y: cy + s / 2 }, end: { x: cx + s / 2, y: cy - s / 2 }, thickness: 1.2, color: INK });
}

function fillAcro(pdf: PDFDocument, map: AcroMapping, a: Filled, values: Record<TextKey, string>, font: PDFFont, clean: (s: string) => string) {
  const form = pdf.getForm();
  // Vorbelegungen im Original (z. B. ausgewählte Optionsfelder) entfernen
  for (const f of form.getFields()) {
    if (f instanceof PDFCheckBox) f.uncheck();
    else if (f instanceof PDFRadioGroup) f.clear();
    else if (f instanceof PDFTextField) f.setText('');
  }
  // statt der Häkchen/Punkte des Originals ein schwarzes X an die Stelle des Kästchens zeichnen (nach dem Einbrennen)
  const crosses: { page: PDFPage; rect: { x: number; y: number; width: number; height: number } }[] = [];
  const set = (ref: FieldRef) => {
    const widgets = typeof ref === 'string' ? form.getCheckBox(ref).acroField.getWidgets() : form.getRadioGroup(ref.radio).acroField.getWidgets();
    // bei Optionsfeldern das Kästchen der Option (über seinen Wert, nicht den Exportwert – der ist in manchen Originalen überall „Ja“)
    const widget = typeof ref === 'string' ? widgets[0] : widgets.find((w) => w.getOnValue()?.decodeText() === ref.value);
    if (!widget) throw new Error(`Option ${JSON.stringify(ref)} fehlt im Original`);
    const page = pdf.findPageForAnnotationRef(pdf.context.getObjectRef(widget.dict)!);
    if (!page) throw new Error(`Seite für ${JSON.stringify(ref)} nicht gefunden`);
    crosses.push({ page, rect: widget.getRectangle() });
  };
  const write = (name: string, text: string, multiline = false) => {
    const field = form.getTextField(name);
    const width = field.acroField.getWidgets()[0].getRectangle().width;
    if (multiline) {
      field.enableMultiline();
      field.setFontSize(8);
    } else field.setFontSize(fitSize(font, text, width));
    field.setText(text);
  };

  for (const [key, ref] of Object.entries(map.choices)) if (selectedChoices(a).has(key)) set(ref);
  for (const [id, name] of Object.entries(map.merkmale)) if (a.merkmalYes.has(id)) set(name);
  for (const [id, refs] of Object.entries(map.sonder ?? {})) {
    const v = a.sonder[id as SonderId];
    if (v) set(refs[v]);
  }
  for (const [key, target] of Object.entries(map.texts) as [TextKey, string | string[]][]) {
    const text = clean(values[key] ?? '');
    if (!text) continue;
    if (Array.isArray(target)) {
      const width = form.getTextField(target[0]).acroField.getWidgets()[0].getRectangle().width - 4;
      wrap(font, text, width, 9)
        .slice(0, target.length)
        .forEach((line, i) => write(target[i], line));
    } else write(target, text, key === 'remarks');
  }
  form.updateFieldAppearances(font);
  form.flatten();
  // flatten() lässt in manchen Originalen Verweise auf die gelöschten Felder in /Annots stehen
  for (const page of pdf.getPages()) {
    const annots = page.node.Annots();
    for (let i = (annots?.size() ?? 0) - 1; i >= 0; i--) {
      const ref = annots!.get(i);
      if (ref instanceof PDFRef && !pdf.context.lookup(ref)) annots!.remove(i);
    }
  }
  for (const { page, rect } of crosses) drawCross(page, rect.x, rect.y, rect.width, rect.height);
}

function fillOverlay(pages: PDFPage[], map: OverlayMapping, a: Filled, values: Record<TextKey, string>, font: PDFFont, clean: (s: string) => string) {
  const at = (b: { page: number }) => pages[b.page];
  const cross = (b: Box) => drawCross(at(b), b.x, at(b).getHeight() - b.top - b.h, b.w, b.h);
  const strike = (b: Box) => {
    const page = at(b);
    const y = page.getHeight() - (b.top + b.h * 0.55);
    page.drawLine({ start: { x: b.x - 1, y }, end: { x: b.x + b.w + 1, y }, thickness: 0.9, color: INK });
  };
  const write = (s: Spot, text: string) => {
    const page = at(s);
    page.drawText(text, { x: s.x + 2, y: page.getHeight() - s.base, size: fitSize(font, text, s.w), font, color: INK });
  };

  // Nichtzutreffendes streichen – nur bei beantworteten Fragen; Ja ( ) Nein ( ) wird angekreuzt
  const selected = selectedChoices(a);
  const answered = new Set([...selected].map(prefix));
  for (const [key, box] of Object.entries(map.choices)) {
    if (box.mark === 'x') {
      if (selected.has(key)) cross(box);
    } else if (answered.has(prefix(key)) && !selected.has(key)) strike(box);
  }
  for (const [id, box] of Object.entries(map.merkmale)) if (a.merkmalYes.has(id)) cross(box);
  for (const [key, target] of Object.entries(map.texts) as [TextKey, Spot | Spot[]][]) {
    const text = clean(values[key] ?? '');
    if (!text) continue;
    if (Array.isArray(target)) {
      wrap(font, text, target[0].w - 4, 9)
        .slice(0, target.length)
        .forEach((line, i) => {
          const page = at(target[i]);
          page.drawText(line, { x: target[i].x + 2, y: page.getHeight() - target[i].base, size: 9, font, color: INK });
        });
    } else write(target, text);
  }
}

const euro = (n: number) => `${n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

/** Zusätzliche letzte Seite: Ergebnis der Berechnung; ohne Berechnung bleiben die Rechenwerte zum Ausfüllen frei */
async function addSummaryPage(pdf: PDFDocument, form: FormVersion, a: Answers, calc: RentCalculation | undefined, font: PDFFont, clean: (s: string) => string) {
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = pdf.getPage(0).getSize();
  const page = pdf.addPage([width, height]);
  const left = 70;
  const right = width - 70;
  const valueX = 340;
  const rent = parseNumber(a.rent);
  const area = calc?.area ?? parseNumber(a.area);
  const rows: [label: string, value: string, strong?: boolean][] = [
    ['Name der Mieterin/des Mieters:', a.tenant.name.trim()],
    ['Mietvertrag vom:', formatDateDe(a.contractDate)],
    ['Mietspiegel (Jahr):', form.id],
    ['Ortsübliche Vergleichsmiete pro qm:', calc ? `${euro(calc.ovmPerSqm)}/m²` : ''],
    ['Wohnungsgröße:', area !== undefined ? `${area.toLocaleString('de-DE')} m²` : ''],
    ['Ortsübliche Vergleichsmiete pro Monat:', calc ? euro(calc.ovm) : ''],
    ['+10%:', calc ? euro(calc.maxRent - calc.ovm) : ''],
    ['Höchstzulässige monatliche Nettokaltmiete:', calc ? euro(calc.maxRent) : '', true],
    ['Derzeit verlangte Miete:', rent !== undefined ? euro(rent) : ''],
    ['Überzahlung pro Monat:', calc && rent !== undefined ? euro(Math.max(0, rent - calc.maxRent)) : '', true],
  ];
  let y = height - 90;
  page.drawText('Zusammenfassung', { x: left, y, size: 18, font: bold, color: INK });
  y -= 50;
  for (const [label, value, strong] of rows) {
    const f = strong ? bold : font;
    page.drawText(clean(label), { x: left, y, size: 11, font: f, color: INK });
    page.drawText(clean(value), { x: valueX + 4, y, size: 11, font: f, color: INK });
    page.drawLine({ start: { x: valueX, y: y - 4 }, end: { x: right, y: y - 4 }, thickness: 0.5, color: INK });
    y -= 40;
  }
}

/**
 * Original-Prüfbogen ausfüllen. `original`: Inhalt von public/forms/169A-<jahr>.pdf (siehe `loadOriginal`).
 * `remarks: false` lässt „Weitere Bemerkungen“ leer (Haus-Modus mit kurzem Ablauf).
 * `calc`: Berechnung der zulässigen Miete für die angehängte Zusammenfassung.
 */
export async function fillPruefbogen(
  original: ArrayBuffer | Uint8Array,
  form: FormVersion,
  answers: Answers,
  today: string,
  { remarks = true, calc }: { remarks?: boolean; calc?: RentCalculation } = {},
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(original);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const charset = new Set(font.getCharacterSet());
  const clean = (s: string) => toWinAnsi(s, charset);
  // wie im Original: nur zutreffende Merkmale ankreuzen; nicht anwendbare und unsichere bleiben leer
  const ctx = conditionContext(answers);
  const all = form.groups.flatMap((g) => g.merkmale);
  const a: Filled = {
    ...answers,
    merkmalYes: new Set(all.filter((m) => merkmalState(m, answers, ctx) === 'yes').map((m) => m.id)),
    unsureMerkmale: all.filter((m) => merkmalState(m, answers, ctx) === 'unsure').map((m) => m.de),
  };
  const values = texts(a, today, remarks);
  const map = ORIGINAL_FIELDS[form.id];
  if (map.kind === 'acro') fillAcro(pdf, map, a, values, font, clean);
  else fillOverlay(pdf.getPages(), map, a, values, font, clean);
  await addSummaryPage(pdf, form, answers, calc, font, clean);
  return pdf.save();
}
