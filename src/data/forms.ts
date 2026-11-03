/**
 * Kataloge der BMV-Prüfbögen 169A („Prüfung der Wiedervermietungsmiete nach § 556 d BGB“).
 * Wortlaut übernommen aus den Originalen unter
 * https://www.berliner-mieterverein.de/aktionen-und-buendnisse/aktion-mietpreisueberpruefung-mietpreisbremse-nutzen-bei-neuem-mietvertrag.htm
 *
 * Merkmal-IDs sind über alle Jahre stabil, damit Erklärungen, Übersetzungen und Bilder
 * nur einmal gepflegt werden müssen. Unterschiede zwischen den Jahren stecken im Wortlaut
 * (`de`) und in den Bedingungen (`cond`).
 */
import { monthStart } from './dates';
import type { Condition, FollowUpKey, FormId, FormVersion, Merkmal, MerkmalGroup } from './types';

const BMV = 'https://www.berliner-mieterverein.de/downloads/';

function m(
  id: string,
  sign: '+' | '-',
  de: string,
  extra: { cond?: Condition; followUp?: FollowUpKey; exclusive?: string } = {},
): Merkmal {
  return { id, sign, de, ...extra };
}

const ENERGY_NOTES_OLD = [
  'Die Energieverbrauchskennwerte beziehen sich auf Energie für Heizung und Warmwasser.',
  'Für die Einordnung eines Endenergiebedarfskennwertes sind die oben angegebenen Energieverbrauchskennwert-Grenzen um 20 % zu erhöhen.',
  'Für dezentrale Warmwasserversorgung sind vor der Eingruppierung 20 kWh/(m²a) auf den ausgewiesenen Energiekennwert aufzuschlagen.',
  'Bei Wohnungen, die in denkmalgeschützten Gebäuden gelegen sind, werden die wohnwertmindernden Merkmale zur energetischen Beschaffenheit dann nicht berücksichtigt, wenn die Umsetzung von energetischen Sanierungen gegen denkmalschutzrechtliche Belange verstoßen würde oder deren Umsetzung durch denkmalschutzrechtliche Auflagen unverhältnismäßig (teuer) wäre.',
];

const ENERGY_NOTES_2026 = [
  'Die (End-)Energieverbrauchskennwerte beziehen sich auf Energie für Heizung und Warmwasser.',
  'Für die Einordnung eines Endenergiebedarfskennwertes sind die oben angegebenen Verbrauchsenergiekennwert-Grenzen um 20 % zu erhöhen.',
  'Für Kennwerte ohne Berücksichtigung der dezentralen Warmwasserversorgung sind vor der Eingruppierung 20 kWh/(m²a) auf den ausgewiesenen (End-)Energiekennwert aufzuschlagen.',
  ENERGY_NOTES_OLD[3],
];

function energy(prefix: string, minus: [number, number, number], plus: [number, number, number]): Merkmal[] {
  return [
    m('energie_minus_1', '-', `${prefix} größer als ${minus[0]} kWh/(m²a)`, { exclusive: 'energie' }),
    m('energie_minus_2', '-', `${prefix} größer als ${minus[1]} kWh/(m²a)`, { exclusive: 'energie' }),
    m('energie_minus_3', '-', `${prefix} größer als ${minus[2]} kWh/(m²a)`, { exclusive: 'energie' }),
    m('energie_plus_1', '+', `${prefix} kleiner als ${plus[0]} kWh/(m²a)`, { exclusive: 'energie' }),
    m('energie_plus_2', '+', `${prefix} kleiner als ${plus[1]} kWh/(m²a)`, { exclusive: 'energie' }),
    m('energie_plus_3', '+', `${prefix} kleiner als ${plus[2]} kWh/(m²a)`, { exclusive: 'energie' }),
  ];
}

/** Energiekennwert-Grenzen je Prüfbogen (für die automatische Vorauswahl) */
export const ENERGY_THRESHOLDS: Record<FormId, { minus: number[]; plus: number[] }> = {
  '2015': { minus: [170, 210, 250], plus: [120, 100, 80] },
  '2017': { minus: [155, 195, 235], plus: [120, 100, 80] },
  '2019': { minus: [155, 195, 235], plus: [120, 100, 80] },
  '2021': { minus: [155, 195, 235], plus: [120, 100, 80] },
  '2023': { minus: [155, 195, 235], plus: [120, 100, 80] },
  '2024': { minus: [145, 195, 235], plus: [120, 100, 80] },
  '2026': { minus: [145, 195, 235], plus: [120, 100, 80] },
};

/* ------------------------------------------------------------------------------------------ */
/* 2026 (Mietspiegel 2026, Verträge ab 1.9.2025)                                                */
/* ------------------------------------------------------------------------------------------ */

const NG = ' [bezieht sich nicht auf Gäste-WCs]';

