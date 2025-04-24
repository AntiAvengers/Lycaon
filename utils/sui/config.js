import 'dotenv/config';
import { SuiClient } from '@mysten/sui/client';
import { decodeSuiPrivateKey, encodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Ed25519Keypair, Ed25519PublicKey } from '@mysten/sui/keypairs/ed25519';
// import { Secp256k1Keypair, Secp256k1PublicKey } from '@mysten/sui/keypairs/secp256k1';
// import { Secp256r1Keypair } from '@mysten/sui/keypairs/secp256r1';
import { fromBase64, fromHex, toHex } from '@mysten/sui/utils';

const SUI_FULLNODE = process.env.MODE == 'DEVELOPMENT' 
    ? 'https://fullnode.devnet.sui.io' 
    : 'https://fullnode.testnet.sui.io';

const client = new SuiClient({ url: SUI_FULLNODE });

const PRIVATE_KEY = process.env.SUI_PRIVATE_KEY;

let keypair = null;
let bytes = null;
let publicKey = null;

if (PRIVATE_KEY) {
  try {
    keypair = Ed25519Keypair.fromSecretKey(fromHex(PRIVATE_KEY));
    console.log(`. . . Sui signer loaded: ${keypair.getPublicKey().toSuiAddress()}`);
    bytes = keypair.getPublicKey().toRawBytes();
    publicKey = new Ed25519PublicKey(bytes);
  } catch (err) {
    console.error("Invalid SUI_PRIVATE_KEY in environment:", err);
  }
}

if(keypair == null) {
    throw new Error("Keypair for Server Wallet not loaded. .env SUI_PRIVATE_KEY missing")
}

export { client, keypair, bytes, publicKey };
