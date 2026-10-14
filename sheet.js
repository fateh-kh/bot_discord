const xlsx = require('xlsx');
const path = require('path');

/**
 * Reads a local .xlsx file and returns all rows as an array of JSON objects.
 * The first row in the sheet is used as the object keys (column headers).
 *
 * Example sheet:
 * Name  | Score
 * Ali   | 90
 * Sara  | 85
 *
 * Returns:
 * [ { Name: 'Ali', Score: 90 }, { Name: 'Sara', Score: 85 } ]
 *
 * @param {string} filePath - path to the .xlsx file (relative to project folder)lp
 * @param {string} [sheetName] - optional sheet/tab name, defaults to the first sheet
 */
function readExcelAsObjects(filePath, sheetName = null) {
    const fullPath = path.join(__dirname, filePath);
    const workbook = xlsx.readFile(fullPath);

    const targetSheet = sheetName || workbook.SheetNames[0];
    const sheet = workbook.Sheets[targetSheet];

    if (!sheet) {
        throw new Error(`Sheet "${targetSheet}" not found. Available sheets: ${workbook.SheetNames.join(', ')}`);
    }

    const data = xlsx.utils.sheet_to_json(sheet); // array of objects, keyed by header row
    return data;
}

module.exports = { readExcelAsObjects };