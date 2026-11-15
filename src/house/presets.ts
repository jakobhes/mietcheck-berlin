/**
 * Haus-Modus: Voreinstellungen für ein bestimmtes Gebäude (z. B. für eine Mieterversammlung).
 * Was für alle Wohnungen im Haus gleich ist, wird fest vorausgefüllt und nicht mehr gefragt.
 * Aktiviert wird der Modus über den Link `?haus=<id>` (siehe `activation.ts`).
 */
import { FORMS, getForm, selectFormVersion } from '../data/forms';
import { parseNumber, parseYear, suggestEnergyMerkmal } from '../data/logic';
import { findMietspiegelField } from '../data/mietspiegel';
import type { FormId, SonderId } from '../data/types';
import type { Answers, Documents, FeatureAnswer, HouseVariant, YesNo } from '../state/answers';

export interface HousePreset {
  id: string;
  name: string;
  street: string;
  zip: string;
  city: string;
  houseNumbers: string[];
  /** nur diese PDFs; die Auswahl auf der Startseite entfällt */
  documents?: Documents;
  /** fest vorgegebene Antworten; die zugehörigen Bildschirme entfallen */
  fixed: (a: Answers) => Partial<Answers>;
  /** Bildschirme, deren Antwort über `fixed` feststeht */
  hiddenScreens: string[];
  /** Ausstattung, die für alle Wohnungen feststeht; das Kästchen wird nicht angezeigt */
  equipment: Partial<Answers['equipment']>;
  /**
   * Merkmale je Zustand der Wohnung, bezogen auf den Prüfbogen 2026:
   * `yes` = angekreuzt, `ask` = wird gefragt, alle übrigen Merkmale 2026 = „trifft nicht zu“.
   * Merkmale, die es nur in älteren Bögen gibt, werden weiter gefragt.
   */
  variants: Record<HouseVariant, { yes: string[]; ask: string[] }>;
  /** Merkmale, die als „weiß nicht“ eingetragen und nicht gefragt werden */
  unsure: string[];
  /** Merkmale, die es nur in älteren Bögen gibt und für alle feststehen; die übrigen werden gefragt */
  oldForms: { yes: string[]; no: string[] };
  /** Sondermerkmale 2015 je Zustand der Wohnung; nicht genannte werden gefragt */
  sonder: Record<HouseVariant, Partial<Record<SonderId, YesNo>>>;
  /** Energieverbrauchskennwert für die Einordnung; die Stufe ergibt sich je Bogen aus dessen Grenzen */
  energyValue: number;
  /** Merkmal im Haus anders fragen: Übersetzungen unter `<i18n>.title|help` */
  questions: Record<string, string>;
  /** Merkmale, deren Erläuterung im Haus nicht passt und weggelassen wird */
  noHelp: string[];
  /** kurzer Ablauf: keine Erreichbarkeit, „Weitere Bemerkungen“ im Prüfbogen leer */
  brief?: boolean;
  /** zusätzliche Bilder zu Merkmalen, nur in diesem Haus (unter public/, Bildunterschrift als UI-Übersetzungsschlüssel) */
  media: Record<string, { src: string; caption: string }[]>;
  /**
   * Frage nach dem Zustand über ein erkennbares Merkmal statt „renoviert/unrenoviert“:
   * Übersetzungen unter `<i18n>.title|help|renoviert|unrenoviert`, dazu je ein Beispielbild (unter public/).
   */
  variantQuestion?: { i18n: string; images: Record<HouseVariant, string> };
}

const BOTH_YES = ['gebaeude_fahrradraum', 'gebaeude_kein_keller', 'wohnung_kein_balkon'];

