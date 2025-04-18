// careerStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCareerStore = create(
  persist(
    (set, get) => ({
      // Military service (for male characters)
      militaryService: {
        completed: false,
        branch: null,
        unit: null,
        rank: null,
        startDate: null,
        endDate: null,
        technicalRole: null,
        commendations: [],
      },

      // Work experience
      workExperiences: [], // Full employment history
      currentJob: null,
      applications: [], // Job application history
      interviews: [], // Interview history

      // Professional history details
      companies: [], // All companies worked for
      positions: [], // All positions held
      responsibilities: [], // Key responsibilities
      achievements: [], // Work achievements
      projects: [], // Professional projects
      performanceRatings: [], // Performance evaluations

      // Internships
      internships: [], // {company, position, startDate, endDate, completed}

      // Career state
      careerLevel: "entry", // 'entry', 'professional', 'distinguished', 'executive'
      careerTrack: null, // 'corporate', 'startup', 'government', 'freelance'
      yearsOfExperience: 0,
      salary: 0,
      satisfaction: 5, // Scale 1-10

      // Career management
      applyForJob: (jobListing) =>
        set((state) => {
          const newApplication = {
            id: Date.now(),
            company: jobListing.company,
            position: jobListing.position,
            dateApplied: new Date().toISOString(),
            status: "applied", // 'applied', 'interview', 'offer', 'rejected'
            salaryOffered: null,
            jobDetails: jobListing,
          };

          return {
            applications: [...state.applications, newApplication],
          };
        }),

      updateApplicationStatus: (applicationId, newStatus, details = {}) =>
        set((state) => {
          const updatedApplications = state.applications.map((app) => {
            if (app.id === applicationId) {
              return { ...app, status: newStatus, ...details };
            }
            return app;
          });

          return { applications: updatedApplications };
        }),

      scheduleInterview: (applicationId, interviewDetails) =>
        set((state) => {
          // First update the application status
          const updatedApplications = state.applications.map((app) => {
            if (app.id === applicationId) {
              return { ...app, status: "interview" };
            }
            return app;
          });

          // Then add the interview
          const newInterview = {
            id: Date.now(),
            applicationId,
            company: interviewDetails.company,
            position: interviewDetails.position,
            date: interviewDetails.date,
            type: interviewDetails.type, // 'technical', 'hr', 'final'
            completed: false,
            result: null,
            notes: null,
          };

          return {
            applications: updatedApplications,
            interviews: [...state.interviews, newInterview],
          };
        }),

      completeInterview: (interviewId, result, notes) =>
        set((state) => {
          const updatedInterviews = state.interviews.map((interview) => {
            if (interview.id === interviewId) {
              return { ...interview, completed: true, result, notes };
            }
            return interview;
          });

          return { interviews: updatedInterviews };
        }),

      acceptJobOffer: (applicationId, offerDetails) =>
        set((state) => {
          // Find the application
          const application = state.applications.find(
            (app) => app.id === applicationId
          );
          if (!application) return state;

          // Create the new job record
          const newJob = {
            id: Date.now(),
            company: application.company,
            position: application.position,
            startDate: new Date().toISOString(),
            endDate: null,
            salary: offerDetails.salary,
            responsibilities: offerDetails.responsibilities || [],
            projects: [],
            performanceReviews: [],
          };

          // If there's a current job, add it to work experiences
          let updatedWorkExperiences = [...state.workExperiences];
          if (state.currentJob) {
            // Set end date for current job
            const endedJob = {
              ...state.currentJob,
              endDate: new Date().toISOString(),
            };
            updatedWorkExperiences.push(endedJob);
          }

          // Update companies list if this is a new company
          let updatedCompanies = [...state.companies];
          if (!updatedCompanies.includes(application.company)) {
            updatedCompanies.push(application.company);
          }

          // Update positions list if this is a new position
          let updatedPositions = [...state.positions];
          if (!updatedPositions.includes(application.position)) {
            updatedPositions.push(application.position);
          }

          // Calculate years of experience
          const yearsOfExperience =
            state.yearsOfExperience +
            (state.currentJob
              ? (new Date() - new Date(state.currentJob.startDate)) /
                (1000 * 60 * 60 * 24 * 365)
              : 0);

          // Update career level based on years of experience and position
          let careerLevel = state.careerLevel;
          if (
            yearsOfExperience >= 10 ||
            application.position.includes("Director") ||
            application.position.includes("CTO")
          ) {
            careerLevel = "executive";
          } else if (
            yearsOfExperience >= 5 ||
            application.position.includes("Senior") ||
            application.position.includes("Lead")
          ) {
            careerLevel = "distinguished";
          } else if (yearsOfExperience >= 2) {
            careerLevel = "professional";
          }

          return {
            currentJob: newJob,
            workExperiences: updatedWorkExperiences,
            companies: updatedCompanies,
            positions: updatedPositions,
            yearsOfExperience: Math.round(yearsOfExperience * 10) / 10, // Round to 1 decimal place
            careerLevel,
            salary: offerDetails.salary,
            satisfaction: 7, // Start with high satisfaction at new job
          };
        }),

      leaveCurrentJob: (reason) =>
        set((state) => {
          if (!state.currentJob) return state;

          // Set end date for current job
          const endedJob = {
            ...state.currentJob,
            endDate: new Date().toISOString(),
            reasonForLeaving: reason,
          };

          return {
            currentJob: null,
            workExperiences: [...state.workExperiences, endedJob],
            salary: 0,
          };
        }),

      addInternship: (internship) =>
        set((state) => ({
          internships: [...state.internships, internship],
        })),

      completeInternship: (internshipId, completionDetails) =>
        set((state) => {
          const updatedInternships = state.internships.map((internship) => {
            if (internship.id === internshipId) {
              return {
                ...internship,
                completed: true,
                endDate: new Date().toISOString(),
                ...completionDetails,
              };
            }
            return internship;
          });

          return { internships: updatedInternships };
        }),

      addProject: (project) =>
        set((state) => {
          // If there's a current job, add the project to that job
          if (state.currentJob) {
            const updatedJob = {
              ...state.currentJob,
              projects: [...state.currentJob.projects, project],
            };

            return {
              currentJob: updatedJob,
              projects: [...state.projects, project],
            };
          }

          // Otherwise just add to overall projects
          return {
            projects: [...state.projects, project],
          };
        }),

      addPerformanceReview: (review) =>
        set((state) => {
          // If there's a current job, add the review to that job
          if (state.currentJob) {
            const updatedJob = {
              ...state.currentJob,
              performanceReviews: [
                ...state.currentJob.performanceReviews,
                review,
              ],
            };

            return {
              currentJob: updatedJob,
              performanceRatings: [...state.performanceRatings, review],
            };
          }

          // Otherwise just add to overall performance ratings
          return {
            performanceRatings: [...state.performanceRatings, review],
          };
        }),

      // Military service (for male characters)
      startMilitaryService: (serviceDetails) =>
        set({
          militaryService: {
            completed: false,
            ...serviceDetails,
            startDate: new Date().toISOString(),
          },
        }),

      completeMilitaryService: (endDetails) =>
        set((state) => ({
          militaryService: {
            ...state.militaryService,
            completed: true,
            endDate: new Date().toISOString(),
            ...endDetails,
          },
        })),

      // Reset career state
      resetCareer: () =>
        set({
          militaryService: {
            completed: false,
            branch: null,
            unit: null,
            rank: null,
            startDate: null,
            endDate: null,
            technicalRole: null,
            commendations: [],
          },
          workExperiences: [],
          currentJob: null,
          applications: [],
          interviews: [],
          companies: [],
          positions: [],
          responsibilities: [],
          achievements: [],
          projects: [],
          performanceRatings: [],
          internships: [],
          careerLevel: "entry",
          careerTrack: null,
          yearsOfExperience: 0,
          salary: 0,
          satisfaction: 5,
        }),
    }),
    {
      name: "azerbaijan-it-sim-career",
      getStorage: () => localStorage,
    }
  )
);
