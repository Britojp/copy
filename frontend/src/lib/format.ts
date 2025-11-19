export function formatDateBR(dateStr: string): string {
  if (!dateStr || dateStr === '—') return '—';
  try {
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function extractArrayFromObject(obj: unknown, key: string): Array<unknown> {
  if (obj && typeof obj === 'object' && key in obj) {
    const arr = (obj as Record<string, unknown>)[key];
    if (Array.isArray(arr)) return arr;
  }
  return [];
}

export function toggleSetItem<T>(set: Set<T>, item: T): Set<T> {
  const next = new Set(set);
  if (next.has(item)) {
    next.delete(item);
  } else {
    next.add(item);
  }
  return next;
}