const groups2026: MerkmalGroup[] = [
  {
    id: 'bad',
    titleDe: 'Merkmalgruppe 1: Bad/WC/Gäste-WC',
    merkmale: [
      m('bad_kein_waschbecken', '-', 'Kein Handwaschbecken in Bad oder WC oder im Bad nur ein kleines Handwaschbecken (Außenmaß 50 cm breit oder weniger)' + NG),
      m('bad_wc_keine_lueftung', '-', 'WC ohne Lüftungsmöglichkeit und Entlüftung' + NG),
      m('bad_dielen', '-', 'Dielenfußboden im Bad (wenn nicht feuchtraumgeeignet)' + NG),
      m('bad_nicht_beheizbar', '-', 'Bad nicht beheizbar oder Holz-/Kohleheizung oder Elektroheizstrahler' + NG),
      m('bad_kein_warmwasser', '-', 'Keine ausreichende Warmwasserversorgung (z.B. keine zentrale Warmwasserversorgung, kein Durchlauferhitzer, kein Boiler > 60 Liter)' + NG),
      m('bad_freistehende_wanne', '-', 'Freistehende Badewanne mit oder ohne Verblendung und ohne separate Dusche in nicht modernisiertem Bad'),
      m('bad_waende_nicht_gefliest', '-', 'Wände nicht ausreichend im Spritzwasserbereich von Waschbecken, Badewanne und/oder Dusche gefliest/geschützt' + NG),
      m('bad_ohne_fenster', '-', 'Bad mit WC ohne Fenster; gilt nicht für die Baualtersklasse 1973 bis 1990 Ost', { cond: { notEast7390: true } }),
      m('bad_keine_dusche', '-', 'Keine Duschmöglichkeit (z.B. kein Spritzwasserschutz, keine Duschkopfhalterung)'),
      m('bad_klein', '-', 'Kleines Bad (Grundfläche kleiner als 4 m²); gilt nicht in der Baualtersklasse 1973 bis 1990 Ost', { cond: { notEast7390: true } }),
      m('bad_grosses_waschbecken', '+', 'Sehr großes Waschbecken (Außenmaß mindestens 80 cm breit) oder Doppelhandwaschbecken oder zwei getrennte Waschbecken nebeneinander' + NG),
      m('bad_hochwertig', '+', 'Besondere und hochwertige Ausstattung (z.B. hochwertige Sanitärausstattung, hochwertige Badmöbel, Eckwanne, Rundwanne, Echtglastrennwand, Regendusche)' + NG),
      m('bad_innen_lueftung', '+', 'Innen liegendes Badezimmer mit moderner, gesteuerter Entlüftung (z.B. mittels Feuchtigkeitssensor)' + NG),
      m('bad_zweites_wc', '+', 'Zweites WC in der Wohnung oder Bad und WC getrennt'),
      m('bad_gross', '+', 'Mindestens ein Bad mit Grundfläche größer als 8 m²' + NG),
      m('bad_fussbodenheizung', '+', 'Fußbodenheizung' + NG),
      m('bad_fliesen_hochwertig', '+', 'Wandbekleidung und Bodenbelag hochwertig (gilt nicht für die Baualtersklasse ab 2010)' + NG, { cond: { maxYear: 2009 } }),
      m('bad_wandhaengendes_wc', '+', 'Wandhängendes WC mit in der Wand eingelassenem Spülkasten (gilt nicht für die Baualtersklassen ab 2002) oder hochwertiges Stand-WC [bezieht sich beides nicht auf Gäste-WCs]'),
      m('bad_strukturheizkoerper', '+', 'Strukturheizkörper als Handtuchwärmer im Bad (gilt für Baualtersklassen bis einschließlich 2001); sofern zusätzlich elektrisch betreibbar: alle Baujahre' + NG),
      m('bad_separate_dusche', '+', 'Von der Badewanne getrennte zusätzliche Duschtasse oder -kabine'),
      m('bad_bodengleiche_dusche', '+', 'Bodengleiche Dusche (auch flache Duschtasse mit einer Tiefe von bis zu 3 cm)'),
    ],
  },
  {
    id: 'kueche',
    titleDe: 'Merkmalgruppe 2: Küche',
    merkmale: [
      m('kueche_ohne_fenster', '-', 'Küche ohne Fenster und ohne ausreichende Entlüftung'),
      m('kueche_kein_herd', '-', 'Keine Kochmöglichkeit oder Gas-/Elektroherd ohne Backofen'),
      m('kueche_keine_spuele', '-', 'Keine Spüle'),
      m('kueche_kein_warmwasser', '-', 'Keine ausreichende Warmwasserversorgung (z.B. keine zentrale Warmwasserversorgung, kein Durchlauferhitzer, kein Boiler)'),
      m('kueche_nicht_beheizbar', '-', 'Küche nicht beheizbar oder Holz-/Kohleheizung'),
      m('kueche_kein_geschirrspueler', '-', 'Geschirrspüler in der Küche nicht stellbar oder anschließbar'),
      m('kueche_keine_wandfliesen', '-', 'Keine Wandfliesen oder vergleichbarer Wandschutz im Arbeitsbereich'),
      m('kueche_boden', '+', 'Hochwertige Fliesen, hochwertiges Linoleum, hochwertiges Feuchtraumlaminat, Parkett, Terrazzo als Bodenbelag jeweils in gutem Zustand (Baualtersklassen bis einschließlich 2009)', { cond: { maxYear: 2009 } }),
      m('kueche_gross', '+', 'Separate Küche mit mind. 14 m² Grundfläche', { followUp: 'kuecheGroesse' }),
      m('kueche_einbaukueche', '+', 'Einbauküche mit Ober- und Unterschränken sowie Herd und Spüle'),
      m('kueche_ceran', '+', 'Ceran-Kochfeld oder Induktions-Kochfeld (gilt für Baualtersklassen bis einschließlich 2001)', { cond: { maxYear: 2001 } }),
      m('kueche_dunstabzug', '+', 'Dunstabzug'),
      m('kueche_kuehlschrank', '+', 'Kühlschrank, Tiefkühlschrank/-truhe oder Geschirrspüler'),
      m('kueche_kochinsel', '+', 'Freistehender Küchenblock mit Arbeitsfläche und Kochmöglichkeit oder Spüle'),
    ],
  },
  {
    id: 'wohnung',
    titleDe: 'Merkmalgruppe 3: Wohnung',
    merkmale: [
      m('wohnung_einfachverglasung', '-', 'Überwiegend Fenster mit Einfachverglasung (Doppel-Kastenfenster sind nicht gemeint)', { followUp: 'raeumeEinfachfenster' }),
      m('wohnung_elektro_unzureichend', '-', 'Unzureichende Elektroinstallation, z.B. keine ausreichende Elektrosteigeleitung und/oder VDE-gerechte Elektroinstallation (z.B. kein FI-Schalter, Potentialausgleich)'),
      m('wohnung_elektro_aufputz', '-', 'Elektroleitungen überwiegend sichtbar auf Putz', { followUp: 'raeumeElektro' }),
      m('wohnung_leitungen_aufputz', '-', 'Be- und Entwässerungsleitungen (Sanitärleitungen) überwiegend sichtbar auf Putz', { followUp: 'raeumeLeitungen' }),
      m('wohnung_keine_waschmaschine', '-', 'Waschmaschine weder in Bad noch Küche stellbar oder nicht anschließbar'),
      m('wohnung_schlechter_schnitt', '-', 'Schlechter Schnitt (z.B. gefangenes Zimmer und/oder Durchgangszimmer)'),
      m('wohnung_kein_balkon', '-', 'Kein Balkon, (Dach-)Terrasse, Loggia und Winter-/Dachgarten (gilt nicht, wenn das Merkmal aus baulichen und/oder rechtlichen Gründen nicht möglich oder nicht zulässig ist)', { followUp: 'balkonGrund' }),
      m('wohnung_eg_kein_einbruchschutz', '-', 'Bei Erdgeschosswohnung: Kein Einbruchs- und/oder Sichtschutzsystem an allen Fenstern der Wohnung (z.B. Gitter, Rollläden, Fensteralarm)'),
      m('wohnung_einbauschrank', '+', 'Abstellraum innerhalb der Wohnung (mindestens 1m² Grundfläche) oder Einbauschrank'),
      m('wohnung_balkon', '+', 'Großer, geräumiger Balkon, (Dach-)Terrasse, Loggia oder Winter-/Dachgarten (ab 4 m² Grundfläche)'),
      m('wohnung_fussbodenheizung', '+', 'Überwiegend Fußbodenheizung', { followUp: 'raeumeFussbodenheizung' }),
      m('wohnung_stuck', '+', 'Aufwändige Decken- und/oder Wandverkleidung (z.B. Stuck, Täfelung) in gutem Zustand in der überwiegenden Anzahl der Wohnräume', { followUp: 'raeumeStuck' }),
      m('wohnung_heizungsrohre', '+', 'Heizungsrohre überwiegend nicht sichtbar auf Putz (gilt für Baualtersklassen bis einschließlich 1990)', { cond: { maxYear: 1990 } }),
      m('wohnung_rolllaeden', '+', 'Außen angebrachte Verschattungssysteme an überwiegender Anzahl der Fenster in den Wohnräumen (z.B. Rollläden)'),
      m('wohnung_raum_40', '+', 'Ein Wohnraum größer als 40 m² Grundfläche'),
      m('wohnung_barrierearm', '+', 'Barrierearme Wohnungsgestaltung (Schwellenfreiheit in der Wohnung, schwellenarmer Übergang zu Balkon/Terrasse sowie ausreichende Bewegungsfreiheit in der Wohnung)'),
      m('wohnung_parkett', '+', 'Hochwertiges Parkett, Natur-/Kunststein, Fliesen oder gleichwertiger Boden/-belag in der überwiegenden Zahl der Wohnräume (inklusive Flur, ohne Küche, ohne Bad)'),
      m('wohnung_waermeschutzfenster', '+', 'Wohngebäude/Wohnungen die vor 2002 bezugsfertig geworden sind: überwiegend Wärmeschutzverglasung oder Schallschutzfenster (jeweils Einbau ab 2002)', { cond: { maxYear: 2001 } }),
      m('wohnung_einbruchschutz_tuer', '+', 'Zusätzliche Einbruchssicherung für die Wohnungstür (z.B. hochwertige Sperrbügel und/oder Türschlösser mit Mehrfachverriegelung) bei verstärkten Türen'),
    ],
  },
  {
    id: 'gebaeude',
    titleDe: 'Merkmalgruppe 4: Gebäude',
    merkmale: [
      m('gebaeude_treppenhaus_schlecht', '-', 'Treppenhaus/Eingangsbereich überwiegend in schlechtem Zustand', { followUp: 'treppenhausDetails' }),
      m('gebaeude_kein_keller', '-', 'Kein Abstellraum außerhalb der Wohnung zur alleinigen Nutzung ohne Zusatzkosten (z.B. kein abschließbarer Keller)'),
      m('gebaeude_haustuer_offen', '-', 'Jederzeit von außen frei zugänglicher Hauseingang/Treppenhaus'),
      m('gebaeude_instandhaltung_schlecht', '-', 'Schlechter Instandhaltungszustand (z.B. dauernde Durchfeuchtung des Mauerwerks - auch Keller -, große Putzschäden, erhebliche Schäden an der Dacheindeckung)', { followUp: 'maengel' }),
      m('gebaeude_seitenfluegel', '-', 'Lage im Seitenflügel oder Quergebäude bei verdichteter Bebauung', { followUp: 'seitenfluegelRaeume' }),
      m('gebaeude_kein_aufzug_ab5', '-', 'Wohnung ab fünftem Obergeschoss ohne Personenaufzug (gilt nicht für die Baualtersklassen bis 1949)', { cond: { minYear: 1950 } }),
      m('gebaeude_keine_sprechanlage', '-', 'Keine Gegen-/Wechselsprechanlage mit elektrischem Türöffner'),
      m('gebaeude_daemmung_schlecht', '-', 'Unzureichende Wärmedämmung oder Heizanlage mit ungünstigem Wirkungsgrad (Einbau/Installation vor 1995)', { followUp: 'daemmung' }),
      m('gebaeude_fahrradraum', '+', 'Abschließbarer leicht zugänglicher Fahrradabstellraum innerhalb des Gebäudes oder Fahrradabstellplätze mit Anschließmöglichkeit außerhalb des Gebäudes auf dem Grundstück (ausreichend dimensioniert)'),
      m('gebaeude_zusatzraeume', '+', 'Zusätzliche und in angemessenem Umfang nutzbare Räume außerhalb der Wohnung in fußläufiger Entfernung (z.B. Gemeinschaftsraum, Gäste-Wohnung Trockenraum)', { followUp: 'zusatzraeume' }),
      m('gebaeude_eingang_repraesentativ', '+', 'Repräsentativer/s oder hochwertig sanierter/s Eingangsbereich/Treppenhaus (z.B. Spiegel, Marmor, exklusive Beleuchtung, hochwertiger Anstrich/Wandbelag, Läufer im gesamten Flur- und Treppenbereich)'),
      m('gebaeude_instandhaltung_gut', '+', 'Überdurchschnittlich guter Instandhaltungszustand des Gebäude(-teil)s, indem sich die Wohnung befindet (z.B. erneuerte Fassade, Dach) (gilt für die Baualtersklassen bis einschließlich 2015)', { cond: { maxYear: 2015 } }),
      m('gebaeude_videosprechanlage', '+', 'Gegen-/Wechselsprechanlage mit Videokontakt und elektrischem Türöffner'),
      m('gebaeude_aufzug', '+', 'Personenaufzug bei weniger als fünf Obergeschossen; gilt nicht für die Baualtersklassen ab 2010', { cond: { maxYear: 2009 } }),
      m('gebaeude_schwellenarm', '+', 'Schwellenarmer Zugang zum Gebäude (max. eine Stufe) und zur Wohnung einschließlich Treppenhaus (max. eine Stufe)'),
      m('gebaeude_daemmung_gut', '+', 'Wärmedämmung zusätzlich zur vorhandenen Bausubstanz oder Einbau/Installation einer modernen Heizanlage ab 2009 (wenn Bezugsfertigkeit des Gebäudes/der Wohnung vor diesem Zeitpunkt)', { cond: { maxYear: 2008 }, followUp: 'daemmung' }),
      ...energy('(End-)Energieverbrauchskennwert', [145, 195, 235], [120, 100, 80]),
    ],
    notesDe: ENERGY_NOTES_2026,
  },
  {
    id: 'umfeld',
    titleDe: 'Merkmalgruppe 5: Wohnumfeld',
    merkmale: [
      m('umfeld_laerm', '-', 'Besonders lärmbelastete Lage der Wohnung (Die Wohnung liegt beispielsweise an einer Hauptverkehrsstraße oder im unmittelbaren Umfeld eines Flughafens und erfährt dadurch unangenehme Lärm- und Staubemissionen. Daneben können auch große Fabrik- und Industrieanlagen, aber auch Gewerbe-, Restaurant- und Partylärm Ursache für eine besonders lärmbelastete Lage sein.)', { followUp: 'laerm' }),
      m('umfeld_geruch', '-', 'Besonders geruchsbelastete Lage', { followUp: 'geruch' }),
      m('umfeld_keine_fahrradplaetze', '-', 'Keine Fahrradabstellmöglichkeit auf dem Grundstück'),
      m('umfeld_ruhig', '+', 'Besonders ruhige Lage (Die Wohnung liegt beispielsweise an einer verkehrsberuhigten Straße, oder an einer parkähnlichen Anlage oder es gibt bauliche Einschränkungen für die Straßen, wie z.B. Poller, Verengung der Fahrbahn, Bepflanzung.)'),
      m('umfeld_gestaltet', '+', 'Aufwändig gestaltetes Wohnumfeld auf dem Grundstück (z.B. Kinderspielplatz – bei Bezugsfertigkeit des Gebäudes vor 2003, Sitzbänke oder Ruhezonen, gute Gehwegbefestigung mit Grünflächen und Beleuchtung)', { followUp: 'wohnumfeld' }),
      m('umfeld_parkplatz', '+', 'Vom Vermieter zur Verfügung gestelltes PKW-Parkplatzangebot in der Nähe (ausreichend dimensioniert)'),
      m('umfeld_garten', '+', 'Garten zur alleinigen Nutzung/Mietergarten ohne Entgelt oder zur Wohnung gehörender Garten mit direktem Zugang'),
    ],
    notesDe: [
      'Hinweise auf bestehende Lärmbelastung von Wohngebäuden werden durch die Senatsverwaltung für Mobilität, Verkehr, Klimaschutz und Umwelt bereitgestellt. Die Strategischen Lärmkarten mit einer gebäudescharfen Darstellung der Fassadenpegel an lärmbeeinflussten Wohngebäuden sind auf der Internetseite dieser Senatsverwaltung veröffentlicht.',
    ],
  },
];

