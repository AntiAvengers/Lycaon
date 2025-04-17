// const fs = require('fs').promises;
// const path = require('path');

// const crypto = require('crypto');

// const { database, schema } = require('../../database/firebaseConfig.js');
// const { default_game_session } = schema;

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import crypto from 'crypto';

import { database, schema } from '../../database/firebaseConfig.js';
const { default_game_session } = schema;

//Picks a random puzzle and selects the appropiate controller file
export const random = async () => {
    const files = await fs.readdir(path.join(__dirname, './'));
    //We decided to remove the math puzzle for now.
    const blacklist = ["puzzle.js", "math_puzzle.js"];
    const puzzles = files.filter(name => !blacklist.includes(name));

    const i = Math.floor(Math.random() * puzzles.length);

    const output = {
        puzzle: puzzles[i].split(".")[0],
        controller: require(`../../utils/puzzles/${puzzles[i]}`)
    }

    return output;
}

export const generate = async (hashed) => {
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

export const load = async (req, res) => {
    const { address } = req.body;

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const session = database.ref('game_session');
    const snapshot = await session.orderByKey().equalTo(hashed).once("value");
    if(!snapshot.val()) {
        res.status(403).json({ error: 'game_session does not exist for user'});
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

export const check_answer = async (req, res) => {
    const { address, answer } = req.body;
    
    if(!answer) {
        res.status(403).json({ error: 'Missing "answer" parameter in request body'});
    }

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const session = database.ref('game_session');
    const snapshot = await session.orderByKey().equalTo(hashed).once("value");
    if(!snapshot.val()) {
        res.status(403).json({ error: 'game_session does not exist for user'});
    }

    const { valid_answers } = snapshot.val();
    const refined_answer = answer.toLowerCase().trim();
    if(valid_answers.includes(refined_answer)) {
        const new_answers = snapshot.val().submitted_answers;
        new_answers.push(refined);

        const new_score = snapshot.val().score + 1;

        await database.ref(`game_session/${hashed}`).update({
            submitted_answers: new_answers,
            score: new_score
        });

        return res.status(200).json({ result: true });
    }
    return res.status(200).json({ result: false });
}

export const finish = async (req, res) => {
    const { address } = req.body;

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const output = {
        player: {},
        leaderboard: {}
    };

    //update user high score in database
    const user = database.ref('user');
    const session = database.ref('game_session');
    const session_snapshot = await user.orderByKey().equalTo(hashed).once("value");
    const user_snapshot = await session.orderByKey().equalTo(hashed).once("value");
    const { highest_score } = user_snapshot.val();
    const { game_type, score } = session_snapshot.val();
    
    if(game_type == highest_score.game_type) {
        if(score > highest_score.score) {
            output.player.high_score_beaten = true;
            output.player.score = score;

            database.ref(`user/${hashed}`).update({
                highest_score: {
                    game_type: game_type,
                    score: score
                }
            });
        }
    }

    //update global leaderboard
    const leaderboard = database.ref('leaderboard');
    const game_leaderboard = await leaderboard.equalTo(game_type).once("value");

    const leaderboard_output = {profile_name, score}
    if(!game_leaderboard.val()) {
        //First player to make it into the leaderboard
        const array = [{profile_name, score}];
        database.ref(`leaderboard/${game_type}`).update([leaderboard_output]);
    } else {
        const original = game_leaderboard.val();
        const array = game_leaderboard.val();
        array.push(leaderboard_output)
        array.sort((a,b) => a.score > b.score ? -1 : 1);
        const new_leaderboard = array.slice(0,5);
        database.ref(`leaderboard/${game_type}`).update(new_leaderboard);

        for(let i = 0; i < new_leaderboard.length; i++) {
            //If the new leaderboard has a new entry (5 entries vs 4 entries)
            if(!original[i]) {
                output.leaderboard.high_score_beaten = true;
                break;
            }
            //If the new leaderboard is not the same as the original
            if(original[i].profile_name !== new_leaderboard[i].profile_name
                || original[i].score !== new_leaderboard[i].score) {
                output.leaderboard.high_score_beaten = true;
                break;
            }
        }
        if(!output.leaderboard.high_score_beaten) {
            output.leaderboard.high_score_beaten = false;
        }
    }

    //update scroll rewards in database
    const game_rules = database.ref(`game_rules/${game_type}`);
    const game_rules_snapshot = await game_rules.once('value');
    const { scoring } = game_rules_snapshot;
    for(let i = 0; i < scoring.length; i++) {
        const { score: requirement, reward } = scoring[i];
        if(output.player.score >= requirement) {
            output.player.reward = reward;
            user.update({ pages: user_snapshot.pages + 1 });
            break;
        }
    }

    //regenerate puzzle
    generate(hashed);

    return output;
}

// module.exports = {
//     random,
//     generate,
//     load,
//     check_answer,
//     finish
// }

// export {
//     random,
//     generate,
//     load,
//     check_answer,
//     finish
// }