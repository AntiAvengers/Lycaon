const fs = require('fs').promises;
const path = require('path');

const crypto = require('crypto');

const { database, schema } = require('../../database/firebaseConfig.js');
const { default_game_session } = schema;

const random = async () => {
    //Puzzle Randomizer
    const files = await fs.readdir(path.join(__dirname, './'));
    const puzzles = files.filter(name => name !== "puzzle.js");

    const i = Math.floor(Math.random() * puzzles.length);

    const output = {
        puzzle: puzzles[i].split("_")[0],
        controller: require(`./${puzzles[i]}`)
    }

    return output;
}

const load = (req, res) => {
    const { address } = req.body;
    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const session = database.ref('game_session');
    session.orderByKey().equalTo(hashed).once("value", snapshot => {
        if(!snapshot.exists()) {
            const new_game_session = {
                [hashed]: game_session_schema
            }

            session.set(new_game_session)
        }
    });

    const result = "SUCCESS";
    res.json({ result });
}

module.exports = {
    random,
    load
}