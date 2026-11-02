/**
 * Haus-Modus: Voreinstellungen für ein bestimmtes Gebäude (z. B. für eine Mieterversammlung).
 * Was für alle Wohnungen im Haus gleich ist, wird fest vorausgefüllt und nicht mehr gefragt.
 * Aktiviert wird der Modus über den Link `?haus=<id>` (siehe `activation.ts`).
 */
import { FORMS, getForm, selectFormVersion } from '../data/forms';
import { suggestEnergyMerkmal } from '../data/logic';
import type { FormId } from '../data/types';
import type { Answers, FeatureAnswer, HouseVariant } from '../state/answers';

export interface HousePreset {
  id: string;
  name: string;
  street: string;
  zip: string;
  city: string;
  houseNumbers: string[];
  /** fest vorgegebene Antworten; die zugehörigen Bildschirme entfallen */
  fixed: (a: Answers) => Partial<Answers>;
  /** Bildschirme, deren Antwort über `fixed` feststeht */
  hiddenScreens: string[];
  /** Vorbelegung beim Auswählen von Aufgang/Zustand, bleibt änderbar */
  defaults: (a: Answers) => Partial<Answers>;
  /**
   * Merkmale je Zustand der Wohnung, bezogen auf den Prüfbogen 2026:
   * `yes` = angekreuzt, `ask` = wird gefragt, alle übrigen Merkmale 2026 = „trifft nicht zu“.
   * Merkmale, die es nur in älteren Bögen gibt, werden weiter gefragt.
   */
  variants: Record<HouseVariant, { yes: string[]; ask: string[] }>;
  /** Merkmale, die es nur in älteren Bögen gibt und die nicht zutreffen */
  oldFormsNo: string[];
  /** Energieverbrauchskennwert für die Einordnung; die Stufe ergibt sich je Bogen aus dessen Grenzen */
  energyValue: number;
  /** zusätzlicher Hinweis bei einem Merkmal (UI-Übersetzungsschlüssel) */
  hints: Record<string, string>;
}

const BOTH_YES = ['gebaeude_treppenhaus_schlecht', 'gebaeude_fahrradraum', 'gebaeude_kein_keller'];

