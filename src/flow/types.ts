import type { ReactNode } from 'react';
import type { GroupId } from '../data/types';

export type ChapterId = 'contract' | 'exceptions' | 'flat' | 'energy' | 'sonder' | GroupId | 'remarks' | 'persons' | 'summary';

/**
 * Ein Bildschirm des Assistenten – in der Regel genau eine Frage
 * („one thing per page“), damit pro Ansicht nur wenig Information zu verarbeiten ist.
 */
export interface Screen {
  /** stabile ID, wird als Fortschritt gespeichert */
  id: string;
  chapter: ChapterId;
  element: ReactNode;
  /** Kapitel-Einstieg (zählt nicht als Frage) */
  intro?: boolean;
  /** beantwortet → „Weiter“ statt „Überspringen“ */
  answered?: boolean;
  /** eigene Beschriftung für den Weiter-Button */
  nextLabel?: string;
  /** Weiter gesperrt (z. B. ohne gültiges Vertragsdatum) */
  blocked?: boolean;
}
