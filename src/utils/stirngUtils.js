export function capitalize(word) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const turkishSortComparator = (a, b) => {
  return String(a).localeCompare(String(b), "tr", { sensitivity: "base" });
};