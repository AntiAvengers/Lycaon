import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dictionary_path = path.join(__dirname, '../enable1.txt');
if(!fs.existsSync(dictionary_path)) {
    throw new Error(`"enable1.txt" not found in ${dictionary_path}`);
}

const MAX_COUNT = 2000000;

export const get_score_cutoff = () => MAX_COUNT;

export const load = () => {
    const MAX_COUNT = 2000000;
    const dictionary = fs.readFileSync(dictionary_path, 'UTF-8')
        //"/r/n" is Windows only, below is universal
        .split(/\r?\n/)
        .map(str => new Object({
            word: str.split(",")[0].toLowerCase(),
            count: parseInt(str.split(",")[1]) > MAX_COUNT ? MAX_COUNT : parseInt(str.split(",")[1])
        }))
        .sort((a,b) => a.count < b.count ? -1 : 1);
    
    return dictionary;
}