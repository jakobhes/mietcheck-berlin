import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb, type RGB } from 'pdf-lib';

export const A4: [number, number] = [595.28, 841.89];
export const MM = 72 / 25.4;

export interface TextOpts {
  size?: number;
  bold?: boolean;
  italic?: boolean;
  color?: RGB;
  x?: number;
  width?: number;
  lineHeight?: number;
  align?: 'left' | 'right' | 'center';
}

const REPLACEMENTS: Record<string, string> = {
  '−': '-', // Minuszeichen
  '→': '->',
  '←': '<-',
  '≤': '<=',
  '≥': '>=',
  ' ': ' ',
  ' ': ' ',
  ' ': ' ',
};

/**
 * Einfache Layout-Hilfe für pdf-lib mit Standardschrift (WinAnsi):
 * Zeilenumbruch, automatischer Seitenumbruch, Kopf-/Fußzeilen.
 */
export class Layout {
  pdf!: PDFDocument;
  regular!: PDFFont;
  bold!: PDFFont;
  italic!: PDFFont;
  page!: PDFPage;
  y = 0;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
  private charset = new Set<number>();
  onNewPage?: (l: Layout) => void;

  constructor(margins = { left: 20 * MM, right: 18 * MM, top: 18 * MM, bottom: 20 * MM }) {
    this.left = margins.left;
    this.right = A4[0] - margins.right;
    this.top = A4[1] - margins.top;
    this.bottom = margins.bottom;
  }

  static async create(onNewPage?: (l: Layout) => void, margins?: ConstructorParameters<typeof Layout>[0]): Promise<Layout> {
    const l = new Layout(margins);
    l.pdf = await PDFDocument.create();
    l.regular = await l.pdf.embedFont(StandardFonts.Helvetica);
    l.bold = await l.pdf.embedFont(StandardFonts.HelveticaBold);
    l.italic = await l.pdf.embedFont(StandardFonts.HelveticaOblique);
    l.charset = new Set(l.regular.getCharacterSet());
    l.onNewPage = onNewPage;
    l.newPage();
    return l;
  }

  get width(): number {
    return this.right - this.left;
  }

  newPage(): void {
    this.page = this.pdf.addPage(A4);
    this.y = this.top;
    this.onNewPage?.(this);
  }

  /** Sorgt dafür, dass `h` Punkte Platz sind, sonst neue Seite. */
  ensure(h: number): void {
    if (this.y - h < this.bottom) this.newPage();
  }

  /** Ersetzt Zeichen, die die Standardschrift nicht kennt. */
  clean(s: string): string {
    let out = '';
    for (const ch of s) {
      const r = REPLACEMENTS[ch];
      if (r !== undefined) {
        out += r;
        continue;
      }
      const cp = ch.codePointAt(0)!;
      if (ch === '\n' || this.charset.has(cp)) out += ch;
      else out += '?';
    }
    return out;
  }

  font(o: TextOpts): PDFFont {
    return o.bold ? this.bold : o.italic ? this.italic : this.regular;
  }

  /** Bricht Text in Zeilen um, die in `width` passen. */
  wrap(text: string, width: number, font: PDFFont, size: number): string[] {
    const lines: string[] = [];
    for (const para of this.clean(text).split('\n')) {
      const words = para.split(/ +/);
      let line = '';
      for (const w of words) {
        const candidate = line ? `${line} ${w}` : w;
        if (font.widthOfTextAtSize(candidate, size) <= width) {
          line = candidate;
          continue;
        }
        if (line) lines.push(line);
        // sehr lange Wörter hart umbrechen
        let rest = w;
        while (font.widthOfTextAtSize(rest, size) > width && rest.length > 1) {
          let i = rest.length - 1;
          while (i > 1 && font.widthOfTextAtSize(rest.slice(0, i), size) > width) i--;
          lines.push(rest.slice(0, i));
          rest = rest.slice(i);
        }
        line = rest;
      }
      lines.push(line);
    }
    return lines;
  }

