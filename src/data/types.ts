export type FormId = '2015' | '2017' | '2019' | '2021' | '2023' | '2024' | '2026';

export type GroupId = 'bad' | 'kueche' | 'wohnung' | 'gebaeude' | 'umfeld';

/** Zusatzfrage aus den Fußnoten der Prüfbögen, z. B. „(3) In welchen Räumen?“ */
export type FollowUpKey =
  | 'entlueftungAlter'
  | 'kuecheGroesse'
  | 'raeumeEinfachfenster'
  | 'raeumeElektro'
  | 'raeumeLeitungen'
  | 'balkonGrund'
  | 'raeumeFussbodenheizung'
  | 'raeumeStuck'
  | 'treppenhausDetails'
  | 'zusatzraeume'
  | 'maengel'
  | 'seitenfluegelRaeume'
  | 'daemmung'
  | 'vernachlaessigung'
  | 'laerm'
  | 'geruch'
  | 'wohnumfeld';

/**
 * Einschränkung eines Merkmals nach Baualter bzw. (nur 2015) nach Sondermerkmalen.
 * Jahreszahlen beziehen sich auf die Bezugsfertigkeit.
 */
export interface Condition {
  /** gilt nur bis einschließlich diesem Jahr */
  maxYear?: number;
  /** gilt nur ab diesem Jahr */
  minYear?: number;
  /** gilt nicht im Zeitraum [von, bis] */
  notBetween?: [number, number];
  /** gilt nicht in der Baualtersklasse 1973–1990 Ost */
  notEast7390?: boolean;
  /** 2015: gilt nur, wenn das genannte Sondermerkmal NICHT zutrifft */
  unlessSonder?: SonderId;
}

export interface Merkmal {
  /** stabile ID über alle Jahre, Schlüssel für Übersetzungen und Bilder */
  id: string;
  sign: '+' | '-';
  /** Wortlaut aus dem BMV-Prüfbogen (wird ins PDF übernommen) */
  de: string;
  cond?: Condition;
  followUp?: FollowUpKey;
  /** Merkmale, von denen höchstens eines gewählt werden darf (Energiekennwert-Stufen) */
  exclusive?: string;
}

export interface MerkmalGroup {
  id: GroupId;
  titleDe: string;
  merkmale: Merkmal[];
  /** Hinweistext unter der Tabelle (z. B. Energiekennwerte) */
  notesDe?: string[];
}

export type SonderId =
  | 'sm_parkett'
  | 'sm_kueche'
  | 'sm_dusche'
  | 'sm_kleines_bad'
  | 'sm_modernes_bad'
  | 'sm_isolierverglasung'
  | 'sm_aufzug';

export interface SonderMerkmal {
  id: SonderId;
  de: string;
  /** Zu-/Abschlag in €/m² laut Mietspiegel 2015, je Baualtersklasse (nur Info) */
  zuschlaege: string;
}

export interface FormVersion {
  id: FormId;
  /** Erster Tag des Vertragsabschluss-Zeitraums (ISO) */
  validFrom: string;
  /** Letzter Tag des Vertragsabschluss-Zeitraums (ISO), offen = aktuell */
  validTo?: string;
  titleDe: string;
  /** Kürzel/Stand rechts oben im Original, z. B. „169A 6/26“ */
  formCode: string;
  sourceUrl: string;
  /** Anzahl der Mietspiegelzeilen (ab 2024 nur noch Zeile, vorher Zeile + Spalte) */
  mietspiegelRows?: number;
  /** Bis 2023 wird das Mietspiegelfeld als Zeile + Spalte angegeben */
  asksColumn: boolean;
  /** 2024 fragt nach Mitgliedsnummer */
  asksMemberNo: boolean;
  /** 2024/2026 fragen den Energiekennwert als eigene Frage ab */
  asksEnergyValue: boolean;
  /** 2015: Sondermerkmale */
  sonder?: SonderMerkmal[];
  groups: MerkmalGroup[];
  /** Adresse/E-Mail für den Versand an den BMV laut Bogen */
  sendTo: { email: string; post: string[] };
}
