const { SuiClient, Ed25519Keypair, fromB64 } = require('@mysten/sui.js');
const { TransactionBlock } = require('@mysten/sui.js/transactions');

const { client, keypair } = require('../config/sui');

const PACKAGE_ID = process.env.SUI_PACKAGE_ID;
const MODULE_NAME = "sprite_token";
const TRANSFER_FUNCTION = "transfer_token";

const get_token_owner = async (token_id) => {
    const object = await client.getObject({ id: tokenId, options: { showOwner: true } });
    return object.data.owner.AddressOwner;
}

const transfer_sprite = async ({ tokenId, recipient }) => {
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
}

const transfer_sui = async ({ amount, recipient }) => {
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
};

module.exports = {
    get_token_owner,
    transfer_sprite,
    transfer_sui
}
