// educationStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

// List of available courses by semester
const availableCourses = {
  1: [
    {
      id: "cs101",
      name: "Introduction to Programming",
      credits: 3,
      difficulty: 1,
    },
    { id: "math101", name: "Calculus I", credits: 4, difficulty: 2 },
    { id: "eng101", name: "English Composition", credits: 3, difficulty: 1 },
    { id: "phys101", name: "Physics I", credits: 4, difficulty: 2 },
  ],
  2: [
    { id: "cs102", name: "Data Structures", credits: 3, difficulty: 2 },
    { id: "math102", name: "Calculus II", credits: 4, difficulty: 3 },
    { id: "db101", name: "Database Fundamentals", credits: 3, difficulty: 2 },
    { id: "net101", name: "Networking Basics", credits: 3, difficulty: 2 },
  ],
  3: [
    { id: "cs201", name: "Algorithms", credits: 4, difficulty: 3 },
    { id: "web101", name: "Web Development", credits: 3, difficulty: 2 },
    { id: "sys101", name: "Operating Systems", credits: 3, difficulty: 3 },
    { id: "stat201", name: "Statistics for CS", credits: 3, difficulty: 2 },
  ],
  4: [
    { id: "cs202", name: "Software Engineering", credits: 4, difficulty: 3 },
    { id: "ai201", name: "Artificial Intelligence", credits: 3, difficulty: 4 },
    { id: "sec201", name: "Cybersecurity Basics", credits: 3, difficulty: 3 },
    { id: "mob201", name: "Mobile App Development", credits: 3, difficulty: 3 },
  ],
  5: [
    { id: "cs301", name: "Advanced Programming", credits: 4, difficulty: 4 },
    { id: "cloud301", name: "Cloud Computing", credits: 3, difficulty: 3 },
    { id: "data301", name: "Data Science", credits: 4, difficulty: 4 },
    { id: "proj301", name: "Project Management", credits: 3, difficulty: 2 },
  ],
  6: [
    { id: "cs401", name: "Capstone Project", credits: 6, difficulty: 5 },
    { id: "ml401", name: "Machine Learning", credits: 4, difficulty: 5 },
    { id: "eth401", name: "Ethics in Computing", credits: 2, difficulty: 1 },
    {
      id: "startup401",
      name: "Tech Entrepreneurship",
      credits: 3,
      difficulty: 3,
    },
  ],
};

// Universities available in the game
const universities = [
  {
    id: "ada",
    name: "ADA University",
    prestigeRating: 10,
    description:
      "A modern university with international standards and English-language instruction.",
    entranceThreshold: 650,
    tuition: 7500,
  },
  {
    id: "bsu",
    name: "Baku State University",
    prestigeRating: 9,
    description:
      "The largest university in Azerbaijan with strong academic traditions and research focus.",
    entranceThreshold: 600,
    tuition: 2200,
  },
  {
    id: "asoiu",
    name: "Azerbaijan State Oil and Industry University",
    prestigeRating: 8,
    description:
      "One of the oldest technical universities in Azerbaijan, focusing on engineering and technology.",
    entranceThreshold: 550,
    tuition: 2000,
  },
  {
    id: "beu",
    name: "Baku Engineering University",
    prestigeRating: 7,
    description:
      "A specialized engineering university with modern facilities and industry connections.",
    entranceThreshold: 500,
    tuition: 1900,
  },
  {
    id: "regional",
    name: "Regional Technical College",
    prestigeRating: 5,
    description:
      "A local college offering basic technical education and IT training.",
    entranceThreshold: 400,
    tuition: 1000,
  },
];

// Degree programs available in the game
const degreePrograms = [
  {
    id: "cs",
    name: "Computer Science",
    description:
      "Focus on theoretical foundations of computing and practical programming skills.",
  },
  {
    id: "se",
    name: "Software Engineering",
    description:
      "Focus on software development methodologies and large-scale project management.",
  },
  {
    id: "it",
    name: "Information Technology",
    description:
      "Broad training in computer systems, networks, and business applications.",
  },
  {
    id: "is",
    name: "Information Security",
    description:
      "Focus on cybersecurity, cryptography, and secure software development.",
  },
];

