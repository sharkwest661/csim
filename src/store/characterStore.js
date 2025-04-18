// characterStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCharacterStore = create(
  persist(
    (set, get) => ({
      // Character basics
      name: "",
      gender: null, // 'male' or 'female'
      familyBackground: null, // 'lower', 'middle', or 'higher'
      hometown: "Baku", // Default hometown

      // Core attributes (1-10 scale, total 30 points)
      attributes: {
        intelligence: 5,
        creativity: 5,
        charisma: 5,
        discipline: 5,
        adaptability: 5,
        stress_resistance: 5,
      },

      // Connections (points distribution across sectors)
      connections: {
        academic: 0,
        industry: 0,
        government: 0,
        entrepreneurial: 0,
      },

      // Skills (1-5 scale, total 20 points)
      skills: {
        // Technical skills
        programming_fundamentals: 1,
        web_development: 1,
        mobile_development: 1,
        database_management: 1,
        networking: 1,
        cybersecurity_basics: 1,

        // Language proficiency
        english: 1,
        russian: 1,
        turkish: 1,
        azerbaijani: 5, // Natives start with level 5

        // Soft skills
        communication: 1,
        time_management: 1,
        teamwork: 1,
        critical_thinking: 1,
        technical_writing: 1,

        // Business skills
        project_management: 1,
        business_fundamentals: 1,
        financial_literacy: 1,
        marketing_basics: 1,
      },

      // Character state flags
      isCreated: false,
      isInUniversity: false,
      isInMilitaryService: false,
      isEmployed: false,

      // Character creation actions
      setName: (name) => set({ name }),

      setGender: (gender) => set({ gender }),

      setFamilyBackground: (background) =>
        set({ familyBackground: background }),

      setHometown: (hometown) => set({ hometown }),

      setAttribute: (attribute, value) =>
        set((state) => ({
          attributes: {
            ...state.attributes,
            [attribute]: value,
          },
        })),

      setConnection: (connectionType, value) =>
        set((state) => ({
          connections: {
            ...state.connections,
            [connectionType]: value,
          },
        })),

      setSkill: (skill, value) =>
        set((state) => ({
          skills: {
            ...state.skills,
            [skill]: value,
          },
        })),

      // Calculate total attribute points
      getTotalAttributePoints: () => {
        const attrs = get().attributes;
        return Object.values(attrs).reduce((sum, val) => sum + val, 0);
      },

      // Calculate total skill points
      getTotalSkillPoints: () => {
        const skills = get().skills;
        // Exclude azerbaijani language which starts at 5
        const sum = Object.entries(skills).reduce((total, [key, value]) => {
          if (key === "azerbaijani") return total;
          return total + value - 1; // Subtract 1 because skills start at 1, not 0
        }, 0);
        return sum;
      },

      // Complete character creation
      finalizeCharacter: () => set({ isCreated: true }),

      // Reset character to default values
      resetCharacter: () =>
        set({
          name: "",
          gender: null,
          familyBackground: null,
          hometown: "Baku",
          attributes: {
            intelligence: 5,
            creativity: 5,
            charisma: 5,
            discipline: 5,
            adaptability: 5,
            stress_resistance: 5,
          },
          connections: {
            academic: 0,
            industry: 0,
            government: 0,
            entrepreneurial: 0,
          },
          skills: {
            programming_fundamentals: 1,
            web_development: 1,
            mobile_development: 1,
            database_management: 1,
            networking: 1,
            cybersecurity_basics: 1,
            english: 1,
            russian: 1,
            turkish: 1,
            azerbaijani: 5,
            communication: 1,
            time_management: 1,
            teamwork: 1,
            critical_thinking: 1,
            technical_writing: 1,
            project_management: 1,
            business_fundamentals: 1,
            financial_literacy: 1,
            marketing_basics: 1,
          },
          isCreated: false,
          isInUniversity: false,
          isInMilitaryService: false,
          isEmployed: false,
        }),
    }),
    {
      name: "azerbaijan-it-sim-character",
      getStorage: () => localStorage,
    }
  )
);
