import { HOUSES, type HousePreset } from './presets';

const HOUSE_KEY = 'mietcheck-berlin:house';
const PARAM = 'haus';

/**
 * Liest den Haus-Modus. `?haus=excelsior` schaltet ihn ein (bleibt im Browser gespeichert,
 * auch nach „Neu beginnen“), `?haus=aus` schaltet ihn ab. Der Parameter wird danach aus der URL entfernt.
 */
export function initialHouse(): HousePreset | undefined {
  const url = new URL(window.location.href);
  if (url.searchParams.has(PARAM)) {
    storeHouse(HOUSES[url.searchParams.get(PARAM)?.toLowerCase() ?? '']);
    url.searchParams.delete(PARAM);
    window.history.replaceState(null, '', url);
  }
  return HOUSES[localStorage.getItem(HOUSE_KEY) ?? ''];
}

export function storeHouse(house: HousePreset | undefined): void {
  if (house) localStorage.setItem(HOUSE_KEY, house.id);
  else localStorage.removeItem(HOUSE_KEY);
}
