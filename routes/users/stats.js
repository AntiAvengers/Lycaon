import express from 'express';
const router = express.Router();

import { get_user_pantry, get_user_profile, set_notification_as_read } from '../../controllers/users/stats.js';

router.post("/get_user_profile", get_user_profile);
router.post("/get_user_pantry", get_user_pantry);
router.post("/set-notification-as-read", set_notification_as_read);

export default router;
