const dictionary = require('../../utils/dictionary');
const words = dictionary.load();

function generate_puzzle(num_of_letters = 7, count = 0) {
    const all_vowels = ["a", "e", "i", "o", "u"];
    const all_consonants = ["b", "c", 'd', 'f', 'g', 'h', 'j', 'k', 
    'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];

    const num_of_vowels = Math.floor((Math.random() * 2) + 1);
    const num_of_consonants = num_of_letters - num_of_vowels;
    //Generating random vowels (1 or 2) and the remaining consonants
    const puzzle = [];
    for(let i = 0; i < num_of_vowels; i++) {
        const vIndex = Math.floor(Math.random() * all_vowels.length);
        puzzle.push(all_vowels[vIndex]);
        all_vowels.splice(vIndex, 1);
    }
    for(let i = 0; i < num_of_consonants; i++) {
        const cIndex = Math.floor(Math.random() * all_consonants.length);
        puzzle.push(all_consonants[cIndex]);
        all_consonants.splice(cIndex, 1);
    }
    //Randomizes the output of letters so the vowels aren't always in the first index.
    for (let i = puzzle.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [puzzle[i], puzzle[randomIndex]] = [puzzle[randomIndex], puzzle[i]];
    }

    //Checks validity of Word puzzle
    const check = get_validity(puzzle);

    const output = {
        data: puzzle,
        solution: check.valid_words,
        validate_on_client: false, //Server will check answers
        meta: {
            is_valid: check.is_valid,
            num_of_generations: count,
            true_words: check.length
        }
    }
    return output.meta.is_valid ? output : generate_puzzle(num_of_letters, (count+1));
}

function get_validity(letters) {
    let valid_words = [];

    for(let i = 0; i < words.length; i++) {
        let add_word = true;
        for(let j = 0; j < words[i].word.length; j++) {
            if(!letters.includes(words[i].word[j])) {
                add_word = false;
                break;
            }
        }
        if(add_word) {
            valid_words.push(words[i]);
        }
    }

    const true_words = valid_words
        .filter(obj => obj.count >= dictionary.get_score_cutoff());    
    
    const output = {
        is_valid: (true_words.length >= 15 ? true : false),
        valid_words: valid_words,
        length: true_words.length
    }
    return output;
}

function check_answer(req, res) {
    const { word } = req.body;

    const response = valid_words
    res.json ({ response });
}

module.exports = {
    generate_puzzle,
    check_answer 
}