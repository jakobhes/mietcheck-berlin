import type { FeatureTexts } from './types';

/**
 * Verständliche Fragen + Erläuterungen zu jedem Merkmal.
 * Der rechtlich maßgebliche Wortlaut steht in src/data/forms.ts und wird zusätzlich angezeigt.
 */
const de: FeatureTexts = {
  /* ---------------- Bad ---------------- */
  bad_kein_waschbecken: {
    q: 'Fehlt im Bad (oder WC) ein Waschbecken – oder ist es sehr klein?',
    help: 'Gemeint ist ein Handwaschbecken, das höchstens etwa 50 cm breit ist (ältere Bögen: 50 × 25 cm). Messen Sie die Außenkante des Beckens.',
  },
  bad_wc_keine_lueftung: {
    q: 'Hat der Raum mit dem WC weder Fenster noch Lüftung?',
    help: 'Trifft zu, wenn es im WC weder ein zu öffnendes Fenster noch einen Lüfter (Ventilator/Lüftungsschacht) gibt.',
  },
  bad_dielen: {
    q: 'Liegen im Bad Holzdielen, die nicht für Feuchträume geeignet sind?',
    help: 'Klassische Holzdielen ohne Versiegelung oder Fliesen darüber. Versiegelte, feuchtraumgeeignete Böden zählen nicht.',
  },
  bad_nicht_beheizbar: {
    q: 'Kann das Bad nicht richtig geheizt werden?',
    help: 'Zutreffend, wenn es keinen Heizkörper gibt, nur mit Holz/Kohle (Ofen) geheizt wird oder nur ein elektrischer Heizstrahler vorhanden ist.',
  },
  bad_kein_warmwasser: {
    q: 'Fehlt im Bad eine ausreichende Warmwasserversorgung?',
    help: 'Kein zentrales Warmwasser, kein Durchlauferhitzer und höchstens ein kleiner Boiler (bis 60 Liter).',
  },
  bad_freistehende_wanne: {
    q: 'Steht im nicht modernisierten Bad eine alte, freistehende Badewanne – ohne separate Dusche?',
    help: 'Typisch für unsanierte Altbauten: eine Wanne auf Füßen oder frei vor der Wand (auch mit Verkleidung), keine eigene Dusche. Eine moderne Designer-Wanne ist nicht gemeint.',
  },
  bad_waende_nicht_gefliest: {
    q: 'Sind die Wände rund um Waschbecken, Wanne oder Dusche nicht ausreichend gefliest?',
    help: 'Im Spritzwasserbereich fehlen Fliesen oder ein vergleichbarer Wasserschutz – z. B. nur Farbe oder Tapete hinter der Dusche.',
  },
  bad_ohne_fenster: {
    q: 'Hat das Bad mit WC kein Fenster?',
    help: 'Ein innenliegendes Bad ohne Fenster. In Plattenbauten (Baujahr 1973–1990 Ost) zählt das Merkmal nicht.',
  },
  bad_keine_dusche: {
    q: 'Kann man im Bad nicht vernünftig duschen?',
    help: 'Zum Beispiel kein Duschkopf-Halter, kein Spritzschutz (Vorhang/Glaswand) oder eine sehr kleine Standfläche.',
  },
  bad_klein: {
    q: 'Ist das Bad kleiner als 4 m²?',
    help: 'Grundfläche des Badezimmers messen (Länge × Breite). Gilt nicht für Baujahr 1973–1990 Ost.',
  },
  bad_grosses_waschbecken: {
    q: 'Gibt es ein sehr großes Waschbecken (mind. 80 cm breit), ein Doppelwaschbecken oder zwei Waschbecken?',
    help: 'Wohnwerterhöhend. Messen Sie die Außenbreite des Beckens.',
  },
  bad_hochwertig: {
    q: 'Ist das Bad besonders hochwertig ausgestattet?',
    help: 'Zum Beispiel Markenarmaturen, hochwertige Badmöbel, Eck- oder Rundwanne, Echtglas-Duschwand, Regendusche. Standard-Ausstattung zählt nicht.',
  },
  bad_innen_lueftung: {
    q: 'Hat das innenliegende Bad eine moderne, automatisch gesteuerte Lüftung?',
    help: 'Zum Beispiel ein Lüfter mit Feuchtigkeitssensor oder Nachlauf-Steuerung. Ein einfacher Schacht zählt nicht.',
  },
  bad_zweites_wc: {
    q: 'Gibt es ein zweites WC – oder sind Bad und WC getrennte Räume?',
    help: 'Wohnwerterhöhend, wenn ein Gäste-WC vorhanden ist oder das WC in einem eigenen Raum liegt.',
  },
  bad_gross: {
    q: 'Ist mindestens ein Bad größer als 8 m²?',
    help: 'Grundfläche des Bades messen. Gäste-WCs zählen nicht.',
  },
  bad_fussbodenheizung: {
    q: 'Hat das Bad eine Fußbodenheizung?',
    help: 'Warmwasser- oder elektrische Fußbodenheizung im Bad.',
  },
  bad_fliesen_hochwertig: {
    q: 'Sind Wand- und Bodenbelag im Bad hochwertig?',
    help: 'Zum Beispiel Natursteinfliesen, großformatige Feinsteinzeugfliesen oder Mosaik. Einfache Standardfliesen sind nicht hochwertig. Je nach Mietspiegel gilt das Merkmal für neuere Baujahre nicht.',
  },
  bad_wandhaengendes_wc: {
    q: 'Hängt das WC an der Wand und der Spülkasten ist in der Wand versteckt (oder hochwertiges Stand-WC)?',
    help: 'Ein Vorwand-WC: Man sieht nur Keramik und Drückerplatte. In neueren Baujahren (je nach Mietspiegel ab 2002/2003) ist das Standard und zählt nicht – ein hochwertiges Stand-WC dagegen schon (ab 2024).',
  },
  bad_strukturheizkoerper: {
    q: 'Gibt es einen Handtuch-Heizkörper (Leiterheizkörper) im Bad?',
    help: 'Ein sprossenartiger Heizkörper, über den man Handtücher hängen kann. Ab 2024 zählt er nur bei Baujahr bis 2001 – außer er ist zusätzlich elektrisch betreibbar.',
  },
  bad_separate_dusche: {
    q: 'Gibt es neben der Badewanne eine separate Dusche?',
    help: 'Eine eigene Duschtasse oder Duschkabine, zusätzlich zur Wanne.',
  },
  bad_bodengleiche_dusche: {
    q: 'Ist die Dusche bodengleich (ohne oder mit max. 3 cm Kante)?',
    help: 'Man kann ebenerdig oder fast ebenerdig in die Dusche gehen – keine hohe Duschwanne.',
  },
  bad_einhebelmischer: {
    q: 'Gibt es eine Einhebel-Mischbatterie?',
    help: 'Ein Wasserhahn mit nur einem Hebel für Menge und Temperatur. (Nur Mietspiegel 2015, wenn „Modernes Bad“ nicht zutrifft.)',
  },

  /* ---------------- Küche ---------------- */
  kueche_ohne_fenster: {
    q: 'Hat die Küche kein Fenster und keine ausreichende Lüftung?',
    help: 'Kein Fenster und keine funktionierende Abluftanlage. Falls es eine Lüftungsanlage gibt, geben Sie bitte ihr Alter an.',
  },
  kueche_kein_herd: {
    q: 'Fehlt ein Herd – oder hat der Herd keinen Backofen?',
    help: 'Nur zutreffend, wenn der Vermieter keinen Herd oder einen Herd ohne Backofen stellt.',
  },
  kueche_keine_spuele: {
    q: 'Gibt es in der Küche keine Spüle?',
    help: 'Kein Spülbecken vom Vermieter.',
  },
  kueche_kein_warmwasser: {
    q: 'Gibt es an der Spüle kein (ausreichendes) warmes Wasser?',
    help: 'Kein zentrales Warmwasser, kein Durchlauferhitzer und kein Boiler an der Spüle.',
  },
  kueche_nicht_beheizbar: {
    q: 'Kann die Küche nicht geheizt werden (oder nur mit Holz/Kohle)?',
    help: 'Kein Heizkörper in der Küche oder nur ein Kohleofen.',
  },
  kueche_kein_geschirrspueler: {
    q: 'Kann in der Küche kein Geschirrspüler aufgestellt oder angeschlossen werden?',
    help: 'Kein Platz oder kein Wasser-/Abwasseranschluss für eine Spülmaschine.',
  },
  kueche_keine_wandfliesen: {
    q: 'Fehlen an der Wand im Arbeitsbereich Fliesen oder ein vergleichbarer Spritzschutz?',
    help: 'Hinter Herd und Spüle gibt es keine Fliesen, keine Glas- oder Kunststoffplatte – nur Farbe/Tapete.',
  },
  kueche_boden: {
    q: 'Hat die Küche einen hochwertigen Bodenbelag in gutem Zustand?',
    help: 'Hochwertige Fliesen, Linoleum, Feuchtraumlaminat, Parkett oder Terrazzo. Einfaches PVC zählt nicht. Ab 2024 nur für Baujahre bis 2009.',
  },
  kueche_gross: {
    q: 'Ist die Küche ein eigener Raum mit mindestens 14 m²?',
    help: 'Bitte geben Sie die Küchengröße in m² an.',
  },
  kueche_einbaukueche: {
    q: 'Stellt der Vermieter eine Einbauküche mit Ober- und Unterschränken, Herd und Spüle?',
    help: 'Nur zählen, wenn die Küche vom Vermieter ist – nicht von Ihnen oder vom Vormieter gekauft (Ablöse).',
  },
  kueche_ceran: {
    q: 'Gibt es ein Ceran- oder Induktionskochfeld?',
    help: 'Glatte Glaskeramik-Kochfläche. Ab 2024 zählt das nur bei Baujahren bis 2001.',
  },
  kueche_dunstabzug: {
    q: 'Gibt es eine Dunstabzugshaube?',
    help: 'Über dem Herd, vom Vermieter gestellt.',
  },
  kueche_kuehlschrank: {
    q: 'Stellt der Vermieter einen Kühlschrank (ab 2024 auch: Gefriergerät oder Geschirrspüler)?',
    help: 'Nur Geräte, die zur Wohnung gehören, nicht Ihre eigenen.',
  },
  kueche_kochinsel: {
    q: 'Gibt es eine freistehende Kochinsel mit Arbeitsfläche und Herd oder Spüle?',
    help: 'Ein Küchenblock, der nicht an der Wand steht.',
  },

  /* ---------------- Wohnung ---------------- */
  wohnung_einfachverglasung: {
    q: 'Haben die meisten Fenster nur eine einzige Glasscheibe?',
    help: 'Einfachverglasung: nur eine Scheibe pro Fensterflügel. Achtung: Kastenfenster (zwei hintereinander liegende Fenster) sind nicht gemeint. Bitte angeben, in welchen Räumen.',
  },
  wohnung_elektro_unzureichend: {
    q: 'Ist die Elektroinstallation veraltet oder unzureichend?',
    help: 'Zum Beispiel springt die Sicherung, wenn Waschmaschine und Staubsauger gleichzeitig laufen; es gibt keinen FI-Schutzschalter im Sicherungskasten oder sehr wenige Steckdosen.',
  },
  wohnung_elektro_aufputz: {
    q: 'Verlaufen die Stromleitungen überwiegend sichtbar auf der Wand?',
    help: 'Kabel oder Kabelkanäle sind auf dem Putz sichtbar statt in der Wand. Bitte Räume angeben.',
  },
  wohnung_leitungen_aufputz: {
    q: 'Verlaufen Wasser- und Abwasserrohre überwiegend sichtbar auf der Wand?',
    help: 'Sichtbare Sanitärleitungen in Bad, Küche oder anderen Räumen. Bitte Räume angeben.',
  },
  wohnung_keine_waschmaschine: {
    q: 'Kann die Waschmaschine weder in Bad noch Küche aufgestellt oder angeschlossen werden?',
    help: 'Kein Platz oder kein Anschluss in Bad und Küche.',
  },
  wohnung_schlechter_schnitt: {
    q: 'Hat die Wohnung einen schlechten Schnitt?',
    help: 'Zum Beispiel ein „gefangenes Zimmer“ (nur durch ein anderes Zimmer erreichbar) oder ein Durchgangszimmer.',
  },
  wohnung_kein_balkon: {
    q: 'Gibt es keinen Balkon, keine Terrasse, Loggia oder Wintergarten?',
    help: 'Gilt nicht, wenn ein Balkon aus baulichen oder rechtlichen Gründen gar nicht möglich wäre (z. B. Denkmalschutz). Bitte begründen, falls bekannt.',
  },
  wohnung_eg_kein_einbruchschutz: {
    q: 'Erdgeschoss: Fehlt an den Fenstern ein Einbruchs- oder Sichtschutz?',
    help: 'Keine Gitter, Rollläden, Fensteralarm o. Ä. an allen Fenstern der Erdgeschosswohnung.',
  },
  wohnung_kein_kabel: {
    q: 'Gibt es weder Kabelanschluss noch Gemeinschafts-Satellitenanlage?',
    help: 'Nur Mietspiegel 2015.',
  },
  wohnung_einbauschrank: {
    q: 'Gibt es einen Abstellraum oder Einbauschrank in der Wohnung?',
    help: 'Eine Kammer oder ein fest eingebauter Schrank, vom Vermieter. Ab 2026: Abstellraum mind. 1 m².',
  },
  wohnung_balkon: {
    q: 'Gibt es einen großen Balkon, eine Terrasse, Loggia oder Wintergarten (mind. 4 m²)?',
    help: 'Grundfläche messen. Kleinere Balkone zählen nicht als wohnwerterhöhend.',
  },
  wohnung_fussbodenheizung: {
    q: 'Wird die Wohnung überwiegend über eine Fußbodenheizung beheizt?',
    help: 'In der Mehrzahl der Räume. Bitte Räume angeben.',
  },
  wohnung_stuck: {
    q: 'Gibt es in den meisten Wohnräumen Stuck oder Holzvertäfelung in gutem Zustand?',
    help: 'Aufwändige Deckenverzierungen oder Wandverkleidungen. Bitte Räume angeben.',
  },
  wohnung_heizungsrohre: {
    q: 'Sind die Heizungsrohre überwiegend unsichtbar (in der Wand/im Boden)?',
    help: 'Ab 2024 zählt das nur bei Baujahren bis 1990.',
  },
  wohnung_rolllaeden: {
    q: 'Gibt es Rollläden (bzw. außen angebrachte Verschattung) an den meisten Fenstern?',
    help: 'Außenrollläden, Außenjalousien oder Markisen an der Mehrzahl der Wohnraumfenster.',
  },
  wohnung_kaltwasserzaehler: {
    q: 'Gibt es einen eigenen Kaltwasserzähler für die Wohnung?',
    help: 'Nur bei älteren Gebäuden und nur, wenn Sie keine Miet-/Leasingkosten dafür über die Betriebskosten zahlen.',
  },
  wohnung_raum_40: {
    q: 'Ist ein Wohnraum größer als 40 m²?',
    help: 'Ein einzelnes Zimmer mit mehr als 40 m² Grundfläche.',
  },
  wohnung_barrierearm: {
    q: 'Ist die Wohnung barrierearm?',
    help: 'Keine Schwellen innerhalb der Wohnung, schwellenarmer Zugang zu Balkon/Terrasse, ausreichend Bewegungsfläche (z. B. für Rollator).',
  },
  wohnung_parkett: {
    q: 'Liegt in den meisten Wohnräumen hochwertiges Parkett, Naturstein, Fliesen o. Ä.?',
    help: 'Echtholzparkett, Naturstein, hochwertige Fliesen. Laminat oder abgenutzte Dielen sind nicht hochwertig.',
  },
  wohnung_waermeschutzfenster: {
    q: 'Haben die meisten Fenster eine moderne Wärmeschutz- oder Schallschutzverglasung?',
    help: 'Nur bei älteren Gebäuden relevant; die Fenster müssen nach dem im Wortlaut genannten Jahr eingebaut worden sein. Oft ist das Einbaujahr im Abstandhalter zwischen den Scheiben eingeprägt.',
  },
  wohnung_einbruchschutz_tuer: {
    q: 'Hat die Wohnungstür eine zusätzliche Einbruchsicherung?',
    help: 'Verstärkte Tür plus z. B. Sperrbügel oder Mehrfachverriegelung.',
  },
  wohnung_breitband: {
    q: 'Gibt es einen rückkanalfähigen Kabelanschluss (Internet über Kabel)?',
    help: 'Nur Mietspiegel 2015.',
  },

  /* ---------------- Gebäude ---------------- */
  gebaeude_treppenhaus_schlecht: {
    q: 'Ist das Treppenhaus bzw. der Eingangsbereich überwiegend in schlechtem Zustand?',
    help: 'Zum Beispiel abblätternde Farbe, Schmierereien, kaputte Beleuchtung, beschädigte Stufen. Bitte letzte Renovierung und Mängel nennen.',
  },
  gebaeude_kein_keller: {
    q: 'Fehlt ein Keller- oder Abstellraum außerhalb der Wohnung nur für Sie?',
    help: 'Kein eigener (abschließbarer) Keller ohne Zusatzkosten.',
  },
  gebaeude_haustuer_offen: {
    q: 'Ist der Hauseingang jederzeit frei zugänglich (Haustür nicht abschließbar)?',
    help: 'Jeder kann jederzeit ins Treppenhaus.',
  },
  gebaeude_instandhaltung_schlecht: {
    q: 'Ist das Gebäude in schlechtem Zustand?',
    help: 'Zum Beispiel dauerhaft feuchte Wände (auch im Keller), große Putzschäden an der Fassade, erhebliche Dachschäden. Bitte Mängel und Ort beschreiben.',
  },
  gebaeude_seitenfluegel: {
    q: 'Liegt die Wohnung im Seitenflügel oder Quergebäude eines eng bebauten Hofes?',
    help: 'Typisch für Berliner Altbauten mit Hinterhöfen. Bitte angeben, welche Räume dort liegen.',
  },
  gebaeude_kein_aufzug_ab5: {
    q: 'Liegt die Wohnung im 5. Obergeschoss oder höher – ohne Aufzug?',
    help: 'Ab 2024: gilt nicht für Gebäude bis Baujahr 1949.',
  },
  gebaeude_keine_sprechanlage: {
    q: 'Fehlt eine Gegensprechanlage mit elektrischem Türöffner?',
    help: 'Sie können nicht mit Besuchern an der Haustür sprechen und die Tür nicht von der Wohnung aus öffnen.',
  },
  gebaeude_daemmung_schlecht: {
    q: 'Ist das Gebäude schlecht gedämmt oder die Heizung alt und ineffizient?',
    help: 'Die Heizanlage wurde vor dem im Wortlaut genannten Jahr eingebaut, oder die Wärmedämmung ist unzureichend. Angaben zu Bereich und Heizungsalter helfen.',
  },
  gebaeude_fahrradraum: {
    q: 'Gibt es einen abschließbaren Fahrradraum oder Fahrradbügel auf dem Grundstück?',
    help: 'Leicht zugänglich und ausreichend groß.',
  },
  gebaeude_zusatzraeume: {
    q: 'Gibt es zusätzliche Gemeinschaftsräume (z. B. Gemeinschaftsraum, Trockenraum, Gästewohnung)?',
    help: 'Nutzbare Räume außerhalb der Wohnung, die Sie mitbenutzen dürfen. Bitte angeben, welche.',
  },
  gebaeude_garage: {
    q: 'Gehört eine Garage oder ein Stellplatz ohne Zusatzkosten zur Wohnung?',
    help: 'Nur Mietspiegel 2015.',
  },
  gebaeude_eingang_repraesentativ: {
    q: 'Ist der Eingangsbereich/das Treppenhaus repräsentativ oder hochwertig saniert?',
    help: 'Zum Beispiel Marmor, Spiegel, besondere Beleuchtung, Läufer im ganzen Treppenhaus.',
  },
  gebaeude_instandhaltung_gut: {
    q: 'Ist das Gebäude in überdurchschnittlich gutem Zustand (z. B. neue Fassade, neues Dach)?',
    help: 'Ab 2024: nur für Gebäude bis Baujahr 2015.',
  },
  gebaeude_einbruchschutz: {
    q: 'Gibt es einbruchhemmende Wohnungs- und Haustüren?',
    help: 'Nur Mietspiegel 2015.',
  },
  gebaeude_videosprechanlage: {
    q: 'Gibt es eine Gegensprechanlage mit Video?',
    help: 'Mit Bildschirm in der Wohnung und elektrischem Türöffner.',
  },
  gebaeude_aufzug: {
    q: 'Gibt es einen Aufzug, obwohl das Haus weniger als fünf Obergeschosse hat?',
    help: 'Ab 2024: zählt nicht bei Gebäuden ab Baujahr 2010.',
  },
  gebaeude_schwellenarm: {
    q: 'Kommt man schwellenarm ins Haus und zur Wohnung (max. eine Stufe)?',
    help: 'Höchstens eine Stufe am Hauseingang und bis zur Wohnungstür.',
  },
  gebaeude_daemmung_gut: {
    q: 'Wurde nachträglich gedämmt oder eine moderne Heizung eingebaut?',
    help: 'Nur bei älteren Gebäuden: zusätzliche Fassaden-/Dachdämmung oder neue Heizanlage nach dem im Wortlaut genannten Datum.',
  },
  energie_minus_1: {
    q: 'Energiekennwert größer als {{n}} kWh/(m²a)',
    help: 'Den Wert finden Sie im Energieausweis oder in der Heizkostenabrechnung. Es zählt nur die höchste zutreffende Stufe.',
  },
  energie_minus_2: {
    q: 'Energiekennwert größer als {{n}} kWh/(m²a)',
    help: 'Den Wert finden Sie im Energieausweis oder in der Heizkostenabrechnung. Es zählt nur die höchste zutreffende Stufe.',
  },
  energie_minus_3: {
    q: 'Energiekennwert größer als {{n}} kWh/(m²a)',
    help: 'Den Wert finden Sie im Energieausweis oder in der Heizkostenabrechnung. Es zählt nur die höchste zutreffende Stufe.',
  },
  energie_plus_1: {
    q: 'Energiekennwert kleiner als {{n}} kWh/(m²a)',
    help: 'Wohnwerterhöhend bei sehr gutem energetischem Zustand.',
  },
  energie_plus_2: {
    q: 'Energiekennwert kleiner als {{n}} kWh/(m²a)',
    help: 'Wohnwerterhöhend bei sehr gutem energetischem Zustand.',
  },
  energie_plus_3: {
    q: 'Energiekennwert kleiner als {{n}} kWh/(m²a)',
    help: 'Wohnwerterhöhend bei sehr gutem energetischem Zustand.',
  },

  /* ---------------- Wohnumfeld ---------------- */
  umfeld_vernachlaessigt: {
    q: 'Liegt die Wohnung in einer stark vernachlässigten Umgebung?',
    help: 'Zum Beispiel verfallene Gebäude, viel Leerstand, Müll. Bitte beschreiben.',
  },
  umfeld_laerm: {
    q: 'Ist die Lage besonders laut?',
    help: 'Zum Beispiel Hauptverkehrsstraße, Bahnstrecke, Flughafennähe, Gewerbe- oder Partylärm. Die Strategischen Lärmkarten des Senats zeigen die Belastung gebäudegenau. Bitte Lärmart angeben.',
  },
  umfeld_geruch: {
    q: 'Ist die Lage besonders geruchsbelastet?',
    help: 'Zum Beispiel durch Gewerbe, Gastronomie oder Industrie. Bitte angeben, wann.',
  },
  umfeld_keine_fahrradplaetze: {
    q: 'Gibt es auf dem Grundstück keine Möglichkeit, Fahrräder abzustellen?',
    help: 'Weder Fahrradkeller noch Fahrradständer.',
  },
  umfeld_muell: {
    q: 'Ist der Müllplatz ungepflegt und offen?',
    help: 'Nur Mietspiegel 2015.',
  },
  umfeld_citylage: {
    q: 'Liegt die Wohnung in bevorzugter Citylage?',
    help: 'Nahe repräsentativen, überregional bekannten Einkaufs- und Geschäftsstraßen (z. B. Kurfürstendamm, Friedrichstraße).',
  },
  umfeld_ruhig: {
    q: 'Ist die Lage besonders ruhig?',
    help: 'Zum Beispiel verkehrsberuhigte Straße, Lage an einem Park, Poller oder Fahrbahnverengungen.',
  },
  umfeld_gestaltet: {
    q: 'Ist das Grundstück aufwändig gestaltet (Spielplatz, Bänke, Grünflächen, Beleuchtung)?',
    help: 'Deutlich mehr als ein einfacher Hof. Bitte beschreiben.',
  },
  umfeld_parkplatz: {
    q: 'Stellt der Vermieter in der Nähe ausreichend Pkw-Parkplätze zur Verfügung?',
    help: 'Parkplätze, die der Vermieter anbietet (nicht öffentliche Straßenparkplätze).',
  },
  umfeld_garten: {
    q: 'Gibt es einen Garten nur für Sie – oder kostenlosen Mietergarten?',
    help: 'Ein zur Wohnung gehörender Garten mit direktem Zugang oder ein Mietergarten ohne Entgelt.',
  },
  umfeld_muell_gepflegt: {
    q: 'Gibt es einen gepflegten, abgeschirmten Müllplatz nur für Mieter?',
    help: 'Nur Mietspiegel 2015.',
  },
  umfeld_villa: {
    q: 'Wohnen Sie in einem villenartigen Mehrfamilienhaus?',
    help: 'Nur Mietspiegel 2015.',
  },

  /* ---------------- Sondermerkmale 2015 ---------------- */
  sm_parkett: {
    q: 'Hochwertiger Bodenbelag in den meisten Wohnräumen?',
    help: 'Parkett, Naturstein, hochwertige Fliesen o. Ä.',
  },
  sm_kueche: {
    q: 'Moderne Küchenausstattung vorhanden?',
    help: 'Alles zusammen: Küchenschränke, Einbauspüle, Dunstabzugshaube, Herd mit Ceran- oder Induktionsfeld, Backofen, Wandfliesen im Arbeitsbereich, Kühlschrank.',
  },
  sm_dusche: {
    q: 'Von der Badewanne getrennte Dusche vorhanden?',
    help: 'Eigene Dusche zusätzlich zur Wanne.',
  },
  sm_kleines_bad: {
    q: 'Ist das Bad kleiner als 4 m²?',
    help: 'Wirkt sich nur bei Baujahr 1991–2002 als Sondermerkmal aus.',
  },
  sm_modernes_bad: {
    q: 'Modernes Bad vorhanden?',
    help: 'Spritzwasserbereiche gefliest, Bodenfliesen, Einbauwanne/-dusche, Einhebelmischer, Handtuch-Heizkörper.',
  },
  sm_isolierverglasung: {
    q: 'Überwiegend Isolierverglasung (ab 1987) oder Schallschutzfenster?',
    help: 'Doppelt verglaste Fenster, eingebaut ab 1987.',
  },
  sm_aufzug: {
    q: 'Gibt es einen Aufzug im Haus?',
    help: 'Personenaufzug.',
  },
};

export default de;
