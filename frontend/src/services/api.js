import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout for mobile networks
});

// Request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('API Error:', {
            message: error.message,
            status: error.response?.status,
            url: error.config?.url,
            data: error.response?.data
        });

        // Handle network errors specifically for mobile
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
            console.error('Network connection issue - check if server is accessible from mobile device');
        }

        return Promise.reject(error);
    }
);

export const chatAPI = {
    // Get all conversations
    getConversations: () => api.get('/api/messages/conversations'),

    // Get specific conversation messages
    getConversation: (wa_id, page = 1, limit = 50) =>
        api.get(`/api/messages/conversations/${wa_id}?page=${page}&limit=${limit}`),

    // Send a message
    sendMessage: (data) => api.post('/api/messages/send', data),

    // Mark messages as read
    markAsRead: (wa_id) => api.put(`/api/messages/conversations/${wa_id}/read`),

    // Health check
    healthCheck: () => api.get('/health'),
};

export default api;
