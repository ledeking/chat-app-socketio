# React Chat App with Socket.IO

A modern, production-ready real-time chat application built with React 19, Socket.IO, TypeScript, and Tailwind CSS. Experience seamless real-time messaging with typing indicators, online user tracking, and room management.

![React](https://img.shields.io/badge/React-19+-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=flat-square&logo=socket.io)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite)

## ✨ Features

### Core Functionality
- ✅ **Real-time Messaging** - Instant message delivery using Socket.IO
- ✅ **User Authentication** - Secure login/register with JWT tokens
- ✅ **Room Management** - Create and join chat rooms
- ✅ **Typing Indicators** - See when users are typing in real-time
- ✅ **Online User Tracking** - View all online users globally and per room
- ✅ **Message History** - Last 50-100 messages persisted per room
- ✅ **Emoji Support** - Rich emoji picker for expressive messages
- ✅ **Auto-scroll** - Messages automatically scroll to bottom
- ✅ **Responsive Design** - Works seamlessly on mobile and desktop
- ✅ **Dark Mode** - System preference-based theme switching

### Technical Features
- **React 19+** with modern hooks and patterns
- **TypeScript** with strict mode for type safety
- **Socket.IO** for bidirectional real-time communication
- **Zustand** for lightweight global state management
- **Tailwind CSS v4** with shadcn/ui components
- **React Router v7** for client-side routing
- **Vite** for fast development and optimized builds
- **JWT Authentication** for secure user sessions
- **Rate Limiting** - Message throttling to prevent spam
- **XSS Protection** - Message sanitization

## 🚀 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript 5.7** - Type safety
- **Vite 6** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Socket.IO Client 4.8** - Real-time communication
- **Zustand 5** - State management
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Component library
- **date-fns** - Date formatting
- **emoji-picker-react** - Emoji picker component
- **sonner** - Toast notifications
- **lucide-react** - Icon library

### Backend
- **Node.js 20+** - Runtime
- **Express 4** - Web framework
- **Socket.IO 4.8** - Real-time server
- **TypeScript** - Type safety
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
react-chat-app-socketio/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   └── layout/       # Layout components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── store/            # Zustand stores
│   │   ├── lib/              # Utilities
│   │   └── App.tsx           # Main app component
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── routes/           # Express routes
│   │   ├── sockets/          # Socket.IO handlers
│   │   ├── middleware/       # Auth middleware
│   │   ├── store/            # In-memory data stores
│   │   └── index.ts          # Server entry point
│   └── package.json
├── package.json               # Root workspace config
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 20+ and npm/yarn/pnpm
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-app-socketio-1
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client && npm install && cd ..

   # Install server dependencies
   cd server && npm install && cd ..
   ```

   Or use the convenience script:
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Create `.env` in the `server/` directory:
   ```env
   SERVER_PORT=4000
   CLIENT_URL=http://localhost:5173
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

   Create `.env` in the `client/` directory (optional):
   ```env
   VITE_SERVER_URL=http://localhost:4000
   ```

4. **Start development servers**

   From the root directory:
   ```bash
   npm run dev
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Server
   cd server && npm run dev

   # Terminal 2 - Client
   cd client && npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 🎮 Usage

### Creating an Account
1. Navigate to the login page
2. Click "Sign up" to create a new account
3. Enter a username (3-20 characters) and password (min 6 characters)
4. Click "Sign Up"

### Joining a Room
1. After logging in, you'll see the lobby with available rooms
2. Click on any room card to join
3. Or create a new room by clicking "Create Room"

### Chatting
1. Type your message in the input field
2. Press Enter or click Send
3. Use the emoji button (😀) to add emojis
4. See typing indicators when others are typing
5. View online users in the sidebar

### Features in Action
- **Real-time Updates**: Messages appear instantly for all users in the room
- **Typing Indicators**: See "username is typing..." when someone is typing
- **Online Status**: Green dot indicates online users
- **Message History**: Previous messages load when joining a room
- **Auto-scroll**: New messages automatically scroll into view

## 🔧 Development

### Available Scripts

**Root:**
- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm run install:all` - Install all dependencies

**Client:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Server:**
- `npm run dev` - Start server with hot reload (tsx watch)
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server

### Environment Variables

**Server (.env):**
- `SERVER_PORT` - Port for the Express server (default: 4000)
- `CLIENT_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `JWT_SECRET` - Secret key for JWT tokens (change in production!)
- `CORS_ORIGINS` - Comma-separated list of allowed origins

**Client (.env):**
- `VITE_SERVER_URL` - Backend server URL (default: http://localhost:4000)

## 🚢 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set build command: `cd client && npm run build`
4. Set output directory: `client/dist`
5. Add environment variable: `VITE_SERVER_URL=https://your-backend-url.com`
6. Deploy!

### Backend (Render/Railway/Fly.io)
1. Push code to GitHub
2. Create new service on your platform
3. Set build command: `cd server && npm run build`
4. Set start command: `cd server && npm start`
5. Add environment variables from `.env.example`
6. Update `CLIENT_URL` to your frontend URL
7. Deploy!

### Important Notes
- Update `CLIENT_URL` and `CORS_ORIGINS` with your production URLs
- Use a strong `JWT_SECRET` in production
- Consider using a database (PostgreSQL, MongoDB) instead of in-memory storage for production
- Set up proper rate limiting for production
- Use HTTPS in production

## 🏗️ Architecture

### Authentication Flow
1. User registers/logs in via REST API
2. Server returns JWT token
3. Token stored in localStorage (Zustand persist)
4. Socket.IO connection authenticated with token
5. Server middleware validates token on connection

### Real-time Communication
1. Client connects to Socket.IO server with JWT
2. Server validates token and establishes connection
3. Client joins rooms via `room:join` event
4. Messages broadcast to all users in room
5. Typing indicators update in real-time
6. Online user list updates on connect/disconnect

### State Management
- **Zustand** stores for global state
- **Auth Store**: User info and JWT token
- **Chat Store**: Rooms, messages, online users, typing indicators
- **LocalStorage**: Persistent auth state

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for password storage
- **XSS Protection** - Message content sanitization
- **Rate Limiting** - Message throttling (500ms debounce)
- **CORS Configuration** - Restricted origins
- **Input Validation** - Username/password validation

## 🎨 UI/UX Features

- **Modern Design** - Clean, Discord/WhatsApp-inspired interface
- **Responsive Layout** - Mobile-first design
- **Dark Mode** - Automatic theme switching
- **Smooth Animations** - Framer Motion ready
- **Loading States** - Connection status indicators
- **Error Handling** - Toast notifications for errors
- **Avatar Colors** - Consistent color per username
- **Message Timestamps** - Formatted with date-fns

## 📝 API Reference

### REST Endpoints

**POST `/api/auth/register`**
- Body: `{ username: string, password: string }`
- Returns: `{ token: string, user: { id, username } }`

**POST `/api/auth/login`**
- Body: `{ username: string, password: string }`
- Returns: `{ token: string, user: { id, username } }`

**GET `/api/auth/verify`**
- Headers: `Authorization: Bearer <token>`
- Returns: `{ user: { id, username } }`

### Socket.IO Events

**Client → Server:**
- `room:join` - Join a room
- `room:leave` - Leave a room
- `room:create` - Create a new room
- `message:send` - Send a message
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

**Server → Client:**
- `rooms:list` - List of all rooms
- `room:messages` - Messages for a room
- `message:new` - New message received
- `users:online` - Online users list
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `room:update` - Room info updated

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by modern chat applications like Discord, Slack, and WhatsApp Web
- Built with best practices from the React and Socket.IO communities
- UI components from [shadcn/ui](https://ui.shadcn.com)

## 📸 Screenshots

_Add screenshots of your application here_

### Features Showcase
- Login/Register page
- Lobby with room list
- Chat room interface
- Typing indicators
- Online users sidebar
- Dark mode toggle

---

Built with ❤️ using React, Socket.IO, and TypeScript
