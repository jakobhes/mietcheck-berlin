export interface FeatureText {
  /** Frage in Alltagssprache; `{{n}}` wird bei Energiekennwerten durch den Grenzwert ersetzt */
  q: string;
  /** Erläuterung, was genau gemeint ist */
  help: string;
}

export type FeatureTexts = Record<string, FeatureText>;

/**
 * Merkmale mit verneintem Wortlaut („Bad ohne Fenster“) werden in allen Sprachen positiv gefragt
 * („Hat das Bad ein Fenster?“) – das ist leichter zu beantworten. „Nein“ heißt dann: Merkmal trifft zu.
 */
export const INVERTED = new Set([
  'bad_kein_waschbecken',
  'bad_wc_keine_lueftung',
  'bad_nicht_beheizbar',
  'bad_kein_warmwasser',
  'bad_waende_nicht_gefliest',
  'bad_ohne_fenster',
  'bad_keine_dusche',
  'kueche_ohne_fenster',
  'kueche_kein_herd',
  'kueche_keine_spuele',
  'kueche_kein_warmwasser',
  'kueche_nicht_beheizbar',
  'kueche_kein_geschirrspueler',
  'kueche_keine_wandfliesen',
  'wohnung_keine_waschmaschine',
  'wohnung_kein_balkon',
  'wohnung_kein_kabel',
  'gebaeude_kein_keller',
  'gebaeude_keine_sprechanlage',
  'gebaeude_haustuer_offen',
  'umfeld_keine_fahrradplaetze',
]);