/** Excelsior, Stresemannstraße 68–76 (Baujahr 1966) */
const excelsior: HousePreset = {
  id: 'excelsior',
  name: 'Excelsior',
  street: 'Stresemannstraße',
  zip: '10963',
  city: 'Berlin',
  houseNumbers: ['68', '70', '72', '74', '76'],
  // die Rügen schreibt der Anwalt, die App erstellt nur die Spanneneinordnung
  documents: 'pruefbogen',
  fixed: (a) => ({
    buildYear: '1966',
    east: '',
    wohnlage: 'einfache',
    position: 'Vorderhaus',
    attic: 'nein',
    modernizedOld: 'nein',
    smallHouse: 'nein',
    municipal: 'nein',
    // im Haus gibt es keine Index- oder Staffelmietverträge
    indexRent: 'nein',
    staffelRent: 'nein',
    // gemessen nur in der 72; die übrigen Aufgänge sind vermutlich ähnlich (Einordnung mit `energyValue` unten)
    energyValue: a.houseNo === '72' ? '160' : '',
    energyKind: 'verbrauch',
    energyDecentralWater: false,
  }),
  hiddenScreens: [
    'contract.indexRent',
    'contract.staffelRent',
    'contract.municipal',
    'flat.buildYear',
    'flat.east',
    'flat.wohnlage',
    // Mietspiegelfeld ergibt sich aus Wohnfläche und Tabelle (siehe applyHouse), sonst ermittelt es der Mieterverein
    'flat.row',
    'flat.equipment',
    'flat.position',
    'flat.attic',
    'flat.modernizedOld',
    'flat.smallHouse',
    'energy.intro',
    'energy.value',
    'energy.kind',
    'remarks.remarks',
  ],
  // Sammelheizung = Fernwärme
  equipment: { badWC: true, sammelheizung: true, fahrstuhl: true },
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
  // Mängel im Treppenhaus kennt nicht jede·r – „weiß nicht“
  unsure: ['gebaeude_treppenhaus_schlecht'],
  oldForms: {
    yes: ['umfeld_muell'],
    // laut Anwalt: weder stark vernachlässigte Umgebung noch bevorzugte Citylage; Kabelanschluss überall, Vertrag schließt man selbst ab
    no: ['umfeld_vernachlaessigt', 'umfeld_citylage', 'wohnung_kein_kabel', 'wohnung_breitband', 'gebaeude_garage', 'gebaeude_einbruchschutz', 'umfeld_muell_gepflegt', 'umfeld_villa'],
  },
  sonder: {
    unrenoviert: { sm_parkett: 'nein', sm_dusche: 'nein', sm_isolierverglasung: 'nein', sm_aufzug: 'ja' },
    renoviert: { sm_parkett: 'nein', sm_kueche: 'ja', sm_dusche: 'nein', sm_modernes_bad: 'ja', sm_isolierverglasung: 'ja', sm_aufzug: 'ja' },
  },
  energyValue: 160,
  // gefragt wird nur, ob ein Fenster zur Stresemannstraße geht
  questions: { umfeld_laerm: 'house.excelsiorLaerm' },
  // Hinweis zu Plattenbauten passt nicht (Baujahr 1966)
  noHelp: ['bad_ohne_fenster'],
  brief: true,
  media: { wohnung_kaltwasserzaehler: [{ src: 'media/house/excelsior-wasserzaehler.jpg', caption: 'house.excelsiorWaterMeter' }] },
  // renovierte Wohnungen haben neue Dreh-Fenster, unrenovierte noch die alten Schwingfenster
  variantQuestion: {
    i18n: 'house.excelsiorWindows',
    images: { renoviert: 'media/house/excelsior-fenster-neu.jpg', unrenoviert: 'media/house/excelsior-fenster-alt.jpg' },
  },
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
    else if (house.unsure.includes(id)) out[id] = 'unsure';
    else if (!ask.includes(id)) out[id] = 'no';
  }
  for (const id of house.oldForms.yes) out[id] = 'yes';
  for (const id of house.oldForms.no) out[id] = 'no';
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
  const formId = formIdOf(a);
  const features = a.houseVariant ? { ...a.features, ...presetFeatures(house, a.houseVariant, formId) } : a.features;
  const sonder = a.houseVariant ? { ...a.sonder, ...house.sonder[a.houseVariant] } : a.sonder;
  const fixed = {
    ...a,
    ...house.fixed(a),
    ...(house.documents && { documents: house.documents }),
    equipment: { ...a.equipment, ...house.equipment },
    features,
    sonder,
  };
  const field = findMietspiegelField(formId, fixed.wohnlage, parseYear(fixed.buildYear), parseNumber(fixed.area));
  return field ? { ...fixed, row: field.field.row, column: field.column ?? '' } : fixed;
}

/** Steht die Antwort auf dieses Merkmal durch das Haus bereits fest? */
export function isPrefilled(house: HousePreset | undefined, a: Answers, merkmalId: string): boolean {
  return !!house && !!a.houseVariant && merkmalId in presetFeatures(house, a.houseVariant, formIdOf(a));
}

/** Steht die Antwort auf dieses Sondermerkmal (2015) durch das Haus bereits fest? */
export function isSonderPrefilled(house: HousePreset | undefined, a: Answers, id: SonderId): boolean {
  return !!house && !!a.houseVariant && id in house.sonder[a.houseVariant];
}
