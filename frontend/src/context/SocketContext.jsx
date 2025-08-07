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

    useEffect(() => {
        const newSocket = io('http://localhost:5000', {
            transports: ['websocket'],
            autoConnect: true,
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
        });

        newSocket.on('disconnect', (reason) => {
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
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