/** Excelsior, Stresemannstraße 68–76 (Baujahr 1966) */
const excelsior: HousePreset = {
  id: 'excelsior',
  name: 'Excelsior',
  street: 'Stresemannstraße',
  zip: '10963',
  city: 'Berlin',
  houseNumbers: ['68', '70', '72', '74', '76'],
  fixed: (a) => ({
    buildYear: '1966',
    east: '',
    wohnlage: 'einfache',
    position: 'Vorderhaus',
    attic: 'nein',
    modernizedOld: 'nein',
    smallHouse: 'nein',
    exNewBuild: 'nein',
    exSocialHousing: 'nein',
    municipal: 'nein',
    // gemessen nur in der 72; die übrigen Aufgänge sind vermutlich ähnlich (Einordnung mit `energyValue` unten)
    energyValue: a.houseNo === '72' ? '160' : '',
    energyKind: 'verbrauch',
    energyDecentralWater: false,
  }),
  hiddenScreens: [
    'contract.municipal',
    'exceptions.newBuild',
    'exceptions.socialHousing',
    'flat.buildYear',
    'flat.east',
    'flat.wohnlage',
    'flat.position',
    'flat.attic',
    'flat.modernizedOld',
    'flat.smallHouse',
    'energy.intro',
    'energy.value',
    'energy.kind',
  ],
  defaults: (a) => ({
    equipment: Object.values(a.equipment).some(Boolean) ? a.equipment : { ...a.equipment, badWC: true, fahrstuhl: true },
  }),
  variants: {
    unrenoviert: {
      yes: BOTH_YES,
      ask: [
        'bad_kein_waschbecken',
        'bad_wc_keine_lueftung',
        'bad_dielen',
        'bad_nicht_beheizbar',
        'bad_kein_warmwasser',
        'bad_freistehende_wanne',
        'bad_waende_nicht_gefliest',
        'bad_ohne_fenster',
        'bad_keine_dusche',
        'bad_klein',
        'bad_wandhaengendes_wc',
        'bad_strukturheizkoerper',
        'kueche_ohne_fenster',
        'kueche_kein_herd',
        'kueche_keine_spuele',
        'kueche_kein_warmwasser',
        'kueche_nicht_beheizbar',
        'kueche_kein_geschirrspueler',
        'kueche_keine_wandfliesen',
        'kueche_einbaukueche',
        'kueche_ceran',
        'kueche_dunstabzug',
        'kueche_kuehlschrank',
        'wohnung_einfachverglasung',
        'wohnung_elektro_unzureichend',
        'wohnung_elektro_aufputz',
        'wohnung_leitungen_aufputz',
        'wohnung_keine_waschmaschine',
        'wohnung_schlechter_schnitt',
        'wohnung_kein_balkon',
        'wohnung_eg_kein_einbruchschutz',
        'wohnung_einbauschrank',
        'wohnung_heizungsrohre',
        'wohnung_raum_40',
        'wohnung_barrierearm',
        'gebaeude_schwellenarm',
        'umfeld_laerm',
        'umfeld_geruch',
      ],
    },
    renoviert: {
      yes: [
        ...BOTH_YES,
        'kueche_einbaukueche',
        'kueche_ceran',
        'kueche_kuehlschrank',
        'wohnung_heizungsrohre',
        'wohnung_barrierearm',
        'wohnung_waermeschutzfenster',
        'gebaeude_schwellenarm',
      ],
      ask: [
        'bad_ohne_fenster',
        'bad_klein',
        'bad_innen_lueftung',
        'bad_wandhaengendes_wc',
        'bad_strukturheizkoerper',
        'kueche_ohne_fenster',
        'kueche_kein_herd',
        'kueche_kein_geschirrspueler',
        'kueche_keine_wandfliesen',
        'wohnung_keine_waschmaschine',
        'wohnung_einbauschrank',
        'wohnung_rolllaeden',
        'umfeld_laerm',
      ],
    },
  },
  // laut Anwalt: weder stark vernachlässigte Umgebung noch bevorzugte Citylage
  oldFormsNo: ['umfeld_vernachlaessigt', 'umfeld_citylage'],
  energyValue: 160,
  hints: { umfeld_laerm: 'house.excelsiorLaermHint' },
};

export const HOUSES: Record<string, HousePreset> = { excelsior };

const IDS_2026 = getForm('2026').groups.flatMap((g) => g.merkmale.map((m) => m.id));
const ENERGY_IDS = IDS_2026.filter((id) => id.startsWith('energie_'));

/** Feste Merkmal-Antworten für den gewählten Zustand der Wohnung und den Prüfbogen */
export function presetFeatures(house: HousePreset, variant: HouseVariant, formId: FormId): Record<string, FeatureAnswer> {
  const { yes, ask } = house.variants[variant];
  const out: Record<string, FeatureAnswer> = {};
  for (const id of IDS_2026) {
    if (yes.includes(id)) out[id] = 'yes';
    else if (!ask.includes(id)) out[id] = 'no';
  }
  for (const id of house.oldFormsNo) out[id] = 'no';
  // Grenzen unterscheiden sich je Bogen (2015: > 170 statt > 145)
  const energy = suggestEnergyMerkmal(formId, house.energyValue, 'verbrauch', false);
  for (const id of ENERGY_IDS) out[id] = id === energy ? 'yes' : 'no';
  return out;
}

function formIdOf(a: Answers): FormId {
  return (selectFormVersion(a.contractDate) ?? FORMS[0]).id;
}

/** Antworten mit den festen Werten des Hauses überlagern (wird nicht gespeichert) */
export function applyHouse(a: Answers, house: HousePreset | undefined): Answers {
  if (!house) return a;
  const features = a.houseVariant ? { ...a.features, ...presetFeatures(house, a.houseVariant, formIdOf(a)) } : a.features;
  return { ...a, ...house.fixed(a), features };
}

/** Steht die Antwort auf dieses Merkmal durch das Haus bereits fest? */
export function isPrefilled(house: HousePreset | undefined, a: Answers, merkmalId: string): boolean {
  return !!house && !!a.houseVariant && merkmalId in presetFeatures(house, a.houseVariant, formIdOf(a));
}
