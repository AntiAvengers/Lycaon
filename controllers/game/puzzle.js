import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import crypto from 'crypto';

import { database, schema } from '../../database/firebaseConfig.js';

//Picks a random puzzle and selects the appropiate controller file
export const random = async () => {
    const dir_path = path.join(__dirname, '../../utils/puzzles');
    const files = await fs.readdir(dir_path);
    //We decided to remove the math puzzle for now.
    const blacklist = ["puzzle.js", "math_puzzle.js"];
    const puzzles = files.filter(name => !blacklist.includes(name));

    const i = Math.floor(Math.random() * puzzles.length);
    const puzzle_name = puzzles[i].split('.')[0];
    const puzzle_path = path.join(dir_path, puzzles[i]);

    const puzzle_url = pathToFileURL(puzzle_path).href;

    const controller = await import(puzzle_url);

    const output = {
        puzzle: puzzle_name,
        controller,
    }

    return output;
}

export const generate = async (hashed) => {
    //Generate new puzzle for player - random puzzle
    const random_puzzle = await random();

    const puzzle = random_puzzle.controller.generate_puzzle();

    try {
        const output = {
            score: 0,
            key_used: false,
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

export const use_key = async(req, res) => {
    const { address } = req.user;
    const hashed = crypto.createHash('sha256').update(address).digest('hex');
    const user_ref = database.ref(`users/${hashed}`);
    const snapshot = await user_ref.once("value");
    const { keys } = snapshot.val();

    if(keys < 1) {
        return res.status(400).json({ error: 'Player does not have enough keys!' });
    }

    const sessions_ref = database.ref(`game_session/${hashed}`);
    sessions_ref.update({ key_used: true });
    user_ref.update({ keys: (keys - 1) });
    return res.status(200).json({ response: (keys - 1) });
}

export const load = async (req, res) => {
    const { address } = req.user;
    if(!address) {
        return res.status(400).json({ error: 'Wallet Address not provided' });
    }

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const session = database.ref(`game_session/${hashed}`);
    const snapshot = await session.once("value");
    if(!snapshot.val()) {
        res.status(400).json({ error: 'game_session does not exist for user'});
    }

    const { key_used } = snapshot.val();
    //If for some reason the puzzle didn't regenerate properly
    if(key_used) {
        //NOTE: For all puzzle controllers, function name has to be "generate_puzzle"
        const puzzle = await generate(hashed);
        return res.status(200).json({ response: puzzle });
    }

    res.status(200).json({ response: snapshot.val() });
}

export const check_answer = async (req, res) => {
    const { answer } = req.body;
    const { address } = req.user;
    
    if(!answer) {
        res.status(400).json({ error: 'Missing "answer" parameter in request body'});
    }

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const session = database.ref(`game_session/${hashed}`);
    const snapshot = await session.once("value");
    if(!snapshot.val()) {
        res.status(403).json({ error: 'game_session does not exist for user'});
    }

    const { valid_answers } = snapshot.val();
    const refined_answer = answer.toLowerCase().trim();
    if(valid_answers.includes(refined_answer)) {
        const new_answers = snapshot.val().submitted_answers;
        if(!new_answers.includes(refined_answer)) {
            new_answers.push(refined_answer);

            const new_score = snapshot.val().score + 1;
    
            await database.ref(`game_session/${hashed}`).update({
                submitted_answers: new_answers,
                score: new_score
            });
        }

        return res.status(200).json({ response: true });
    }
    return res.status(200).json({ response: false });
}

export const finish = async (req, res) => {
    const { address } = req.user;

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const output = {
        player: {},
        leaderboard: {}
    };

    //update user high score in database
    const user = database.ref(`users/${hashed}`);
    const session = database.ref(`game_session/${hashed}`);
    const user_snapshot = await user.once("value");
    const session_snapshot = await session.once("value");
    const { profile_name, highest_score } = user_snapshot.val();
    const { game_type, score } = session_snapshot.val();
    output.player.score = score;
    
    if(score > highest_score[game_type]) {
        output.player.high_score_beaten = true;
        database.ref(`users/${hashed}/highest_score`)
            .update({ [game_type]: score });
    }

    //update global leaderboard
    const leaderboard = database.ref(`leaderboard/${game_type}`);
    const game_leaderboard = await leaderboard.once("value");

    const leaderboard_output = { profile_name, score }

    if(score > 0) {
        const original = game_leaderboard.val();
        if(Object.keys(original).length < 6) {
            leaderboard.push({ profile_name, score });
            output.leaderboard.high_score_beaten = true;
        } else {
            const original_array = Object.keys(original)
                .filter(key => key !== "_init")
                .map(key => {
                    return new Object({ ...original[key], prop: key })
                })
                .sort((a,b) => a.score > b.score ? -1 : 1);
            const updated_array = [...original_array, leaderboard_output]
                .sort((a,b) => a.score > b.score ? -1 : 1)
                .slice(0,5);
            for(let i = 0; i < original_array.length; i++) {
                if(updated_array[i].score > original_array[i].score) {
                    output.leaderboard.high_score_beaten = true;
                    break;
                }
            }
    
            if(!output.leaderboard.high_score_beaten) {
                output.leaderboard.high_score_beaten = false;
            }
    
            if(output.leaderboard.high_score_beaten) {
                const updated_leaderboard = {};
                leaderboard.set({ _init: true });
                for(let i = 0; i < updated_array.length; i++) {
                    const { profile_name, score } = updated_array[i];
                    leaderboard.push({ profile_name, score});
                }
            }
        }
    }
    
    //update scroll rewards in database
    const game_rules = database.ref(`game_rules/${game_type}`);
    const game_rules_snapshot = await game_rules.once('value');
    const { scoring } = game_rules_snapshot.val();
    for(let i = 0; i < scoring.length; i++) {
        const { score: requirement, reward } = scoring[i];
        if(output.player.score >= requirement) {
            const player_pages = user_snapshot.val().pages;
            output.player.reward = reward;
            user.update({ pages: player_pages + reward });
            break;
        }
    }

    //regenerate puzzle
    generate(hashed);
    return res.status(200).json({ response: output });
}