/* ------------------------------------------------------------------------------------------ */
/* 2024 (Mietspiegel 2024, Verträge 1.9.2023 – 31.8.2025)                                       */
/* ------------------------------------------------------------------------------------------ */

const groups2024: MerkmalGroup[] = [
  {
    id: 'bad',
    titleDe: 'Merkmalgruppe 1: Bad/WC/Gäste-WC',
    merkmale: [
      m('bad_kein_waschbecken', '-', 'Kein Handwaschbecken in Bad oder WC oder im Bad nur ein kleines Handwaschbecken (Außenmaß 50 x 25 cm oder kleiner)' + NG),
      m('bad_wc_keine_lueftung', '-', 'WC ohne Lüftungsmöglichkeit und Entlüftung' + NG),
      m('bad_dielen', '-', 'Dielenfußboden im Bad (wenn nicht feuchtraumgeeignet)' + NG),
      m('bad_nicht_beheizbar', '-', 'Bad oder WC nicht beheizbar oder Holz-/Kohleheizung oder Elektroheizstrahler' + NG),
      m('bad_kein_warmwasser', '-', 'Keine ausreichende Warmwasserversorgung (keine zentrale Warmwasserversorgung, kein Durchlauferhitzer, kein Boiler > 60 Liter)' + NG),
      m('bad_freistehende_wanne', '-', 'Bad ohne separate Dusche mit frei stehender Badewanne mit oder ohne Verblendung in nicht modernisiertem Bad'),
      m('bad_waende_nicht_gefliest', '-', 'Wände nicht ausreichend im Spritzwasserbereich von Waschbecken, Badewanne und/oder Dusche gefliest' + NG),
      m('bad_ohne_fenster', '-', 'Bad mit WC ohne Fenster; gilt nicht für die Baualtersklasse 1973 bis 1990 Ost', { cond: { notEast7390: true } }),
      m('bad_keine_dusche', '-', 'Keine Duschmöglichkeit (z.B. kein Spritzwasserschutz, keine Duschkopfhalterung, sehr kleine Standfläche)'),
      m('bad_klein', '-', 'Kleines Bad (kleiner als 4 m²); gilt nicht in der Baualtersklasse 1973 bis 1990 Ost', { cond: { notEast7390: true } }),
      m('bad_grosses_waschbecken', '+', 'Sehr großes Waschbecken (Außenmaß mindestens 80 cm breit) oder Doppelhandwaschbecken oder zwei getrennte Waschbecken' + NG),
      m('bad_hochwertig', '+', 'Besondere und hochwertige Ausstattung (z.B. hochwertige Sanitärausstattung, hochwertige Badmöbel, Eckwanne, Rundwanne)' + NG),
      m('bad_innen_lueftung', '+', 'Innen liegendes Badezimmer mit moderner, gesteuerter Entlüftung (z.B. mittels Feuchtigkeitssensor)' + NG),
      m('bad_zweites_wc', '+', 'Zweites WC in der Wohnung oder Bad und WC getrennt'),
      m('bad_gross', '+', 'Mindestens ein Bad größer als 8 m²' + NG),
      m('bad_fussbodenheizung', '+', 'Fußbodenheizung' + NG),
      m('bad_fliesen_hochwertig', '+', 'Wandbekleidung und Bodenbelag hochwertig; gilt nicht für die Baualtersklasse 2016 bis 2022' + NG, { cond: { notBetween: [2016, 2022] } }),
      m('bad_wandhaengendes_wc', '+', 'Wandhängendes WC mit in der Wand eingelassenem Spülkasten (gilt nicht in der Baualtersklasse ab 2002) oder hochwertiges Stand-WC [bezieht sich beides nicht auf Gäste-WCs]'),
      m('bad_strukturheizkoerper', '+', 'Strukturheizkörper als Handtuchwärmer im Bad (Baualtersklassen bis einschließlich 2001); falls elektrisch betreibbar: alle Baujahre' + NG),
      m('bad_separate_dusche', '+', 'Von der Badewanne getrennte zusätzliche Duschtasse oder -kabine'),
      m('bad_bodengleiche_dusche', '+', 'Bodengleiche Dusche (auch flache Duschtasse mit einer Tiefe von bis zu 3 cm)'),
    ],
  },
  {
    id: 'kueche',
    titleDe: 'Merkmalgruppe 2: Küche',
    merkmale: groups2026[1].merkmale.map((x) =>
      x.id === 'kueche_gross' ? { ...x, de: 'separate Küche mit mind. 14 m² Grundfläche' } : x,
    ),
  },
  {
    id: 'wohnung',
    titleDe: 'Merkmalgruppe 3: Wohnung',
    merkmale: [
      m('wohnung_einfachverglasung', '-', 'Überwiegend Einfachverglasung (Doppel-Kastenfenster sind nicht gemeint)', { followUp: 'raeumeEinfachfenster' }),
      m('wohnung_elektro_unzureichend', '-', 'Unzureichende Elektroinstallation, z.B. keine ausreichende Elektrosteigeleitung und/oder VDE-gerechte Elektroinstallation (z.B. kein FI-Schalter, Potentialausgleich)'),
      m('wohnung_elektro_aufputz', '-', 'Elektroleitungen überwiegend sichtbar auf Putz', { followUp: 'raeumeElektro' }),
      m('wohnung_leitungen_aufputz', '-', 'Be- und Entwässerungsinstallation überwiegend auf Putz', { followUp: 'raeumeLeitungen' }),
      m('wohnung_keine_waschmaschine', '-', 'Waschmaschine weder in Bad noch Küche stellbar oder nicht anschließbar'),
      m('wohnung_schlechter_schnitt', '-', 'Schlechter Schnitt (z.B. gefangenes Zimmer und/oder Durchgangszimmer)'),
      m('wohnung_kein_balkon', '-', 'Kein Balkon, (Dach-)Terrasse, Loggia und Winter-/Dachgarten (gilt nicht, wenn das Merkmal aus baulichen und/oder rechtlichen Gründen nicht möglich oder nicht zulässig ist)', { followUp: 'balkonGrund' }),
      m('wohnung_einbauschrank', '+', 'Einbauschrank oder Abstellraum innerhalb der Wohnung'),
      m('wohnung_balkon', '+', 'Großer, geräumiger Balkon, (Dach-)Terrasse, Loggia oder Wintergarten (ab 4 m²)'),
      m('wohnung_fussbodenheizung', '+', 'Überwiegend Fußbodenheizung', { followUp: 'raeumeFussbodenheizung' }),
      m('wohnung_stuck', '+', 'Aufwändige Decken- und/oder Wandverkleidung (z.B. Stuck, Täfelung) in gutem Zustand in der überwiegenden Anzahl der Wohnräume', { followUp: 'raeumeStuck' }),
      m('wohnung_heizungsrohre', '+', 'Heizungsrohre überwiegend nicht sichtbar (gilt für Baualtersklassen bis einschließlich 1990)', { cond: { maxYear: 1990 } }),
      m('wohnung_rolllaeden', '+', 'Rollläden'),
      m('wohnung_barrierearm', '+', 'Barrierearme Wohnungsgestaltung (Schwellenfreiheit in der Wohnung, schwellenarmer Übergang zu Balkon/Terrasse, ausreichende Bewegungsfreiheit in der Wohnung und/oder barrierearme Badgestaltung)'),
      m('wohnung_raum_40', '+', 'Ein Wohnraum größer als 40 m²'),
      m('wohnung_parkett', '+', 'Hochwertiges Parkett, Natur-/Kunststein, Fliesen oder gleichwertiger Boden/-belag in der überwiegenden Zahl der Wohnräume'),
      m('wohnung_waermeschutzfenster', '+', 'Wohngebäude/Wohnungen die vor 2002 bezugsfertig geworden sind: überwiegend Wärmeschutzverglasung (Einbau ab 2002) oder Schallschutzfenster', { cond: { maxYear: 2001 } }),
      m('wohnung_einbruchschutz_tuer', '+', 'Zusätzliche Einbruchssicherung für die Wohnungstür (z.B. hochwertige Sperrbügel und/oder Türschlösser mit Mehrfachverriegelung) bei verstärkten Türen'),
    ],
  },
  {
    id: 'gebaeude',
    titleDe: 'Merkmalgruppe 4: Gebäude',
    merkmale: groups2026[3].merkmale.map((x) => {
      switch (x.id) {
        case 'gebaeude_haustuer_offen':
          return { ...x, de: 'Jederzeit von außen frei zugänglicher Hauseingang' };
        case 'gebaeude_zusatzraeume':
          return { ...x, de: 'Zusätzliche und in angemessenem Umfang nutzbare Räume außerhalb der Wohnung in fußläufiger Entfernung (z.B. Gemeinschaftsraum)' };
        case 'gebaeude_instandhaltung_gut':
          return { ...x, de: 'Überdurchschnittlich guter Instandhaltungszustand des Gebäude(-teil)s, indem sich die Wohnung befindet (z.B. erneuerte Fassade, Dach) (gilt für die Baualtersklassen bis einschließlich 2015)' };
        default:
          return x.id.startsWith('energie_') ? { ...x, de: x.de.replace('(End-)', '') } : x;
      }
    }),
    notesDe: ENERGY_NOTES_OLD,
  },
  {
    id: 'umfeld',
    titleDe: 'Merkmalgruppe 5: Wohnumfeld',
    merkmale: [
      m('umfeld_vernachlaessigt', '-', 'Lage in stark vernachlässigter Umgebung', { followUp: 'vernachlaessigung' }),
      m('umfeld_laerm', '-', 'Besonders lärmbelastete Lage der Wohnung (Die Wohnung liegt beispielsweise an einer Hauptverkehrsstraße oder im unmittelbaren Umfeld eines Flughafens und erfährt dadurch unangenehme Lärm- und Staubemissionen. Daneben können auch große Fabrik- und Industrieanlagen, aber auch Gewerbe-, Restaurant- und Partylärm Ursache für eine besonders lärmbelastete Lage sein.)', { followUp: 'laerm' }),
      m('umfeld_geruch', '-', 'Besonders geruchsbelastete Lage', { followUp: 'geruch' }),
      m('umfeld_keine_fahrradplaetze', '-', 'Keine Fahrradabstellmöglichkeit auf dem Grundstück'),
      m('umfeld_citylage', '+', 'Bevorzugte Citylage (nahe repräsentativen, überregional ausstrahlenden Einkaufs-, Dienstleistungs- und Wohnstandorten)'),
      m('umfeld_ruhig', '+', 'Besonders ruhige Lage (Die Wohnung liegt beispielsweise an einer verkehrsberuhigten Straße, oder an einer parkähnlichen Anlage oder es gibt bauliche Einschränkungen für die Straßen, wie z.B. Poller, Verengung der Fahrbahn, Bepflanzung.)'),
      m('umfeld_gestaltet', '+', 'Aufwändig gestaltetes Wohnumfeld auf dem Grundstück (z.B. Kinderspielplatz – bei Bezugsfertigkeit des Gebäudes vor 2002, Sitzbänke oder Ruhezonen, gute Gehwegbefestigung mit Grünflächen und Beleuchtung)', { followUp: 'wohnumfeld' }),
      m('umfeld_parkplatz', '+', 'Vom Vermieter zur Verfügung gestelltes PKW-Parkplatzangebot in der Nähe (ausreichend dimensioniert)'),
      m('umfeld_garten', '+', 'Garten zur alleinigen Nutzung/Mietergarten ohne Entgelt oder zur Wohnung gehörender Garten mit direktem Zugang'),
    ],
  },
];

