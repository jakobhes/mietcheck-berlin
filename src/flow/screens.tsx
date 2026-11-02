import type { TFunction } from 'i18next';
import { FORMS, selectFormVersion } from '../data/forms';
import { isPrefilled, type HousePreset } from '../house/presets';
import type { Answers } from '../state/answers';
import { contractScreens } from '../steps/ContractStep';
import { energyScreens } from '../steps/EnergyStep';
import { exceptionsScreens } from '../steps/ExceptionsStep';
import { flatScreens } from '../steps/FlatStep';
import { groupScreens } from '../steps/GroupStep';
import { houseScreens } from '../steps/HouseStep';
import { personsScreens } from '../steps/PersonsStep';
import { remarksScreens } from '../steps/RemarksStep';
import { sonderScreens } from '../steps/SonderStep';
import { summaryScreens } from '../steps/SummaryStep';
import type { Screen } from './types';

/** Alle Bildschirme in Reihenfolge. Ohne gültiges Vertragsdatum dient der neueste Bogen als Vorschau für den Fortschritt. */
export function buildScreens(a: Answers, t: TFunction, house?: HousePreset): Screen[] {
  const form = selectFormVersion(a.contractDate) ?? FORMS[0];
  const hidden = new Set(house?.hiddenScreens);
  const screens = [
    ...(house ? houseScreens(house, a, t) : []),
    ...contractScreens(a, t),
    ...exceptionsScreens(a, t, hidden),
    ...flatScreens(form, a, t),
    ...energyScreens(form, a, t),
    ...sonderScreens(form, a, t),
    ...form.groups.flatMap((g) => groupScreens(g, a, t, (id) => isPrefilled(house, a, id))),
    ...remarksScreens(a, t),
    ...personsScreens(form, a, t),
    ...summaryScreens(form, a, t),
  ].filter((s) => !hidden.has(s.id));
  // Kapitel-Einstiege ohne verbleibende Fragen entfallen
  return screens.filter((s) => !s.intro || s.chapter === 'summary' || screens.some((o) => o.chapter === s.chapter && !o.intro));
}
