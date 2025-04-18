// settingsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set) => ({
      // Game preferences
      difficulty: "normal", // 'easy', 'normal', 'hard', 'realistic'
      language: "azerbaijani", // 'azerbaijani', 'english'
      soundEffects: true,
      music: true,
      notifications: true,
      darkMode: false,
      autosave: true,
      autosaveInterval: 5, // minutes

      // UI preferences
      textSize: "medium", // 'small', 'medium', 'large'
      animationsEnabled: true,
      highContrastMode: false,

      // Game configuration
      gameSpeed: 1, // Time progression multiplier

      // Actions
      setDifficulty: (difficulty) => set({ difficulty }),

      setLanguage: (language) => set({ language }),

      toggleSoundEffects: () =>
        set((state) => ({
          soundEffects: !state.soundEffects,
        })),

      toggleMusic: () =>
        set((state) => ({
          music: !state.music,
        })),

      toggleNotifications: () =>
        set((state) => ({
          notifications: !state.notifications,
        })),

      toggleDarkMode: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),

      toggleAutosave: () =>
        set((state) => ({
          autosave: !state.autosave,
        })),

      setAutosaveInterval: (minutes) =>
        set({
          autosaveInterval: minutes,
        }),

      setTextSize: (size) => set({ textSize: size }),

      toggleAnimations: () =>
        set((state) => ({
          animationsEnabled: !state.animationsEnabled,
        })),

      toggleHighContrastMode: () =>
        set((state) => ({
          highContrastMode: !state.highContrastMode,
        })),

      setGameSpeed: (speed) => set({ gameSpeed: speed }),

      // Reset to default settings
      resetSettings: () =>
        set({
          difficulty: "normal",
          language: "azerbaijani",
          soundEffects: true,
          music: true,
          notifications: true,
          darkMode: false,
          autosave: true,
          autosaveInterval: 5,
          textSize: "medium",
          animationsEnabled: true,
          highContrastMode: false,
          gameSpeed: 1,
        }),
    }),
    {
      name: "azerbaijan-it-sim-settings",
      getStorage: () => localStorage,
    }
  )
);