/* ------------------------------------------------------------------------------------------ */
/* 2019 / 2021 / 2023 (inhaltlich identisch) und 2017 (kleine Abweichungen)                      */
/* ------------------------------------------------------------------------------------------ */

function groups2017to2023(is2017: boolean): MerkmalGroup[] {
  return [
    {
      id: 'bad',
      titleDe: 'Merkmalgruppe 1: Bad/WC',
      merkmale: [
        m('bad_kein_waschbecken', '-', 'Kein Handwaschbecken in Bad oder WC oder im Bad nur ein kleines Handwaschbecken (Außenmaß 50 x 25 cm oder kleiner)'),
        m('bad_wc_keine_lueftung', '-', 'WC ohne Lüftungsmöglichkeit und Entlüftung'),
        m('bad_dielen', '-', is2017 ? 'Dielenfußboden im Bad' : 'Dielenfußboden im Bad (wenn nicht feuchtraumgeeignet)'),
        m('bad_nicht_beheizbar', '-', 'Bad oder WC nicht beheizbar oder Holz-/Kohleheizung oder Elektroheizstrahler'),
        m('bad_kein_warmwasser', '-', 'Keine ausreichende Warmwasserversorgung (keine zentrale Warmwasserversorgung, kein Durchlauferhitzer, kein Boiler > 60 Liter)'),
        m('bad_freistehende_wanne', '-', 'Bad ohne separate Dusche mit frei stehender Badewanne mit oder ohne Verblendung in nicht modernisiertem Bad'),
        m('bad_waende_nicht_gefliest', '-', 'Wände nicht ausreichend im Spritzwasserbereich von Waschbecken, Badewanne und/oder Dusche gefliest'),
        m('bad_ohne_fenster', '-', 'Bad mit WC ohne Fenster'),
        m('bad_keine_dusche', '-', 'Keine Duschmöglichkeit'),
        m('bad_klein', '-', 'Kleines Bad (kleiner als 4 m²); gilt nicht in der Baualtersklasse 1973 bis 1990 Ost', { cond: { notEast7390: true } }),
        m('bad_grosses_waschbecken', '+', 'Sehr großes Waschbecken (Außenmaß mindestens 80 cm breit) oder Doppelhandwaschbecken oder zwei getrennte Waschbecken'),
        m('bad_hochwertig', '+', 'Besondere und hochwertige Ausstattung (z.B. hochwertige Sanitärausstattung, hochwertige Badmöbel, Eckwanne, Rundwanne)'),
        m('bad_innen_lueftung', '+', 'Innen liegendes Badezimmer mit moderner, gesteuerter Entlüftung (z.B. mittels Feuchtigkeitssensor)'),
        m('bad_zweites_wc', '+', 'Zweites WC in der Wohnung oder Bad und WC getrennt'),
        m('bad_gross', '+', 'Mindestens ein Bad größer als 8 m²'),
        m('bad_fussbodenheizung', '+', 'Fußbodenheizung'),
        m('bad_fliesen_hochwertig', '+', 'Wandbekleidung und Bodenbelag hochwertig'),
        is2017
          ? m('bad_wandhaengendes_wc', '+', 'Wandhängendes WC mit in der Wand eingelassenem Spülkasten')
          : m('bad_wandhaengendes_wc', '+', 'Wandhängendes WC mit in der Wand eingelassenem Spülkasten; gilt nicht in der Baualtersklasse ab 2003', { cond: { maxYear: 2002 } }),
        m('bad_strukturheizkoerper', '+', 'Strukturheizkörper als Handtuchwärmer'),
        m('bad_separate_dusche', '+', 'Von der Badewanne getrennte zusätzliche Duschtasse oder -kabine'),
      ],
    },
    {
      id: 'kueche',
      titleDe: 'Merkmalgruppe 2: Küche',
      merkmale: [
        m('kueche_ohne_fenster', '-', 'Küche ohne Fenster und ohne ausreichende Entlüftung'),
        m('kueche_kein_herd', '-', 'Keine Kochmöglichkeit oder Gas-/Elektroherd ohne Backofen'),
        m('kueche_keine_spuele', '-', 'Keine Spüle'),
        m('kueche_kein_warmwasser', '-', 'Keine ausreichende Warmwasserversorgung (z.B. keine zentrale Warmwasserversorgung, kein Durchlauferhitzer, kein Boiler)'),
        m('kueche_nicht_beheizbar', '-', 'Küche nicht beheizbar oder Holz-/Kohleheizung'),
        m('kueche_kein_geschirrspueler', '-', 'Geschirrspüler in der Küche nicht stellbar oder anschließbar'),
        m('kueche_boden', '+', 'Hochwertige Fliesen, hochwertiges Linoleum, hochwertiges Feuchtraumlaminat, Parkett, Terrazzo als Bodenbelag jeweils in gutem Zustand'),
        m('kueche_gross', '+', 'separate Küche mit mind. 14 m² Grundfläche', { followUp: 'kuecheGroesse' }),
        m('kueche_einbaukueche', '+', 'Einbauküche mit Ober- und Unterschränken sowie Herd und Spüle'),
        m('kueche_ceran', '+', 'Ceran-Kochfeld oder Induktions-Kochfeld'),
        m('kueche_dunstabzug', '+', 'Dunstabzug'),
        m('kueche_kuehlschrank', '+', 'Kühlschrank'),
      ],
    },
    {
      id: 'wohnung',
      titleDe: 'Merkmalgruppe 3: Wohnung',
      merkmale: [
        m('wohnung_einfachverglasung', '-', 'Überwiegend Einfachverglasung', { followUp: 'raeumeEinfachfenster' }),
        m('wohnung_elektro_unzureichend', '-', 'Unzureichende Elektroinstallation, z.B. keine ausreichende Elektrosteigeleitung und/oder VDE-gerechte Elektroinstallation (z.B. kein FI-Schalter, Potentialausgleich)'),
        m('wohnung_elektro_aufputz', '-', 'Elektroinstallation überwiegend sichtbar auf Putz', { followUp: 'raeumeElektro' }),
        m('wohnung_leitungen_aufputz', '-', 'Be- und Entwässerungsinstallation überwiegend auf Putz', { followUp: 'raeumeLeitungen' }),
        m('wohnung_keine_waschmaschine', '-', 'Waschmaschine weder in Bad noch Küche stellbar oder nicht anschließbar'),
        m('wohnung_schlechter_schnitt', '-', is2017 ? 'Schlechter Schnitt (z.B. gefangener Raum und/oder Durchgangsraum)' : 'Schlechter Schnitt (z.B. gefangenes Zimmer und/oder Durchgangszimmer)'),
        m('wohnung_kein_balkon', '-', 'Kein Balkon, (Dach-)Terrasse, Loggia und Winter-/Dachgarten (gilt nicht, wenn das Merkmal aus baulichen und/oder rechtlichen Gründen nicht möglich oder nicht zulässig ist)', { followUp: 'balkonGrund' }),
        m('wohnung_einbauschrank', '+', 'Einbauschrank oder Abstellraum innerhalb der Wohnung'),
        m('wohnung_balkon', '+', 'Großer, geräumiger Balkon, (Dach-)Terrasse, Loggia oder Wintergarten (ab 4 m²)'),
        m('wohnung_fussbodenheizung', '+', 'Überwiegend Fußbodenheizung', { followUp: 'raeumeFussbodenheizung' }),
        m('wohnung_stuck', '+', 'Aufwändige Decken- und/oder Wandverkleidung (z.B. Stuck, Täfelung) in gutem Zustand in der überwiegenden Anzahl der Wohnräume', { followUp: 'raeumeStuck' }),
        m('wohnung_heizungsrohre', '+', 'Heizungsrohre überwiegend nicht sichtbar'),
        m('wohnung_rolllaeden', '+', 'Rollläden'),
        is2017
          ? m('wohnung_kaltwasserzaehler', '+', 'Wohnungsbezogener Kaltwasserzähler in vor 1998 bezugsfertigen Gebäuden/Wohnungen, wenn der Mieter nicht die Kosten für Miete oder Leasing im Rahmen der Betriebskosten trägt', { cond: { maxYear: 1997 } })
          : m('wohnung_kaltwasserzaehler', '+', 'Wohnungsbezogener Kaltwasserzähler in vor 1991 bezugsfertigen Gebäuden/Wohnungen, wenn der Mieter nicht die Kosten für Miete oder Leasing im Rahmen der Betriebskosten trägt', { cond: { maxYear: 1990 } }),
        m('wohnung_raum_40', '+', 'Ein Wohnraum größer als 40 m²'),
        m('wohnung_barrierearm', '+', 'Barrierearme Wohnungsgestaltung (Schwellenfreiheit in der Wohnung, schwellenarmer Übergang zu Balkon/Terrasse, ausreichende Bewegungsfreiheit in der Wohnung und/oder barrierearme Badgestaltung)'),
        m('wohnung_parkett', '+', 'Hochwertiges Parkett, Natur-/Kunststein, Fliesen oder gleichwertiger Boden/-belag in der überwiegenden Zahl der Wohnräume'),
        is2017
          ? m('wohnung_waermeschutzfenster', '+', 'Überwiegend Wärmeschutzverglasung (Einbau ab 1995) oder Schallschutzfenster für Wohngebäude/Wohnungen, die vor 1995 bezugsfertig geworden sind', { cond: { maxYear: 1994 } })
          : m('wohnung_waermeschutzfenster', '+', 'Wohngebäude/Wohnungen die vor 2002 bezugsfertig geworden sind: überwiegend Wärmeschutzverglasung (Einbau ab 2002) oder Schallschutzfenster', { cond: { maxYear: 2001 } }),
        m('wohnung_einbruchschutz_tuer', '+', 'Zusätzliche Einbruchssicherung für die Wohnungstür (z.B. hochwertige Sperrbügel und/oder Türschlösser mit Mehrfachverriegelung) bei verstärkten Türen'),
      ],
    },
    {
      id: 'gebaeude',
      titleDe: 'Merkmalgruppe 4: Gebäude',
      merkmale: [
        m('gebaeude_treppenhaus_schlecht', '-', 'Treppenhaus/Eingangsbereich überwiegend in schlechtem Zustand', { followUp: 'treppenhausDetails' }),
        m('gebaeude_kein_keller', '-', 'Kein Mieterkeller oder Kellerersatzraum zur alleinigen Nutzung des Mieters vorhanden'),
        m('gebaeude_haustuer_offen', '-', 'Hauseingangstür nicht abschließbar'),
        m('gebaeude_instandhaltung_schlecht', '-', 'Schlechter Instandhaltungszustand (z.B. dauernde Durchfeuchtung des Mauerwerks - auch Keller -, große Putzschäden, erhebliche Schäden an der Dacheindeckung)', { followUp: 'maengel' }),
        m('gebaeude_seitenfluegel', '-', 'Lage im Seitenflügel oder Quergebäude bei verdichteter Bebauung', { followUp: 'seitenfluegelRaeume' }),
        m('gebaeude_kein_aufzug_ab5', '-', 'Wohnung ab fünftem Obergeschoss ohne Personenaufzug'),
        m('gebaeude_keine_sprechanlage', '-', 'Keine Gegen-/Wechselsprechanlage mit elektrischem Türöffner'),
        m('gebaeude_daemmung_schlecht', '-', 'Unzureichende Wärmedämmung oder Heizanlage mit ungünstigem Wirkungsgrad (Einbau/Installation vor 1988)', { followUp: 'daemmung' }),
        m('gebaeude_fahrradraum', '+', is2017
          ? 'Abschließbarer leicht zugänglicher Fahrradabstellraum innerhalb des Gebäudes oder Fahrradabstellplätze mit Anschließmöglichkeit außerhalb des Gebäudes auf dem Grundstück'
          : 'Abschließbarer leicht zugänglicher Fahrradabstellraum innerhalb des Gebäudes oder Fahrradabstellplätze mit Anschließmöglichkeit außerhalb des Gebäudes auf dem Grundstück (ausreichend dimensioniert)'),
        m('gebaeude_zusatzraeume', '+', `Zusätzliche und in angemessenem Umfang nutzbare Räume außerhalb der Wohnung in fußläufiger Entfernung (z.B. ${is2017 ? 'Partyraum' : 'Gemeinschaftsraum'})`, { followUp: 'zusatzraeume' }),
        m('gebaeude_eingang_repraesentativ', '+', 'Repräsentativer/s oder hochwertig sanierter/s Eingangsbereich/Treppenhaus (z.B. Spiegel, Marmor, exklusive Beleuchtung, hochwertiger Anstrich / Wandbelag, Läufer im gesamten Flur- und Treppenbereich)'),
        m('gebaeude_instandhaltung_gut', '+', 'Überdurchschnittlich guter Instandhaltungszustand des Gebäude(-teil)s, indem sich die Wohnung befindet (z.B. erneuerte Fassade, Dach)'),
        m('gebaeude_videosprechanlage', '+', 'Gegen-/Wechselsprechanlage mit Videokontakt und elektrischem Türöffner'),
        m('gebaeude_aufzug', '+', 'Personenaufzug bei weniger als fünf Obergeschossen'),
        m('gebaeude_daemmung_gut', '+', 'Wärmedämmung zusätzlich zur vorhandenen Bausubstanz oder Einbau/Installation einer modernen Heizanlage nach dem 1.1.2003 (wenn Bezugsfertigkeit des Gebäudes/der Wohnung vor diesem Zeitpunkt)', { cond: { maxYear: 2002 }, followUp: 'daemmung' }),
        ...energy('Energieverbrauchskennwert', [155, 195, 235], [120, 100, 80]),
      ],
      notesDe: ENERGY_NOTES_OLD,
    },
    {
      id: 'umfeld',
      titleDe: 'Merkmalgruppe 5: Wohnumfeld',
      merkmale: [
        m('umfeld_vernachlaessigt', '-', is2017 ? 'Lage in stark vernachlässigter Umgebung in einfacher Wohnlage' : 'Lage in stark vernachlässigter Umgebung', { followUp: 'vernachlaessigung' }),
        m('umfeld_laerm', '-', 'Besonders lärmbelastete Lage (ein Indiz hierfür kann die Ausweisung einer hohen Verkehrslärmbelastung gemäß Erläuterungen unter Nr. 12 des Mietspiegelheftes sein)', { followUp: 'laerm' }),
        m('umfeld_geruch', '-', 'Besonders geruchsbelastete Lage', { followUp: 'geruch' }),
        m('umfeld_keine_fahrradplaetze', '-', 'Keine Fahrradabstellmöglichkeit auf dem Grundstück'),
        m('umfeld_citylage', '+', 'Bevorzugte Citylage (nahe repräsentativen, überregional ausstrahlenden Einkaufs-, Dienstleistungs- und Wohnstandorten)'),
        m('umfeld_ruhig', '+', 'Besonders ruhige Lage'),
        m('umfeld_gestaltet', '+', 'Aufwändig gestaltetes Wohnumfeld auf dem Grundstück (z.B. Kinderspielplatz – bei Bezugsfertigkeit des Gebäudes vor 2003, Sitzbänke oder Ruhezonen, gute Gehwegbefestigung mit Grünflächen und Beleuchtung)', { followUp: 'wohnumfeld' }),
        m('umfeld_parkplatz', '+', is2017 ? 'Vom Vermieter zur Verfügung gestelltes PKW-Parkplatzangebot in der Nähe' : 'Vom Vermieter zur Verfügung gestelltes PKW-Parkplatzangebot in der Nähe (ausreichend dimensioniert)'),
        m('umfeld_garten', '+', 'Garten zur alleinigen Nutzung/Mietergarten ohne Entgelt oder zur Wohnung gehörender Garten mit direktem Zugang'),
      ],
    },
  ];
}

