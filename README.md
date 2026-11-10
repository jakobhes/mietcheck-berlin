# MietCheck Berlin

Step-by-step assistant for Berlin tenants: check rent-relevant features under the Mietspiegel (2015–2026), fill in the Berliner Mieterverein 169A form and generate a § 556g BGB rent objection letter as PDF. German, English, Arabic, Ukrainian, Spanish and Turkish. Runs fully in the browser.

> **Hinweis:** Kein Angebot des Berliner Mietervereins e.V. und keine Rechtsberatung.

## Was die App macht

1. **Mietvertrag**: Das Vertragsdatum wählt automatisch den passenden BMV-Prüfbogen 169A (Mietspiegel 2015, 2017, 2019, 2021, 2023, 2024 oder 2026). Dazu kommen Mietbeginn, Nettokaltmiete, Index-/Staffelmiete und städtischer Vermieter.
2. **Ausnahmen**: Gefragt wird nur, ob der Vermieter vor Vertragsschluss schriftlich eine Ausnahme mitgeteilt hat (§ 556g Abs. 1a BGB; ja / nein / weiß nicht). Bei „ja“ kommt der Wortlaut in die Rüge, bei „weiß nicht“ ein allgemeiner Bezug. Ob tatsächlich eine Ausnahme vorliegt (Neubau, Vormiete, Modernisierung), fragt das Rügeschreiben beim Vermieter ab.
3. **Wohnung & Energie** – inkl. automatischer Einordnung des Energiekennwerts.
4. **Merkmalgruppen 1–5** (Bad, Küche, Wohnung, Gebäude, Wohnumfeld): jedes Merkmal als verständliche Frage mit Erläuterung, Beispielbild und dem Originalwortlaut, Antwort ja / nein / weiß nicht. Negativ formulierte Merkmale werden positiv gefragt („Hat das Bad ein Fenster?“) und intern umgedreht. „Weiß nicht“ wird nicht angekreuzt, sondern im Prüfbogen unter den Bemerkungen aufgeführt. Merkmale, die für das Baujahr (bzw. 2015: wegen Sondermerkmalen) nicht gelten, werden ausgeblendet.
5. **Ergebnis**: Übersicht pro Merkmalgruppe, Rüge-Frist (30 Monate ab Mietbeginn bei Verträgen ab 1.4.2020) und zwei PDFs:
   - ausgefüllter **Prüfbogen 169A** zum Einsenden an den Berliner Mieterverein
   - **Rügeschreiben** nach § 556g Abs. 2 BGB mit Auskunftsverlangen nach Abs. 3

Die PDFs lassen sich erst erstellen, wenn alle **Pflichtfragen** beantwortet sind – alles, was im Prüfbogen oder in der Rüge sonst leer bliebe oder falsch angekreuzt wäre (Vertragsdaten, Wohnungsangaben, Ja/Nein-Fragen des Bogens, Namen und Anschriften). Optional bleiben die Merkmale der Orientierungshilfe, Mietspiegelzeile, Ausstattung, Energiekennwert, Kontaktdaten und Bemerkungen.

Alle Eingaben bleiben im `localStorage` des Browsers; es gibt keinen Server.

### Bedienkonzept

