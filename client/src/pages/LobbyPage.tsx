import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChatStore } from "@/store/useChatStore";
import { useSocket } from "@/hooks/useSocket";
import { Plus, Users, Hash } from "lucide-react";
import { toast } from "sonner";

export function LobbyPage() {
  const { rooms, onlineUsers, setCurrentRoom } = useChatStore();
  const [newRoomName, setNewRoomName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();
  const socket = useSocket();

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) {
      toast.error("Room name cannot be empty");
      return;
    }

    if (socket) {
      socket.emit("room:create", newRoomName.trim());
      setNewRoomName("");
      setShowCreateForm(false);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    if (socket) {
      setCurrentRoom(roomId);
      socket.emit("room:join", roomId);
      navigate(`/chat/${roomId}`);
    }
  };

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Available Rooms</h2>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Room
            </Button>
          </div>

          {showCreateForm && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Room name"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreateRoom();
                      }
                    }}
                  />
                  <Button onClick={handleCreateRoom}>Create</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewRoomName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {rooms.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No rooms available. Create one to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              rooms.map((room) => (
                <Card
                  key={room.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleJoinRoom(room.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Hash className="h-5 w-5" />
                        {room.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {room.userCount}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Join Room
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Online Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {onlineUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No users online
                  </p>
                ) : (
                  onlineUsers.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                    >
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">{user.username}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
