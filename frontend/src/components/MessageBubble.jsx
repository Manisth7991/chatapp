import React from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import { formatMessageTime, formatFullDate } from '../utils/helpers';

const MessageBubble = ({ message, isOwn, showTimestamp }) => {
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

    return (
        <div className="message-bubble">
            {showTimestamp && (
                <div className="text-center my-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600 font-medium shadow-sm">
                        {formatFullDate(message.timestamp)}
                    </span>
                </div>
            )}

            <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 group`}>
                <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm transition-all duration-200 ${isOwn
                        ? 'bg-whatsapp-primary text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                        } group-hover:shadow-md`}
                >
                    {/* Message Text */}
                    <p className="whitespace-pre-wrap break-words leading-relaxed mb-1">{message.text}</p>

                    {/* Time and Status */}
                    <div className={`flex items-center justify-end space-x-1 ${isOwn ? 'text-white/80' : 'text-gray-500'
                        }`}>
                        <span className="text-xs font-medium">
                            {format(new Date(message.timestamp), 'HH:mm')}
                        </span>
                        {isOwn && message.status && (
                            <div className="flex-shrink-0 ml-1">
                                {getStatusIcon(message.status)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
