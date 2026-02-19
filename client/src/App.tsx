import { Routes, Route, Navigate } from "react-router";
import { Toaster } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { Header } from "@/components/layout/Header";
import { LoginPage } from "@/pages/LoginPage";
import { LobbyPage } from "@/pages/LobbyPage";
import { ChatRoomPage } from "@/pages/ChatRoomPage";
import { useSocket } from "@/hooks/useSocket";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { isAuthenticated } = useAuthStore();

  // Initialize socket connection if authenticated
  if (isAuthenticated) {
    useSocket();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LobbyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:roomId"
          element={
            <ProtectedRoute>
              <ChatRoomPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
