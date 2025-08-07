// scripts/processPayloads.js
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Message from '../models/ProcessedMessage.js';
import { extractMessageData, extractStatusData } from '../utils/processPayload.js';

dotenv.config();

// Validate environment variables
if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI environment variable is required');
    process.exit(1);
}

try {
    // MongoDB connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Folder containing payloads
    const payloadDir = path.resolve('./scripts/samplePayloads');

    // Check if directory exists
    try {
        await fs.access(payloadDir);
    } catch {
        console.error(`❌ Payload directory not found: ${payloadDir}`);
        process.exit(1);
    }

    const files = await fs.readdir(payloadDir);
    console.log(`📁 Found ${files.length} files to process`);

    let processedCount = 0;
    let errorCount = 0;

    for (const file of files) {
        if (!file.endsWith('.json')) {
            console.log(`⏭️ Skipping non-JSON file: ${file}`);
            continue;
        }

        const filePath = path.join(payloadDir, file);

        try {
            const content = await fs.readFile(filePath, 'utf8');
            const payload = JSON.parse(content);

            if (payload.payload_type !== 'whatsapp_webhook') {
                console.log(`⚠️ Skipping non-whatsapp_webhook in: ${file}`);
                continue;
            }

            const entry = payload.metaData?.entry?.[0];
            const change = entry?.changes?.[0]?.value;

            if (!change) {
                console.warn(`⚠️ Invalid payload structure in: ${file}`);
                continue;
            }

            // Handle status updates
            if (change.statuses?.length) {
                const statusUpdates = extractStatusData(payload);

                for (const statusUpdate of statusUpdates) {
                    const updated = await Message.findOneAndUpdate(
                        { msg_id: statusUpdate.msg_id },
                        { status: statusUpdate.status },
                        { new: true }
                    );

                    if (updated) {
                        console.log(`✅ Updated status for msg_id: ${statusUpdate.msg_id} → ${statusUpdate.status}`);
                    } else {
                        console.warn(`⚠️ Status update skipped: msg_id ${statusUpdate.msg_id} not found`);
                    }
                }
                processedCount++;
                continue;
            }

            // Handle incoming messages
            if (change.messages?.length) {
                const messageData = extractMessageData(payload);

                if (messageData) {
                    const savedMessage = await Message.findOneAndUpdate(
                        { msg_id: messageData.msg_id },
                        { $setOnInsert: messageData },
                        { upsert: true, new: true }
                    );

                    console.log(`📥 Processed message from ${messageData.name}: ${messageData.text.substring(0, 50)}${messageData.text.length > 50 ? '...' : ''}`);
                    processedCount++;
                } else {
                    console.warn(`⚠️ Could not extract message data from: ${file}`);
                }
                continue;
            }

            console.warn(`⚠️ No messages or statuses found in: ${file}`);
        } catch (err) {
            console.error(`❌ Failed to process file ${file}:`, err.message);
            errorCount++;
        }
    }

    console.log(`\n� Processing Summary:`);
    console.log(`✅ Successfully processed: ${processedCount} files`);
    console.log(`❌ Errors encountered: ${errorCount} files`);

} catch (err) {
    console.error('❌ Script execution failed:', err.message);
    process.exit(1);
} finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB connection closed');
}
