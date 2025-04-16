const dotenv = require("dotenv");
dotenv.config();

const { client } = require('../../utils/sui/config');

const { TransactionBlock } = require('@mysten/sui.js/transactions');
// const { bcs } = require('@mysten/sui.js/bcs');

const PACKAGE_ID = process.env.SUI_PACKAGE_ID;
const MODULE_NAME = 'sprite_token';
const MINT_FUNCTION = 'mint';

const create_mint_transaction = async (req, res) => {
    const { address, stats } = req.body;

    //Need code to get the creature that was selected to mint.

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
        ],
    });

    //Gas-Fee Estimation
    const simulation = await client.devInspectTransactionBlock({
        sender: address,
        transactionBlock: tx,
    });

    const gas_fees = simulation.effects.gasUsed;

    const serialized = await tx.serialize();

    return res.json({
        transactionBlock: serialized,
        estimatedGas: gas_fees.computationCost + gas_fees.storageCost - gas_fees.storageRebate,
    });
};

module.exports = {
    create_mint_transaction
}
