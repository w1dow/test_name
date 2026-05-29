import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Settings as SettingsIcon,
  BookOpen,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";

interface SettingsPanelProps {
  onBack: () => void;
}

export default function SettingsPanel({ onBack }: SettingsPanelProps) {
  const theme = useAppStore((s) => s.theme);
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const isSciFi = theme === "sci-fi";

  const name = user?.name || "";
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [learnerType, setLearnerType] = useState<
    "Visual" | "Auditory" | "Kinesthetic" | "Reading/Writing"
  >((user?.learnerType as "Visual") || "Visual");
  const [studyGoal, setStudyGoal] = useState(
    user?.studyGoalHours?.toString() || "4"
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate();
    },
  });

  const textColor = isSciFi ? "#FFFFFF" : "#4A3B32";
  const mutedColor = isSciFi ? "#8A8D99" : "#8B7355";
  const accentColor = isSciFi ? "#00F0FF" : "#6B8E23";
  const cardBg = isSciFi ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)";
  const cardBorder = isSciFi ? "rgba(0,240,255,0.1)" : "rgba(107,142,35,0.15)";
  const inputBg = isSciFi ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.5)";
  const inputBorder = isSciFi ? "rgba(255,255,255,0.1)" : "rgba(107,142,35,0.15)";

  const displayInitial = (name || username || "T").charAt(0).toUpperCase();

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMutation.mutateAsync({
        name: name || undefined,
        username: username || undefined,
        email: email || undefined,
        phone: phone || undefined,
        learnerType,
        studyGoalHours: parseFloat(studyGoal) || 4,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Error handled by mutation
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <motion.button
          onClick={onBack}
          className="p-1 rounded-lg transition-all"
          style={{
            background: isSciFi ? "rgba(0,240,255,0.1)" : "rgba(107,142,35,0.1)",
            color: accentColor,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4" />
        </motion.button>
        <SettingsIcon className="w-4 h-4" style={{ color: accentColor }} />
        <h2
          className="text-sm font-bold tracking-widest uppercase"
          style={{ color: textColor }}
        >
          Settings
        </h2>
      </div>

      {/* Edit Profile */}
      <div
        className="rounded-xl p-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <h3
          className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ color: textColor }}
        >
          Edit Profile
        </h3>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
            style={{
              background: isSciFi
                ? "linear-gradient(135deg, #00F0FF, #2563EB)"
                : "linear-gradient(135deg, #6B8E23, #8FBC8F)",
              color: "#FFFFFF",
              boxShadow: isSciFi
                ? "0px 0px 15px rgba(0, 240, 255, 0.3)"
                : "0px 4px 15px rgba(107, 142, 35, 0.2)",
            }}
          >
            {displayInitial}
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-3">
          <div>
            <label className="text-xs block mb-1" style={{ color: mutedColor }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg text-sm outline-none transition-all focus:ring-1"
              style={{
                background: inputBg,
                border: `1px solid ${inputBorder}`,
                color: textColor,
              }}
            />
          </div>

          <div>
            <label className="text-xs block mb-1" style={{ color: mutedColor }}>
              Email ID
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg text-sm outline-none transition-all focus:ring-1"
              style={{
                background: inputBg,
                border: `1px solid ${inputBorder}`,
                color: textColor,
              }}
            />
          </div>

          <div>
            <label className="text-xs block mb-1" style={{ color: mutedColor }}>
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg text-sm outline-none transition-all focus:ring-1"
              style={{
                background: inputBg,
                border: `1px solid ${inputBorder}`,
                color: textColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* Learner Profile */}
      <div
        className="rounded-xl p-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4" style={{ color: accentColor }} />
          <h3
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: textColor }}
          >
            Learner Profile
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs block mb-1" style={{ color: mutedColor }}>
              Learner Type
            </label>
            <select
              value={learnerType}
              onChange={(e) =>
                setLearnerType(
                  e.target.value as "Visual" | "Auditory" | "Kinesthetic" | "Reading/Writing"
                )
              }
              className="w-full py-2.5 px-3 rounded-lg text-sm outline-none transition-all appearance-none cursor-pointer"
              style={{
                background: inputBg,
                border: `1px solid ${inputBorder}`,
                color: textColor,
              }}
            >
              <option value="Visual">Visual</option>
              <option value="Auditory">Auditory</option>
              <option value="Kinesthetic">Kinesthetic</option>
              <option value="Reading/Writing">Reading/Writing</option>
            </select>
          </div>

          <div>
            <label className="text-xs block mb-1" style={{ color: mutedColor }}>
              Study Hours Goal
            </label>
            <select
              value={studyGoal}
              onChange={(e) => setStudyGoal(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg text-sm outline-none transition-all appearance-none cursor-pointer"
              style={{
                background: inputBg,
                border: `1px solid ${inputBorder}`,
                color: textColor,
              }}
            >
              <option value="2">2 hours/day</option>
              <option value="4">4 hours/day</option>
              <option value="6">6 hours/day</option>
              <option value="8">8 hours/day</option>
              <option value="10">10+ hours/day</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 rounded-xl font-medium text-sm text-white transition-all flex items-center justify-center gap-2"
        style={{
          background: saved
            ? "rgba(34, 197, 94, 0.8)"
            : "linear-gradient(135deg, #00F0FF, #2563EB)",
          boxShadow: "0px 0px 15px rgba(0, 240, 255, 0.2)",
        }}
        whileHover={{ scale: saving ? 1 : 1.02 }}
        whileTap={{ scale: saving ? 1 : 0.98 }}
      >
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
      </motion.button>
    </div>
  );
}
