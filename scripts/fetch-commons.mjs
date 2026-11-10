#!/usr/bin/env node
/**
 * Lädt die Beispielfotos von Wikimedia Commons herunter (verkleinert auf 800 px) und
 * schreibt Urheber- und Lizenzangaben nach src/data/media-photos.json.
 *
 *   node scripts/fetch-commons.mjs
 *
 * Neue Fotos: Eintrag in PHOTOS ergänzen (Dateiname auf Commons ohne „File:“).
 * Nur frei lizenzierte Dateien verwenden (CC0, Public Domain, CC BY, CC BY-SA).
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public/media/photos');
const JSON_OUT = join(ROOT, 'src/data/media-photos.json');
const UA = 'MietCheckBerlin/0.1 (https://github.com/jakobhes/mietcheck-berlin)';
const WIDTH = 800;

/** @type {{ title: string; alt: string; ids: string[] }[]} */
const PHOTOS = [
  { title: 'Clawfoot bathtub.jpg', alt: 'Freistehende Badewanne auf Füßen', ids: ['bad_freistehende_wanne'] },
  { title: 'Handtuchwärmer - Badheizkörper.jpg', alt: 'Handtuch-Heizkörper (Strukturheizkörper) im Bad', ids: ['bad_strukturheizkoerper'] },
  { title: 'GER — BY — München — Bahnhofplatz 1 (Doppelwaschbecken) 2020.JPG', alt: 'Doppelwaschbecken', ids: ['bad_grosses_waschbecken'] },
  { title: 'Bathroom-mold.jpg', alt: 'Schimmel und Feuchtigkeit an der Wand', ids: ['gebaeude_instandhaltung_schlecht'] },
  { title: 'Ceranfeld.jpg', alt: 'Ceran-Kochfeld', ids: ['kueche_ceran'] },
  { title: 'California Kitchen Range Hood.jpg', alt: 'Dunstabzugshaube über dem Herd', ids: ['kueche_dunstabzug'] },
  { title: 'FI-Schutzschalter FI 22.03.JPG', alt: 'FI-Schutzschalter im Sicherungskasten', ids: ['wohnung_elektro_unzureichend'] },
  { title: '2014 Grumbtsche Villa - Decke Raum 4 OG.JPG', alt: 'Stuckdecke', ids: ['wohnung_stuck'] },
  { title: 'Constructingheatedfloor.jpg', alt: 'Fußbodenheizung beim Einbau (Rohre im Estrich)', ids: ['wohnung_fussbodenheizung', 'bad_fussbodenheizung'] },
  { title: 'Albertstrasse balkon 21.11.2010 10-51-15.JPG', alt: 'Balkone an einem Berliner Wohnhaus', ids: ['wohnung_balkon', 'wohnung_kein_balkon'] },
  { title: 'Berlin - courtyard in Knesebeckstraße, Charlottenburg 01.jpg', alt: 'Berliner Hinterhof mit Seitenflügel und Quergebäude', ids: ['gebaeude_seitenfluegel'] },
  { title: '2 "staple" style bike racks in grey metal.jpg', alt: 'Fahrradbügel zum Anschließen', ids: ['gebaeude_fahrradraum', 'umfeld_keine_fahrradplaetze'] },
];

function slug(title) {
  const ext = title.split('.').pop().toLowerCase().replace('jpeg', 'jpg');
  return (
    title
      .replace(/\.[^.]+$/, '')
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) + `.${ext === 'png' ? 'png' : 'jpg'}`
  );
}

function stripHtml(s = '') {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

async function info(titles) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  u.search = new URLSearchParams({
    action: 'query',
    titles: titles.map((t) => `File:${t}`).join('|'),
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: String(WIDTH),
    format: 'json',
    formatversion: '2',
  }).toString();
  const res = await fetch(u, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Commons API ${res.status}`);
  return (await res.json()).query.pages;
}

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });
const pages = await info(PHOTOS.map((p) => p.title));
const byTitle = new Map(pages.map((p) => [p.title.replace(/^File:/, ''), p]));
const result = [];

for (const p of PHOTOS) {
  const page = byTitle.get(p.title.replace(/_/g, ' '));
  const ii = page?.imageinfo?.[0];
  if (!ii) {
    console.warn(`⚠ nicht gefunden: ${p.title}`);
    continue;
  }
  const md = ii.extmetadata ?? {};
  const license = stripHtml(md.LicenseShortName?.value);
  if (!/^(CC0|CC BY|Public domain|PD)/i.test(license) && !/free use/i.test(license)) {
    console.warn(`⚠ Lizenz nicht frei genug (${license}): ${p.title}`);
    continue;
  }
  const file = slug(p.title);
  const img = await fetch(ii.thumburl ?? ii.url, { headers: { 'User-Agent': UA } });
  if (!img.ok) throw new Error(`Download ${p.title}: ${img.status}`);
  await writeFile(join(OUT_DIR, file), Buffer.from(await img.arrayBuffer()));
  result.push({
    file,
    alt: p.alt,
    author: stripHtml(md.Artist?.value) || 'unbekannt',
    license,
    licenseUrl: md.LicenseUrl?.value,
    sourceUrl: ii.descriptionurl,
    ids: p.ids,
  });
  console.log(`✓ ${file} (${license})`);
}

await writeFile(JSON_OUT, JSON.stringify(result, null, 2) + '\n');
console.log(`\n${result.length} Fotos → ${JSON_OUT}`);
