import { readFileSync } from 'node:fs';
import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { FORMS } from '../data/forms';
import { initialAnswers, type Answers } from '../state/answers';
import { fillPruefbogen, ORIGINAL_FIELDS } from './original';

const original = (id: string) => readFileSync(`public/forms/169A-${id}.pdf`);

describe.each(FORMS.map((f) => f.id))('Original-Prüfbogen %s', (id) => {
  const form = FORMS.find((f) => f.id === id)!;
  const map = ORIGINAL_FIELDS[form.id];

  it('maps every merkmal and Sondermerkmal', () => {
    const ids = form.groups.flatMap((g) => g.merkmale.map((m) => m.id));
    expect(Object.keys(map.merkmale).sort()).toEqual([...ids].sort());
    if (form.sonder) expect(Object.keys(map.kind === 'acro' ? (map.sonder ?? {}) : {}).sort()).toEqual(form.sonder.map((s) => s.id).sort());
  });

  it('refers only to fields that exist in the original', async () => {
    if (map.kind !== 'acro') return;
    const names = new Set((await PDFDocument.load(original(id))).getForm().getFields().map((f) => f.getName()));
    const refs = [
      ...Object.values(map.merkmale),
      ...Object.values(map.texts).flat(),
      ...Object.values(map.choices),
      ...Object.values(map.sonder ?? {}).flatMap((r) => [r.ja, r.nein]),
    ].map((r) => (typeof r === 'string' ? r : r.radio));
    expect(refs.filter((n) => !names.has(n))).toEqual([]);
  });

  it('fills the original and keeps its pages', async () => {
    const a: Answers = {
      ...initialAnswers,
      contractDate: form.validFrom,
      buildYear: '1966',
      area: '68,5',
      wohnlage: 'einfache',
      attic: 'nein',
      features: { [form.groups[0].merkmale[0].id]: 'yes' },
      tenant: { ...initialAnswers.tenant, name: 'Erika Mustermann' },
    };
    const pdf = await PDFDocument.load(await fillPruefbogen(original(id), form, a, '2026-11-15'));
    expect(pdf.getPageCount()).toBe(6);
    // eingebrannt: keine Formularfelder mehr
    expect(pdf.getForm().getFields()).toHaveLength(0);
  });
});
