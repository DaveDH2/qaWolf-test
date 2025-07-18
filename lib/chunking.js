
/**
 * const CHUNKS = [
 *   { page: 1, range: [1, 30] },
 *   { page: 2, range: [31, 60] },
 *   { page: 3, range: [61, 90] },
 *   { page: 4, range: [91, 100] },
 * ];
 * 
 * @param {number} totalCount - Total number of items to chunk (e.g., 100 posts)
 * @param {number} chunkSize - Max items per chunk (e.g., 30 per HN pagination)
 * @param {number} [maxChunks=4] - Optional limit on number of chunks/workers
 * @returns {Array<{ page: number, range: [number, number] }>}
 */
export function generateChunks(totalCount, chunkSize, maxChunks = 4) {
  const chunks = [];
  let start = 1;
  let page = 1;

  while (start <= totalCount && chunks.length < maxChunks) {
    const end = Math.min(start + chunkSize - 1, totalCount);
    chunks.push({ page, range: [start, end] });
    start = end + 1;
    page++;
  }

  return chunks;
}