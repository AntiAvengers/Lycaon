const crypto = require('crypto');

const dotenv = require("dotenv");
dotenv.config();

const { SuiClient, Ed25519Keypair, fromB64 } = require('@mysten/sui.js');
const { TransactionBlock } = require('@mysten/sui.js/transactions');

const { client, keypair } = require('../config/sui');

const PACKAGE_ID = process.env.SUI_PACKAGE_ID;
const MODULE_NAME = "sprite_token";
const MINT_FUNCTION = "mint"
const TRANSFER_FUNCTION = "transfer_token";

const get_token_owner = async (token_id) => {
    const object = await client.getObject({ id: token_id, options: { showOwner: true } });
    return object.data.owner.AddressOwner;
}

//Might not be necessary if we get the player to sign the transaction to mint the sprite
const mint_sprite = async (stats) => { //stats = object of sprite immutable stats (type, rarity)
  try { 
    const input = JSON.stringify(Object.keys(stats).sort().reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {}));
  
    const hashed = crypto.createHash('sha256').update(input).digest();
    
    const tx = new TransactionBlock();
  
    tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${MINT_FUNCTION}`,
        arguments: [
          tx.pure(hashed),
        ]
    });
  
    const output = result.effects.created;
    const token_id = output[0].reference.objectId;

    return token_id;
  } catch(err) {
    console.error(err);
  }
}

const transfer_sprite = async ({ tokenId, recipient }) => {
  try {
    const tx = new TransactionBlock();

    tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${TRANSFER_FUNCTION}`,
        arguments: [
          tx.object(tokenId),
          tx.pure(recipient),
        ],
    });
  
    const result = await client.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        signer: keypair,
        options: {
            showEffects: true,
        },
    });
  
    return result;
  } catch(err) {
    console.error(err);
  }
}

const transfer_sui = async ({ amount, recipient }) => {
  try {
    const tx = new TransactionBlock();

    tx.transferObjects(
      [tx.splitCoins(tx.gas, [tx.pure(amount)])],
      tx.pure(recipient)
    );
  
    const result = await client.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: keypair,
      options: {
        showEffects: true,
      },
    });
  
    return result;
  } catch(err) {
    console.error(err);
  }
};

module.exports = {
    get_token_owner,
    mint_sprite,
    transfer_sprite,
    transfer_sui
}
