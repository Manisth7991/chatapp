import express from 'express';
import { getConversations, getConversationById, sendMessage, markAsRead } from '../controllers/messageController.js';

const router = express.Router();

router.get("/conversations", getConversations);
router.get("/conversations/:wa_id", getConversationById);
router.put("/conversations/:wa_id/read", markAsRead);
router.post("/send", sendMessage);

export default router;
