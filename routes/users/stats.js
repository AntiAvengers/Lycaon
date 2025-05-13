import express from 'express';
const router = express.Router();

import { 
    get_user_pantry, 
    get_user_profile, 
    set_notification_as_read, 
    set_profile_name,
    get_welcome_gift,
} from '../../controllers/users/stats.js';

router.post("/get_user_profile", get_user_profile);
router.post("/get_user_pantry", get_user_pantry);
router.post("/set-notification-as-read", set_notification_as_read);
router.post("/set-profile-name", set_profile_name);
router.post("/get-welcome-gift", get_welcome_gift);

export default router;
