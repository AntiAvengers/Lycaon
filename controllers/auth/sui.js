const crypto = require('crypto');

const { fromBase64 } = require('@mysten/sui/utils');
const { verifyPersonalMessageSignature } = require('@mysten/sui/verify');
const { SuiGraphQLClient } = require('@mysten/sui/graphql');

const { database } = require('../../database/firebaseConfig');

const Users_UUID = new Map();

function check_account(address) {
    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const new_user = {
        [hashed]: {
            logged_in: false,
            wallet_ID: address,
            highest_score: 0
        }
    }

    const users = database.ref('users');
    users.once("value", snapshot => {
        if(!snapshot.val()) {
            users.set(new_user);
            return generate_UUID(req, res);
        }

        if(!snapshot.val()[hashed]) {
            users.push(new_user);
        }
    });
}

function login(req, res) {
    const { address } = req.body;
    check_account(address);

    const users = database.ref('users');
    users.once("value", snapshot => {
        if(!snapshot.val()[hashed]) {
            users.push(new_user);
        }
    });
}

function generate_UUID(req, res) {
    const { address } = req.params;

    if(!address) return res.status(400).json({error: 'Wallet address missing from request parameters!' });

    const UUID = crypto.randomUUID();
    Users_UUID.set(address, UUID);

    res.json({ UUID });
}

async function connect(req, res) {
    const { address, bytes, message, signature } = req.body;

    if(!address || !bytes || !message || !signature) {
        return res.status(400).json({ error: "Missing required fields (address, message or signature) from request body!" });
    }

    const UUID_message = Users_UUID.get(address);
    console.log(Users_UUID);

    if(!UUID_message || UUID_message !== message) {
        return res.status(401).json({ error: "Invalid or Expired UUID Message"});
    }

    try {
        const is_verified = await verifyPersonalMessageSignature(
            fromBase64(bytes),
            signature, 
            { 
                address: address, 
                client: new SuiGraphQLClient({
                    url: 'https://sui-testnet.mystenlabs.com/graphql',
                }),
            }
        );
        Users_UUID.delete(address);

        /*
            * Have to check the auto connect feature in wallet. Will they have to sign in their wallet everytime?
            (cont.) Wallet Sign-in => JWT Issuance (there might be a disconnect between JWT session vs Wallet Session)
            1) Wallet is confirmed to be User's
            2) Issue JWT
            3) If new acc -> generate new user in firebase (perhaps during the JWT code)
            4)  otherwise continue     
        */
        const result = "You have succesfully logged in";
        res.json({ result });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}



module.exports = {
    connect,
    generate_UUID,
    check_account,
    login
} 