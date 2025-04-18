// gameStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Import other stores
import { useCharacterStore } from "./characterStore";
import { useEducationStore } from "./educationStore";
import { useCareerStore } from "./careerStore";
import { useResumeStore } from "./resumeStore";
import { useGameEventsStore } from "./gameEventsStore";
import { useSettingsStore } from "./settingsStore";

export const useGameStore = create(
  persist(
    (set, get) => ({
      // Game metadata
      gameStarted: false,
      gameId: null, // Unique identifier for this playthrough
      lastSaved: null,
      currentStage: "character_creation", // 'character_creation', 'education', 'military', 'career', 'game_over'

      // Game actions

      // Initialize a new game
      startNewGame: () => {
        // Generate a unique game ID
        const gameId = `game_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // Reset all stores to their initial state
        useCharacterStore.getState().resetCharacter();
        useEducationStore.getState().resetEducation();
        useCareerStore.getState().resetCareer();
        useResumeStore.getState().resetResume();
        useGameEventsStore.getState().resetGameEvents();

        // Initialize game events
        useGameEventsStore.getState().initializeGame();

        // Set initial game state
        set({
          gameStarted: true,
          gameId,
          lastSaved: new Date().toISOString(),
          currentStage: "character_creation",
        });
      },

      // Save the current game state
      saveGame: () =>
        set({
          lastSaved: new Date().toISOString(),
        }),

      // Advance to the next game stage
      advanceStage: (nextStage) => {
        const validStages = [
          "character_creation",
          "education",
          "military",
          "career",
          "game_over",
        ];

        if (!validStages.includes(nextStage)) {
          console.error(`Invalid game stage: ${nextStage}`);
          return;
        }

        // Perform stage-specific transitions
        if (nextStage === "education") {
          // Character creation is complete, education begins
          useCharacterStore.getState().finalizeCharacter();
          useGameEventsStore.getState().setGamePhase("education");
        } else if (nextStage === "military") {
          // Education complete, military service begins (for male characters)
          const gender = useCharacterStore.getState().gender;

          if (gender === "male") {
            // Initialize military service
            const serviceDetails = {
              branch: "Army", // Default, could be randomized or chosen
              unit: "IT Department",
              rank: "Private",
            };
            useCareerStore.getState().startMilitaryService(serviceDetails);
            useGameEventsStore.getState().setGamePhase("military");
          } else {
            // Skip military for female characters, go straight to career
            set({ currentStage: "career" });
            useGameEventsStore.getState().setGamePhase("early_career");
            return;
          }
        } else if (nextStage === "career") {
          // Military or education complete, career begins
          if (
            useCharacterStore.getState().gender === "male" &&
            nextStage === "career" &&
            get().currentStage === "military"
          ) {
            // Complete military service
            useCareerStore.getState().completeMilitaryService({
              rank: "Corporal",
              commendations: ["Service Excellence"],
            });
          }

          useGameEventsStore.getState().setGamePhase("early_career");

          // Sync resume with all accumulated data
          const character = useCharacterStore.getState();
          const education = useEducationStore.getState();
          const career = useCareerStore.getState();

          useResumeStore.getState().syncFromCharacter(character);
          useResumeStore.getState().syncFromEducation(education);
          useResumeStore.getState().syncFromCareer(career);
          useResumeStore.getState().calculateResumeQuality();
        }

        // Update the current stage
        set({
          currentStage: nextStage,
          lastSaved: new Date().toISOString(),
        });
      },

      // Process a game day - handles events, status changes, etc.
      processGameDay: () => {
        // Advance game time by 1 day
        useGameEventsStore.getState().advanceTime(1);

        // Process any pending events
        useGameEventsStore.getState().processEventQueue();

        // Perform stage-specific daily processing
        const currentStage = get().currentStage;

        if (currentStage === "education") {
          // Education-specific daily processing
          // e.g., progress in courses, random study events
        } else if (currentStage === "military") {
          // Military-specific daily processing
          // e.g., skill changes, service events
        } else if (currentStage === "career") {
          // Career-specific daily processing
          // e.g., job performance, workplace events
        }

        // Auto-save if enabled
        const settings = useSettingsStore.getState();
        if (settings.autosave) {
          set({ lastSaved: new Date().toISOString() });
        }
      },

      // Process a game week (7 days)
      processGameWeek: () => {
        // Call processGameDay 7 times
        for (let i = 0; i < 7; i++) {
          get().processGameDay();
        }
      },

      // Process a game month (30 days)
      processGameMonth: () => {
        // Call processGameDay 30 times
        for (let i = 0; i < 30; i++) {
          get().processGameDay();
        }

        // Monthly events like salary, rent, etc.
        const currentStage = get().currentStage;

        if (currentStage === "career") {
          // Add monthly salary
          const career = useCareerStore.getState();
          if (career.currentJob && career.salary > 0) {
            useGameEventsStore
              .getState()
              .updateStat("totalSalaryEarned", (prev) => prev + career.salary);
          }
        }
      },

      // Process a semester (for education stage)
      processSemester: () => {
        if (get().currentStage !== "education") return;

        // Process approximately 4 months of game time
        for (let i = 0; i < 120; i++) {
          get().processGameDay();
        }

        // Advance semester in education store
        useEducationStore.getState().advanceSemester();

        // Check if education is complete
        if (useEducationStore.getState().isGraduated) {
          // Move to military or career based on gender
          const gender = useCharacterStore.getState().gender;
          get().advanceStage(gender === "male" ? "military" : "career");
        }
      },

      // Initialize resume with character data
      syncResume: () => {
        const character = useCharacterStore.getState();
        const education = useEducationStore.getState();
        const career = useCareerStore.getState();

        useResumeStore.getState().syncFromCharacter(character);
        useResumeStore.getState().syncFromEducation(education);
        useResumeStore.getState().syncFromCareer(career);
        useResumeStore.getState().calculateResumeQuality();
      },

      // End game and show results
      endGame: (reason) =>
        set({
          currentStage: "game_over",
          gameEnded: true,
          gameEndReason: reason,
          lastSaved: new Date().toISOString(),
        }),

      // Reset entire game state
      resetGame: () => {
        // Reset all individual stores
        useCharacterStore.getState().resetCharacter();
        useEducationStore.getState().resetEducation();
        useCareerStore.getState().resetCareer();
        useResumeStore.getState().resetResume();
        useGameEventsStore.getState().resetGameEvents();

        // Reset game store
        set({
          gameStarted: false,
          gameId: null,
          lastSaved: null,
          currentStage: "character_creation",
          gameEnded: false,
          gameEndReason: null,
        });
      },
    }),
    {
      name: "azerbaijan-it-sim-game",
      getStorage: () => localStorage,
    }
  )
);
