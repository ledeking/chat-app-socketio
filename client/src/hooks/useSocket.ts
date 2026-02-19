import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { toast } from "sonner";

export function useSocket() {
  const { token, user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const {
    setRooms,
    setMessages,
    addMessage,
    setOnlineUsers,
    addTypingUser,
    removeTypingUser,
  } = useChatStore();

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    const socket = getSocket(token);
    socketRef.current = socket;

    // Connection events
    socket.on("connect", () => {
      console.log("✅ Connected to server");
      toast.success("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      toast.error("Disconnected from server");
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      toast.error("Connection error: " + error.message);
    });

    // Rooms
    socket.on("rooms:list", (rooms) => {
      setRooms(rooms);
    });

    socket.on("room:created", (room) => {
      toast.success(`Room "${room.name}" created`);
    });

    socket.on("room:update", (room) => {
      // Update room user count
      setRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.id === room.id ? { ...r, userCount: room.userCount } : r
        )
      );
    });

    // Messages
    socket.on("room:messages", (messages) => {
      // Group messages by room
      const messagesByRoom = new Map<string, typeof messages>();
      messages.forEach((msg: any) => {
        const roomMsgs = messagesByRoom.get(msg.roomId) || [];
        roomMsgs.push(msg);
        messagesByRoom.set(msg.roomId, roomMsgs);
      });

      messagesByRoom.forEach((msgs, roomId) => {
        setMessages(roomId, msgs);
      });
    });

    socket.on("message:new", (message) => {
      addMessage(message);
    });

    // Users
    socket.on("users:online", (users) => {
      setOnlineUsers(users);
    });

    // Typing indicators
    socket.on("typing:start", ({ userId, username, roomId }: any) => {
      addTypingUser(roomId || socket.data?.currentRoom, {
        userId,
        username,
      });
    });

    socket.on("typing:stop", ({ userId, roomId }: any) => {
      removeTypingUser(roomId || socket.data?.currentRoom, userId);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("rooms:list");
      socket.off("room:created");
      socket.off("room:update");
      socket.off("room:messages");
      socket.off("message:new");
      socket.off("users:online");
      socket.off("typing:start");
      socket.off("typing:stop");
    };
  }, [token, user, setRooms, setMessages, addMessage, setOnlineUsers, addTypingUser, removeTypingUser]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
}
