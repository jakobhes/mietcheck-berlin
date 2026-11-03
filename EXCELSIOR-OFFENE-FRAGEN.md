# Excelsior – offene Fragen

Offene Punkte für den Excelsior-Modus (`?haus=excelsior`, Stresemannstraße 68–76, Baujahr 1966).
Alles, was hier noch offen ist, wird in der App weiterhin abgefragt oder ist als Annahme eingetragen.
Wo etwas geändert werden muss: `src/house/presets.ts`.

Stand: 3.11.2026 · Annahme: etwa 540 Mieter·innen, Verträge aus allen Zeiträumen seit 6/2015 möglich.

## Für alle Verträge

- [ ] **Empfänger der Rüge:** Vermieter oder Hausverwaltung? Name und Anschrift für alle gleich?
  → Wird im Moment von allen einzeln eingegeben. Name und vollständige Anschrift sind inzwischen Pflichtangaben (sonst lassen sich die PDFs nicht erstellen). Wenn sie für alle gleich sind, könnte die App sie vorausfüllen.
- [ ] **Sammelheizung** (Zentralheizung): Gibt es sie in allen Wohnungen?
  → Nicht vorausgefüllt, die Leute kreuzen selbst an.
- [ ] **Bad mit WC** in allen Wohnungen? (war „denke ich schon“)
  → Ist vorausgefüllt, lässt sich aber ändern.
- [ ] **Energiekennwert der anderen Aufgänge** (68, 70, 74, 76): Bekannt ist nur die 72 mit 160 kWh/(m²a).
  → Für alle angenommen: „größer als 145“ angekreuzt (2026/2024), „größer als 155“ (2017–2023). Der Zahlenwert steht nur bei der 72 im PDF.
- [ ] **Art des Energiekennwerts:** Verbrauchs- oder Bedarfsausweis? Wird das Warmwasser zentral erzeugt?
  → Angenommen: Verbrauchskennwert, zentrales Warmwasser. Bei einem Bedarfsausweis liegt die Grenze 20 % höher (174 statt 145). Dann würde 160 *nicht* mehr reichen.
- [ ] **Treppenhaus in schlechtem Zustand (Fußnote 10):** Wann wurde zuletzt renoviert, welche Mängel gibt es?
  → Das Merkmal ist angekreuzt, der Fußnotentext bleibt leer. Ein fester Text würde die Rügen stärken.
- [ ] **Wohnlage 2015:** Für 2017–2026 ist „einfach“ jetzt per Straßenverzeichnis bestätigt (siehe unten). Das Straßenverzeichnis 2015 ist nicht online; dort ist „einfach“ weiter nur angenommen.
- [ ] **Mietspiegelzeile und zulässige Miete:** Die App ermittelt Zeile (und bis 2023 Spalte) für alle Verträge (Mietspiegel 2015–2026) selbst aus der Wohnfläche, trägt sie in den Prüfbogen ein und berechnet die zulässige Miete für die Rüge (`src/data/mietspiegel.ts`). Die Frage nach der Zeile entfällt im Excelsior-Modus.
  → Bestätigt ist bisher nur ein Fall: 2024, einfache Wohnlage, unter 55 m² → Zeile 17 (Stresemannstraße 72). Bitte die übrigen Jahre/Größen stichprobenartig mit dem Mieterverein abgleichen.
  → 2015 werden die Sondermerkmale „Moderne Küchenausstattung“ (+0,50 €) und „Modernes Bad“ (+0,12 €) eingerechnet (Mietspiegel 2015, Nr. 10.1 und 11.3).
- [ ] **Umfassende Modernisierung / andere Ausnahmen:** Welche Wohnungen betrifft das angeblich, und wann war das? Hat der Vermieter das vor Vertragsschluss schriftlich mitgeteilt?
  → Die App fragt nicht mehr nach Neubau, Modernisierung, Vormiete oder Sozialwohnung, sondern nur noch, ob der Vermieter schriftlich eine Ausnahme mitgeteilt hat (ja / nein / weiß nicht). Bei „ja“ wird der Wortlaut in die Rüge übernommen; das Auskunftsverlangen in der Rüge fragt Modernisierung und Vormiete ohnehin ab. Wenn der Vermieter allen dasselbe mitgeteilt hat, wäre ein gemeinsamer Text als Vorlage hilfreich.
- [ ] **Hausnummer 68** hat weniger Stockwerke: Gibt es dort einen Aufzug? Hat sie mehr als 4 Obergeschosse?
  → Angenommen ist dasselbe wie in den anderen Aufgängen: Aufzug vorhanden, „Aufzug bei weniger als fünf Obergeschossen“ trifft nicht zu.
