import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionAttempts, setConnectionAttempts] = useState(0);

    useEffect(() => {
        const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

        const createConnection = () => {
            const newSocket = io(SOCKET_URL, {
                transports: ['polling', 'websocket'], // Try polling first for mobile compatibility
                autoConnect: true,
                timeout: 20000,
                forceNew: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                maxReconnectionAttempts: 5,
            });

            newSocket.on('connect', () => {
                console.log('Socket connected successfully');
                setIsConnected(true);
                setConnectionAttempts(0);
            });

            newSocket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                setIsConnected(false);
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setIsConnected(false);
                setConnectionAttempts(prev => prev + 1);
            });

            newSocket.on('reconnect', (attemptNumber) => {
                console.log('Socket reconnected after', attemptNumber, 'attempts');
                setIsConnected(true);
                setConnectionAttempts(0);
            });

            newSocket.on('reconnect_error', (error) => {
                console.error('Socket reconnection error:', error);
            });

            setSocket(newSocket);

            return newSocket;
        };

        const newSocket = createConnection();

        return () => {
            if (newSocket) {
                newSocket.close();
            }
        };
    }, []);

    const joinConversation = (wa_id) => {
        if (socket && wa_id) {
            socket.emit('join_conversation', wa_id);
        }
    };

    const leaveConversation = (wa_id) => {
        if (socket && wa_id) {
            socket.emit('leave_conversation', wa_id);
        }
    };

    const sendTyping = (wa_id, isTyping) => {
        if (socket && wa_id) {
            socket.emit('typing', { wa_id, typing: isTyping });
        }
    };

    const markAsRead = (msg_id, wa_id) => {
        if (socket && msg_id && wa_id) {
            socket.emit('mark_read', { msg_id, wa_id });
        }
    };

    const value = {
        socket,
        isConnected,
        connectionAttempts,
        joinConversation,
        leaveConversation,
        sendTyping,
        markAsRead,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
