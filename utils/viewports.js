// utils/viewports.js

export const allViewports = {
  Desktop: { width: 1440, height: 1000 },
  Laptop:  { width: 1230, height: 1000 },
  Tablet:  { width: 768,  height: 1000 },
  Mobile:  { width: 412,  height: 1000 }
};

// Named objects ready to use in tests
export const Desktop = { name: 'Desktop', size: allViewports.Desktop };
export const Laptop  = { name: 'Laptop',  size: allViewports.Laptop };
export const Tablet  = { name: 'Tablet',  size: allViewports.Tablet };
export const Mobile  = { name: 'Mobile',  size: allViewports.Mobile };

export async function setViewport(page, viewportSize) {
  await page.setViewportSize(viewportSize);
  // await page.reload();   
}

/**
 * Helper: getEnabledViewports
 * @param {string[]} keys - e.g. ['Tablet','Mobile']
 * @returns array of {name, size}
 */
export function getEnabledViewports(keys) {
  if (!keys || keys.length === 0) return [];
  return keys.map(k => ({ name: k, size: allViewports[k] }));
}
/** Order keys by descending width so we can “bucket” a size to the nearest defined viewport */
const ORDERED_KEYS_DESC = Object
  .entries(allViewports)
  .sort((a, b) => b[1].width - a[1].width)
  .map(([k]) => k);

/** Map a {width,height} to the closest named viewport using width bucketing */
export function mapSizeToViewportName(size) {
  if (!size || typeof size.width !== 'number') return 'Desktop'; // fallback
  const w = size.width;

  // exact match first
  for (const [name, vp] of Object.entries(allViewports)) {
    if (vp.width === w) return name;
  }

  // else pick the first whose width <= current width (descending list)
  for (const name of ORDERED_KEYS_DESC) {
    if (w >= allViewports[name].width) return name;
  }

  // otherwise the smallest bucket
  return 'Mobile';
}

/** Convenience: read the viewport from a Playwright page and map it to a name */
export function getViewportNameFromPage(page) {
  // page.viewportSize() returns {width,height} or null if viewport: null
  const size = page.viewportSize?.() || null;
  return mapSizeToViewportName(size);
}
