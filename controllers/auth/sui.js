import crypto from 'crypto';

import { fromBase64 } from '@mysten/sui/utils';
import { verifyPersonalMessageSignature } from '@mysten/sui/verify';
import { SuiGraphQLClient } from '@mysten/sui/graphql';

import { database, schema } from '../../database/firebaseConfig.js';
const { default_user, default_game_session } = schema;
import { generateToken, verifyToken } from '../../utils/jwt.js';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const Users_UUID = new Map();

export const check_account = (address) => {
    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const new_user = { [hashed]: default_user };
    const new_game_session = { [hashed]: default_game_session };

    const users = database.ref('users');
    users.once("value", snapshot => {
        if(!snapshot.val()) {
            users.set(new_user);
        }
        else if(!snapshot.val()[hashed]) {
            users.update({ [hashed]: default_user });
        }
    });

    const game_sessions = database.ref('game_session');
    game_sessions.once("value", snapshot => {
        if(!snapshot.val()) {
            game_sessions.set(new_game_session);
        }
        else if(!snapshot.val()[hashed]) {
            game_sessions.update({ [hashed]: default_game_session });
        }
    });

    console.log('. . .', address, 'has logged in!');
}

export const generate_UUID = (req, res) => {
    //Step 0: Connect React App w/ Sui Wallet through @mysten/dapp-kit (Responsibility of FrontEnd)
    const { address } = req.body;

    //Step 1: Generate UUID message for Client w/ Sui Wallet to sign to prove ownership of wallet
    const UUID = crypto.randomUUID();
    Users_UUID.set(address, UUID);

    res.json({ UUID });
}

export const login = async (req, res) => {
    //Step 2: Client signs message, sends bytes + signature back encoded via Base64
    const { address, bytes, UUID, message, signature } = req.body;

    if(!bytes || !message || !signature || !UUID) {
        return res.status(400).json({ error: "Missing required fields (message or signature) from request body!" });
    }

    const UUID_message = Users_UUID.get(address);

    if(!UUID_message || UUID_message !== UUID) {
        return res.status(401).json({ error: "Invalid or Expired UUID Message"});
    }

    //Step 3: Signature verified using Sui's built-in signature verification.
    // . . . If it doesn't match, will throw an error on the server hence the try-catch block
    try {
        const is_verified = await verifyPersonalMessageSignature(
            fromBase64(bytes),
            signature, 
            process.env.MODE == "DEVELOPMENT" ? 
            { 
                address: address,
                //At some point this stopped working and caused the signature to fail to verify . . .
                // client: new SuiGraphQLClient({
                //     url: `https://sui-devnet.mystenlabs.com/graphql`,
                // }),
            } :
            { 
                address: address, 
                // client: new SuiGraphQLClient({
                //     url: `https://sui-testnet.mystenlabs.com/graphql`,
                // }),
            }
        );

        Users_UUID.delete(address);

        //Step 4: Checks on firebase if user account exists (tied to Sui Wallet Address)
        // . . . otherwise initializes data in firebase for new user
        check_account(address);

        //Step 5: Issue a JWT
        const accessToken = generateToken({ address }, ACCESS_TOKEN_SECRET, '30m');  // Access token for authentication
        const refreshToken = generateToken({ address }, REFRESH_TOKEN_SECRET, '7d');  // Refresh token for long-term sessions
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.MODE === "PRODUCTION",
            sameSite: process.env.MODE === "PRODUCTION" ? "Strict" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        res.status(200).json({ accessToken });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}