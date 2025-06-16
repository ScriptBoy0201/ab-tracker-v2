export function saveToLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromLocal(key) {
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
}
