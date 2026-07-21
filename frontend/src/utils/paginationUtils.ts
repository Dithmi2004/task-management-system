export function getTotalPages(
  itemCount: number,
  itemsPerPage: number
): number {
  return Math.max(
    1,
    Math.ceil(itemCount / itemsPerPage)
  );
}

export function getPaginatedItems<T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number
): T[] {
  const startIndex = (currentPage - 1) * itemsPerPage;

  return items.slice(
    startIndex,
    startIndex + itemsPerPage
  );
}
