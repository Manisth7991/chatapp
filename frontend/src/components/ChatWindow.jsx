import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Phone, Video, MoreVertical, Send, Paperclip, Smile } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useSocket } from '../context/SocketContext';
import { useTypingIndicator, useAutoResize } from '../hooks/useUtils';
import { shouldShowTimestamp, getInitials, formatPhoneNumber } from '../utils/helpers';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import LoadingSpinner from './LoadingSpinner';

const ChatWindow = ({ selectedConversation, onBack, isMobile }) => {
    const { selectedMessages, messagesLoading, sendMessage } = useChat();
    const { joinConversation, leaveConversation, sendTyping, isConnected } = useSocket();

    const [messageText, setMessageText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);    // Auto-resize textarea
    useAutoResize(textareaRef, 120);    // Typing indicator
    const { isTyping, handleTyping, stopTyping } = useTypingIndicator(
        (typing) => sendTyping(selectedConversation?.wa_id, typing),
        1000
    );

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedMessages]);

    // Join/leave conversation rooms
    useEffect(() => {
        if (selectedConversation) {
            joinConversation(selectedConversation.wa_id);
            return () => leaveConversation(selectedConversation.wa_id);
        }
    }, [selectedConversation, joinConversation, leaveConversation]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setMessageText(value);

        if (value.trim()) {
            handleTyping();
        } else {
            stopTyping();
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!messageText.trim() || !selectedConversation || isSending) return;

        try {
            setIsSending(true);

            await sendMessage(
                selectedConversation.wa_id,
                selectedConversation.name,
                messageText.trim()
            );

            setMessageText('');
            stopTyping();

            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // You might want to show a toast notification here
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    if (!selectedConversation) {
        return (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-whatsapp-background to-gray-100">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="w-64 h-64 mx-auto mb-8 opacity-20">
                        <svg viewBox="0 0 303 172" className="w-full h-full">
                            <defs>
                                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#00a884" />
                                    <stop offset="100%" stopColor="#008069" />
                                </linearGradient>
                            </defs>
                            <path
                                fill="url(#grad)"
                                d="M158.8 12.8c-36.5-5.8-74.5 8.4-97.7 36.1-23.2 27.7-27.9 66.2-12.1 98.6l-17.8 56.8 58.3-15.3c30.9 14.7 67.8 9.8 94.3-12.6 26.5-22.4 36.1-59.4 24.6-94.5-11.5-35.1-49.6-63.3-49.6-69.1z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-light text-gray-700 mb-4">WhatsApp Web Clone</h3>
                    <p className="text-gray-500 leading-relaxed mb-6">
                        Send and receive messages without keeping your phone online.
                        Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
                    </p>
                    <div className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg shadow-sm">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                        <span className="text-sm text-gray-600 font-medium">
                            {isConnected ? 'Connected to server' : 'Disconnected from server'}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="bg-whatsapp-background border-b border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {isMobile && (
                            <button
                                onClick={onBack}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                        )}

                        {/* Avatar */}
                        <div className="w-10 h-10 bg-gradient-to-br from-whatsapp-primary to-whatsapp-secondary rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                            {getInitials(selectedConversation.name)}
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h2 className="font-semibold text-gray-800">
                                {selectedConversation.name || 'Unknown'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {formatPhoneNumber(selectedConversation.wa_id)}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Video className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Phone className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-gray-50 to-white">
                {messagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <LoadingSpinner size="lg" />
                            <p className="text-gray-500 mt-4">Loading messages...</p>
                        </div>
                    </div>
                ) : selectedMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                            <div className="w-20 h-20 mx-auto mb-4 opacity-30">
                                <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium">No messages in this conversation</p>
                            <p className="text-sm mt-1">Send a message to start chatting</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 space-y-1">
                        {selectedMessages.map((message, index) => (
                            <MessageBubble
                                key={message._id || message.msg_id}
                                message={message}
                                isOwn={message.msg_id?.startsWith('local-')}
                                showTimestamp={shouldShowTimestamp(message, selectedMessages[index - 1])}
                            />
                        ))}

                        {/* Typing Indicator */}
                        <TypingIndicator isVisible={false} />

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 bg-whatsapp-background">
                <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                    {/* Attachment Button */}
                    <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>

                    {/* Message Input */}
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={messageText}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message"
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent resize-none min-h-[48px] max-h-32 leading-relaxed"
                            rows={1}
                            disabled={isSending}
                        />

                        {/* Emoji Button */}
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                        >
                            <Smile className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Send Button */}
                    <button
                        type="submit"
                        disabled={!messageText.trim() || isSending}
                        className="p-3 bg-whatsapp-primary text-white rounded-full hover:bg-whatsapp-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-md"
                    >
                        {isSending ? (
                            <LoadingSpinner size="sm" className="border-white border-t-transparent" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
