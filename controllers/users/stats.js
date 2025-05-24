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
    const { id } = req.body;
    const { address } = req.user;
    const hashed = crypto.createHash('sha256').update(address).digest('hex');
    const notifications_ref = database.ref(`notifications/${hashed}/${id}`);
    const snapshot = await notifications_ref.once("value");
    if(snapshot.exists()) {
        notifications_ref.update({ read: true, delete_date: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))});
    }
    return res.status(200).json({ response: true });
}

export const set_profile_name = async (req, res) => {
    const { profile_name } = req.body;
    const { address } = req.user;
    const hashed = crypto.createHash('sha256').update(address).digest('hex');
    const users_ref = database.ref(`users/${hashed}`);
    users_ref.update({ profile_name: profile_name });
    return res.status(200).json({ response: profile_name });
}

export const get_welcome_gift = async (req, res) => {
    const { address } = req.user;
    const hashed = crypto.createHash('sha256').update(address).digest('hex');
    const users_ref = database.ref(`users/${hashed}`);
    const snapshot = await users_ref.once("value");
    const { profile_name, pages, shards } = snapshot.val();

    if(pages !== 0 && shards !== 0) {
        return res.status(200).json({ error: "Player has already received welcome gift" });
    }

    users_ref.update({
        pages: 10, 
        shards: 10000,
    });
    
    return res.status(200).json({ response: "OK" });
}