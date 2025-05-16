import 'dotenv/config';
import { client } from './config.js';

export const get_object = async (id) => {
  return await client.getObject({
    id: id,
    options: { showContent: true }
  })
}

export const get_transaction_block = async (digest) => {
  return await client.getTransactionBlock({ 
    digest, 
    options: {
      showInput: true,
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
      showBalanceChanges: true,
    } 
  });
}