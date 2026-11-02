export interface FeatureText {
  /** Frage in Alltagssprache; `{{n}}` wird bei Energiekennwerten durch den Grenzwert ersetzt */
  q: string;
  /** Erläuterung, was genau gemeint ist */
  help: string;
}

export type FeatureTexts = Record<string, FeatureText>;
