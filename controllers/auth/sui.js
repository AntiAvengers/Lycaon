const crypto = require('crypto');

const { fromBase64 } = require('@mysten/sui/utils');
const { verifyPersonalMessageSignature } = require('@mysten/sui/verify');
const { SuiGraphQLClient } = require('@mysten/sui/graphql');

const { database, schema } = require('../../database/firebaseConfig');
const { default_user, default_game_session } = schema;
const { generateToken, verifyToken } = require('../../utils/jwt');

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const Users_UUID = new Map();

function check_account(address) {
    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const new_user = { [hashed]: default_user };
    const new_game_session = { [hashed]: default_game_session };

    const users = database.ref('users');
    users.once("value", snapshot => {
        if(!snapshot.val()) {
            users.set(new_user);
        }
        else if(!snapshot.val()[hashed]) {
            users.push(default_user);
        }
    });

    const game_sessions = database.ref('game_session');
    game_sessions.once("value", snapshot => {
        if(!snapshot.val()) {
            game_sessions.set(new_game_session);
        }
        else if(!snapshot.val()[hashed]) {
            game_sessions.push(default_game_session);
        }
    });

    console.log('. . .', address, 'has logged in!');
}

function generate_UUID(req, res) {
    //Step 0: Connect React App w/ Sui Wallet through @mysten/dapp-kit (Responsibility of FrontEnd)
    const { address } = req.body;

    //Step 1: Generate UUID message for Client w/ Sui Wallet to sign to prove ownership of wallet
    const UUID = crypto.randomUUID();
    Users_UUID.set(address, UUID);

    res.json({ UUID });
}

async function login(req, res) {
    //Step 2: Client signs message, sends bytes + signature back encoded via Base64
    const { address, bytes, message, signature } = req.body;

    if(!bytes || !message || !signature) {
        return res.status(400).json({ error: "Missing required fields (message or signature) from request body!" });
    }

    const UUID_message = Users_UUID.get(address);

    if(!UUID_message || UUID_message !== message) {
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
                client: new SuiGraphQLClient({
                    url: 'https://sui-testnet.mystenlabs.com/graphql',
                }),
            } : { address: address }
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
            secure: process.env.NODE_ENV === "PRODUCTION",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ accessToken });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}

module.exports = {
    check_account,
    generate_UUID,
    login,
} 