  measure(text: string, o: TextOpts = {}): number {
    const size = o.size ?? 10;
    const lh = o.lineHeight ?? size * 1.3;
    return this.wrap(text, o.width ?? this.width, this.font(o), size).length * lh;
  }

  /** Schreibt Text am aktuellen y (fließend, mit Seitenumbruch). Gibt die Höhe zurück. */
  text(text: string, o: TextOpts = {}): number {
    const size = o.size ?? 10;
    const lh = o.lineHeight ?? size * 1.3;
    const font = this.font(o);
    const x0 = o.x ?? this.left;
    const width = o.width ?? this.right - x0;
    const lines = this.wrap(text, width, font, size);
    for (const line of lines) {
      this.ensure(lh);
      let x = x0;
      if (o.align === 'right') x = x0 + width - font.widthOfTextAtSize(line, size);
      if (o.align === 'center') x = x0 + (width - font.widthOfTextAtSize(line, size)) / 2;
      this.page.drawText(line, { x, y: this.y - size, size, font, color: o.color ?? rgb(0, 0, 0) });
      this.y -= lh;
    }
    return lines.length * lh;
  }

  /** Text an fester Position ohne Fluss (für Spalten in Tabellen). Gibt die Höhe zurück. */
  textAt(text: string, x: number, y: number, width: number, o: TextOpts = {}): number {
    const size = o.size ?? 10;
    const lh = o.lineHeight ?? size * 1.3;
    const font = this.font(o);
    const lines = this.wrap(text, width, font, size);
    lines.forEach((line, i) => {
      this.page.drawText(line, { x, y: y - size - i * lh, size, font, color: o.color ?? rgb(0, 0, 0) });
    });
    return lines.length * lh;
  }

  gap(h: number): void {
    this.y -= h;
  }

  checkbox(x: number, yTop: number, checked: boolean, size = 8): void {
    this.page.drawRectangle({ x, y: yTop - size, width: size, height: size, borderColor: rgb(0, 0, 0), borderWidth: 0.7 });
    if (checked) {
      const p = 1.5;
      this.page.drawLine({ start: { x: x + p, y: yTop - p }, end: { x: x + size - p, y: yTop - size + p }, thickness: 1.1 });
      this.page.drawLine({ start: { x: x + p, y: yTop - size + p }, end: { x: x + size - p, y: yTop - p }, thickness: 1.1 });
    }
  }

  /** Mehrere Auswahloptionen in einer Zeile: [x] a  [ ] b */
  choices(options: { label: string; checked: boolean }[], x: number, size = 10): void {
    this.ensure(size * 1.4);
    let cx = x;
    for (const o of options) {
      this.checkbox(cx, this.y - 1, o.checked, size * 0.85);
      cx += size * 0.85 + 4;
      const label = this.clean(o.label);
      this.page.drawText(label, { x: cx, y: this.y - size, size, font: this.regular });
      cx += this.regular.widthOfTextAtSize(label, size) + 14;
    }
    this.y -= size * 1.4;
  }

  hline(y = this.y, x1 = this.left, x2 = this.right, thickness = 0.5, color = rgb(0, 0, 0)): void {
    this.page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness, color });
  }

  box(x: number, yTop: number, w: number, h: number, fill?: RGB, border = true): void {
    this.page.drawRectangle({
      x,
      y: yTop - h,
      width: w,
      height: h,
      color: fill,
      borderColor: border ? rgb(0, 0, 0) : undefined,
      borderWidth: border ? 0.6 : 0,
    });
  }

  /** Fußzeilen auf allen Seiten nachträglich (für „Seite x von y“). */
  footers(render: (page: PDFPage, index: number, total: number) => void): void {
    const pages = this.pdf.getPages();
    pages.forEach((p, i) => render(p, i, pages.length));
  }

  async save(): Promise<Uint8Array> {
    return this.pdf.save();
  }
}

export const GREY = rgb(0.85, 0.85, 0.85);
export const LIGHT = rgb(0.94, 0.94, 0.94);
export const DARK = rgb(0.35, 0.35, 0.35);
