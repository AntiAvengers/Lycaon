const { fromBase64 } = require('@mysten/sui/utils');
const { verifyPersonalMessageSignature } = require('@mysten/sui/verify');
const { SuiGraphQLClient } = require('@mysten/sui/graphql');

const Users_UUID = new Map();

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


    if(!UUID_message || UUID_message !== message) {
        return res.status(401).json({ error: "Invalid or Expired UUID Message"});
    }

    try {
        console.log('VERIFYING SIGNATURE');
        const is_verified = await verifyPersonalMessageSignature(
            fromBase64(bytes),
            signature, 
            { address: address, client: new SuiGraphQLClient({
                url: 'https://sui-testnet.mystenlabs.com/graphql',
            }), }
        );
        console.log('SIGNATURE VERIFIED');
        const result = "You have succesfully logged in";
        res.json({ result });

    } catch(err) {
        res.status(500).json({ error: err });
    }
}



module.exports = {
    connect,
    generate_UUID
} 