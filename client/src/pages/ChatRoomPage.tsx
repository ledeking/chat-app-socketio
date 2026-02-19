import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useSocket } from "@/hooks/useSocket";
import { format } from "date-fns";
import { ArrowLeft, Send } from "lucide-react";
import { getInitials, getUsernameColor } from "@/lib/utils";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { toast } from "sonner";

export function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const socket = useSocket();
  const {
    messages,
    currentRoom,
    typingUsers,
    setCurrentRoom,
    clearTypingUsers,
  } = useChatStore();

  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const roomMessages = roomId ? messages.get(roomId) || [] : [];
  const roomTypingUsers = roomId ? typingUsers.get(roomId) || [] : [];

  useEffect(() => {
    if (roomId && socket) {
      setCurrentRoom(roomId);
      socket.emit("room:join", roomId);
    }

    return () => {
      if (roomId && socket) {
        socket.emit("room:leave", roomId);
        clearTypingUsers(roomId);
      }
    };
  }, [roomId, socket, setCurrentRoom, clearTypingUsers]);

  useEffect(() => {
    scrollToBottom();
  }, [roomMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !roomId || !socket) return;

    socket.emit("message:send", {
      roomId,
      content: message.trim(),
    });

    setMessage("");
    setShowEmojiPicker(false);

    // Stop typing indicator
    if (socket && roomId) {
      socket.emit("typing:stop", roomId);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (!socket || !roomId) return;

    // Emit typing start
    socket.emit("typing:start", roomId);

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout to stop typing
    const timeout = setTimeout(() => {
      if (socket && roomId) {
        socket.emit("typing:stop", roomId);
      }
    }, 1000);

    setTypingTimeout(timeout);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleLeaveRoom = () => {
    if (roomId && socket) {
      socket.emit("room:leave", roomId);
    }
    navigate("/");
  };

  if (!roomId) {
    return null;
  }

  return (
    <div className="container h-[calc(100vh-3.5rem)] flex flex-col py-4">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLeaveRoom}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Room: {roomId}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea
            ref={messagesContainerRef}
            className="flex-1 p-4"
          >
            <div className="space-y-4">
              {roomMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                roomMessages.map((msg) => {
                  const isOwnMessage = msg.userId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        isOwnMessage ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar
                        initials={getInitials(msg.username)}
                        color={getUsernameColor(msg.username)}
                      />
                      <div
                        className={`flex flex-col gap-1 ${
                          isOwnMessage ? "items-end" : "items-start"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {msg.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(msg.timestamp), "HH:mm")}
                          </span>
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[80%] ${
                            isOwnMessage
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {roomTypingUsers.length > 0 && (
                <div className="text-sm text-muted-foreground italic">
                  {roomTypingUsers.map((u) => u.username).join(", ")} typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <div className="border-t p-4 relative">
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                😀
              </Button>
              <Input
                value={message}
                onChange={handleTyping}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
