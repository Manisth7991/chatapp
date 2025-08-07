import express from 'express';
import { handleWebhook, handleStatusUpdate } from '../controllers/webhookController.js';

const router = express.Router();

router.post("/webhook", handleWebhook);
router.post("/webhook/status", handleStatusUpdate);

export default router;
