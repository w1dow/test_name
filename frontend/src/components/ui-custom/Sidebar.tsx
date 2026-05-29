import { motion } from "framer-motion";
import {
  Palette,
  LayoutGrid,
  Settings,
  LogOut,
  Clock,
  Target,
  Flame,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";

interface SidebarProps {
  onSettingsClick: () => void;
}

export default function Sidebar({ onSettingsClick }: SidebarProps) {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const { user, logout } = useAuth();

  const isSciFi = theme === "sci-fi";

  const { data: studyStats } = trpc.user.getStudyStats.useQuery(undefined, {
    enabled: !!user,
  });

  const themeMutation = trpc.user.updateTheme.useMutation();

  const handleThemeSwitch = (newTheme: "sci-fi" | "warm") => {
    setTheme(newTheme);
    if (user) {
      themeMutation.mutate({ theme: newTheme });
    }
  };

  const textColor = isSciFi ? "#FFFFFF" : "#4A3B32";
  const mutedColor = isSciFi ? "#8A8D99" : "#8B7355";
  const accentColor = isSciFi ? "#00F0FF" : "#6B8E23";
  const cardBg = isSciFi ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)";
  const cardBorder = isSciFi ? "rgba(0,240,255,0.1)" : "rgba(107,142,35,0.15)";

  const displayName = user?.name || user?.username || "TREX";
  const displayInitial = displayName.charAt(0).toUpperCase();
  const learnerType = studyStats?.learnerType || "Visual";
  const dailyGoal = studyStats?.goalHours || 4;
  const todayMinutes = studyStats?.todayMinutes || 0;
  const todayHours = Math.round((todayMinutes / 60) * 10) / 10;
  const streakDays = studyStats?.streakDays || 0;

  const weeklyData = studyStats?.weeklyData || [];
  const maxHours = Math.max(...weeklyData.map((d) => d.hours), 1);

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <motion.div
          className="p-1"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronRight className="w-5 h-5" style={{ color: accentColor }} />
        </motion.div>
        <h2
          className="text-sm font-bold tracking-widest uppercase"
          style={{ color: textColor }}
        >
          Dashboard
        </h2>
      </div>

      {/* Profile Section */}
      <div
        className="rounded-xl p-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: isSciFi
                ? "linear-gradient(135deg, #00F0FF, #2563EB)"
                : "linear-gradient(135deg, #6B8E23, #8FBC8F)",
              color: "#FFFFFF",
            }}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              displayInitial
            )}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: textColor }}>
              {displayName}
            </p>
            <p className="text-xs" style={{ color: mutedColor }}>
              {learnerType} Learner
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: mutedColor }}>
          <Target className="w-3 h-3" />
          <span>Daily Goal: {dailyGoal} hours/day</span>
        </div>
      </div>

      {/* Study Hours Today */}
      <div
        className="rounded-xl p-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4" style={{ color: accentColor }} />
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: textColor }}>
            Study Hours Today
          </h3>
        </div>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-2xl font-bold" style={{ color: accentColor }}>
            {todayHours}
          </span>
          <span className="text-xs mb-1" style={{ color: mutedColor }}>
            / {dailyGoal} hours done
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: isSciFi ? "rgba(0,240,255,0.1)" : "rgba(107,142,35,0.1)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              background: isSciFi
                ? "linear-gradient(90deg, #00F0FF, #2563EB)"
                : "linear-gradient(90deg, #6B8E23, #8FBC8F)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((todayHours / dailyGoal) * 100, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Streak */}
      <div
        className="rounded-xl p-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4" style={{ color: "#f59e0b" }} />
          <span className="text-xs" style={{ color: mutedColor }}>
            Streak:
          </span>
          <span className="text-sm font-bold" style={{ color: "#f59e0b" }}>
            {streakDays} days
          </span>
        </div>
      </div>

      {/* Weekly Chart */}
      <div
        className="rounded-xl p-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: textColor }}>
          This Week
        </h3>
        <div className="flex items-end gap-1.5 h-20">
          {weeklyData.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-t-sm"
                style={{
                  background:
                    day.hours > 0
                      ? isSciFi
                        ? "rgba(0, 240, 255, 0.6)"
                        : "rgba(107, 142, 35, 0.6)"
                      : isSciFi
                        ? "rgba(0, 240, 255, 0.1)"
                        : "rgba(107, 142, 35, 0.1)",
                }}
                initial={{ height: 0 }}
                animate={{ height: `${(day.hours / maxHours) * 60}px` }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
              <span className="text-[10px]" style={{ color: mutedColor }}>
                {day.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Themes */}
      <div
        className="rounded-xl p-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4" style={{ color: accentColor }} />
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: textColor }}>
            Themes
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            onClick={() => handleThemeSwitch("sci-fi")}
            className="rounded-lg p-3 text-center transition-all"
            style={{
              background:
                theme === "sci-fi"
                  ? "rgba(0, 240, 255, 0.15)"
                  : isSciFi
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.03)",
              border:
                theme === "sci-fi"
                  ? "1px solid rgba(0, 240, 255, 0.4)"
                  : `1px solid ${cardBorder}`,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-full h-12 rounded-md mb-2 overflow-hidden">
              <img
                src="/space_galaxy.jpg"
                alt="Cosmos"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className="text-xs font-medium"
              style={{
                color: theme === "sci-fi" ? accentColor : mutedColor,
              }}
            >
              Cosmos
            </span>
          </motion.button>

          <motion.button
            onClick={() => handleThemeSwitch("warm")}
            className="rounded-lg p-3 text-center transition-all"
            style={{
              background:
                theme === "warm"
                  ? isSciFi
                    ? "rgba(255, 183, 197, 0.15)"
                    : "rgba(107, 142, 35, 0.15)"
                  : isSciFi
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.03)",
              border:
                theme === "warm"
                  ? isSciFi
                    ? "1px solid rgba(255, 183, 197, 0.4)"
                    : "1px solid rgba(107, 142, 35, 0.4)"
                  : `1px solid ${cardBorder}`,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-full h-12 rounded-md mb-2 overflow-hidden">
              <img
                src="/warm_scenery.jpg"
                alt="Artsy Bound"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className="text-xs font-medium"
              style={{
                color: theme === "warm" ? (isSciFi ? "#FFB7C5" : "#6B8E23") : mutedColor,
              }}
            >
              Artsy Bound
            </span>
          </motion.button>
        </div>
      </div>

      {/* Your Apps */}
      <div
        className="rounded-xl p-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <div className="flex items-center gap-2 mb-3">
          <LayoutGrid className="w-4 h-4" style={{ color: accentColor }} />
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: textColor }}>
            Your Apps
          </h3>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { name: "WhatsApp", color: "#25D366" },
            { name: "Gmail", color: "#EA4335" },
            { name: "GDrive", color: "#4285F4" },
            { name: "GCalendar", color: "#4285F4" },
          ].map((app) => (
            <motion.button
              key={app.name}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all"
              style={{
                background: isSciFi ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
              }}
              whileHover={{ scale: 1.05, background: `${app.color}15` }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const urls: Record<string, string> = {
                  WhatsApp: "https://web.whatsapp.com",
                  Gmail: "https://mail.google.com",
                  GDrive: "https://drive.google.com",
                  GCalendar: "https://calendar.google.com",
                };
                window.open(urls[app.name], "_blank");
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold"
                style={{ background: `${app.color}20`, color: app.color }}
              >
                {app.name.charAt(0)}
              </div>
              <span className="text-[9px]" style={{ color: mutedColor }}>
                {app.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <motion.button
        onClick={onSettingsClick}
        className="w-full flex items-center gap-2 p-3 rounded-xl transition-all"
        style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Settings className="w-4 h-4" style={{ color: accentColor }} />
        <span className="text-sm" style={{ color: textColor }}>
          Settings
        </span>
      </motion.button>

      {/* Logout */}
      <motion.button
        onClick={() => {
          logout();
          setSidebarOpen(false);
        }}
        className="w-full flex items-center gap-2 p-3 rounded-xl transition-all"
        style={{
          background: "rgba(239, 68, 68, 0.05)",
          border: "1px solid rgba(239, 68, 68, 0.15)",
        }}
        whileHover={{ scale: 1.01, background: "rgba(239, 68, 68, 0.1)" }}
        whileTap={{ scale: 0.99 }}
      >
        <LogOut className="w-4 h-4 text-red-400" />
        <span className="text-sm text-red-400">Logout</span>
      </motion.button>
    </div>
  );
}
