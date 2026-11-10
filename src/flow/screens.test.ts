import type { TFunction } from 'i18next';
import { describe, expect, it, vi } from 'vitest';
import { initialAnswers, type Answers } from '../state/answers';
import { buildScreens } from './screens';

// i18n greift beim Import auf localStorage und document zu; die Bildschirme werden hier nicht gerendert
vi.mock('../i18n', () => ({ featureText: () => ({}) }));

const t = ((k: string) => k) as unknown as TFunction;

const complete: Answers = {
  ...initialAnswers,
  contractDate: '2024-03-01',
  rentStart: '2024-04',
  rent: '950',
  indexRent: 'nein',
  staffelRent: 'nein',
  municipal: 'nein',
  landlordDisclosed: 'unsicher',
  buildYear: '1910',
  area: '62,5',
  wohnlage: 'mittlere',
  position: 'Vorderhaus',
  floor: '2',
  attic: 'nein',
  modernizedOld: 'nein',
  smallHouse: 'nein',
  wistg: 'nein',
  tenant: { ...initialAnswers.tenant, name: 'Mia Muster', street: 'Musterstraße 1', zip: '10999', city: 'Berlin' },
  landlord: { name: 'Haus GmbH', street: 'Allee 2', zip: '10115', city: 'Berlin' },
};

const blocked = (a: Answers) => buildScreens(a, t).filter((s) => s.blocked).map((s) => s.id);

describe('Pflichtfragen', () => {
  it('sperren nichts, wenn alles für die PDFs Nötige beantwortet ist', () => {
    expect(blocked(complete)).toEqual([]);
  });

  it('sperren unbeantwortete Pflichtfragen, Merkmale und optionale Angaben bleiben überspringbar', () => {
    const ids = blocked({ ...complete, rent: '', wistg: '', row: '', features: {} });
    expect(ids).toEqual(['contract.rent', 'remarks.wistg']);
  });

  it('verlangen den Wortlaut, wenn der Vermieter eine Ausnahme mitgeteilt hat', () => {
    expect(blocked({ ...complete, landlordDisclosed: 'ja' })).toEqual(['exceptions.disclosed']);
    expect(blocked({ ...complete, landlordDisclosed: 'ja', landlordExceptions: { ...complete.landlordExceptions, neubau: true } })).toEqual([]);
  });

  it('verlangen vollständige Anschriften und ungültige Zahlen gelten als unbeantwortet', () => {
    expect(blocked({ ...complete, area: 'groß', landlord: { ...complete.landlord, zip: '' } })).toEqual(['flat.area', 'persons.landlord']);
  });

  it('fragen Ost/West nur bei Baujahren 1973–1990 und dann verpflichtend', () => {
    expect(blocked({ ...complete, buildYear: '1980' })).toEqual(['flat.east']);
  });

  it('sperren die PDF-Kapitel mit Liste der offenen Kapitel', () => {
    const summary = buildScreens({ ...complete, rent: '', wistg: '' }, t).find((s) => s.id === 'summary.download');
    expect(summary?.element).toMatchObject({ props: { missing: ['contract', 'remarks'] } });
  });
});
