const crypto = require('crypto');

const { fromBase64 } = require('@mysten/sui/utils');
const { verifyPersonalMessageSignature } = require('@mysten/sui/verify');
const { SuiGraphQLClient } = require('@mysten/sui/graphql');

const { database } = require('../../database/firebaseConfig');
const { generateToken, verifyToken } = require('./jwt');

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const Users_UUID = new Map();

function check_account(address) {
    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const new_user = {
        [hashed]: {
            name: "",
            logged_in: false,
            wallet_ID: address,
            highest_score: 0,
            new_account: false,
            last_login: Date.now(),
        }
    }

    const users = database.ref('users');
    users.once("value", snapshot => {
        if(!snapshot.val()) {
            users.set(new_user);
        }
        else if(!snapshot.val()[hashed]) {
            users.push(new_user);
        }
    });

    console.log('. . .', address, 'has logged in!');
}

function generate_UUID(req, res) {
    //Step 0: Connect React App w/ Sui Wallet through @mysten/dapp-kit (Responsibility of FrontEnd)
    const { address } = req.body;
    if(!address) {
        res.json({ error: "Missing Property in request body: Wallet Address, perhaps wallet is not connected!"})
    }

    //Step 1: Generate UUID message for Client w/ Sui Wallet to sign to prove ownership of wallet
    const UUID = crypto.randomUUID();
    Users_UUID.set(address, UUID);

    res.json({ UUID });
}

async function login(req, res) {
    //Step 2: Client signs message, sends bytes + signature back encoded via Base64
    const { address, bytes, message, signature } = req.body;

    if(!address || !bytes || !message || !signature) {
        return res.status(400).json({ error: "Missing required fields (address, message or signature) from request body!" });
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
        const user = { address };  // User object (could be expanded with other data)
        const accessToken = generateToken(user, ACCESS_TOKEN_SECRET, '30m');  // Access token for authentication
        const refreshToken = generateToken(user, REFRESH_TOKEN_SECRET, '7d');  // Refresh token for long-term sessions

        res.status(200).json({ accessToken, refreshToken });
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