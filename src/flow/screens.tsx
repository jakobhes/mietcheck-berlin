import type { TFunction } from 'i18next';
import { FORMS, selectFormVersion } from '../data/forms';
import type { Answers } from '../state/answers';
import { contractScreens } from '../steps/ContractStep';
import { energyScreens } from '../steps/EnergyStep';
import { exceptionsScreens } from '../steps/ExceptionsStep';
import { flatScreens } from '../steps/FlatStep';
import { groupScreens } from '../steps/GroupStep';
import { personsScreens } from '../steps/PersonsStep';
import { remarksScreens } from '../steps/RemarksStep';
import { sonderScreens } from '../steps/SonderStep';
import { summaryScreens } from '../steps/SummaryStep';
import type { Screen } from './types';

/** Alle Bildschirme in Reihenfolge. Ohne gültiges Vertragsdatum dient der neueste Bogen als Vorschau für den Fortschritt. */
export function buildScreens(a: Answers, t: TFunction): Screen[] {
  const form = selectFormVersion(a.contractDate) ?? FORMS[0];
  return [
    ...contractScreens(a, t),
    ...exceptionsScreens(a, t),
    ...flatScreens(form, a, t),
    ...energyScreens(form, a, t),
    ...sonderScreens(form, a, t),
    ...form.groups.flatMap((g) => groupScreens(g, a, t)),
    ...remarksScreens(a, t),
    ...personsScreens(form, a, t),
    ...summaryScreens(form, a, t),
  ];
}
