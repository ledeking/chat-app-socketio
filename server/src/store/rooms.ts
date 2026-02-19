import { Room, Message } from "../types/index.js";

// In-memory room store
const rooms = new Map<string, Room>();

export const roomStore = {
  create: (room: Room): void => {
    rooms.set(room.id, room);
  },

  findById: (id: string): Room | undefined => {
    return rooms.get(id);
  },

  getAll: (): Room[] => {
    return Array.from(rooms.values());
  },

  addUser: (roomId: string, userId: string): boolean => {
    const room = rooms.get(roomId);
    if (room) {
      room.users.add(userId);
      return true;
    }
    return false;
  },

  removeUser: (roomId: string, userId: string): boolean => {
    const room = rooms.get(roomId);
    if (room) {
      room.users.delete(userId);
      return true;
    }
    return false;
  },

  addMessage: (roomId: string, message: Message): boolean => {
    const room = rooms.get(roomId);
    if (room) {
      room.messages.push(message);
      // Keep only last 100 messages
      if (room.messages.length > 100) {
        room.messages = room.messages.slice(-100);
      }
      return true;
    }
    return false;
  },

  getMessages: (roomId: string, limit: number = 50): Message[] => {
    const room = rooms.get(roomId);
    if (room) {
      return room.messages.slice(-limit);
    }
    return [];
  },

  delete: (id: string): boolean => {
    return rooms.delete(id);
  },
};
