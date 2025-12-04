export async function getTableColumnData(tableLocator, columnIndex, allRows = false) {
    const rows = tableLocator.locator('tbody tr');
    if (allRows) {
        const data = [];
        const rowCount = await rows.count();
        for (let i = 0; i < rowCount; i++) {
            data.push(await rows.nth(i).locator(`td:nth-child(${columnIndex})`).innerText());
        }
        return data;
    } else {
        return await rows.first().locator(`td:nth-child(${columnIndex})`).innerText();
    }
}

export const getSplitTableColumnData = async (tableLocator, columnIndex, index, allRows = false) => {
    const data = await getTableColumnData(tableLocator, columnIndex, allRows);
    if (!data || (Array.isArray(data) && data.length === 1 && data[0] === "No Data Found")) {
        console.log("⚠️ No data found in table. Returning empty array.");
        return [];
    }
    const extractValue = (cellText) => {
        const parts = cellText.split('\n').map(p => p.trim()).filter(Boolean);
        if (index <= 0 || index > parts.length) {
            throw new Error(`Invalid index ${index}. Cell only has ${parts.length} part(s).`);
        }
        return parts[index - 1]; // 1 => first part, 2 => second part
    };

    if (allRows) {
        return data.map(extractValue);
    } else {
        return extractValue(data);
    }
}

/**
 * Generic function to get table rows as array of objects
 * Automatically picks the first line for multi-line cells if splitIndex not provided
 * @param {Locator} tableLocator - Playwright table locator
 * @param {Array<{ name: string, index: number, splitIndex?: number }>} columns - Array of columns to capture
 * @param {boolean} allRows - Whether to get all rows or only first row
 */
export async function getRowsAsArray(tableLocator, columns, allRows = true) {
    const rows = tableLocator.locator('tbody tr');
    const rowCount = await rows.count();

    if (rowCount === 0) {
        console.log("⚠️ No rows found in table. Returning empty array.");
        return [];
    }

    const result = [];

    for (let i = 0; i < (allRows ? rowCount : 1); i++) {
        const row = rows.nth(i);
        const rowData = {};

        for (const col of columns) {
            let cellText = await row.locator(`td:nth-child(${col.index})`).innerText();
            cellText = cellText.trim();

            // If splitIndex is provided, pick that line
            if (col.splitIndex) {
                const parts = cellText.split('\n').map(p => p.trim()).filter(Boolean);
                const idx = col.splitIndex - 1;
                rowData[col.name] = parts[idx] || '';
            } else {
                // Auto-pick the “main line” for multi-line cells (first non-empty line)
                const parts = cellText.split('\n').map(p => p.trim()).filter(Boolean);
                rowData[col.name] = parts[0] || '';
            }
        }

        result.push(rowData);
    }

    return result;
}