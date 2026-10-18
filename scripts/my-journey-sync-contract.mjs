// Pure, browser-independent planning utilities. Not wired into the live site.
export const SYNC_CONTRACT_VERSION = 1;
export const GENERAL_STORAGE_KEYS = Object.freeze([
  'nldg-profile-v2','nldg-favorites-v1','nldg-history-v1',
  'nldg-collections-v1','nldg-completed-v1','nldg-notes-v1',
  'nldg-prayers-v1','nldg-plans-v1','nldg-streak-v1','nldg-study-state'
]);
export const SERIES_STORAGE_KEYS = Object.freeze([
  'nldg-series-after-benediction','nldg-series-preferences-idols',
  'nldg-faith-hurting-en','nldg-faith-hurting-es','nldg-series-james'
]);
export const PRIVATE_STORAGE_KEYS = Object.freeze([
  'nldg-notes-v1','nldg-prayers-v1'
]);
export function normalizeCompletedLessons(values, maxLesson = Number.MAX_SAFE_INTEGER) {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter(value => Number.isInteger(value) && value >= 1 && value <= maxLesson))].sort((a,b)=>a-b);
}
export function mergeCompletedLessons(local, remote, maxLesson) {
  return normalizeCompletedLessons([...normalizeCompletedLessons(local,maxLesson),...normalizeCompletedLessons(remote,maxLesson)],maxLesson);
}
export function planImport(storage, { includePrivate = false } = {}) {
  const allowed = [...GENERAL_STORAGE_KEYS,...SERIES_STORAGE_KEYS].filter(key => includePrivate || !PRIVATE_STORAGE_KEYS.includes(key));
  const records = [];
  const rejected = [];
  for (const key of allowed) {
    const raw = storage.getItem(key);
    if (raw === null) continue;
    try {
      const parsed = JSON.parse(raw);
      if (parsed === null || typeof parsed !== 'object') throw new Error('Invalid shape');
      records.push({key, value: parsed});
    } catch {
      rejected.push(key);
    }
  }
  return { version: SYNC_CONTRACT_VERSION, records, rejected, privateIncluded: includePrivate };
}
