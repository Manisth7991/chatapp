import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ErrorBoundary from './components/ErrorBoundary';
import { SocketProvider } from './context/SocketContext';
import { ChatProvider, useChat } from './context/ChatContext';

function AppContent() {
    const { selectedConversation, selectConversation } = useChat();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="h-screen bg-whatsapp-background flex overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full bg-gradient-to-br from-whatsapp-primary/10 to-transparent"></div>
            </div>

            {/* Main container */}
            <div className="relative z-10 flex w-full max-w-7xl mx-auto bg-white shadow-2xl">
                {/* Sidebar */}
                <div className={`${isMobile
                    ? selectedConversation
                        ? 'hidden'
                        : 'w-full'
                    : 'w-1/3 min-w-[300px] max-w-[400px]'
                    } border-r border-gray-200`}>
                    <Sidebar
                        selectedConversation={selectedConversation}
                        onSelectConversation={selectConversation}
                        isMobile={isMobile}
                    />
                </div>

                {/* Chat Window */}
                <div className={`${isMobile
                    ? selectedConversation
                        ? 'w-full'
                        : 'hidden'
                    : 'flex-1'
                    }`}>
                    <ChatWindow
                        selectedConversation={selectedConversation}
                        onBack={() => selectConversation(null)}
                        isMobile={isMobile}
                    />
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <SocketProvider>
                <ChatProvider>
                    <AppContent />
                </ChatProvider>
            </SocketProvider>
        </ErrorBoundary>
    );
}

export default App;