/* ------------------------------------------------------------------------------------------ */
/* 2015 (Mietspiegel 2015, Verträge 1.6.2015 – 31.8.2016) mit Sondermerkmalen                   */
/* ------------------------------------------------------------------------------------------ */

const groups2015: MerkmalGroup[] = [
  {
    id: 'bad',
    titleDe: 'Merkmalgruppe 1: Bad/WC',
    merkmale: [
      m('bad_kein_waschbecken', '-', 'Kein Handwaschbecken in Bad oder WC oder im Bad nur ein kleines Handwaschbecken (Außenmaß 50 x 25 cm oder kleiner)'),
      m('bad_wc_keine_lueftung', '-', 'WC ohne Lüftungsmöglichkeit oder Entlüftung'),
      m('bad_dielen', '-', 'Dielenfußboden im Bad'),
      m('bad_nicht_beheizbar', '-', 'Badezimmer oder WC nicht beheizbar oder Holz-/Kohleheizung oder Elektroheizstrahler'),
      m('bad_kein_warmwasser', '-', 'Keine ausreichende Warmwasserversorgung (keine zentrale Warmwasserversorgung, kein Durchlauferhitzer, kein Boiler > 60 Liter)'),
      m('bad_freistehende_wanne', '-', 'Bad ohne separate Dusche mit frei stehender Wanne mit oder ohne Verblendung in nicht modernisiertem Bad'),
      m('bad_waende_nicht_gefliest', '-', 'Wände nicht überwiegend gefliest'),
      m('bad_ohne_fenster', '-', 'Bad mit WC ohne Fenster'),
      m('bad_keine_dusche', '-', 'Keine Duschmöglichkeit'),
      m('bad_klein', '-', 'Kleines Bad (kleiner als 4 m²) – nur wenn Sondermerkmal „kleines Bad (kleiner als 4 m²)“ nicht zutrifft', { cond: { unlessSonder: 'sm_kleines_bad' } }),
      m('bad_grosses_waschbecken', '+', 'Sehr großes Waschbecken (Außenmaß mindestens 80 cm breit) oder Doppelhandwaschbecken oder zwei getrennte Waschbecken'),
      m('bad_hochwertig', '+', 'Besondere und hochwertige Ausstattung (z.B. hochwertige Sanitärausstattung, hochwertige Badmöbel, Eckwanne, Rundwanne)'),
      m('bad_innen_lueftung', '+', 'Innen liegendes Badezimmer mit moderner, gesteuerter Entlüftung (z.B. mittels Feuchtigkeitssensor)'),
      m('bad_zweites_wc', '+', 'Zweites WC in der Wohnung / Bad und WC getrennt'),
      m('bad_gross', '+', 'Mindestens ein Bad größer als 8 m²'),
      m('bad_fussbodenheizung', '+', 'Fußbodenheizung'),
      m('bad_fliesen_hochwertig', '+', 'Hochwertige Boden- oder Wandfliesen'),
      m('bad_wandhaengendes_wc', '+', 'Wandhängendes WC mit in der Wand eingelassenem Spülkasten – nur wenn Sondermerkmal „Modernes Bad“ nicht zutrifft', { cond: { unlessSonder: 'sm_modernes_bad' } }),
      m('bad_strukturheizkoerper', '+', 'Strukturheizkörper als Handtuchwärmer – nur wenn Sondermerkmal „Modernes Bad“ nicht zutrifft', { cond: { unlessSonder: 'sm_modernes_bad' } }),
      m('bad_einhebelmischer', '+', 'Einhebelmischbatterie – nur wenn Sondermerkmal „Modernes Bad“ nicht zutrifft', { cond: { unlessSonder: 'sm_modernes_bad' } }),
      m('bad_separate_dusche', '+', 'Von der Badewanne getrennte Dusche – nur wenn Sondermerkmal „Von der Badewanne getrennte Dusche“ nicht zutrifft', { cond: { unlessSonder: 'sm_dusche' } }),
    ],
  },
  {
    id: 'kueche',
    titleDe: 'Merkmalgruppe 2: Küche',
    merkmale: [
      m('kueche_ohne_fenster', '-', 'Küche ohne Fenster und ohne ausreichende Entlüftung'),
      m('kueche_kein_herd', '-', 'Keine Kochmöglichkeit oder Gas-/Elektroherd ohne Backofen'),
      m('kueche_keine_spuele', '-', 'Keine Spüle'),
      m('kueche_kein_warmwasser', '-', 'Keine ausreichende Warmwasserversorgung (keine zentrale Warmwasserversorgung, kein Durchlauferhitzer, kein Boiler an der Spüle)'),
      m('kueche_nicht_beheizbar', '-', 'Küche nicht beheizbar oder Holz-/Kohleheizung'),
      m('kueche_kein_geschirrspueler', '-', 'Geschirrspüler in der Küche nicht stellbar oder anschließbar'),
      m('kueche_boden', '+', 'Als Bodenbelag hochwertige Fliesen, hochwertiges Linoleum, hochwertiges Feuchtraumlaminat, Parkett oder Terrazzo in gutem Zustand'),
      m('kueche_gross', '+', 'Wohnküche (separater Raum mit mind. 14 m² Grundfläche)', { followUp: 'kuecheGroesse' }),
      m('kueche_einbaukueche', '+', 'Einbauküche mit Ober- und Unterschränken sowie Herd und Spüle – nur wenn Sondermerkmal „Moderne Küchenausstattung“ nicht zutrifft', { cond: { unlessSonder: 'sm_kueche' } }),
      m('kueche_ceran', '+', 'Ceran-Kochfeld oder Induktions-Kochfeld – nur wenn Sondermerkmal „Moderne Küchenausstattung“ nicht zutrifft', { cond: { unlessSonder: 'sm_kueche' } }),
      m('kueche_dunstabzug', '+', 'Dunstabzugshaube – nur wenn Sondermerkmal „Moderne Küchenausstattung“ nicht zutrifft', { cond: { unlessSonder: 'sm_kueche' } }),
      m('kueche_kuehlschrank', '+', 'Kühlschrank – nur wenn Sondermerkmal „Moderne Küchenausstattung“ nicht zutrifft', { cond: { unlessSonder: 'sm_kueche' } }),
    ],
  },
  {
    id: 'wohnung',
    titleDe: 'Merkmalgruppe 3: Wohnung',
    merkmale: [
      m('wohnung_einfachverglasung', '-', 'Überwiegend Einfachverglasung', { followUp: 'raeumeEinfachfenster' }),
      m('wohnung_elektro_unzureichend', '-', 'Unzureichende Elektroinstallation: Kein gleichzeitiger Betrieb von mindestens zwei haushaltsüblichen größeren Elektrogeräten (z.B. Waschmaschine und Staubsauger) möglich oder weniger als zwei Steckdosen in Wohnräumen'),
      m('wohnung_elektro_aufputz', '-', 'Elektroinstallation überwiegend sichtbar auf Putz'),
      m('wohnung_leitungen_aufputz', '-', 'Be- und Entwässerungsinstallation überwiegend auf Putz'),
      m('wohnung_keine_waschmaschine', '-', 'Waschmaschine weder in Bad noch Küche stellbar oder nicht anschließbar'),
      m('wohnung_schlechter_schnitt', '-', 'Schlechter Schnitt (z.B. mehr als ein gefangenes Zimmer)'),
      m('wohnung_kein_balkon', '-', 'Kein Balkon (das Merkmal gilt nicht, wenn der Balkon aus baulichen und/oder rechtlichen Gründen nicht möglich oder nicht zulässig ist)', { followUp: 'balkonGrund' }),
      m('wohnung_kein_kabel', '-', 'Weder Breitbandkabelanschluss noch Gemeinschaftssatelliten-/Antennenanlage'),
      m('wohnung_einbauschrank', '+', 'Einbauschrank oder Abstellraum mit Sichtschutz innerhalb der Wohnung'),
      m('wohnung_balkon', '+', 'Großer, geräumiger Balkon, (Dach-)Terrasse, Loggia oder Wintergarten (ab 4 m²)'),
      m('wohnung_fussbodenheizung', '+', 'Überwiegend Fußbodenheizung', { followUp: 'raeumeFussbodenheizung' }),
      m('wohnung_stuck', '+', 'Aufwändige Deckenverkleidung (z.B. Stuck) oder getäfelte Wandverkleidung in gutem Zustand in der überwiegenden Anzahl der Wohnräume', { followUp: 'raeumeStuck' }),
      m('wohnung_heizungsrohre', '+', 'Heizungsrohre überwiegend unter Putz'),
      m('wohnung_breitband', '+', 'Rückkanalfähiger Breitbandkabelanschluss (Nutzung ohne zusätzliche vertragliche Bindung des Mieters mit Dritten)'),
      m('wohnung_rolllaeden', '+', 'Rollläden'),
      m('wohnung_kaltwasserzaehler', '+', 'Wohnungsbezogener Kaltwasserzähler, wenn der Mieter nicht die Kosten für Miete oder Leasing im Rahmen der Betriebskosten trägt'),
      m('wohnung_raum_40', '+', 'Ein Wohnraum größer als 40 m²'),
      m('wohnung_barrierearm', '+', 'Barrierearme Wohnungsgestaltung (Schwellenfreiheit in der Wohnung, schwellenarmer Übergang zu Balkon/Terrasse, ausreichende Bewegungsfreiheit in der Wohnung und/oder barrierearme Badgestaltung)'),
      m('wohnung_waermeschutzfenster', '+', 'Überwiegend Isolierverglasung (Einbau ab 1987) oder Schallschutzfenster – nur wenn Sondermerkmal „Überwiegend Isolierverglasung (ab 1987) oder Schallschutzfenster“ nicht zutrifft', { cond: { unlessSonder: 'sm_isolierverglasung' } }),
      m('wohnung_parkett', '+', 'Hochwertiges Parkett, Natur-/Kunststein, Fliesen oder gleichwertiger Boden/-belag in der überwiegenden Zahl der Wohnräume – nur wenn das gleichnamige Sondermerkmal nicht zutrifft', { cond: { unlessSonder: 'sm_parkett' } }),
    ],
  },
  {
    id: 'gebaeude',
    titleDe: 'Merkmalgruppe 4: Gebäude',
    merkmale: [
      m('gebaeude_treppenhaus_schlecht', '-', 'Treppenhaus/Eingangsbereich überwiegend in schlechtem Zustand', { followUp: 'treppenhausDetails' }),
      m('gebaeude_kein_keller', '-', 'Kein nur dem Mieter zugänglicher, bestimmungsgemäß nutzbarer Abstellraum im Gebäude außerhalb der Wohnung vorhanden'),
      m('gebaeude_haustuer_offen', '-', 'Hauseingangstür nicht abschließbar'),
      m('gebaeude_instandhaltung_schlecht', '-', 'Schlechter Instandhaltungszustand (z.B. dauernde Durchfeuchtung des Mauerwerks - auch Keller -, große Putzschäden, erhebliche Schäden an der Dacheindeckung)', { followUp: 'maengel' }),
      m('gebaeude_seitenfluegel', '-', 'Lage im Seitenflügel oder Quergebäude bei verdichteter Bebauung', { followUp: 'seitenfluegelRaeume' }),
      m('gebaeude_keine_sprechanlage', '-', 'Keine Gegen-/Wechselsprechanlage mit elektrischem Türöffner'),
      m('umfeld_keine_fahrradplaetze', '-', 'Keine Fahrradabstellmöglichkeit'),
      m('gebaeude_daemmung_schlecht', '-', 'Unzureichende Wärmedämmung oder Heizanlage mit ungünstigem Wirkungsgrad (Einbau/Installation vor 1984)', { followUp: 'daemmung' }),
      m('gebaeude_fahrradraum', '+', 'Abschließbarer Fahrradabstellraum innerhalb oder außerhalb des Gebäudes'),
      m('gebaeude_zusatzraeume', '+', 'Zusätzliche und in angemessenem Umfang nutzbare Räume außerhalb der Wohnung in fußläufiger Entfernung (z.B. Partyraum)', { followUp: 'zusatzraeume' }),
      m('gebaeude_garage', '+', 'Zur Wohnung gehörige(r) Garage/Stellplatz (ohne zusätzliches Entgelt)'),
      m('gebaeude_eingang_repraesentativ', '+', 'Repräsentativer/s oder hochwertig sanierter/s Eingangsbereich/Treppenhaus (z.B. Spiegel, Marmor, exklusive Beleuchtung, hochwertiger Anstrich / Wandbelag, Läufer im gesamten Flur- und Treppenbereich)'),
      m('gebaeude_einbruchschutz', '+', 'Einbruchhemmende Wohnungs- und Haustür (zusätzliche moderne Einbruchsicherungsmaßnahmen)'),
      m('gebaeude_videosprechanlage', '+', 'Gegen-/Wechselsprechanlage mit Videokontakt und Türöffner'),
      m('gebaeude_aufzug', '+', 'Personenaufzug bei weniger als fünf Obergeschossen – nur wenn Sondermerkmal „Aufzug im Haus“ nicht zutrifft', { cond: { unlessSonder: 'sm_aufzug' } }),
      m('gebaeude_daemmung_gut', '+', 'Wärmedämmung zusätzlich zur vorhandenen Bausubstanz oder Einbau/Installation einer modernen Heizanlage nach dem 1.7.1994 (wenn Baujahr vor diesem Zeitpunkt)', { cond: { maxYear: 1994 }, followUp: 'daemmung' }),
      ...energy('Energieverbrauchskennwert', [170, 210, 250], [120, 100, 80]),
    ],
    notesDe: ENERGY_NOTES_OLD,
  },
  {
    id: 'umfeld',
    titleDe: 'Merkmalgruppe 5: Wohnumfeld',
    merkmale: [
      m('umfeld_vernachlaessigt', '-', 'Lage in stark vernachlässigter Umgebung in einfacher Wohnlage', { followUp: 'vernachlaessigung' }),
      m('umfeld_laerm', '-', 'Lage der Wohnung an einer Straße oder Schienenstrecke mit hoher Verkehrslärmbelästigung oder Belastung durch Flugverkehr nach Maßgabe der Erläuterungen zur Verkehrslärmbelastung unter Nr. 12. dieses Mietspiegels', { followUp: 'laerm' }),
      m('umfeld_geruch', '-', 'Erhebliche, regelmäßige Beeinträchtigung durch Geräusche oder Gerüche (Gewerbe), z.B. durch Liefer- und Kundenverkehr', { followUp: 'geruch' }),
      m('umfeld_muell', '-', 'Ungepflegte und offene Müllstandfläche'),
      m('umfeld_citylage', '+', 'Bevorzugte Citylage (nahe repräsentativen, überregional ausstrahlenden Einkaufs-, Dienstleistungs- und Wohnstandorten)'),
      m('umfeld_ruhig', '+', 'Lage an einer besonders ruhigen Straße oder besonders ruhige Innenlage'),
      m('umfeld_gestaltet', '+', 'Aufwändig gestaltetes Wohnumfeld auf dem Grundstück (z.B. Sitzbänke oder Ruhezonen, neu angelegte Wegebefestigung mit Grünflächen)', { followUp: 'wohnumfeld' }),
      m('umfeld_muell_gepflegt', '+', 'Gepflegte Müllstandsfläche mit sichtbegrenzender Gestaltung; nur den Mietern zugänglich'),
      m('umfeld_villa', '+', 'Villenartige Mehrfamilienhäuser'),
      m('umfeld_garten', '+', 'Garten zur alleinigen Nutzung/Mietergarten ohne Entgelt oder zur Wohnung gehörender Garten mit direktem Zugang'),
    ],
  },
];

