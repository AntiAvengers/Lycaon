const fs = require('fs');
const path = require('path');

const dictionary_path = path.join(__dirname, '../enable1.txt');
if(!fs.existsSync(dictionary_path)) {
    throw new Error(`"enable1.txt" not found in ${dictionary_path}`);
} 

module.exports = {
    load_dictionary: () => {
        const MAX_COUNT = 2000000;
        const dictionary = fs.readFileSync(dictionary_path, 'UTF-8')
            .split("\r\n")
            .map(str => new Object({
                word: str.split(",")[0].toLowerCase(),
                count: parseInt(str.split(",")[1]) > MAX_COUNT ? MAX_COUNT : parseInt(str.split(",")[1])
            }))
            .sort((a,b) => a.count < b.count ? -1 : 1);
        
        return dictionary;
    }
}