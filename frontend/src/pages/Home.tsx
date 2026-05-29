import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanelRightOpen, PanelRightClose, MessageSquare, Send } from "lucide-react";
import SpaceScene from "@/components/scenes/SpaceScene";
import FloralScene from "@/components/scenes/FloralScene";
import InteractiveCat from "@/components/scenes/InteractiveCat";
import Sidebar from "@/components/ui-custom/Sidebar";
import SettingsPanel from "@/components/ui-custom/SettingsPanel";
import { useAppStore } from "@/store/useAppStore";
import { useAuth } from "@/hooks/useAuth";

function CatSleepMonitor() {
  const updateLastActive = useAppStore((s) => s.updateLastActive);
  const setCatState = useAppStore((s) => s.setCatState);
  const catState = useAppStore((s) => s.catState);
  const lastActive = useAppStore((s) => s.lastActiveTime);

  useEffect(() => {
    const handleActivity = () => {
      updateLastActive();
      if (catState === "sleep") {
        setCatState("idle");
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [updateLastActive, setCatState, catState]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const inactive = now - lastActive;
      if (inactive > 60000 && catState !== "sleep") {
        setCatState("sleep");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lastActive, catState, setCatState]);

  return null;
}

export default function Home() {
  const theme = useAppStore((s) => s.theme);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const activePanel = useAppStore((s) => s.activePanel);
  const setActivePanel = useAppStore((s) => s.setActivePanel);
  const setCatState = useAppStore((s) => s.setCatState);
  const catState = useAppStore((s) => s.catState);
  const { user } = useAuth();

  const [promptValue, setPromptValue] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);

  // Welcome message based on user
  const displayName = user?.name || user?.username || "Captain";

  const handleCatClick = useCallback(() => {
    if (catState === "sleep") {
      setCatState("idle");
    } else if (catState === "idle") {
      setCatState("play");
      setTimeout(() => setCatState("idle"), 3000);
    } else {
      setCatState("alert");
      setTimeout(() => setCatState("idle"), 2000);
    }
  }, [catState, setCatState]);

  const handleSendMessage = useCallback(() => {
    if (!promptValue.trim()) return;
    const userMsg = { role: "user", content: promptValue };
    setMessages((prev) => [...prev, userMsg]);
    setPromptValue("");
    setIsChatOpen(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'd be happy to help with your studies! What subject are you working on?",
        "Great question! Let me break that down for you.",
        "I can help you organize your study schedule. What topics do you need to cover?",
        "That's an interesting topic! Let me provide some key insights.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { role: "assistant", content: randomResponse }]);
    }, 1000);
  }, [promptValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const isSciFi = theme === "sci-fi";

  return (
    <div className="fixed inset-0 overflow-hidden">
      <CatSleepMonitor />

      {/* 3D Background */}
      <AnimatePresence mode="wait">
        {isSciFi ? (
          <motion.div
            key="space"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <SpaceScene />
          </motion.div>
        ) : (
          <motion.div
            key="floral"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <FloralScene />
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <img src="/logo_lumis.png" alt="LUMIS" className="w-8 h-8 object-contain" />
            <span
              className="text-lg font-bold tracking-wider"
              style={{
                color: isSciFi ? "#FFFFFF" : "#4A3B32",
                textShadow: isSciFi ? "0px 0px 10px rgba(0, 240, 255, 0.4)" : "none",
              }}
            >
              LUMIS
            </span>
          </motion.div>

          {/* Sidebar toggle */}
          <motion.button
            onClick={toggleSidebar}
            className="p-2 rounded-xl transition-all"
            style={{
              background: isSciFi
                ? "rgba(5, 5, 8, 0.6)"
                : "rgba(253, 251, 247, 0.8)",
              border: isSciFi
                ? "1px solid rgba(0, 240, 255, 0.2)"
                : "1px solid rgba(107, 142, 35, 0.2)",
              color: isSciFi ? "#00F0FF" : "#6B8E23",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {sidebarOpen ? (
              <PanelRightClose className="w-5 h-5" />
            ) : (
              <PanelRightOpen className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center relative px-6">
          {/* Welcome text */}
          {!isChatOpen && (
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1
                className="text-5xl md:text-6xl font-bold mb-2"
                style={{
                  color: isSciFi ? "#FFFFFF" : "#4A3B32",
                  textShadow: isSciFi
                    ? "0px 0px 20px rgba(0, 240, 255, 0.3)"
                    : "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Welcome{" "}
                <span
                  style={{
                    color: isSciFi ? "#00F0FF" : "#6B8E23",
                  }}
                >
                  {displayName}
                </span>
                !
              </h1>
              <p
                className="text-lg"
                style={{ color: isSciFi ? "#8A8D99" : "#8B7355" }}
              >
                How can I help you study today?
              </p>
            </motion.div>
          )}

          {/* Chat Interface */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                className="absolute inset-x-6 top-0 bottom-32 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div
                  className="flex-1 rounded-2xl p-4 overflow-y-auto scrollbar-hide mb-4"
                  style={{
                    background: isSciFi
                      ? "rgba(5, 5, 8, 0.7)"
                      : "rgba(253, 251, 247, 0.85)",
                    border: isSciFi
                      ? "1px solid rgba(0, 240, 255, 0.15)"
                      : "1px solid rgba(107, 142, 35, 0.15)",
                  }}
                >
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`mb-3 flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className="max-w-[70%] px-4 py-2.5 rounded-2xl text-sm"
                        style={{
                          background:
                            msg.role === "user"
                              ? isSciFi
                                ? "rgba(0, 240, 255, 0.2)"
                                : "rgba(107, 142, 35, 0.2)"
                              : isSciFi
                                ? "rgba(255, 255, 255, 0.05)"
                                : "rgba(255, 255, 255, 0.6)",
                          color: isSciFi ? "#FFFFFF" : "#4A3B32",
                          border:
                            msg.role === "user"
                              ? isSciFi
                                ? "1px solid rgba(0, 240, 255, 0.3)"
                                : "1px solid rgba(107, 142, 35, 0.3)"
                              : "none",
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Command Prompt Bar */}
        <div className="px-6 pb-8">
          <motion.div
            className="max-w-2xl mx-auto rounded-full flex items-center gap-3 px-5 py-3"
            style={{
              background: isSciFi
                ? "rgba(5, 5, 8, 0.75)"
                : "rgba(253, 251, 247, 0.9)",
              border: isSciFi
                ? "1px solid rgba(0, 240, 255, 0.25)"
                : "1px solid rgba(107, 142, 35, 0.25)",
              boxShadow: isSciFi
                ? "0px 0px 20px rgba(0, 240, 255, 0.1)"
                : "0px 4px 20px rgba(74, 59, 50, 0.1)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <MessageSquare
              className="w-5 h-5 flex-shrink-0"
              style={{ color: isSciFi ? "#00F0FF" : "#6B8E23" }}
            />
            <input
              type="text"
              placeholder="Ask LUMIS anything..."
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{
                color: isSciFi ? "#FFFFFF" : "#4A3B32",
              }}
            />
            <motion.button
              onClick={handleSendMessage}
              className="p-2 rounded-full flex-shrink-0"
              style={{
                background: isSciFi
                  ? "rgba(0, 240, 255, 0.15)"
                  : "rgba(107, 142, 35, 0.15)",
                color: isSciFi ? "#00F0FF" : "#6B8E23",
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>

        {/* Interactive Cat */}
        <motion.div
          className="absolute bottom-24 right-6 z-20 cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          onClick={handleCatClick}
          whileHover={{ scale: 1.05 }}
        >
          <InteractiveCat />
          {/* Cat status indicator */}
          <div
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full border-2"
            style={{
              background:
                catState === "sleep"
                  ? "#6366f1"
                  : catState === "play"
                    ? "#f59e0b"
                    : catState === "alert"
                      ? "#ef4444"
                      : "#22c55e",
              borderColor: isSciFi ? "#050508" : "#FDFBF7",
            }}
          />
        </motion.div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-30 bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSidebarOpen(false);
                setActivePanel(null);
              }}
            />

            {/* Panel */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-80 z-40 overflow-y-auto scrollbar-hide"
              style={{
                background: isSciFi
                  ? "rgba(5, 5, 8, 0.85)"
                  : "rgba(253, 251, 247, 0.92)",
                borderLeft: isSciFi
                  ? "1px solid rgba(0, 240, 255, 0.15)"
                  : "1px solid rgba(107, 142, 35, 0.15)",
                backdropFilter: "blur(20px)",
              }}
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {activePanel === "settings" ? (
                <SettingsPanel onBack={() => setActivePanel(null)} />
              ) : (
                <Sidebar onSettingsClick={() => setActivePanel("settings")} />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
