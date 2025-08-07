import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import MobileErrorBoundary from './MobileErrorBoundary';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Check if we're on mobile
            const isMobile = window.innerWidth < 768;

            // Check if it's a network error
            const isNetworkError = this.state.error?.message?.includes('Network') ||
                this.state.error?.message?.includes('fetch') ||
                this.state.error?.code === 'NETWORK_ERROR';

            if (isMobile) {
                return (
                    <MobileErrorBoundary
                        error={this.state.error?.message}
                        isNetworkError={isNetworkError}
                        onRetry={() => window.location.reload()}
                    />
                );
            }

            return (
                <div className="h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center max-w-md mx-auto p-6">
                        <div className="w-16 h-16 mx-auto mb-4 text-red-500">
                            <AlertTriangle className="w-full h-full" />
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-gray-600 mb-6">
                            We encountered an unexpected error. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center px-4 py-2 bg-whatsapp-primary text-white rounded-lg hover:bg-whatsapp-secondary transition-colors"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh Page
                        </button>
                        {process.env.NODE_ENV === 'development' && (
                            <details className="mt-4 text-left">
                                <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                                    Error Details
                                </summary>
                                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                                    {this.state.error?.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
