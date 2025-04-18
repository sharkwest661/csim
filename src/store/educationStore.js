// educationStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useEducationStore = create(
  persist(
    (set, get) => ({
      // Pre-university stats
      entranceExamScore: 0, // Out of 700
      subjectBreakdown: {
        mathematics: 0,
        physics: 0,
        informatics: 0,
        language: 0,
      },
      preparatoryCourses: [],

      // University education
      university: null,
      degreeProgram: null,
      specialization: null,
      enrollmentDate: null,
      expectedGraduationDate: null,
      currentSemester: 0,
      totalSemesters: 8, // Default for 4-year bachelor's degree
      gpa: 0,
      deansListAppearances: 0,
      coursesCompleted: [],
      currentCourses: [],
      thesis: null,

      // Additional education
      certifications: [], // {name, date, expiryDate}
      onlineCourses: [], // {name, platform, date, completed}
      workshops: [], // {name, organizer, date}
      internationalExperience: [], // {program, country, startDate, endDate}

      // University state and flags
      isEntranceExamCompleted: false,
      isEnrolled: false,
      isGraduated: false,

      // Actions - Entrance exam
      setEntranceExamScore: (score) =>
        set({
          entranceExamScore: score,
          isEntranceExamCompleted: true,
        }),

      setSubjectScore: (subject, score) =>
        set((state) => ({
          subjectBreakdown: {
            ...state.subjectBreakdown,
            [subject]: score,
          },
        })),

      addPreparatoryCourse: (course) =>
        set((state) => ({
          preparatoryCourses: [...state.preparatoryCourses, course],
        })),

      // Actions - University enrollment
      enrollInUniversity: (universityData) => {
        const { name, prestigeRating, program, specialization } =
          universityData;
        const enrollmentDate = new Date(); // In a real game, this would be the game's current date

        // Calculate expected graduation date (4 years later)
        const gradDate = new Date(enrollmentDate);
        gradDate.setFullYear(gradDate.getFullYear() + 4);

        set({
          university: name,
          degreeProgram: program,
          specialization: specialization,
          enrollmentDate: enrollmentDate.toISOString(),
          expectedGraduationDate: gradDate.toISOString(),
          currentSemester: 1,
          isEnrolled: true,
        });
      },

      // Actions - Semester progression
      advanceSemester: () =>
        set((state) => {
          // If we've reached the last semester, graduate the student
          if (state.currentSemester >= state.totalSemesters) {
            return { isGraduated: true };
          }

          return { currentSemester: state.currentSemester + 1 };
        }),

      // Actions - Course management
      addCourse: (course) =>
        set((state) => ({
          currentCourses: [...state.currentCourses, course],
        })),

      completeCourse: (courseId, grade) =>
        set((state) => {
          // Find the course to complete
          const courseToComplete = state.currentCourses.find(
            (course) => course.id === courseId
          );
          if (!courseToComplete) return state;

          // Remove from current courses
          const updatedCurrentCourses = state.currentCourses.filter(
            (course) => course.id !== courseId
          );

          // Add to completed courses with grade
          const completedCourse = {
            ...courseToComplete,
            grade,
            completedDate: new Date().toISOString(), // In a real game, this would be the game's current date
          };

          // Recalculate GPA
          const allCompletedCourses = [
            ...state.coursesCompleted,
            completedCourse,
          ];
          const totalPoints = allCompletedCourses.reduce(
            (sum, course) => sum + course.grade * course.credits,
            0
          );
          const totalCredits = allCompletedCourses.reduce(
            (sum, course) => sum + course.credits,
            0
          );
          const newGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

          // Check if GPA is high enough for Dean's List (assuming 3.5 is the threshold)
          let deansListCount = state.deansListAppearances;
          if (newGPA >= 3.5) {
            deansListCount += 1;
          }

          return {
            currentCourses: updatedCurrentCourses,
            coursesCompleted: allCompletedCourses,
            gpa: newGPA,
            deansListAppearances: deansListCount,
          };
        }),

      // Actions - Thesis and capstone
      setThesis: (thesisData) =>
        set({
          thesis: thesisData,
        }),

      // Actions - Additional education
      addCertification: (certification) =>
        set((state) => ({
          certifications: [...state.certifications, certification],
        })),

      addOnlineCourse: (course) =>
        set((state) => ({
          onlineCourses: [...state.onlineCourses, course],
        })),

      addWorkshop: (workshop) =>
        set((state) => ({
          workshops: [...state.workshops, workshop],
        })),

      addInternationalExperience: (experience) =>
        set((state) => ({
          internationalExperience: [
            ...state.internationalExperience,
            experience,
          ],
        })),

      // Reset education data
      resetEducation: () =>
        set({
          entranceExamScore: 0,
          subjectBreakdown: {
            mathematics: 0,
            physics: 0,
            informatics: 0,
            language: 0,
          },
          preparatoryCourses: [],
          university: null,
          degreeProgram: null,
          specialization: null,
          enrollmentDate: null,
          expectedGraduationDate: null,
          currentSemester: 0,
          totalSemesters: 8,
          gpa: 0,
          deansListAppearances: 0,
          coursesCompleted: [],
          currentCourses: [],
          thesis: null,
          certifications: [],
          onlineCourses: [],
          workshops: [],
          internationalExperience: [],
          isEntranceExamCompleted: false,
          isEnrolled: false,
          isGraduated: false,
        }),
    }),
    {
      name: "azerbaijan-it-sim-education",
      getStorage: () => localStorage,
    }
  )
);
