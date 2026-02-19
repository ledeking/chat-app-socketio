import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { socketAuth, AuthSocket } from "../middleware/auth.js";
import { roomStore } from "../store/rooms.js";
import { Room, Message, TypingUser } from "../types/index.js";

// Track connected users
const connectedUsers = new Map<string, { userId: string; username: string; socketId: string }>();
const typingUsers = new Map<string, TypingUser>(); // key: `${userId}-${roomId}`

export const setupSocketIO = (io: Server) => {
  // Authentication middleware
  io.use(socketAuth);

  io.on("connection", (socket: AuthSocket) => {
    const userId = socket.userId!;
    const username = socket.username!;

    console.log(`✅ User connected: ${username} (${socket.id})`);

    // Add to connected users
    connectedUsers.set(userId, { userId, username, socketId: socket.id });

    // Emit updated user list
    io.emit("users:online", Array.from(connectedUsers.values()).map(u => ({
      userId: u.userId,
      username: u.username,
    })));

    // Send existing rooms
    const rooms = roomStore.getAll();
    socket.emit("rooms:list", rooms.map(room => ({
      id: room.id,
      name: room.name,
      createdBy: room.createdBy,
      userCount: room.users.size,
      createdAt: room.createdAt,
    })));

    // Join room
    socket.on("room:join", (roomId: string) => {
      let room = roomStore.findById(roomId);

      if (!room) {
        // Create room if it doesn't exist
        room = {
          id: roomId,
          name: roomId, // Default name
          createdBy: userId,
          createdAt: new Date(),
          users: new Set([userId]),
          messages: [],
        };
        roomStore.create(room);
      } else {
        roomStore.addUser(roomId, userId);
      }

      socket.join(roomId);
      socket.data.currentRoom = roomId;

      // Send room messages
      const messages = roomStore.getMessages(roomId, 50);
      socket.emit("room:messages", messages);

      // Notify others in room
      socket.to(roomId).emit("room:user-joined", {
        userId,
        username,
      });

      // Update room user count
      const updatedRoom = roomStore.findById(roomId);
      if (updatedRoom) {
        io.to(roomId).emit("room:update", {
          id: updatedRoom.id,
          userCount: updatedRoom.users.size,
        });
      }

      // Emit updated room list to all
      const allRooms = roomStore.getAll();
      io.emit("rooms:list", allRooms.map(r => ({
        id: r.id,
        name: r.name,
        createdBy: r.createdBy,
        userCount: r.users.size,
        createdAt: r.createdAt,
      })));
    });

    // Leave room
    socket.on("room:leave", (roomId: string) => {
      socket.leave(roomId);
      roomStore.removeUser(roomId, userId);
      socket.data.currentRoom = undefined;

      socket.to(roomId).emit("room:user-left", {
        userId,
        username,
      });

      const updatedRoom = roomStore.findById(roomId);
      if (updatedRoom) {
        io.to(roomId).emit("room:update", {
          id: updatedRoom.id,
          userCount: updatedRoom.users.size,
        });
      }

      // Emit updated room list
      const allRooms = roomStore.getAll();
      io.emit("rooms:list", allRooms.map(r => ({
        id: r.id,
        name: r.name,
        createdBy: r.createdBy,
        userCount: r.users.size,
        createdAt: r.createdAt,
      })));
    });

    // Create room
    socket.on("room:create", (roomName: string) => {
      const roomId = uuidv4();
      const room: Room = {
        id: roomId,
        name: roomName,
        createdBy: userId,
        createdAt: new Date(),
        users: new Set([userId]),
        messages: [],
      };

      roomStore.create(room);
      socket.join(roomId);
      socket.data.currentRoom = roomId;

      // Emit updated room list to all
      const allRooms = roomStore.getAll();
      io.emit("rooms:list", allRooms.map(r => ({
        id: r.id,
        name: r.name,
        createdBy: r.createdBy,
        userCount: r.users.size,
        createdAt: r.createdAt,
      })));

      socket.emit("room:created", {
        id: roomId,
        name: roomName,
      });
    });

    // Send message
    socket.on("message:send", (data: { roomId: string; content: string }) => {
      const { roomId, content } = data;

      // Rate limiting: simple check (in production, use proper rate limiting)
      if (!content || content.trim().length === 0) {
        return;
      }

      // Sanitize content (prevent XSS)
      const sanitizedContent = content.trim().slice(0, 1000); // Max 1000 chars

      const message: Message = {
        id: uuidv4(),
        roomId,
        userId,
        username,
        content: sanitizedContent,
        timestamp: new Date(),
      };

      roomStore.addMessage(roomId, message);

      // Broadcast to room
      io.to(roomId).emit("message:new", message);
    });

    // Typing indicator
    socket.on("typing:start", (roomId: string) => {
      const key = `${userId}-${roomId}`;
      typingUsers.set(key, {
        userId,
        username,
        roomId,
      });

      socket.to(roomId).emit("typing:start", {
        userId,
        username,
      });
    });

    socket.on("typing:stop", (roomId: string) => {
      const key = `${userId}-${roomId}`;
      typingUsers.delete(key);

      socket.to(roomId).emit("typing:stop", {
        userId,
        username,
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${username} (${socket.id})`);

      // Remove from connected users
      connectedUsers.delete(userId);

      // Leave all rooms
      const currentRoom = socket.data.currentRoom;
      if (currentRoom) {
        roomStore.removeUser(currentRoom, userId);
        socket.to(currentRoom).emit("room:user-left", {
          userId,
          username,
        });

        const updatedRoom = roomStore.findById(currentRoom);
        if (updatedRoom) {
          io.to(currentRoom).emit("room:update", {
            id: updatedRoom.id,
            userCount: updatedRoom.users.size,
          });
        }
      }

      // Remove typing indicators
      for (const [key, typing] of typingUsers.entries()) {
        if (typing.userId === userId) {
          typingUsers.delete(key);
          socket.to(typing.roomId).emit("typing:stop", {
            userId,
            username,
          });
        }
      }

      // Emit updated user list
      io.emit("users:online", Array.from(connectedUsers.values()).map(u => ({
        userId: u.userId,
        username: u.username,
      })));

      // Emit updated room list
      const allRooms = roomStore.getAll();
      io.emit("rooms:list", allRooms.map(r => ({
        id: r.id,
        name: r.name,
        createdBy: r.createdBy,
        userCount: r.users.size,
        createdAt: r.createdAt,
      })));
    });
  });
};
