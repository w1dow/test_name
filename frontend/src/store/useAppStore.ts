import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeType = "sci-fi" | "warm";
export type CatState = "idle" | "sleep" | "play" | "alert";
export type PanelType = "dashboard" | "settings" | null;

interface AppState {
  // Theme
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Active Panel
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;

  // Cat State
  catState: CatState;
  setCatState: (state: CatState) => void;
  lastActiveTime: number;
  updateLastActive: () => void;

  // Study Session
  studySessionActive: boolean;
  studySessionStart: Date | null;
  studyMinutesToday: number;
  startStudySession: () => void;
  endStudySession: () => void;
  setStudyMinutesToday: (minutes: number) => void;

  // App State
  hasSeenIntro: boolean;
  setHasSeenIntro: (seen: boolean) => void;
  isAuthenticated: boolean;
  setAuthenticated: (val: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      theme: "sci-fi",
      setTheme: (theme) => set({ theme }),

      // Sidebar
      sidebarOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Active Panel
      activePanel: null,
      setActivePanel: (panel) => set({ activePanel: panel }),

      // Cat State
      catState: "idle",
      setCatState: (catState) => set({ catState }),
      lastActiveTime: Date.now(),
      updateLastActive: () => set({ lastActiveTime: Date.now() }),

      // Study Session
      studySessionActive: false,
      studySessionStart: null,
      studyMinutesToday: 0,
      startStudySession: () =>
        set({ studySessionActive: true, studySessionStart: new Date() }),
      endStudySession: () =>
        set({ studySessionActive: false, studySessionStart: null }),
      setStudyMinutesToday: (minutes) => set({ studyMinutesToday: minutes }),

      // App State
      hasSeenIntro: false,
      setHasSeenIntro: (seen) => set({ hasSeenIntro: seen }),
      isAuthenticated: false,
      setAuthenticated: (val) => set({ isAuthenticated: val }),
    }),
    {
      name: "lumis-store",
      partialize: (state) => ({
        theme: state.theme,
        hasSeenIntro: state.hasSeenIntro,
      }),
    }
  )
);