const SEND_TO = {
  email: 'bmv@berliner-mieterverein.de',
  post: ['Berliner Mieterverein e.V.', '„Aktion Mietpreisüberprüfung“', 'Spichernstraße 1', '10777 Berlin'],
};

export const FORMS: FormVersion[] = [
  {
    id: '2026',
    validFrom: '2025-09-01',
    titleDe: 'Prüfung der Wiedervermietungsmiete nach § 556 d BGB mit dem Mietspiegel 2026',
    formCode: '169A 6/26',
    sourceUrl: BMV + 'fl169A%20(Mietpreisbremse%20-%20Fragebogen%20-%202026).pdf',
    mietspiegelRows: 189,
    asksColumn: false,
    asksMemberNo: false,
    asksEnergyValue: true,
    groups: groups2026,
    sendTo: { email: '', post: SEND_TO.post },
  },
  {
    id: '2024',
    validFrom: '2023-09-01',
    validTo: '2025-08-31',
    titleDe: 'Prüfung der Wiedervermietungsmiete nach § 556 d BGB mit dem Mietspiegel 2024',
    formCode: '169A 6/24',
    sourceUrl: BMV + 'fl169a-2024-wiedervermietung.pdf',
    mietspiegelRows: 163,
    asksColumn: false,
    asksMemberNo: true,
    asksEnergyValue: true,
    groups: groups2024,
    sendTo: { email: 'mietpreis@berliner-mieterverein.de', post: SEND_TO.post },
  },
  {
    id: '2023',
    validFrom: '2022-09-01',
    validTo: '2023-08-31',
    titleDe: 'Prüfung der Wiedervermietungsmiete nach § 556 d BGB mit dem Mietspiegel 2023',
    formCode: '169 a',
    sourceUrl: BMV + 'fl169a-2023-wiedervermietung.pdf',
    asksColumn: true,
    asksMemberNo: false,
    asksEnergyValue: false,
    groups: groups2017to2023(false),
    sendTo: SEND_TO,
  },
  {
    id: '2021',
    validFrom: '2020-09-01',
    validTo: '2022-08-31',
    titleDe: 'Prüfung der Wiedervermietungsmiete nach § 556 d BGB mit dem Mietspiegel 2021',
    formCode: '169 a',
    sourceUrl: BMV + 'wiedervermietung-169-a-2021-1.pdf',
    asksColumn: true,
    asksMemberNo: false,
    asksEnergyValue: false,
    groups: groups2017to2023(false),
    sendTo: SEND_TO,
  },
  {
    id: '2019',
    validFrom: '2018-09-01',
    validTo: '2020-08-31',
    titleDe: 'Prüfung der Wiedervermietungsmiete nach § 556 d BGB mit dem Mietspiegel 2019',
    formCode: '169 a',
    sourceUrl: BMV + 'wiedervermietung-169-a-2019-9-19-3.pdf',
    asksColumn: true,
    asksMemberNo: false,
    asksEnergyValue: false,
    groups: groups2017to2023(false),
    sendTo: SEND_TO,
  },
  {
    id: '2017',
    validFrom: '2016-09-01',
    validTo: '2018-08-31',
    titleDe: 'Prüfung der Wiedervermietungsmiete nach § 556 d BGB mit dem Mietspiegel 2017',
    formCode: '169 a',
    sourceUrl: BMV + 'wiedervermietung-169-a-2017-9-19.pdf',
    asksColumn: true,
    asksMemberNo: false,
    asksEnergyValue: false,
    groups: groups2017to2023(true),
    sendTo: SEND_TO,
  },
  {
    id: '2015',
    validFrom: '2015-06-01',
    validTo: '2016-08-31',
    titleDe: 'Prüfung der Wiedervermietungsmiete nach § 556 d BGB mit dem Mietspiegel 2015',
    formCode: '169 a',
    sourceUrl: BMV + 'wiedervermietung-169-a-2015-9-19.pdf',
    asksColumn: true,
    asksMemberNo: false,
    asksEnergyValue: false,
    sonder: [
      { id: 'sm_parkett', de: 'Hochwertiges Parkett, Natur-/Kunststein, Fliesen oder gleichwertiger Boden/-belag in der überwiegenden Zahl der Wohnräume', zuschlaege: 'bis 1918: +0,56 € · 1919–1949: +0,83 € · 1950–1964: +1,10 € · 1973–1990 West: +0,46 € · 1991–2002: +0,79 €' },
      { id: 'sm_kueche', de: 'Moderne Küchenausstattung (Küchenschränke, Einbauspüle, Dunstabzugshaube, Herd mit Ceran- oder Induktionskochfeld, Backofen, Wandfliesen im Arbeitsbereich, Kühlschrank)', zuschlaege: 'bis 1918: +1,37 € · 1950–1964: +1,04 € · 1965–1972: +0,50 € · 1973–1990 West: +0,40 € · 1991–2002: +0,42 €' },
      { id: 'sm_dusche', de: 'Von der Badewanne getrennte Dusche', zuschlaege: 'bis 1918: +0,63 €' },
      { id: 'sm_kleines_bad', de: 'Kleines Bad (kleiner als 4 m²)', zuschlaege: '1991–2002: −0,32 €' },
      { id: 'sm_modernes_bad', de: 'Modernes Bad (Wände ausreichend im Spritzwasserbereich von Waschbecken, Badewanne und/oder Dusche gefliest, Bodenfliesen, Einbauwanne und/oder -dusche, Einhebelmischbatterie, Strukturheizkörper als Handtuchwärmer)', zuschlaege: 'bis 1918: +0,34 € · 1919–1949: +0,40 € · 1950–1964: +0,28 € · 1965–1972: +0,12 € · 1973–1990 Ost: +0,16 €' },
      { id: 'sm_isolierverglasung', de: 'Überwiegend Isolierverglasung (ab 1987) oder Schallschutzfenster', zuschlaege: 'bis 1918: +0,28 €' },
      { id: 'sm_aufzug', de: 'Aufzug im Haus', zuschlaege: 'bis 1918: +0,64 €' },
    ],
    groups: groups2015,
    sendTo: SEND_TO,
  },
];

/** Datum der Einführung der Mietpreisbremse in Berlin */
export const MIETPREISBREMSE_START = '2015-06-01';

export function getForm(id: FormId): FormVersion {
  const f = FORMS.find((x) => x.id === id);
  if (!f) throw new Error(`Unbekannter Prüfbogen ${id}`);
  return f;
}

/**
 * Wählt den Prüfbogen anhand des Vertragsabschlusses (yyyy-mm oder yyyy-mm-dd; die Zeiträume beginnen immer am Monatsersten).
 * Gibt `undefined` zurück, wenn der Vertrag vor Einführung der Mietpreisbremse geschlossen wurde.
 */
export function selectFormVersion(contractDate: string): FormVersion | undefined {
  const date = monthStart(contractDate);
  if (!date || date < MIETPREISBREMSE_START) return undefined;
  return FORMS.find((f) => date >= f.validFrom && (!f.validTo || date <= f.validTo));
}
