import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { chatAPI } from '../services/api';

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

// Chat reducer
const chatReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };

        case 'SET_CONVERSATIONS':
            return {
                ...state,
                conversations: action.payload,
                loading: false,
                error: null
            };

        case 'SET_SELECTED_MESSAGES':
            return {
                ...state,
                selectedMessages: action.payload,
                messagesLoading: false
            };

        case 'SET_MESSAGES_LOADING':
            return { ...state, messagesLoading: action.payload };

        case 'ADD_MESSAGE':
            const newMessage = action.payload;

            // Update conversations list
            const updatedConversations = state.conversations.map(conv => {
                if (conv.wa_id === newMessage.wa_id) {
                    return {
                        ...conv,
                        lastMessage: newMessage.text,
                        lastTimestamp: newMessage.timestamp,
                        messages: [...conv.messages, newMessage]
                    };
                }
                return conv;
            });

            // If conversation doesn't exist, create it
            let finalConversations = updatedConversations;
            if (!updatedConversations.find(conv => conv.wa_id === newMessage.wa_id)) {
                finalConversations = [{
                    wa_id: newMessage.wa_id,
                    name: newMessage.name,
                    lastMessage: newMessage.text,
                    lastTimestamp: newMessage.timestamp,
                    unreadCount: 0,
                    messages: [newMessage]
                }, ...updatedConversations];
            }

            // Update selected messages if viewing this conversation
            const updatedSelectedMessages = state.selectedConversation?.wa_id === newMessage.wa_id
                ? [...state.selectedMessages, newMessage]
                : state.selectedMessages;

            return {
                ...state,
                conversations: finalConversations,
                selectedMessages: updatedSelectedMessages
            };

        case 'UPDATE_MESSAGE_STATUS':
            const { msg_id, status } = action.payload;

            // Update in conversations
            const conversationsWithUpdatedStatus = state.conversations.map(conv => ({
                ...conv,
                messages: conv.messages.map(msg =>
                    msg.msg_id === msg_id ? { ...msg, status } : msg
                )
            }));

            // Update in selected messages
            const selectedMessagesWithUpdatedStatus = state.selectedMessages.map(msg =>
                msg.msg_id === msg_id ? { ...msg, status } : msg
            );

            return {
                ...state,
                conversations: conversationsWithUpdatedStatus,
                selectedMessages: selectedMessagesWithUpdatedStatus
            };

        case 'SET_SELECTED_CONVERSATION':
            return { ...state, selectedConversation: action.payload };

        case 'SET_TYPING_USERS':
            return { ...state, typingUsers: action.payload };

        case 'MARK_CONVERSATION_READ':
            const updatedConversationsRead = state.conversations.map(conv => {
                if (conv.wa_id === action.payload) {
                    return { ...conv, unreadCount: 0 };
                }
                return conv;
            });
            return { ...state, conversations: updatedConversationsRead };

        default:
            return state;
    }
};

const initialState = {
    conversations: [],
    selectedMessages: [],
    selectedConversation: null,
    loading: false,
    messagesLoading: false,
    error: null,
    typingUsers: {}
};

export const ChatProvider = ({ children }) => {
    const [state, dispatch] = useReducer(chatReducer, initialState);
    const { socket } = useSocket();

    // Socket event listeners
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            dispatch({ type: 'ADD_MESSAGE', payload: message });
        };

        const handleStatusUpdate = (updatedMessage) => {
            dispatch({
                type: 'UPDATE_MESSAGE_STATUS',
                payload: { msg_id: updatedMessage.msg_id, status: updatedMessage.status }
            });
        };

        const handleTyping = (data) => {
            dispatch({
                type: 'SET_TYPING_USERS',
                payload: { ...state.typingUsers, [data.wa_id]: data.typing }
            });
        };

        socket.on('new_message', handleNewMessage);
        socket.on('status_update', handleStatusUpdate);
        socket.on('user_typing', handleTyping);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('status_update', handleStatusUpdate);
            socket.off('user_typing', handleTyping);
        };
    }, [socket, state.typingUsers]);

    // API functions
    const fetchConversations = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await chatAPI.getConversations();
            dispatch({ type: 'SET_CONVERSATIONS', payload: response.data.data });
        } catch (error) {
            console.error('Error fetching conversations:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const fetchMessages = async (wa_id) => {
        try {
            dispatch({ type: 'SET_MESSAGES_LOADING', payload: true });

            const response = await chatAPI.getConversation(wa_id);
            dispatch({ type: 'SET_SELECTED_MESSAGES', payload: response.data.data.messages });
        } catch (error) {
            console.error('Error fetching messages:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            dispatch({ type: 'SET_MESSAGES_LOADING', payload: false });
        }
    }; const sendMessage = async (wa_id, name, text) => {
        try {
            const response = await chatAPI.sendMessage({ wa_id, name, text });
            // Message will be added via socket event
            return response.data.data;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            console.error('Error sending message:', error);
            throw error;
        }
    };

    const selectConversation = async (conversation) => {
        // Clear previous messages first
        dispatch({ type: 'SET_SELECTED_MESSAGES', payload: [] });
        dispatch({ type: 'SET_SELECTED_CONVERSATION', payload: conversation });

        if (conversation) {
            try {
                // Set loading state
                dispatch({ type: 'SET_MESSAGES_LOADING', payload: true });

                // Fetch messages for the selected conversation
                const response = await chatAPI.getConversation(conversation.wa_id);

                // Set the messages
                dispatch({ type: 'SET_SELECTED_MESSAGES', payload: response.data.data.messages || [] });

                // Mark messages as read
                markMessagesAsRead(conversation.wa_id);

            } catch (error) {
                console.error('Error in selectConversation:', error);
                dispatch({ type: 'SET_ERROR', payload: error.message });
                dispatch({ type: 'SET_MESSAGES_LOADING', payload: false });
            }
        }
    };

    const markMessagesAsRead = async (wa_id) => {
        try {
            // Update unread count in conversations list
            dispatch({ type: 'MARK_CONVERSATION_READ', payload: wa_id });

            // Mark messages as read on server
            await chatAPI.markAsRead(wa_id);

        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    const value = {
        ...state,
        fetchConversations,
        fetchMessages,
        sendMessage,
        selectConversation,
        dispatch
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