// Random events that can occur during university
const educationEvents = [
  {
    id: "hackathon",
    title: "Local Hackathon",
    description:
      "A 48-hour hackathon is being organized on campus. Participating could enhance your skills and resume but might affect your study time.",
    options: [
      {
        label: "Participate",
        effect: (state) => {
          return {
            energy: state.energy - 20,
            skills: {
              ...state.skills,
              programming: state.skills.programming + 5,
              teamwork: state.skills.teamwork + 3,
            },
            resume: {
              ...state.resume,
              projects: [
                ...state.resume.projects,
                {
                  name: "Campus Hackathon Project",
                  description: "Participated in a 48-hour hackathon",
                  skills: ["teamwork", "problem-solving", "programming"],
                },
              ],
            },
          };
        },
      },
      {
        label: "Skip it",
        effect: (state) => {
          return {
            energy: state.energy + 5,
          };
        },
      },
    ],
  },
  {
    id: "research",
    title: "Research Opportunity",
    description:
      "A professor has invited you to join their research project. This would be great for your resume but demands significant time.",
    options: [
      {
        label: "Accept offer",
        effect: (state) => {
          return {
            energy: state.energy - 15,
            skills: {
              ...state.skills,
              research: state.skills.research + 8,
              criticalThinking: state.skills.criticalThinking + 4,
            },
            resume: {
              ...state.resume,
              research: [
                ...state.resume.research,
                {
                  name: "University Research Assistant",
                  description: "Assisted in faculty research project",
                  skills: ["research", "critical thinking", "academic writing"],
                },
              ],
            },
          };
        },
      },
      {
        label: "Decline politely",
        effect: (state) => {
          return {
            energy: state.energy + 5,
          };
        },
      },
    ],
  },
  {
    id: "internship",
    title: "Summer Internship Opportunity",
    description:
      "A tech company is offering summer internships. Applying would require preparing your resume and going through interviews.",
    options: [
      {
        label: "Apply for internship",
        effect: (state) => {
          return {
            energy: state.energy - 10,
            resume: {
              ...state.resume,
              internships: [
                ...state.resume.internships,
                {
                  name: "Summer Tech Internship",
                  description:
                    "Interned at a local tech company during summer break",
                  skills: [
                    "professional experience",
                    "industry knowledge",
                    "practical application",
                  ],
                },
              ],
            },
          };
        },
      },
      {
        label: "Focus on studies",
        effect: (state) => {
          return {
            energy: state.energy + 5,
            skills: {
              ...state.skills,
              academicKnowledge: state.skills.academicKnowledge + 3,
            },
          };
        },
      },
    ],
  },
];

// Grade point values
const gradePoints = {
  A: 4.0,
  B: 3.0,
  C: 2.0,
  D: 1.0,
  F: 0.0,
};

