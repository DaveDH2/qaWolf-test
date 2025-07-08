
/**
 * Generates chunk ranges like [0, 29], [30,59] up to total count
 * 
 * 
 * @param {number} totalCount = Total number of items to chunk (eg. 100 post)
 * @param {number} chunkSize = Maxium items per chunk. Currently its at 30 per pagination as of July 3, 2025
 * @param {number} [maxChunk=4] - Optional limit to how many workers to generate ; 4 MAX also see playwright.config.js
 * @returns {Array<{ page: number, range: [number, number] }>} - Array of paged chunk objects
 */

export function generateChunks(totalCount, chunkSize, maxChunks = 4) {
    const chunks = [];
    let start = 0;
    let page = 1;

    while (start < totalCount && chunks.length < maxChunks) {
        const end = Math.min(start + chunkSize - 1, totalCount - 1);
        chunks.push({page, range: [start, end]});
        start = end + 1;
        page++;
    }

    return chunks;
}