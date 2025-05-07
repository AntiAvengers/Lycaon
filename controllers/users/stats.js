import crypto from 'crypto';
import { database, schema } from '../../database/firebaseConfig.js';

export const get_user_profile = async (req, res) => {
    const { address } = req.user;
    const hashed = crypto.createHash('sha256').update(address).digest('hex');
    const user_ref = database.ref(`users/${hashed}`);
    const snapshot = await user_ref.once("value");

    if(!snapshot.exists()) {
        return res.status(400).json({ error: "Wallet Address was not provided properly" });
    }

    return res.status(200).json({ data: snapshot.val() });
}

export const get_user_collection = async (req, res) => {
    const { address } = req.user;

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const collection_ref = database.ref(`collection/${hashed}`);
    const snapshot = await collection_ref.once("value");

    if(!snapshot.exists()) {
        return res.status(400).json({ error: "Wallet Address was not provided properly" });
    }

    return res.status(200).json({ data: snapshot.val() });
}

export const get_user_pantry = async (req, res) => {
    const { address } = req.user;
    const hashed = crypto.createHash('sha256').update(address).digest('hex');
    const pantry_ref = database.ref(`pantry/${hashed}`);
    const snapshot = await pantry_ref.once("value");
    return res.status(200).json({ response: snapshot.val() });
}

export const set_notification_as_read = async (req, res) => {
    console.log('SETTING NOTIFICATION AS READ');
    const { id } = req.body;
    const { address } = req.user;
    const hashed = crypto.createHash('sha256').update(address).digest('hex');
    const notifications_ref = database.ref(`notifications/${hashed}/${id}`);
    const snapshot = await notifications_ref.once("value");
    if(snapshot.exists()) {
        notifications_ref.update({ read: true });
    }
    return res.status(200).json({ response: true });
}