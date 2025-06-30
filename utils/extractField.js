/**
 * Parse JSON body safely
 */
export function parseJson(response) {
    try {
        return JSON.parse(response.body);
    } catch (err) {
        console.error(`❌ Failed to parse JSON: ${err}, body=${response.body}`);
        return {};
    }
}

/**
 * Extract field from ANY object by path with array filtering support
 *
 * Supported syntax:
 *   [0]     - random element from array
 *   [1], [2]... - 1-based index (1 = first element)
 *   [-1]    - last element
 *   [all]   - return full array
 *   [?key=value] - filter array by key = value
 *   [?key1=value1&key2=value2] - filter array by multiple conditions (AND logic)
 *
 * Examples:
 *   extractField(res, 'usergroups[0].id')                          // random group
 *   extractField(res, 'accessToken[1].value')                // 1st cookie
 *   extractField(res, 'locations[?name=Main Library].id')         // filter by name
 *   extractField(res, 'locations[?name=Main Library&code=MAIN].id') // filter by multiple fields
 */
export function extractField(objOrResponse, path) {
    // Auto-detect response object and parse JSON body
    const data = (objOrResponse?.body !== undefined)
        ? parseJson(objOrResponse)
        : objOrResponse;

    const parts = path.split('.');
    let current = data;

    for (const part of parts) {
        const match = part.match(/^(\w+)\[(.*?)\]$/); // e.g. locations[0], locations[?name=Main]

        if (match) {
            const key = match[1];
            const indexOrFilter = match[2];

            current = current?.[key];

            if (!Array.isArray(current)) {
                console.warn(`⚠️ extractField: Expected array at "${key}", but got:`, current);
                return undefined;
            }

            // Filter by conditions e.g. [?name=Main Library&code=MAIN]
            if (indexOrFilter.startsWith('?')) {
                const filterStr = indexOrFilter.slice(1); // remove '?'
                const conditions = filterStr.split('&').map(cond => {
                    const [field, value] = cond.split('=');
                    return [field, value?.replace(/^["']|["']$/g, '')]; // strip quotes
                });

                const found = current.find(item =>
                    conditions.every(([field, expected]) => `${item[field]}` === expected)
                );

                if (!found) {
                    console.warn(`⚠️ extractField: No match for filter [${filterStr}] in "${key}"`);
                    return undefined;
                }

                current = found;
            }
            // Random element
            else if (indexOrFilter === '0') {
                const randIndex = Math.floor(Math.random() * current.length);
                current = current[randIndex];
            }
            // Last element
            else if (indexOrFilter === '-1') {
                current = current[current.length - 1];
            }
            // Return full array
            else if (indexOrFilter === 'all') {
                return current;
            }
            // 1-based index
            else {
                const idx = parseInt(indexOrFilter, 10) - 1;
                if (isNaN(idx) || idx < 0 || idx >= current.length) {
                    console.warn(`⚠️ extractField: Index out of range [${indexOrFilter}] at "${key}"`);
                    return undefined;
                }
                current = current[idx];
            }
        } else {
            current = current?.[part];
        }

        if (current === undefined) {
            console.warn(`⚠️ extractField: Path "${path}" not found at part "${part}"`);
            return undefined;
        }
    }

    return current;
}
