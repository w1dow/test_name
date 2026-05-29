import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Phone, User, Sparkles } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAppStore } from "@/store/useAppStore";

type AuthMode = "login" | "register";

export default function Onboarding() {
  const [mode, setMode] = useState<AuthMode>("register");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setAuthenticated = useAppStore((s) => s.setAuthenticated);

  const registerMutation = trpc.localAuth.register.useMutation();
  const loginMutation = trpc.localAuth.login.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        if (!name || !username || !password) {
          setError("Name, username, and password are required");
          setLoading(false);
          return;
        }
        const result = await registerMutation.mutateAsync({
          name,
          username,
          email: email || undefined,
          phone: phone || undefined,
          password,
        });
        localStorage.setItem("auth_token", result.token);
        setAuthenticated(true);
      } else {
        if (!username || !password) {
          setError("Username and password are required");
          setLoading(false);
          return;
        }
        const result = await loginMutation.mutateAsync({
          identifier: username,
          password,
        });
        localStorage.setItem("auth_token", result.token);
        setAuthenticated(true);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError("");
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(220, 38, 38, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(37, 99, 235, 0.4) 0%, transparent 50%), #0a0a1a",
      }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background:
                i % 3 === 0
                  ? "rgba(220, 38, 38, 0.4)"
                  : i % 3 === 1
                    ? "rgba(37, 99, 235, 0.4)"
                    : "rgba(0, 240, 255, 0.3)",
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.img
            src="/logo_lumis.png"
            alt="LUMIS"
            className="w-24 h-24 object-contain mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <h1
            className="text-3xl font-bold tracking-wider"
            style={{
              color: "#FFFFFF",
              textShadow: "0px 0px 15px rgba(0, 240, 255, 0.4)",
            }}
          >
            LUMIS AI
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Study smarter, not harder
          </p>
        </div>

        {/* Auth Card */}
        <div
          className="rounded-2xl p-6 backdrop-blur-xl"
          style={{
            background: "rgba(10, 10, 26, 0.7)",
            border: "1px solid rgba(0, 240, 255, 0.15)",
            boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 rounded-xl bg-white/5">
            <button
              onClick={() => setMode("register")}
              className="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300"
              style={{
                background:
                  mode === "register"
                    ? "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(37, 99, 235, 0.2))"
                    : "transparent",
                color: mode === "register" ? "#00F0FF" : "#8A8D99",
                border:
                  mode === "register"
                    ? "1px solid rgba(0, 240, 255, 0.3)"
                    : "1px solid transparent",
              }}
            >
              Sign Up
            </button>
            <button
              onClick={() => setMode("login")}
              className="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300"
              style={{
                background:
                  mode === "login"
                    ? "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(37, 99, 235, 0.2))"
                    : "transparent",
                color: mode === "login" ? "#00F0FF" : "#8A8D99",
                border:
                  mode === "login"
                    ? "1px solid rgba(0, 240, 255, 0.3)"
                    : "1px solid transparent",
              }}
            >
              Log In
            </button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  key="register-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Name */}
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full py-3 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    />
                  </div>

                  {/* Username */}
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full py-3 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-3 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full py-3 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {mode === "login" && (
                <motion.div
                  key="login-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Username / Email / Phone */}
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Username, Email or Phone"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full py-3 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password - shared */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pl-4 pr-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium text-sm text-white transition-all"
              style={{
                background: loading
                  ? "rgba(0, 240, 255, 0.3)"
                  : "linear-gradient(135deg, #00F0FF, #2563EB)",
                boxShadow: "0px 0px 20px rgba(0, 240, 255, 0.3)",
              }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading
                ? "Please wait..."
                : mode === "register"
                  ? "Create Account"
                  : "Log In"}
            </motion.button>
          </form>

          {/* Switch mode text */}
          <p className="mt-4 text-center text-sm text-gray-500">
            {mode === "register" ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={switchMode}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  onClick={switchMode}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-600">
          By continuing, you agree to LUMIS Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
