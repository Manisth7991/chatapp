# WhatsApp Web Clone - Full Stack Application

A complete full-stack WhatsApp Web clone built with Node.js/Express backend and React frontend. The application processes WhatsApp webhook payloads, stores messages in MongoDB, and provides real-time communication with a modern, responsive UI that closely replicates WhatsApp Web's design.

## 🚀 Features

### Backend Features
- ✅ WhatsApp webhook payload processing
- ✅ Message storage in MongoDB with `processed_messages` collection
- ✅ Real-time updates via Socket.IO
- ✅ Message status tracking (sent, delivered, read)
- ✅ RESTful API endpoints
- ✅ Local payload file processing script
- ✅ Comprehensive error handling and validation
- ✅ ESM module support

### Frontend Features
- ✅ Modern WhatsApp Web UI replica
- ✅ Responsive design (mobile and desktop)
- ✅ Real-time messaging with Socket.IO
- ✅ Conversation list with last message preview
- ✅ Message bubbles with timestamps and status indicators
- ✅ Typing indicators
- ✅ Auto-resizing message input
- ✅ Smooth animations and transitions
- ✅ Loading states and error handling

## 🏗️ Project Structure

```
chatapp/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── messageController.js  # Message API handlers
│   │   └── webhookController.js  # Webhook processing
│   ├── models/
│   │   └── ProcessedMessage.js   # MongoDB schema
│   ├── routes/
│   │   ├── messages.js          # Message routes
│   │   └── webhook.js           # Webhook routes
│   ├── scripts/
│   │   ├── processPayloads.js   # Local payload processor
│   │   └── samplePayloads/      # Sample webhook files
│   ├── socket/
│   │   └── socket.js            # Socket.IO configuration
│   ├── utils/
│   │   └── processPayload.js    # Payload utilities
│   └── server.js                # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── context/             # React contexts
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # API services
│   │   ├── utils/               # Utility functions
│   │   └── App.jsx              # Main App component
│   ├── public/
│   └── package.json
├── package.json                 # Root package.json
├── .env.example                 # Environment variables
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Quick Start

1. **Clone the repository:**
```bash
git clone <repository-url>
cd chatapp
```

2. **Install all dependencies:**
```bash
npm run install:all
```

3. **Set up environment variables:**
```bash
# Backend
cp .env.example .env
# Edit .env with your MongoDB connection string

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env if needed (defaults should work)
```

4. **Start both frontend and backend:**
```bash
npm run dev:all
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Individual Commands

```bash
# Backend only
npm run backend

# Frontend only
npm run frontend

# Process sample payloads
npm run process-payloads

# Build frontend for production
npm run build
```

## 🌐 API Endpoints

### Health & Info
- **GET** `/health` - Server health status

### Messages
- **GET** `/api/messages/conversations` - Get all conversations
- **GET** `/api/messages/conversations/:wa_id` - Get specific conversation with pagination
- **POST** `/api/messages/send` - Send a new message

### Webhooks
- **POST** `/api/webhook` - Process incoming WhatsApp message webhooks
- **POST** `/api/webhook/status` - Process message status updates

## 📱 Frontend Architecture

### Key Components
- **App.jsx** - Main application container
- **Sidebar.jsx** - Conversation list with search
- **ChatWindow.jsx** - Main chat interface
- **MessageBubble.jsx** - Individual message display
- **ConversationItem.jsx** - Conversation list item

### Context Providers
- **SocketContext** - Socket.IO connection management
- **ChatContext** - Chat state management and API calls

### Custom Hooks
- **useTypingIndicator** - Handles typing state
- **useAutoResize** - Auto-resizes textarea
- **useDebounce** - Debounces input values

## 🔄 Data Flow

1. **Message Reception**: WhatsApp sends webhook → Backend processes → Stores in MongoDB
2. **Real-time Updates**: Backend emits Socket.IO events → Frontend receives → UI updates
3. **Message Sending**: Frontend sends via API → Backend stores → Socket.IO broadcasts
4. **Status Updates**: Status webhooks → Backend updates DB → Socket.IO notifies clients

## 🎨 UI/UX Features

### Design System
- **Colors**: WhatsApp-inspired color palette
- **Typography**: Segoe UI font family
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach

### User Experience
- **Real-time Messaging**: Instant message delivery
- **Visual Feedback**: Loading states, typing indicators
- **Accessibility**: Keyboard navigation support
- **Performance**: Optimized rendering and API calls

## 🛢️ Database Schema

### Messages Collection (`processed_messages`)
```javascript
{
  wa_id: String,           // WhatsApp ID
  name: String,            // Contact name
  msg_id: String,          // Unique message ID (indexed)
  text: String,            // Message content
  timestamp: Date,         // Message timestamp
  status: String,          // sent|delivered|read
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

## 🔌 Socket.IO Events

### Client → Server
- `join_conversation` - Join conversation room
- `leave_conversation` - Leave conversation room
- `typing` - Send typing status
- `mark_read` - Mark message as read

### Server → Client
- `new_message` - New message received
- `status_update` - Message status updated
- `user_typing` - Typing indicator
- `message_read` - Read receipt

## 📄 Sample Payload Structure

### Message Webhook
```json
{
  "payload_type": "whatsapp_webhook",
  "metaData": {
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "id": "message_id",
            "from": "whatsapp_id",
            "timestamp": "unix_timestamp",
            "text": { "body": "message_content" }
          }],
          "contacts": [{
            "profile": { "name": "Contact Name" }
          }]
        }
      }]
    }]
  }
}
```

## 🚀 Production Deployment

### Backend Deployment
1. Set production environment variables
2. Build application: `npm run build`
3. Start with: `npm start`

### Frontend Deployment
1. Build frontend: `npm run build`
2. Serve static files from `frontend/dist`

### Environment Variables
```env
# Backend
MONGO_URI=mongodb://localhost:27017/chatapp
PORT=5000
NODE_ENV=production

# Frontend
VITE_API_URL=https://your-api-domain.com
```

## 🧪 Testing the Application

### Testing Message Flow
1. Start the application: `npm run dev:all`
2. Process sample payloads: `npm run process-payloads`
3. Open frontend at `http://localhost:3000`
4. Select a conversation and send messages
5. Observe real-time updates

### Testing Webhooks
Send POST requests to webhook endpoints with sample payloads to test the webhook processing functionality.

## 🛠️ Development

### Code Quality
- ESLint configuration for code quality
- Consistent code formatting
- Modular component architecture
- Reusable utility functions

### Performance Optimizations
- Component memoization where appropriate
- Efficient re-rendering strategies
- Optimized API calls
- Socket connection management

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

ISC License

## 🆘 Troubleshooting

### Common Issues
1. **Connection Error**: Check MongoDB connection string
2. **Port Conflicts**: Ensure ports 3000 and 5000 are available
3. **Socket Issues**: Verify Socket.IO connection on frontend
4. **Build Errors**: Run `npm run install:all` to ensure all dependencies are installed

### Debug Mode
Set `NODE_ENV=development` for detailed error logs and debugging information.
