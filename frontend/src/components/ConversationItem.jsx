import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { formatMessageTime, getInitials, truncateText, formatPhoneNumber } from '../utils/helpers';

const ConversationItem = ({ conversation, isSelected, onClick }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'sent':
                return <Check className="w-4 h-4 status-sent" />;
            case 'delivered':
                return <CheckCheck className="w-4 h-4 status-delivered" />;
            case 'read':
                return <CheckCheck className="w-4 h-4 status-read" />;
            default:
                return null;
        }
    };

    // Get the last message from the conversation
    const lastMessage = conversation.messages?.[conversation.messages.length - 1];
    const lastMessageStatus = lastMessage?.status;

    return (
        <div
            onClick={onClick}
            className={`flex items-center p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 border-b border-gray-100 ${isSelected ? 'bg-whatsapp-primary/10 border-l-4 border-l-whatsapp-primary' : ''
                }`}
        >
            {/* Avatar */}
            <div className="w-12 h-12 bg-gradient-to-br from-whatsapp-primary to-whatsapp-secondary rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 shadow-sm">
                {getInitials(conversation.name)}
            </div>

            {/* Content */}
            <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 truncate">
                        {conversation.name || 'Unknown'}
                    </h3>
                    <div className="flex items-center space-x-1">
                        {lastMessageStatus && getStatusIcon(lastMessageStatus)}
                        <span className="text-xs text-gray-500 font-medium">
                            {conversation.lastTimestamp && formatMessageTime(conversation.lastTimestamp)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                        {truncateText(conversation.lastMessage || 'No messages yet', 40)}
                    </p>

                    {conversation.unreadCount > 0 && (
                        <span className="bg-whatsapp-primary text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-medium shadow-sm">
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </span>
                    )}
                </div>

                {/* Phone number */}
                <p className="text-xs text-gray-400 mt-1">
                    {formatPhoneNumber(conversation.wa_id)}
                </p>
            </div>
        </div>
    );
};

export default ConversationItem;
