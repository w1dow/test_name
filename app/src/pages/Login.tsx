import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508]">
      <div className="text-center">
        <div
          className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"
          style={{ borderColor: "#00F0FF", borderTopColor: "transparent" }}
        />
        <p className="mt-4 text-sm text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}
