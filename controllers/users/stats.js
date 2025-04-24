import crypto from 'crypto';
import { database, schema } from '../../database/firebaseConfig.js';

export const get_user_profile = async (req, res) => {
    const { address } = req.body;

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const user = database.ref('users');
    const snapshot = await user.orderByKey().equalTo(hashed).once("value");

    if(!snapshot.exists()) {
        return res.status(400).json({ error: "Wallet Address was not provided properly" });
    }

    return res.status(200).json({ data: snapshot.val() });
}

export const get_user_collection = async (req, res) => {
    const { address } = req.body;

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const collection = database.ref('collection');
    const snapshot = await collection.orderByKey().equalTo(hashed).once("value");

    if(!snapshot.exists()) {
        return res.status(400).json({ error: "Wallet Address was not provided properly" });
    }

    return res.status(200).json({ data: snapshot.val() });
}