export const useEducationStore = create(
  persist(
    (set, get) => ({
      // Pre-university examination
      hasCompletedEntranceExam: false,
      entranceExamScore: 0,
      subjectBreakdown: {},
      preparatoryCourses: [],

      // University selection
      universityId: null,
      university: null,
      degreeProgram: null,
      specialization: null,
      isEnrolled: false,

      // Current semester (1-8)
      currentSemester: 1,
      totalSemesters: 8,

      // Selected courses for current semester
      selectedCourses: [],

      // All grades by course ID
      courseGrades: {},

      // Available time units to allocate per semester
      timeUnits: 10,

      // Allocated time activities
      allocatedTime: {
        study: 0,
        skillDevelopment: 0,
        networking: 0,
        partTimeWork: 0,
        extracurricular: 0,
      },

      // Current GPA
      gpa: 0,

      // Academic achievements
      achievements: {
        deansList: false,
        scholarships: [],
        awards: [],
      },

      // Graduation status
      isGraduated: false,
      expectedGraduationDate: null,
      actualGraduationDate: null,
      finalThesis: null,

      // Energy level (0-100)
      energy: 100,

      // Skills gained through education
      skills: {
        programming: 0,
        mathematics: 0,
        communication: 0,
        teamwork: 0,
        problemSolving: 0,
        research: 0,
        criticalThinking: 0,
        academicKnowledge: 0,
      },

      // Resume elements from education
      resume: {
        projects: [],
        research: [],
        internships: [],
        awards: [],
      },

      // Currently active event (if any)
      activeEvent: null,

      // History of completed semesters
      semesterHistory: [],

      // Actions

      // Set entrance exam score and mark as completed
      setEntranceExamScore: (score) =>
        set({
          entranceExamScore: score,
          hasCompletedEntranceExam: true,
        }),

      // Set subject breakdown from entrance exam
      setSubjectBreakdown: (breakdown) =>
        set({
          subjectBreakdown: breakdown,
        }),

      // Set selected university
      setUniversity: (universityId) => {
        const university = universities.find((u) => u.id === universityId);
        if (university) {
          set({
            universityId,
            university: university.name,
            isEnrolled: true,
          });
        }
      },

      // Set degree program
      setDegreeProgram: (programId) => {
        const program = degreePrograms.find((p) => p.id === programId);
        if (program) {
          set({
            degreeProgram: program.name,
          });
        }
      },

      // Set specialization within degree program
      setSpecialization: (specialization) =>
        set({
          specialization,
        }),

      // Get available courses for current semester
      getAvailableCourses: () => {
        const semester = get().currentSemester;
        return availableCourses[semester] || [];
      },

      // Get available universities based on entrance exam score
      getAvailableUniversities: () => {
        const score = get().entranceExamScore;
        return universities.filter((u) => score >= u.entranceThreshold);
      },

      // Select courses for the current semester
      selectCourses: (courseIds) => {
        const availableCourses = get().getAvailableCourses();
        const selectedCourses = availableCourses.filter((course) =>
          courseIds.includes(course.id)
        );

        set({ selectedCourses });
      },

      // Allocate time to different activities
      allocateTime: (allocation) => {
        // Ensure total doesn't exceed available time units
        const total = Object.values(allocation).reduce(
          (sum, val) => sum + val,
          0
        );
        const timeUnits = get().timeUnits;

        if (total <= timeUnits) {
          set({ allocatedTime: allocation });
          return true;
        }
        return false;
      },

      // Complete a course with a specific grade
      completeCourse: (courseId, grade) => {
        set((state) => {
          const newCourseGrades = {
            ...state.courseGrades,
            [courseId]: grade,
          };

          // Recalculate GPA
          let totalPoints = 0;
          let totalCredits = 0;

          Object.entries(newCourseGrades).forEach(([id, grade]) => {
            // Find the course to get its credits
            let course;
            for (let sem = 1; sem <= state.currentSemester; sem++) {
              const semCourses = availableCourses[sem] || [];
              const found = semCourses.find((c) => c.id === id);
              if (found) {
                course = found;
                break;
              }
            }

            if (course) {
              totalPoints += gradePoints[grade] * course.credits;
              totalCredits += course.credits;
            }
          });

          const newGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

          return {
            courseGrades: newCourseGrades,
            gpa: parseFloat(newGPA.toFixed(2)),
          };
        });
      },

      // Advance to the next semester
      advanceSemester: () => {
        set((state) => {
          // Store current semester in history
          const semesterRecord = {
            semester: state.currentSemester,
            gpa: state.gpa,
            courses: state.selectedCourses.map((course) => ({
              ...course,
              grade: state.courseGrades[course.id] || "Incomplete",
            })),
            allocatedTime: state.allocatedTime,
          };

          // Check for achievements
          let achievements = { ...state.achievements };
          if (state.gpa >= 3.5) {
            achievements.deansList = true;
          }

          // Apply skill gains based on time allocation
          const skillGains = {
            study: { academicKnowledge: state.allocatedTime.study * 0.5 },
            skillDevelopment: {
              programming: state.allocatedTime.skillDevelopment * 0.3,
              problemSolving: state.allocatedTime.skillDevelopment * 0.2,
            },
            networking: {
              communication: state.allocatedTime.networking * 0.3,
              teamwork: state.allocatedTime.networking * 0.2,
            },
            partTimeWork: {
              programming: state.allocatedTime.partTimeWork * 0.1,
              communication: state.allocatedTime.partTimeWork * 0.1,
            },
            extracurricular: {
              teamwork: state.allocatedTime.extracurricular * 0.2,
              criticalThinking: state.allocatedTime.extracurricular * 0.1,
            },
          };

          let updatedSkills = { ...state.skills };
          Object.entries(skillGains).forEach(([activity, gains]) => {
            Object.entries(gains).forEach(([skill, value]) => {
              if (updatedSkills[skill] !== undefined) {
                updatedSkills[skill] += value;
              }
            });
          });

          // Trigger a random event (30% chance)
          let activeEvent = null;
          if (Math.random() < 0.3) {
            const randomIndex = Math.floor(
              Math.random() * educationEvents.length
            );
            activeEvent = educationEvents[randomIndex];
          }

          // Check if graduation conditions are met
          const newSemester = state.currentSemester + 1;
          let isGraduated = false;
          let actualGraduationDate = null;

          if (newSemester > state.totalSemesters) {
            isGraduated = true;
            actualGraduationDate = new Date().toISOString();
          }

          return {
            currentSemester: newSemester,
            selectedCourses: [],
            allocatedTime: {
              study: 0,
              skillDevelopment: 0,
              networking: 0,
              partTimeWork: 0,
              extracurricular: 0,
            },
            semesterHistory: [...state.semesterHistory, semesterRecord],
            achievements,
            skills: updatedSkills,
            energy: Math.min(state.energy + 20, 100), // Recover some energy between semesters
            activeEvent,
            isGraduated,
            actualGraduationDate,
          };
        });
      },

      // Handle education event
      handleEvent: (optionIndex) => {
        set((state) => {
          const event = state.activeEvent;
          if (!event || !event.options[optionIndex]) {
            return state;
          }

          const option = event.options[optionIndex];
          const effectChanges = option.effect(state);

          return {
            ...state,
            ...effectChanges,
            activeEvent: null, // Clear the event after handling
          };
        });
      },

      // Study for a course (improves potential grade)
      studyCourse: (courseId) => {
        set((state) => {
          // Studying reduces energy but improves course performance
          return {
            energy: Math.max(0, state.energy - 5),
          };
        });
      },

      // Add preparatory course
      addPreparatoryCourse: (course) =>
        set((state) => ({
          preparatoryCourses: [...state.preparatoryCourses, course],
        })),

      // Set thesis project
      setThesis: (thesis) =>
        set({
          finalThesis: thesis,
        }),

      // Reset education progress (for testing or new game)
      resetEducation: () => {
        set({
          hasCompletedEntranceExam: false,
          entranceExamScore: 0,
          subjectBreakdown: {},
          preparatoryCourses: [],
          universityId: null,
          university: null,
          degreeProgram: null,
          specialization: null,
          isEnrolled: false,
          currentSemester: 1,
          totalSemesters: 8,
          selectedCourses: [],
          courseGrades: {},
          timeUnits: 10,
          allocatedTime: {
            study: 0,
            skillDevelopment: 0,
            networking: 0,
            partTimeWork: 0,
            extracurricular: 0,
          },
          gpa: 0,
          achievements: {
            deansList: false,
            scholarships: [],
            awards: [],
          },
          isGraduated: false,
          expectedGraduationDate: null,
          actualGraduationDate: null,
          finalThesis: null,
          energy: 100,
          skills: {
            programming: 0,
            mathematics: 0,
            communication: 0,
            teamwork: 0,
            problemSolving: 0,
            research: 0,
            criticalThinking: 0,
            academicKnowledge: 0,
          },
          resume: {
            projects: [],
            research: [],
            internships: [],
            awards: [],
          },
          activeEvent: null,
          semesterHistory: [],
        });
      },
    }),
    {
      name: "education-storage",
      getStorage: () => localStorage,
    }
  )
);
