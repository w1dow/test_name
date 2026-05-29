import { Routes, Route, Navigate } from "react-router";
import { useAppStore } from "@/store/useAppStore";
import { useAuth } from "@/hooks/useAuth";
import IntroScreen from "@/components/IntroScreen";
import Onboarding from "@/pages/Onboarding";
import Home from "@/pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const hasSeenIntro = useAppStore((s) => s.hasSeenIntro);
  const isStoreAuthenticated = useAppStore((s) => s.isAuthenticated);

  // Sync auth state from store
  const effectiveAuth = isAuthenticated || isStoreAuthenticated;

  // Show intro first
  if (!hasSeenIntro) {
    return (
      <>
        <IntroScreen />
        <Routes>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    );
  }

  // Show onboarding if not authenticated
  if (!effectiveAuth && !isLoading) {
    return (
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Show main app if authenticated
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return <AppContent />;
}
