import type { ChapterId, Screen } from './types';

/** Desktop-Seite: Kapitelkopf plus einige Fragen desselben Kapitels */
export interface Page {
  chapter: ChapterId;
  intro?: Screen;
  questions: Screen[];
  /** alle Bildschirme der Seite in Reihenfolge */
  all: Screen[];
}

/** So viele Fragen passen gut auf eine Desktop-Seite, ohne zu überladen */
export const MAX_PER_PAGE = 6;

/** Teilt jedes Kapitel in möglichst gleich große Seiten mit höchstens MAX_PER_PAGE Fragen. */
export function paginate(screens: Screen[]): Page[] {
  const pages: Page[] = [];
  let i = 0;
  while (i < screens.length) {
    const chapter = screens[i].chapter;
    let j = i;
    while (j < screens.length && screens[j].chapter === chapter) j++;
    const intro = screens[i].intro ? screens[i] : undefined;
    const questions = screens.slice(intro ? i + 1 : i, j);
    const count = Math.max(1, Math.ceil(questions.length / MAX_PER_PAGE));
    const size = Math.ceil(questions.length / count);
    for (let k = 0; k < count; k++) {
      const chunk = questions.slice(k * size, (k + 1) * size);
      const head = k === 0 ? intro : undefined;
      pages.push({ chapter, intro: head, questions: chunk, all: head ? [head, ...chunk] : chunk });
    }
    i = j;
  }
  return pages;
}
