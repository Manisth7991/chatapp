# 🚀 Quick Start Guide

## Prerequisites
- Node.js v16+ 
- MongoDB (local or cloud)
- Git

## Setup in 3 Steps

### 1. Clone & Setup
```bash
git clone <your-repo-url>
cd chatapp

# On Windows
setup.bat

# On macOS/Linux
chmod +x setup.sh
./setup.sh
```

### 2. Configure Environment
Update `.env` with your MongoDB connection:
```env
MONGO_URI=mongodb://localhost:27017/chatapp
PORT=5000
```

### 3. Start the Application
```bash
npm run dev:all
```

🎉 **That's it!** 

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Test with Sample Data
```bash
npm run process-payloads
```

## Available Commands
- `npm run dev:all` - Start both frontend and backend
- `npm run backend` - Backend only (port 5000)
- `npm run frontend` - Frontend only (port 3000)
- `npm run process-payloads` - Load sample WhatsApp messages

## What You'll See
1. **Conversation List** - Left sidebar with contacts
2. **Chat Interface** - WhatsApp-like messaging UI
3. **Real-time Updates** - Messages appear instantly
4. **Status Indicators** - Sent/delivered/read status
5. **Responsive Design** - Works on mobile and desktop

## Troubleshooting
- **MongoDB Error**: Check your connection string in `.env`
- **Port Conflicts**: Make sure ports 3000 and 5000 are free
- **Dependencies Issue**: Run `npm run install:all`

Happy messaging! 💬
