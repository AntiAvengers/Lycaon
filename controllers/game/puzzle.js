const fs = require('fs').promises;
const path = require('path');

const crypto = require('crypto');

const { database, schema } = require('../../database/firebaseConfig.js');
const { default_game_session } = schema;

//Picks a random puzzle and selects the appropiate controller file
const random = async () => {
    const files = await fs.readdir(path.join(__dirname, './'));
    //We decided to remove the math puzzle for now.
    const blacklist = ["puzzle.js", "math_puzzle.js"];
    const puzzles = files.filter(name => !blacklist.includes(name));

    const i = Math.floor(Math.random() * puzzles.length);

    const output = {
        puzzle: puzzles[i].split("_")[0],
        controller: require(`./${puzzles[i]}`)
    }

    return output;
}

//hashed = crypto.createHash('sha256').update(address).digest('hex'); of wallet address
const generate = async (hashed) => {
    //Generate new puzzle for player - random puzzle
    const random_puzzle = await random();

    const puzzle = random_puzzle.controller.generate_puzzle();

    try {
        const output = {
            game_type: random_puzzle.puzzle,
            puzzle_data: puzzle.data,
            validate_on_client: puzzle.validate_on_client,
            valid_answers: puzzle.solution ? puzzle.solution : false,
        }
        database.ref(`game_session/${hashed}`).update(output);
        delete output.valid_answers;
        return output;
    } catch(err) {
        console.error('Error updating game session:', err);
        return 400;
    }
}

const load = async (req, res) => {
    const { address } = req.body;
    console.log(req.body);
    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    if(!address) {
        res.sendStatus(403).json({ Error: "Missing Sui wallet address. Make sure wallet is connected with Lycaon" })
    }

    const session = database.ref('game_session');
    const snapshot = await session.orderByKey().equalTo(hashed).once("value");
    if(!snapshot.val()) {
        res.sendStatus(403);
    }

    const { key_used } = snapshot.val();
    //If for some reason the puzzle didn't regenerate properly
    if(!key_used) {
        //NOTE: For all puzzle controllers, function name has to be "generate_puzzle"
        const puzzle = await generate(hashed);
        return res.status(200).json({puzzle});
    }

    res.status(200).json({puzzle: snapshot.val()});
}

const validate = (req, res) => {

}

module.exports = {
    random,
    generate,
    load
}