- [ ] **Lärm:** Welche Fassaden sind laut Lärmkarte stark belastet? Nur die Seite zur Stresemannstraße? Ist das je Aufgang verschieden?
  → Wird gefragt, mit Hinweis zur Stresemannstraße. Mit einer Liste „Aufgang + Seite“ ließe sich das auch vorausfüllen.
  → Hinweis aus den Straßenverzeichnissen 2017–2023: Ein `*` markiert dort Adressen mit Verkehrslärmbelastung. 2017: 66–68 mit `*`, 72–76 ohne (die 70 fehlt im Verzeichnis). 2019, 2021, 2023: 66–72 mit `*`, 74–76 ohne. Ab 2024 enthält das Verzeichnis diese Angabe nicht mehr.
- [ ] **Renoviert / unrenoviert über die Fenster:** Die App fragt nicht mehr „renoviert?“, sondern wie die Fenster aufgehen: an der Seite wie eine Tür (neue Fenster → renoviert) oder um eine senkrechte Achse in der Mitte (alte Schwingfenster → unrenoviert). Trifft das auf alle Wohnungen zu? Gibt es renovierte Wohnungen mit alten Fenstern oder umgekehrt?
  → Text in `src/i18n/ui/de.ts` (`house.excelsiorWindows`), dazu Englisch und Arabisch.
- [ ] **Fotos der Fenster:** Die Bilder zur Fenster-Frage sind noch Platzhalter-Zeichnungen (`public/media/house/excelsior-fenster-alt.svg`, `…-neu.svg`). Fotos aus dem Haus wären deutlich verständlicher.
- [ ] **Renoviert, Energiefeld:** Im PDF „renoviert“ war „größer als 145“ schwarz ausgefüllt statt angekreuzt. Das habe ich als Kreuz gewertet. Bitte bestätigen.

## Verträge 9/2016 – 8/2023 (Mietspiegel 2017, 2019, 2021, 2023)

- [ ] **Wohnungsbezogener Kaltwasserzähler** (+), nur wenn die Mieter·innen keine Miete oder Leasinggebühr dafür über die Betriebskosten zahlen. Gibt es ihn? Steht er in der Betriebskostenabrechnung?
  → Wird im Moment gefragt.

## Verträge 6/2015 – 8/2016 (Mietspiegel 2015)

Der Bogen 2015 hat eigene Sondermerkmale. Wenn eines zutrifft, fallen einige normale Merkmale weg. Bitte jeweils für **renoviert** und **unrenoviert** klären:

- [ ] Hochwertiges Parkett, Natur-/Kunststein, Fliesen o. Ä. in den meisten Wohnräumen
- [ ] Moderne Küchenausstattung (Küchenschränke, Einbauspüle, Dunstabzug, Ceran/Induktion, Backofen, Wandfliesen, Kühlschrank)
- [ ] Von der Badewanne getrennte Dusche
- [ ] Kleines Bad (unter 4 m²)
- [ ] Modernes Bad (Wände im Spritzwasserbereich gefliest, Bodenfliesen, Einbauwanne/-dusche, Einhebelmischer, Handtuchheizkörper)
- [ ] Überwiegend Isolierverglasung (ab 1987) oder Schallschutzfenster
- [ ] Aufzug im Haus (vermutlich ja)

Merkmale, die es nur im Bogen 2015 gibt:

- [ ] Einhebelmischbatterie im Bad (+)
- [ ] Weder Breitbandkabel noch Gemeinschafts-Satelliten-/Antennenanlage (−)
- [ ] Rückkanalfähiger Breitbandkabelanschluss ohne Zusatzvertrag (+)
- [ ] Zur Wohnung gehörige Garage oder Stellplatz ohne Entgelt (+)
- [ ] Einbruchhemmende Wohnungs- und Haustür (+)
- [ ] Ungepflegte und offene Müllstandsfläche (−)
- [ ] Gepflegte Müllstandsfläche mit Sichtschutz, nur für Mieter·innen zugänglich (+)
- [ ] Villenartiges Mehrfamilienhaus (+) → vermutlich nein

Energie 2015: Die Grenze lag damals bei 170 kWh/(m²a). Mit 160 kWh ist deshalb **kein** Energie-Merkmal angekreuzt. Das ist so umgesetzt.

## Bereits geklärt

- Wohnlage „einfach“ für Stresemannstraße 68–76 laut Straßenverzeichnissen 2017, 2019, 2021, 2023, 2024 und 2026 (2024/2026: gerade Nummern 28–78, einfach)

- Adresse: Stresemannstraße 68/70/72/74/76, 10963 Berlin
- Baujahr 1966, Vorderhaus, kein Dachgeschoss, kein modernisierter Altbau, kein Ein- oder Zweifamilienhaus
- Kein städtisches Wohnungsunternehmen, keine Index- oder Staffelmietverträge im Haus (beides fest auf „nein“, wird nicht gefragt)
- Kein Neubau, keine Sozialwohnung (wird in der App inzwischen gar nicht mehr gefragt)
- Fahrradabstellmöglichkeit vorhanden (renoviert und unrenoviert)
- Stark vernachlässigte Umgebung: nein · Bevorzugte Citylage: nein (2015–2024, wie vom Anwalt angekreuzt)
