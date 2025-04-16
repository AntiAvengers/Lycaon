const dotenv = require("dotenv");
dotenv.config();

const { SuiClient, Ed25519Keypair, fromB64 } = require('@mysten/sui.js');

const SUI_FULLNODE = process.env.MODE == 'DEVELOPMENT' 
    ? 'https://fullnode.devnet.sui.io' 
    : 'https://fullnode.testnet.sui.io';

const client = new SuiClient({ url: SUI_FULLNODE });

const PRIVATE_KEY_B64 = process.env.SUI_PRIVATE_KEY;

let keypair = null;

if (PRIVATE_KEY_B64) {
  try {
    keypair = Ed25519Keypair.fromSecretKey(fromB64(PRIVATE_KEY_B64));
    console.log(`Sui signer loaded: ${keypair.getPublicKey().toSuiAddress()}`);
  } catch (err) {
    console.error("Invalid SUI_PRIVATE_KEY in environment:", err);
  }
}

module.exports = {
  client,
  keypair
};
