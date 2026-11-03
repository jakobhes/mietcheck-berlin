import type { FollowUpKey, SonderId } from '../data/types';
import type { EnergyKind } from '../data/logic';

export type YesNo = '' | 'ja' | 'nein';
export type FeatureAnswer = 'yes' | 'no' | 'unsure';

export interface Address {
  name: string;
  street: string;
  zip: string;
  city: string;
}

export type HouseVariant = 'renoviert' | 'unrenoviert';

export interface Answers {
  /* Haus-Modus (z. B. Excelsior): Aufgang und Zustand der Wohnung */
  houseNo: string;
  houseVariant: '' | HouseVariant;

  /* Vertrag */
  contractDate: string;
  rentStart: string;
  rent: string;
  indexRent: YesNo;
  staffelRent: YesNo;
  municipal: YesNo;

  /* Ausnahmen (§ 556e, § 556f BGB) – nur Hinweise */
  exNewBuild: YesNo;
  exModernized: YesNo;
  exPreviousRent: YesNo;
  exSocialHousing: YesNo;
  landlordDisclosed: YesNo;
  landlordDisclosedText: string;

  /* Wohnung */
  buildYear: string;
  east: YesNo;
  area: string;
  wohnlage: '' | 'einfache' | 'mittlere' | 'gute';
  row: string;
  column: string;
  equipment: {
    aussenWC: boolean;
    innenWC: boolean;
    badWC: boolean;
    sammelheizung: boolean;
    ofenheizung: boolean;
    fahrstuhl: boolean;
  };
  position: '' | 'Vorderhaus' | 'Seitenflügel' | 'Hinterhaus';
  floor: string;
  side: '' | 'links' | 'rechts' | 'mitte';
  attic: YesNo;
  modernizedOld: YesNo;
  modernizedWhen: string;
  smallHouse: YesNo;

  /* Energie */
  energyValue: string;
  energyKind: EnergyKind;
  energyDecentralWater: boolean;

  /* Merkmale */
  sonder: Partial<Record<SonderId, YesNo>>;
  features: Record<string, FeatureAnswer>;
  followUps: Partial<Record<FollowUpKey, string>>;
  laermArt: { strasse: boolean; schiene: boolean; flug: boolean };
  remarks: string;
  wistg: YesNo;

  /* Personen */
  tenant: Address & { email: string; phone: string; reachable: string; memberNo: string };
  flatDiffers: boolean;
  flat: Omit<Address, 'name'> & { detail: string };
  landlord: Address;

  /* Rüge */
  maxRent: string;
  demandInfo: boolean;
}

export const emptyAddress: Address = { name: '', street: '', zip: '', city: '' };

export const initialAnswers: Answers = {
  houseNo: '',
  houseVariant: '',
  contractDate: '',
  rentStart: '',
  rent: '',
  indexRent: '',
  staffelRent: '',
  municipal: '',
  exNewBuild: '',
  exModernized: '',
  exPreviousRent: '',
  exSocialHousing: '',
  landlordDisclosed: '',
  landlordDisclosedText: '',
  buildYear: '',
  east: '',
  area: '',
  wohnlage: '',
  row: '',
  column: '',
  equipment: { aussenWC: false, innenWC: false, badWC: false, sammelheizung: false, ofenheizung: false, fahrstuhl: false },
  position: '',
  floor: '',
  side: '',
  attic: '',
  modernizedOld: '',
  modernizedWhen: '',
  smallHouse: '',
  energyValue: '',
  energyKind: 'verbrauch',
  energyDecentralWater: false,
  sonder: {},
  features: {},
  followUps: {},
  laermArt: { strasse: false, schiene: false, flug: false },
  remarks: '',
  wistg: '',
  tenant: { ...emptyAddress, email: '', phone: '', reachable: '', memberNo: '' },
  flatDiffers: false,
  flat: { street: '', zip: '', city: 'Berlin', detail: '' },
  landlord: { ...emptyAddress },
  maxRent: '',
  demandInfo: true,
};

const STORAGE_KEY = 'mietcheck-berlin:v1';

export function loadAnswers(): Answers {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialAnswers;
    const parsed = JSON.parse(raw) as Partial<Answers>;
    return { ...initialAnswers, ...parsed };
  } catch {
    return initialAnswers;
  }
}

export function saveAnswers(a: Answers): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
  } catch {
    /* Speicher voll oder deaktiviert – App funktioniert trotzdem */
  }
}

export function clearAnswers(): void {
  localStorage.removeItem(STORAGE_KEY);
}
