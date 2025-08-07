import Message from '../models/ProcessedMessage.js';

export const getConversations = async (req, res) => {
    try {
        const allMessages = await Message.find().sort({ timestamp: 1 });

        const grouped = allMessages.reduce((acc, msg) => {
            if (!acc[msg.wa_id]) {
                acc[msg.wa_id] = {
                    wa_id: msg.wa_id,
                    name: msg.name,
                    lastMessage: null,
                    lastTimestamp: null,
                    unreadCount: 0,
                    messages: []
                };
            }
            acc[msg.wa_id].messages.push(msg);

            // Keep track of the latest message for each conversation
            if (!acc[msg.wa_id].lastTimestamp || msg.timestamp > acc[msg.wa_id].lastTimestamp) {
                acc[msg.wa_id].lastMessage = msg.text;
                acc[msg.wa_id].lastTimestamp = msg.timestamp;
            }

            // Count unread messages (status not 'read')
            if (msg.status !== 'read') {
                acc[msg.wa_id].unreadCount++;
            }

            return acc;
        }, {});

        // Sort conversations by last message timestamp (most recent first)
        const conversations = Object.values(grouped).sort((a, b) =>
            new Date(b.lastTimestamp) - new Date(a.lastTimestamp)
        );

        res.json({
            success: true,
            count: conversations.length,
            data: conversations
        });
    } catch (err) {
        console.error("Error fetching conversations:", err);
        res.status(500).json({
            error: "Error fetching messages",
            details: err.message
        });
    }
};

export const getConversationById = async (req, res) => {
    try {
        const { wa_id } = req.params;
        const { page = 1, limit = 50 } = req.query;

        if (!wa_id) {
            return res.status(400).json({ error: "WhatsApp ID is required" });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const messages = await Message.find({ wa_id })
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const totalMessages = await Message.countDocuments({ wa_id });

        res.json({
            success: true,
            data: {
                wa_id,
                messages: messages.reverse(), // Reverse to show oldest first
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalMessages / parseInt(limit)),
                    totalMessages,
                    hasNext: skip + messages.length < totalMessages,
                    hasPrev: parseInt(page) > 1
                }
            }
        });
    } catch (err) {
        console.error("Error fetching conversation:", err);
        res.status(500).json({
            error: "Error fetching conversation",
            details: err.message
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { wa_id, name, text } = req.body;

        // Validate required fields
        if (!wa_id || !text) {
            return res.status(400).json({
                error: "Missing required fields: wa_id and text are required"
            });
        }

        const message = await Message.create({
            msg_id: "local-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
            wa_id,
            name: name || "Unknown",
            text,
            timestamp: new Date(),
            status: "sent"
        });

        // Emit to connected clients
        if (req.io) {
            req.io.emit("new_message", message);
            req.io.broadcastToConversation?.(wa_id, "new_message", message);
        }

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: message
        });
    } catch (err) {
        console.error("Error sending message:", err);
        res.status(500).json({
            error: "Failed to send message",
            details: err.message
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { wa_id } = req.params;

        // Update all unread messages for this conversation to 'read' status
        const result = await Message.updateMany(
            {
                wa_id: wa_id,
                status: { $ne: 'read' } // Only update messages that are not already read
            },
            {
                $set: { status: 'read' }
            }
        );

        // Emit status update to connected clients
        if (req.io) {
            req.io.emit("messages_marked_read", { wa_id, count: result.modifiedCount });
        }

        res.json({
            success: true,
            message: `Marked ${result.modifiedCount} messages as read`,
            data: {
                wa_id,
                modifiedCount: result.modifiedCount
            }
        });
    } catch (err) {
        console.error("Error marking messages as read:", err);
        res.status(500).json({
            error: "Failed to mark messages as read",
            details: err.message
        });
    }
};
