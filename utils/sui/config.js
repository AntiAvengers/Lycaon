// const dotenv = require("dotenv");
// dotenv.config();

// const { SuiClient, Ed25519Keypair, fromB64 } = require('@mysten/sui.js');

import 'dotenv/config';
// import { SuiClient, Ed25519Keypair, fromB64 } from '@mysten/sui.js';
import { SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromBase64, toHex } from '@mysten/sui/utils';

const SUI_FULLNODE = process.env.MODE == 'DEVELOPMENT' 
    ? 'https://fullnode.devnet.sui.io' 
    : 'https://fullnode.testnet.sui.io';

export const client = new SuiClient({ url: SUI_FULLNODE });

// const PRIVATE_KEY_B64 = process.env.SUI_PRIVATE_KEY;
// const STRIPPED_KEY = PRIVATE_KEY_B64.replace(/=+$/, '');

// let keypair = null;

// if (PRIVATE_KEY_B64) {
//   try {
//     keypair = Ed25519Keypair.fromSecretKey(fromBase64(STRIPPED_KEY));
//     console.log(`Sui signer loaded: ${keypair.getPublicKey().toSuiAddress()}`);
//   } catch (err) {
//     console.error("Invalid SUI_PRIVATE_KEY in environment:", err);
//   }
// }

// module.exports = {
//   client,
//   keypair
// };

// export {
//   keypair
// };
