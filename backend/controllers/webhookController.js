import Message from '../models/ProcessedMessage.js';
import { extractMessageData } from '../utils/processPayload.js';

export const handleWebhook = async (req, res) => {
    try {
        const payload = req.body;

        if (!payload || payload.payload_type !== "whatsapp_webhook") {
            return res.status(400).json({ error: "Invalid payload type" });
        }

        const messageData = extractMessageData(payload);
        if (!messageData) {
            return res.status(400).json({ error: "No valid message found in payload" });
        }

        // Use upsert to avoid duplicates
        const savedMessage = await Message.findOneAndUpdate(
            { msg_id: messageData.msg_id },
            { $setOnInsert: messageData },
            { upsert: true, new: true }
        );

        // Emit to connected clients
        if (req.io) {
            req.io.emit("new_message", savedMessage);
        }

        res.status(200).json({
            success: true,
            message: "Message processed successfully",
            data: savedMessage
        });
    } catch (err) {
        console.error("Error processing webhook:", err);
        res.status(500).json({ error: "Failed to process message", details: err.message });
    }
};

export const handleStatusUpdate = async (req, res) => {
    try {
        const payload = req.body;

        if (!payload || payload.payload_type !== "whatsapp_webhook") {
            return res.status(400).json({ error: "Invalid payload type" });
        }

        const statusInfo = payload.metaData?.entry?.[0]?.changes?.[0]?.value?.statuses?.[0];
        if (!statusInfo) {
            return res.status(400).json({ error: "Invalid status payload structure" });
        }

        const { id, meta_msg_id, status } = statusInfo;
        const messageId = id || meta_msg_id;

        if (!messageId || !status) {
            return res.status(400).json({ error: "Missing message ID or status" });
        }

        const validStatuses = ["sent", "delivered", "read"];
        const normalizedStatus = status.toLowerCase();

        if (!validStatuses.includes(normalizedStatus)) {
            return res.status(400).json({ error: `Invalid status: ${status}` });
        }

        const updatedMessage = await Message.findOneAndUpdate(
            { msg_id: messageId },
            { status: normalizedStatus },
            { new: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({ error: `Message with ID ${messageId} not found` });
        }

        // Emit status update to connected clients
        if (req.io) {
            req.io.emit("status_update", updatedMessage);
        }

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: updatedMessage
        });
    } catch (err) {
        console.error("Error updating status:", err);
        res.status(500).json({ error: "Failed to update status", details: err.message });
    }
};
