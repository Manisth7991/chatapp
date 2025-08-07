import React, { useEffect, useState } from 'react';
import { Search, MessageCircle, MoreVertical } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import ConversationItem from './ConversationItem';
import LoadingSpinner from './LoadingSpinner';

const Sidebar = ({ selectedConversation, onSelectConversation, isMobile }) => {
    const { conversations, loading, error, fetchConversations } = useChat();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchConversations();
    }, []);

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.wa_id.includes(searchTerm)
    );

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="bg-whatsapp-background border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-whatsapp-primary rounded-full flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">Chats</h1>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search or start new chat"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading && !conversations.length ? (
                    <div className="flex items-center justify-center h-32">
                        <LoadingSpinner />
                    </div>
                ) : error ? (
                    <div className="p-4 text-center text-red-500">
                        <p>Error loading conversations</p>
                        <button
                            onClick={fetchConversations}
                            className="mt-2 text-whatsapp-primary hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        {searchTerm ? 'No conversations found' : 'No conversations yet'}
                    </div>
                ) : (
                    <div className="space-y-0">
                        {filteredConversations.map((conversation) => (
                            <ConversationItem
                                key={conversation.wa_id}
                                conversation={conversation}
                                isSelected={selectedConversation?.wa_id === conversation.wa_id}
                                onClick={() => onSelectConversation(conversation)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-gray-200 bg-whatsapp-background">
                <div className="text-xs text-gray-500 text-center">
                    {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
