import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FORMS } from '../data/forms';
import { initialAnswers, type Answers } from '../state/answers';
import { buildPruefbogen } from './pruefbogen';
import { buildRuege, ruegeParagraphs } from './ruege';

/** Beispieldaten; mit PDF_OUT=<ordner> werden die PDFs zur Sichtprüfung gespeichert. */
function sample(formId: string): Answers {
  const form = FORMS.find((f) => f.id === formId)!;
  const features: Answers['features'] = {};
  form.groups.forEach((g) =>
    g.merkmale.forEach((m, i) => {
      features[m.id] = i % 4 === 0 ? 'yes' : i % 7 === 0 ? 'unsure' : 'no';
    }),
  );
  return {
    ...initialAnswers,
    contractDate: form.validFrom,
    rentStart: form.validFrom,
    rent: '1.250,00',
    indexRent: 'nein',
    staffelRent: 'ja',
    municipal: 'nein',
    buildYear: '1905',
    area: '68,5',
    wohnlage: 'mittlere',
    row: '12',
    column: 'B',
    equipment: { ...initialAnswers.equipment, badWC: true, sammelheizung: true },
    modernization: 'Neue Fenster 2019, Bad 2021',
    position: 'Seitenflügel',
    floor: '3',
    side: 'links',
    attic: 'nein',
    modernizedOld: 'ja',
    modernizedWhen: '2019',
    smallHouse: 'nein',
    energyValue: '182',
    sonder: { sm_kueche: 'ja', sm_aufzug: 'nein' },
    features,
    selfInstalled: { bad_kein_waschbecken: false, kueche_ohne_fenster: true },
    followUps: { entlueftungAlter: 'ca. 30 Jahre', raeumeEinfachfenster: 'Küche, Bad', laerm: 'tagsüber und nachts' },
    laermArt: { strasse: true, schiene: false, flug: true },
    remarks: 'Wohnfläche erscheint kleiner als angegeben.',
    wistg: 'ja',
    tenant: { name: 'Erika Mustermann', street: 'Musterstraße 12', zip: '10999', city: 'Berlin', email: 'erika@example.org', phone: '030 1234567', reachable: '18', memberNo: '' },
    landlord: { name: 'Muster Immobilien GmbH', street: 'Hauptstraße 1', zip: '10115', city: 'Berlin' },
    landlordDisclosed: 'ja',
    landlordDisclosedText: 'Die Vormiete habe 1.200 € betragen.',
  };
}

const OUT = process.env.PDF_OUT;

describe('PDF generation', () => {
  it.each(FORMS.map((f) => f.id))('Prüfbogen %s', async (id) => {
    const form = FORMS.find((f) => f.id === id)!;
    const bytes = await buildPruefbogen(form, sample(id), '2026-11-02');
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe('%PDF-');
    if (OUT) {
      mkdirSync(OUT, { recursive: true });
      writeFileSync(join(OUT, `pruefbogen-${id}.pdf`), bytes);
    }
  });

  it.each(FORMS.map((f) => f.id))('Rüge %s', async (id) => {
    const form = FORMS.find((f) => f.id === id)!;
    const bytes = await buildRuege(form, sample(id), '2026-11-02');
    expect(bytes.length).toBeGreaterThan(1000);
    if (OUT) writeFileSync(join(OUT, `ruege-${id}.pdf`), bytes);
  });

  it('Rüge text depends on contract date', () => {
    const form = FORMS.find((f) => f.id === '2026')!;
    const recent = ruegeParagraphs(form, { ...sample('2026'), contractDate: '2025-10-01', rentStart: '2025-11-01' }, '2026-11-02');
    expect(recent.paragraphs.join(' ')).toContain('ab Beginn des Mietverhältnisses');
    const old = ruegeParagraphs(FORMS.find((f) => f.id === '2019')!, { ...sample('2019'), contractDate: '2019-01-01', rentStart: '2019-02-01' }, '2026-11-02');
    expect(old.paragraphs.join(' ')).toContain('nach Zugang dieser Rüge');
  });

  it('survives non-Latin input', async () => {
    const form = FORMS.find((f) => f.id === '2026')!;
    const a = { ...sample('2026'), remarks: 'ملاحظة → test', tenant: { ...sample('2026').tenant, name: 'محمد' } };
    await expect(buildPruefbogen(form, a, '2026-11-02')).resolves.toBeInstanceOf(Uint8Array);
    await expect(buildRuege(form, a, '2026-11-02')).resolves.toBeInstanceOf(Uint8Array);
  });
});
