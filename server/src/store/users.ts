import { User } from "../types/index.js";

// In-memory user store (in production, use a database)
const users = new Map<string, User>();

export const userStore = {
  create: (user: User): void => {
    users.set(user.id, user);
  },

  findByUsername: (username: string): User | undefined => {
    return Array.from(users.values()).find((u) => u.username === username);
  },

  findById: (id: string): User | undefined => {
    return users.get(id);
  },

  getAll: (): User[] => {
    return Array.from(users.values());
  },

  delete: (id: string): boolean => {
    return users.delete(id);
  },
};
