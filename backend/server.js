import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import webhookRoutes from "./routes/webhook.js";
import messageRoutes from "./routes/messages.js";
import configureSocket from "./socket/socket.js";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Add io instance to request object
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Error handling middleware for JSON parsing
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        console.error('Bad JSON');
        return res.status(400).json({ error: 'Invalid JSON format' });
    }
    next();
});

// Connect to MongoDB
connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
app.get('/demo', (req, res) => {
   res.send('Demo endpoint is working!');
});

// Routes
app.use("/api", webhookRoutes);
app.use("/api/messages", messageRoutes);

// Socket.IO setup
configureSocket(io);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
