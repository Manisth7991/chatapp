export function extractMessageData(payload) {
    try {
        // Validate payload structure
        if (!payload?.metaData?.entry?.[0]?.changes?.[0]?.value) {
            console.error("Invalid payload structure: missing required nested properties");
            return null;
        }

        const entry = payload.metaData.entry[0];
        const change = entry.changes[0];
        const value = change.value;
        const message = value.messages?.[0];

        if (!message) {
            console.log("No message found in payload");
            return null;
        }

        // Validate required message fields
        if (!message.id || !message.from) {
            console.error("Invalid message: missing id or from field");
            return null;
        }

        const messageData = {
            msg_id: message.id,
            wa_id: message.from,
            name: value.contacts?.[0]?.profile?.name || "Unknown",
            text: message.text?.body || message.text || "",
            timestamp: new Date(parseInt(message.timestamp) * 1000),
            status: "sent" // Default status for incoming messages
        };

        // Validate timestamp
        if (isNaN(messageData.timestamp.getTime())) {
            console.warn("Invalid timestamp, using current time");
            messageData.timestamp = new Date();
        }

        return messageData;
    } catch (err) {
        console.error("Error extracting message data:", err);
        return null;
    }
}

export function extractStatusData(payload) {
    try {
        // Validate payload structure
        if (!payload?.metaData?.entry?.[0]?.changes?.[0]?.value?.statuses) {
            console.error("Invalid status payload structure");
            return null;
        }

        const statuses = payload.metaData.entry[0].changes[0].value.statuses;
        return statuses.map(status => ({
            msg_id: status.id || status.meta_msg_id,
            status: status.status?.toLowerCase(),
            timestamp: new Date(parseInt(status.timestamp) * 1000)
        })).filter(s => s.msg_id && s.status);
    } catch (err) {
        console.error("Error extracting status data:", err);
        return [];
    }
}
