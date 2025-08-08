## 🚀 Features

| Task | Feature | Function |
|------|---------|----------|
| **1** | **Read payloads** | Parse JSON files |
| **1** | **Store messages** | Insert into MongoDB |
| **1** | **Update message status** | Update based on webhook payloads |
| **2** | **Display chat list** | Show chats by user |
| **2** | **Display chat messages** | Show message bubbles + timestamps |
| **2** | **Show user info** | Display name + number in chat |
| **3** | **Send message input** | Demo send with text input |
| **3** | **Save sent message** | Store to MongoDB |
| **3** | **Show sent message** | Update UI instantly |
| **4** | **Deploy on public URL** | Shareable, hosted app |
| **Bonus** | **Real-time updates via WebSocket** | Live message & status updates |

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS (or your chosen styling library)
- **Backend:** Node.js, WebSocket
- **Database:** MongoDB
- **Deployment:** Vercel, Render, Netlify, or similar

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chat-app.git

# Enter the project directory
cd chat-app

# Install dependencies for frontend & backend
cd client
npm install
cd ../server
npm install

# Start the backend
npm run dev

# Start the frontend
cd ../client
npm start
