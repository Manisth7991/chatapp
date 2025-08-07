import React from 'react';
import { AlertCircle, Wifi, RefreshCw } from 'lucide-react';

const MobileErrorBoundary = ({ error, onRetry, isNetworkError = false }) => {
    const handleRefresh = () => {
        if (onRetry) {
            onRetry();
        } else {
            window.location.reload();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-6 bg-gray-50">
            <div className="text-center max-w-md">
                {isNetworkError ? (
                    <Wifi className="w-16 h-16 text-red-500 mx-auto mb-4" />
                ) : (
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                )}

                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {isNetworkError ? 'Connection Problem' : 'Something went wrong'}
                </h2>

                <p className="text-gray-600 mb-6">
                    {isNetworkError
                        ? 'Unable to connect to the server. Please check your internet connection and ensure you\'re connected to the same network as the server.'
                        : error || 'An unexpected error occurred. Please try again.'
                    }
                </p>

                {isNetworkError && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                        <h3 className="font-medium text-blue-800 mb-2">Troubleshooting Tips:</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Check your WiFi connection</li>
                            <li>• Ensure you're on the same network as the server</li>
                            <li>• Try refreshing the page</li>
                            <li>• Contact support if the problem persists</li>
                        </ul>
                    </div>
                )}

                <button
                    onClick={handleRefresh}
                    className="inline-flex items-center px-6 py-3 bg-whatsapp-primary text-white rounded-lg hover:bg-whatsapp-secondary transition-colors"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                </button>
            </div>
        </div>
    );
};

export default MobileErrorBoundary;
