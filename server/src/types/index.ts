export interface User {
  id: string;
  username: string;
  password: string; // hashed
  createdAt: Date;
}

export interface Room {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  users: Set<string>; // user IDs
  messages: Message[];
}

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

export interface TypingUser {
  userId: string;
  username: string;
  roomId: string;
}

export interface SocketUser {
  socketId: string;
  userId: string;
  username: string;
  currentRoom?: string;
}
