// gameEventsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGameEventsStore = create(
  persist(
    (set, get) => ({
      // Game time tracking
      currentDate: null, // ISO string of current game date
      gameSpeed: 1, // Time multiplier
      gamePhase: "character_creation", // 'character_creation', 'education', 'military', 'early_career', 'mid_career', 'late_career'

      // Random events
      currentEvent: null,
      pastEvents: [],
      eventQueue: [],
      eventHistory: [], // All events that occurred with choices made

      // Energy and stress management
      energy: 100, // 0-100 scale
      stress: 0, // 0-100 scale
      satisfaction: 50, // 0-100 scale
      health: 100, // 0-100 scale

      // Game stats tracking
      stats: {
        daysPlayed: 0,
        totalSalaryEarned: 0,
        jobsApplied: 0,
        jobsAccepted: 0,
        projectsCompleted: 0,
        skillsLearned: 0,
        eventsExperienced: 0,
        decisionsCorrect: 0, // Based on positive outcomes
        decisionsIncorrect: 0, // Based on negative outcomes
      },

      // Action availability flags
      availableActions: {
        applyForJobs: false,
        studyForExams: false,
        developSkills: false,
        networkingEvents: false,
        startProjects: false,
        restAndRecovery: true, // Always available
      },

      // Initialize game state with starting date
      initializeGame: () =>
        set({
          currentDate: new Date().toISOString(), // Start with current real-world date
          gamePhase: "character_creation",
          energy: 100,
          stress: 0,
          satisfaction: 50,
          health: 100,
        }),

      // Advance game time by specified days
      advanceTime: (days) =>
        set((state) => {
          if (!state.currentDate) return state;

          const currentGameDate = new Date(state.currentDate);
          currentGameDate.setDate(currentGameDate.getDate() + days);

          // Adjust stats based on time passing
          // Natural energy recovery and stress reduction when time passes
          let newEnergy = Math.min(100, state.energy + days * 5);
          let newStress = Math.max(0, state.stress - days * 2);

          return {
            currentDate: currentGameDate.toISOString(),
            energy: newEnergy,
            stress: newStress,
            stats: {
              ...state.stats,
              daysPlayed: state.stats.daysPlayed + days,
            },
          };
        }),

      // Set game phase
      setGamePhase: (phase) =>
        set({
          gamePhase: phase,
          // Update available actions based on phase
          availableActions: {
            applyForJobs:
              phase !== "character_creation" && phase !== "education",
            studyForExams: phase === "education",
            developSkills: phase !== "character_creation",
            networkingEvents: phase !== "character_creation",
            startProjects: phase !== "character_creation",
            restAndRecovery: true, // Always available
          },
        }),

      // Queue a new event to be triggered later
      queueEvent: (event, triggerDate) =>
        set((state) => ({
          eventQueue: [
            ...state.eventQueue,
            {
              ...event,
              triggerDate: triggerDate || state.currentDate,
            },
          ],
        })),

      // Trigger an immediate event
      triggerEvent: (event) =>
        set((state) => ({
          currentEvent: event,
          stats: {
            ...state.stats,
            eventsExperienced: state.stats.eventsExperienced + 1,
          },
        })),

      // Process event queue to check for triggerable events
      processEventQueue: () =>
        set((state) => {
          if (!state.currentDate || state.currentEvent) return state;

          const currentGameDate = new Date(state.currentDate);

          // Find events that should trigger now
          const triggeredEvents = state.eventQueue.filter((event) => {
            const eventDate = new Date(event.triggerDate);
            return eventDate <= currentGameDate;
          });

          // Filter out events that have been triggered
          const remainingEvents = state.eventQueue.filter((event) => {
            const eventDate = new Date(event.triggerDate);
            return eventDate > currentGameDate;
          });

          // If we have events to trigger, trigger the first one
          if (triggeredEvents.length > 0) {
            return {
              currentEvent: triggeredEvents[0],
              eventQueue: remainingEvents,
              stats: {
                ...state.stats,
                eventsExperienced: state.stats.eventsExperienced + 1,
              },
            };
          }

          return { eventQueue: remainingEvents };
        }),

      // Complete the current event with a choice
      completeEvent: (choiceIndex, outcome) =>
        set((state) => {
          if (!state.currentEvent) return state;

          const completedEvent = {
            ...state.currentEvent,
            choiceMade: choiceIndex,
            outcome,
            dateCompleted: new Date().toISOString(),
          };

          // Track if decision was good or bad based on outcome
          let decisionsCorrect = state.stats.decisionsCorrect;
          let decisionsIncorrect = state.stats.decisionsIncorrect;

          if (outcome && outcome.type === "positive") {
            decisionsCorrect += 1;
          } else if (outcome && outcome.type === "negative") {
            decisionsIncorrect += 1;
          }

          return {
            currentEvent: null,
            pastEvents: [...state.pastEvents, completedEvent],
            eventHistory: [...state.eventHistory, completedEvent],
            stats: {
              ...state.stats,
              decisionsCorrect,
              decisionsIncorrect,
            },
          };
        }),

      // Modify character energy levels
      modifyEnergy: (amount) =>
        set((state) => ({
          energy: Math.max(0, Math.min(100, state.energy + amount)),
        })),

      // Modify character stress levels
      modifyStress: (amount) =>
        set((state) => ({
          stress: Math.max(0, Math.min(100, state.stress + amount)),
        })),

      // Modify character satisfaction
      modifySatisfaction: (amount) =>
        set((state) => ({
          satisfaction: Math.max(0, Math.min(100, state.satisfaction + amount)),
        })),

      // Modify character health
      modifyHealth: (amount) =>
        set((state) => ({
          health: Math.max(0, Math.min(100, state.health + amount)),
        })),

      // Rest and recover (reduces stress, increases energy)
      restAndRecover: (days) =>
        set((state) => {
          // Calculate recovery effects
          const energyRecovery = Math.min(days * 15, 100 - state.energy);
          const stressReduction = Math.min(days * 10, state.stress);

          // Apply changes and advance time
          const currentGameDate = new Date(state.currentDate);
          currentGameDate.setDate(currentGameDate.getDate() + days);

          return {
            currentDate: currentGameDate.toISOString(),
            energy: state.energy + energyRecovery,
            stress: state.stress - stressReduction,
            stats: {
              ...state.stats,
              daysPlayed: state.stats.daysPlayed + days,
            },
          };
        }),

      // Update a specific game stat
      updateStat: (statName, value) =>
        set((state) => ({
          stats: {
            ...state.stats,
            [statName]:
              typeof value === "function"
                ? value(state.stats[statName])
                : value,
          },
        })),

      // Reset game events to default state
      resetGameEvents: () =>
        set({
          currentDate: null,
          gameSpeed: 1,
          gamePhase: "character_creation",
          currentEvent: null,
          pastEvents: [],
          eventQueue: [],
          eventHistory: [],
          energy: 100,
          stress: 0,
          satisfaction: 50,
          health: 100,
          stats: {
            daysPlayed: 0,
            totalSalaryEarned: 0,
            jobsApplied: 0,
            jobsAccepted: 0,
            projectsCompleted: 0,
            skillsLearned: 0,
            eventsExperienced: 0,
            decisionsCorrect: 0,
            decisionsIncorrect: 0,
          },
          availableActions: {
            applyForJobs: false,
            studyForExams: false,
            developSkills: false,
            networkingEvents: false,
            startProjects: false,
            restAndRecovery: true,
          },
        }),
    }),
    {
      name: "azerbaijan-it-sim-game-events",
      getStorage: () => localStorage,
    }
  )
);
