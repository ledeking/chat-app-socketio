import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { userStore } from "../store/users.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AuthSocket extends Socket {
  userId?: string;
  username?: string;
}

export const socketAuth = async (
  socket: AuthSocket,
  next: (err?: ExtendedError) => void
) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
    const user = userStore.findById(decoded.userId);

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    socket.userId = user.id;
    socket.username = user.username;

    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
};
