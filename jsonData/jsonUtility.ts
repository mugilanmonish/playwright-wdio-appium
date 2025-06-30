import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Required to use __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default JSON file path (customize this as needed)
const jsonFilePath = path.resolve(__dirname, './data.json');

/**
 * Reads data from a JSON file
 * @param {string} filePath - Optional path to JSON file
 * @returns {object} Parsed JSON data
 */
export function readJson(filePath: string = jsonFilePath): object {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}

/**
 * Writes data to a JSON file (overwrites existing content)
 * @param {object} data - The data to write
 * @param {string} filePath - Optional path to JSON file
 */
export function writeJson(data: object, filePath: string = jsonFilePath) {
  const formattedData = JSON.stringify(data, null, 2); // pretty print
  fs.writeFileSync(filePath, formattedData, 'utf-8');
}