import * as crypto from 'crypto';
import 'dotenv/config';
import { client } from '../../utils/sui/config.js';
import { get_transaction_block } from '../../utils/sui/client.js';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { bcs } from '@mysten/sui/bcs';

import * as ed from '@noble/ed25519';

const PACKAGE_ID = process.env.SUI_PACKAGE_ID;
const MODULE_NAME = 'sprite_token';
const MINT_FUNCTION = 'mint';

export const create_mint_transaction = async (req, res) => {
    try {
        const { address, stats } = req.body;

        const uuid = crypto.randomUUID().replace(/-/g, '');

        const MyStruct = bcs.struct('MyStruct', {
            uuid: bcs.byteVector(),
            expiration: bcs.u64(),
            sprite_type: bcs.byteVector(),
            sprite_rarity: bcs.byteVector(),
        });

        const struct = MyStruct.serialize({ 
            uuid: new TextEncoder().encode(uuid),
            expiration: Date.now() + (1000 * 60 * 5),
            sprite_type: new TextEncoder().encode(stats.type),
            sprite_rarity: new TextEncoder().encode(stats.rarity)
        })
        .toBytes();

        const privKey = ed.utils.randomPrivateKey();
        const pubKey = await ed.getPublicKeyAsync(privKey);
        const signature = await ed.signAsync(struct, privKey);
        const isValid = await ed.verifyAsync(signature, struct, pubKey);

        const tx = new TransactionBlock();

        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::${MINT_FUNCTION}`,
            arguments: [
                tx.pure(bcs.vector(bcs.u8()).serialize(struct)),
                tx.pure(bcs.vector(bcs.u8()).serialize(signature)),
                tx.pure(bcs.vector(bcs.u8()).serialize(pubKey)), 
                tx.object(process.env.UUID_REGISTRY),
                tx.object('0x6'),
            ],
        });

        tx.setGasBudget(100_000_000);
    
        const simulation = await client.devInspectTransactionBlock({
            sender: address,
            transactionBlock: tx,
        });
    
        const gas_fees = simulation.effects.gasUsed;

        if(simulation.effects.status.status == 'failure') {
            throw simulation.effects.status.error;
        }
    
        const serialized = await tx.serialize();
    
        return res.json({
            transactionBlock: serialized,
            estimatedGas: parseFloat(gas_fees.computationCost) + parseFloat(gas_fees.storageCost) - parseFloat(gas_fees.storageRebate),
        });
    } catch(err) {
        console.error(err);
    } 
};

export const update_minted_digest = async (req, res) => {
    try {
        const { address, digest } = req.body;

        if(!digest) {
            return res.status(403).json({ error: "Missing Digest for Transaction Block!" });
        }
    
        const tx = await get_transaction_block(digest);
        console.log(tx);
        console.log(Object.keys(tx));
    
        const minted_object_ID = tx.objectChanges.filter(obj => obj.type == 'created')[0].objectId;
        
        //7j6V7LWcwcNTvxaEF9fugwqDTeHHB4WuWDJRUV25mDp2
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: err });
    }
}
