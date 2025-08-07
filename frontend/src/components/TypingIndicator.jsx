import React from 'react';

const TypingIndicator = ({ isVisible, userName = 'Someone' }) => {
    if (!isVisible) return null;

    return (
        <div className="flex justify-start mb-2">
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm max-w-xs">
                <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">{userName} is typing</span>
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
