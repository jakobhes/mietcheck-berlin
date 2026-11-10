/**
 * Beispielbilder zu Merkmalen.
 * - Fotos: Wikimedia Commons, lokal unter public/media/photos/ abgelegt, mit Lizenzangabe
 *   (Metadaten in media-photos.json, erzeugt mit scripts/fetch-commons.mjs).
 * - Illustrationen: eigene SVGs unter public/media/illustrations/ (MIT-Lizenz wie das Projekt).
 * - Eigene Fotos: public/media/own/ (eigene Aufnahmen, außerhalb von photos/, weil
 *   fetch-commons.mjs diesen Ordner neu anlegt).
 */
import photos from './media-photos.json';

export interface MediaItem {
  src: string;
  kind: 'photo' | 'illustration';
  /** Kurzer Alternativtext (deutsch) */
  alt: string;
  author?: string;
  license?: string;
  licenseUrl?: string;
  sourceUrl?: string;
}

interface PhotoMeta {
  file: string;
  alt: string;
  author: string;
  license: string;
  licenseUrl?: string;
  sourceUrl: string;
  /** Merkmal-IDs, bei denen das Foto angezeigt wird */
  ids: string[];
}

const base = import.meta.env.BASE_URL;

const ILLUSTRATIONS: [file: string, alt: string, ids: string[]][] = [
  ['bad-flaeche.svg', 'Badgröße messen: unter 4 m² ist klein, über 8 m² ist groß', ['bad_klein', 'bad_gross', 'sm_kleines_bad']],
  ['waschbecken-mass.svg', 'Waschbecken messen: höchstens 50 cm ist klein, ab 80 cm sehr groß', ['bad_kein_waschbecken', 'bad_grosses_waschbecken']],
  ['dusche-bodengleich.svg', 'Querschnitt: bodengleiche Dusche (max. 3 cm) und Duschwanne mit hoher Kante', ['bad_bodengleiche_dusche']],
  ['wc-wandhaengend.svg', 'Wandhängendes WC mit Spülkasten in der Wand und Stand-WC mit sichtbarem Spülkasten', ['bad_wandhaengendes_wc']],
  ['gefangenes-zimmer.svg', 'Grundriss: Das gefangene Zimmer ist nur durch ein anderes Zimmer erreichbar', ['wohnung_schlechter_schnitt']],
  ['verglasung.svg', 'Querschnitt: Einfachverglasung, Kastenfenster und Isolierverglasung', ['wohnung_einfachverglasung', 'wohnung_waermeschutzfenster', 'sm_isolierverglasung']],
  ['seitenfluegel.svg', 'Lageplan eines Berliner Altbaus: Vorderhaus, Seitenflügel, Quergebäude und Hof', ['gebaeude_seitenfluegel']],
  ['schwelle.svg', 'Schwellenfreier Übergang im Vergleich zu einer Stufe', ['wohnung_barrierearm', 'gebaeude_schwellenarm']],
  ['aufzug-etagen.svg', 'Gebäudeschnitt: Erdgeschoss bis 5. Obergeschoss', ['gebaeude_kein_aufzug_ab5', 'gebaeude_aufzug']],
  ['energie-skala.svg', 'Energieausweis-Skala von grün (sparsam) bis rot (hoher Verbrauch)', ['energie_minus_1', 'energie_minus_2', 'energie_minus_3', 'energie_plus_1', 'energie_plus_2', 'energie_plus_3']],
];

const OWN_PHOTOS: [file: string, alt: string, ids: string[]][] = [
  ['wc-wandhaengend.jpg', 'Wandhängendes WC, der Spülkasten ist in der Wand versteckt', ['bad_wandhaengendes_wc']],
  ['fenster-verschattung.jpg', 'Fenster mit Jalousie', ['wohnung_rolllaeden']],
];

export const MEDIA: Record<string, MediaItem[]> = {};

function add(id: string, item: MediaItem) {
  (MEDIA[id] ??= []).push(item);
}

for (const p of photos as PhotoMeta[]) {
  const item: MediaItem = {
    src: `${base}media/photos/${p.file}`,
    kind: 'photo',
    alt: p.alt,
    author: p.author,
    license: p.license,
    licenseUrl: p.licenseUrl,
    sourceUrl: p.sourceUrl,
  };
  p.ids.forEach((id) => add(id, item));
}

for (const [file, alt, ids] of OWN_PHOTOS) {
  ids.forEach((id) => add(id, { src: `${base}media/own/${file}`, kind: 'photo', alt }));
}

for (const [file, alt, ids] of ILLUSTRATIONS) {
  ids.forEach((id) => add(id, { src: `${base}media/illustrations/${file}`, kind: 'illustration', alt }));
}

export function photoCredits(): MediaItem[] {
  return (photos as PhotoMeta[]).map((p) => ({
    src: `${base}media/photos/${p.file}`,
    kind: 'photo',
    alt: p.alt,
    author: p.author,
    license: p.license,
    licenseUrl: p.licenseUrl,
    sourceUrl: p.sourceUrl,
  }));
}
