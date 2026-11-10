// One switch to pause or reopen pickup requests and contact support.
export const servicesPaused = false;
export const openingSoonHref = "#service-opening-soon";
export function showOpeningSoon() {
  window.dispatchEvent(new Event("zapiboo:opening-soon"));
}