- **Handy: eine Frage pro Bildschirm** („one thing per page“, GOV.UK Service Manual): weniger kognitive Last, weniger Abbrüche.
- **Desktop (ab 62em): bis zu 6 Fragen pro Seite** als Karten, Kapitel gleichmäßig auf Seiten verteilt (`src/flow/pages.ts`); nach einer Antwort scrollt die Seite zur nächsten Karte.
- **Hell/Dunkel** umschaltbar in der Kopfzeile (wird im Browser gespeichert).
- **Kapitel mit eigenem Einstieg** und segmentierter Fortschrittsanzeige – kurze Etappenziele statt eines langen Formulars.
- **Hilfe nur auf Wunsch** (progressive disclosure): Erläuterungen, Originalwortlaut und Links sind aufklappbar.
- **Weiter von Hand**: Auf dem Handy geht es nach einer Auswahl nicht automatisch weiter, sondern erst mit „Weiter“ (Enter in Textfeldern geht auch). Optionale Fragen lassen sich überspringen; bei offenen Pflichtfragen ist „Weiter“ gesperrt, und das Kapitelmenü springt nicht darüber hinaus.
- Oberfläche mit [Mantine](https://mantine.dev) (inkl. RTL für Arabisch), Icons von Tabler, Schrift Inter / Noto Sans Arabic.

### Haus-Modus (z. B. Mieterversammlung)

Für ein bestimmtes Gebäude lässt sich vieles vorausfüllen, damit nur noch gefragt wird, was sich von Wohnung zu Wohnung unterscheidet. Eingeschaltet wird der Modus über einen Link (z. B. als QR-Code):

- `…/?haus=excelsior` – Excelsior, Stresemannstraße 68–76 (Baujahr 1966)
- `…/?haus=aus` – zurück zur normalen App (oder im Menü „Excelsior-Modus beenden“)

Der Modus bleibt im Browser gespeichert, auch nach „Neu beginnen“. Zuerst wird nach dem Aufgang und dem Zustand der Wohnung (renoviert / unrenoviert) gefragt – im Excelsior über ein sichtbares Merkmal: wie die Fenster aufgehen (`variantQuestion`). Danach entfallen Baujahr, Wohnlage, Vorderhaus/Seitenflügel, Dachgeschoss, Altbau-Modernisierung, Ein-/Zweifamilienhaus, Energie, Index-/Staffelmiete, städtischer Vermieter und alle Merkmale, die für das Haus feststehen. Im PDF sind die vorausgefüllten Merkmale trotzdem angekreuzt. Soweit die Mietspiegeltabelle in `src/data/mietspiegel.ts` erfasst ist (bisher Mietspiegel 2015–2026, Baujahr 1965–1972; 2015 inkl. Sondermerkmale), trägt die App außerdem das Mietspiegelfeld in den Prüfbogen ein, berechnet die ortsübliche Vergleichsmiete nach der Orientierungshilfe und schreibt die zulässige Miete samt Rechenweg ins Rügeschreiben. Definition: `src/house/presets.ts` (je Zustand `yes` = angekreuzt, `ask` = wird gefragt, übrige Merkmale des Bogens 2026 = trifft nicht zu).

## Entwicklung

```bash
npm install
npm run dev        # Entwicklungsserver
npm test           # Vitest (Logik, Kataloge, Übersetzungen, Pflichtfragen, PDF-Erzeugung)
npm run build      # statischer Build nach dist/
```

Beispiel-PDFs aller Jahrgänge erzeugen: `PDF_OUT=/tmp/pdfs npx vitest run src/pdf`

### Struktur

| Pfad | Inhalt |
|---|---|
| `src/data/forms.ts` | Kataloge aller Prüfbogen-Versionen (Wortlaut, Bedingungen, Folgefragen) |
| `src/data/logic.ts` | Versionsauswahl, Baujahr-Bedingungen, Energiekennwert, Rüge-Fristen |
| `src/data/mietspiegel.ts` | Mietspiegeltabellen (bisher Baujahr 1965–1972) und Berechnung der zulässigen Miete |
| `src/i18n/features/{de,en,ar}.ts` | Fragen & Erläuterungen je Merkmal |
| `src/i18n/ui/{de,en,ar}.ts` | Oberflächentexte |
| `src/pdf/` | PDF-Erzeugung (pdf-lib): Prüfbogen und Rüge |
| `src/flow/` | Bildschirm-Modell (inkl. Pflichtfragen), Kapitel, Seitenaufteilung am Desktop |
| `src/state/` | Antworten, Speicherung im Browser, abgeleitete Werte |
| `src/house/` | Haus-Modus: Voreinstellungen je Gebäude, Aktivierung per `?haus=` |
| `src/steps/` | Bildschirme je Kapitel (`xxxScreens()`) |
| `public/media/` | Illustrationen (eigene SVGs) und Fotos (Wikimedia Commons) |
| `scripts/fetch-commons.mjs` | lädt Fotos + Lizenzangaben von Wikimedia Commons |

Neuer Mietspiegel: Katalog in `src/data/forms.ts` ergänzen (neue `FormVersion`), neue Merkmal-IDs in allen drei `features`-Dateien übersetzen – die Tests prüfen das.

Die Original-PDFs des BMV werden zur Referenz lokal unter `sources/` abgelegt (nicht im Repo).

## Lizenzen

- Code und eigene Illustrationen: MIT
- Fotos: Wikimedia Commons, jeweilige Lizenz (CC BY / CC BY-SA / CC0 / Public Domain) – Urheber und Lizenz stehen in `src/data/media-photos.json` und werden in der App angezeigt.
- Merkmalsbezeichnungen nach dem Berliner Mietspiegel bzw. den Prüfbögen 169A des Berliner Mietervereins e.V.
