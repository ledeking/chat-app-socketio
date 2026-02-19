import { create } from "zustand";

export interface Room {
  id: string;
  name: string;
  createdBy: string;
  userCount: number;
  createdAt: Date;
}

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

export interface OnlineUser {
  userId: string;
  username: string;
}

export interface TypingUser {
  userId: string;
  username: string;
}

interface ChatState {
  rooms: Room[];
  currentRoom: string | null;
  messages: Map<string, Message[]>; // roomId -> messages
  onlineUsers: OnlineUser[];
  typingUsers: Map<string, TypingUser[]>; // roomId -> typing users
  setRooms: (rooms: Room[]) => void;
  setCurrentRoom: (roomId: string | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (roomId: string, messages: Message[]) => void;
  setOnlineUsers: (users: OnlineUser[]) => void;
  addTypingUser: (roomId: string, user: TypingUser) => void;
  removeTypingUser: (roomId: string, userId: string) => void;
  clearTypingUsers: (roomId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  rooms: [],
  currentRoom: null,
  messages: new Map(),
  onlineUsers: [],
  typingUsers: new Map(),
  setRooms: (rooms) => set({ rooms }),
  setCurrentRoom: (roomId) => set({ currentRoom: roomId }),
  addMessage: (message) => {
    const messages = new Map(get().messages);
    const roomMessages = messages.get(message.roomId) || [];
    roomMessages.push(message);
    messages.set(message.roomId, roomMessages);
    set({ messages });
  },
  setMessages: (roomId, messages) => {
    const messagesMap = new Map(get().messages);
    messagesMap.set(roomId, messages);
    set({ messages: messagesMap });
  },
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  addTypingUser: (roomId, user) => {
    const typingUsers = new Map(get().typingUsers);
    const roomTyping = typingUsers.get(roomId) || [];
    if (!roomTyping.find((u) => u.userId === user.userId)) {
      roomTyping.push(user);
      typingUsers.set(roomId, roomTyping);
      set({ typingUsers });
    }
  },
  removeTypingUser: (roomId, userId) => {
    const typingUsers = new Map(get().typingUsers);
    const roomTyping = typingUsers.get(roomId) || [];
    const filtered = roomTyping.filter((u) => u.userId !== userId);
    typingUsers.set(roomId, filtered);
    set({ typingUsers });
  },
  clearTypingUsers: (roomId) => {
    const typingUsers = new Map(get().typingUsers);
    typingUsers.delete(roomId);
    set({ typingUsers });
  },
}));
