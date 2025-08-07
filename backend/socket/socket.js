export default function configureSocket(io) {
    io.on("connection", (socket) => {
        console.log("✅ Client connected:", socket.id);

        // Handle joining conversation rooms
        socket.on("join_conversation", (wa_id) => {
            if (wa_id) {
                socket.join(`conversation_${wa_id}`);
                console.log(`📱 Client ${socket.id} joined conversation: ${wa_id}`);
            }
        });

        // Handle leaving conversation rooms
        socket.on("leave_conversation", (wa_id) => {
            if (wa_id) {
                socket.leave(`conversation_${wa_id}`);
                console.log(`📱 Client ${socket.id} left conversation: ${wa_id}`);
            }
        });

        // Handle typing indicators
        socket.on("typing", (data) => {
            if (data.wa_id) {
                socket.to(`conversation_${data.wa_id}`).emit("user_typing", {
                    wa_id: data.wa_id,
                    typing: data.typing
                });
            }
        });

        // Handle message read receipts
        socket.on("mark_read", (data) => {
            if (data.msg_id && data.wa_id) {
                socket.to(`conversation_${data.wa_id}`).emit("message_read", {
                    msg_id: data.msg_id,
                    wa_id: data.wa_id
                });
            }
        });

        socket.on("disconnect", (reason) => {
            console.log("❌ Client disconnected:", socket.id, "Reason:", reason);
        });

        socket.on("error", (error) => {
            console.error("🔴 Socket error:", error);
        });
    });

    // Handle broadcasting new messages to specific conversations
    io.broadcastToConversation = (wa_id, event, data) => {
        io.to(`conversation_${wa_id}`).emit(event, data);
    };

    // Handle broadcasting to all connected clients
    io.broadcastToAll = (event, data) => {
        io.emit(event, data);
    };

    console.log("🔌 Socket.IO configured and ready");
}
