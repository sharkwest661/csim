// resumeStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useResumeStore = create(
  persist(
    (set, get) => ({
      // Resume metadata
      lastUpdated: null,
      qualityScore: 0, // Overall resume quality
      qualityLevel: "entry", // 'entry', 'professional', 'distinguished', 'executive'
      activeTemplate: "basic", // 'basic', 'professional', 'executive', 'custom'
      unlockedTemplates: ["basic"],

      // Resume sections
      personalInfo: {
        name: "",
        email: "",
        phone: "",
        address: "",
        linkedIn: "",
        github: "",
      },

      objective: "", // Career objective statement

      // Education section
      education: {
        preUniversity: {
          entranceExamScore: 0,
          subjectBreakdown: {},
          preparatoryCourses: [],
        },
        university: {
          institution: "",
          prestigeRating: 0,
          degree: "",
          specialization: "",
          graduationDate: "",
          gpa: 0,
          deansList: false,
          thesis: null,
        },
        additionalEducation: {
          certifications: [],
          onlineCourses: [],
          workshops: [],
          internationalExperiences: [],
        },
      },

      // Skills section
      skills: {
        technical: {}, // Programming languages with proficiency levels
        softSkills: [],
        languages: {}, // Language list with proficiency
      },

      // Work experience section
      workExperience: {
        professionalHistory: [], // Companies, positions, dates, responsibilities
        internships: [],
        militaryService: null,
      },

      // Projects portfolio
      projects: {
        personal: [],
        team: [],
        hackathons: [],
      },

      // Additional sections
      additional: {
        volunteering: [],
        publications: [],
        professionalMemberships: [],
      },

      // Resume section strength ratings (0-10)
      sectionStrengths: {
        education: 0,
        skills: 0,
        workExperience: 0,
        projects: 0,
        additional: 0,
      },

      // Resume action functions

      // Sync data from other stores
      syncFromCharacter: (characterData) =>
        set((state) => {
          const personalInfo = {
            name: characterData.name,
            // Other personal info would be synced here
          };

          // Update skills based on character data
          const technicalSkills = {};
          const languages = {};
          const softSkills = [];

          // Example conversion of skills to resume format
          Object.entries(characterData.skills).forEach(([key, value]) => {
            if (
              key.includes("development") ||
              key.includes("programming") ||
              key.includes("database") ||
              key.includes("networking") ||
              key.includes("cybersecurity")
            ) {
              let proficiency = "Beginner";
              if (value >= 4) proficiency = "Expert";
              else if (value >= 3) proficiency = "Advanced";
              else if (value >= 2) proficiency = "Intermediate";

              technicalSkills[key.replace("_", " ")] = proficiency;
            } else if (
              key === "english" ||
              key === "russian" ||
              key === "turkish" ||
              key === "azerbaijani"
            ) {
              let proficiency = "Basic";
              if (value >= 4) proficiency = "Fluent";
              else if (value >= 3) proficiency = "Advanced";
              else if (value >= 2) proficiency = "Intermediate";

              languages[key] = proficiency;
            } else if (
              key === "communication" ||
              key === "teamwork" ||
              key === "time_management" ||
              key === "critical_thinking"
            ) {
              if (value >= 2) {
                softSkills.push(key.replace("_", " "));
              }
            }
          });

          return {
            personalInfo,
            skills: {
              technical: technicalSkills,
              languages,
              softSkills,
            },
            lastUpdated: new Date().toISOString(),
          };
        }),

      syncFromEducation: (educationData) =>
        set((state) => {
          // Map education data to resume format
          const universityEducation = {
            institution: educationData.university,
            degree: educationData.degreeProgram,
            specialization: educationData.specialization,
            graduationDate: educationData.expectedGraduationDate,
            gpa: educationData.gpa,
            deansList: educationData.deansListAppearances > 0,
            thesis: educationData.thesis,
          };

          const preUniversity = {
            entranceExamScore: educationData.entranceExamScore,
            subjectBreakdown: educationData.subjectBreakdown,
            preparatoryCourses: educationData.preparatoryCourses,
          };

          const additionalEducation = {
            certifications: educationData.certifications,
            onlineCourses: educationData.onlineCourses,
            workshops: educationData.workshops,
            internationalExperiences: educationData.internationalExperience,
          };

          // Calculate education section strength
          let educationStrength = 0;

          if (universityEducation.institution) educationStrength += 2;
          if (universityEducation.gpa > 3.0)
            educationStrength += universityEducation.gpa - 3;
          if (universityEducation.deansList) educationStrength += 1;
          if (universityEducation.thesis) educationStrength += 1;
          if (additionalEducation.certifications.length > 0)
            educationStrength += Math.min(
              2,
              additionalEducation.certifications.length
            );
          if (additionalEducation.internationalExperiences.length > 0)
            educationStrength += 1;

          // Cap at 10
          educationStrength = Math.min(10, educationStrength);

          return {
            education: {
              preUniversity,
              university: universityEducation,
              additionalEducation,
            },
            sectionStrengths: {
              ...state.sectionStrengths,
              education: educationStrength,
            },
            lastUpdated: new Date().toISOString(),
          };
        }),

      syncFromCareer: (careerData) =>
        set((state) => {
          // Map career data to resume format
          const professionalHistory = [
            ...careerData.workExperiences,
            careerData.currentJob,
          ].filter(Boolean);

          // Calculate work experience section strength
          let workExperienceStrength = 0;

          // 1 point per year of experience, up to 5
          workExperienceStrength += Math.min(5, careerData.yearsOfExperience);

          // 1 point per unique company (diversity of experience), up to 3
          workExperienceStrength += Math.min(3, careerData.companies.length);

          // 1 point for having held a leadership position
          if (
            careerData.positions.some(
              (p) =>
                p.includes("Lead") ||
                p.includes("Senior") ||
                p.includes("Manager") ||
                p.includes("Director")
            )
          ) {
            workExperienceStrength += 1;
          }

          // 1 point for international work experience
          if (professionalHistory.some((job) => job.isInternational)) {
            workExperienceStrength += 1;
          }

          // Cap at 10
          workExperienceStrength = Math.min(10, workExperienceStrength);

          return {
            workExperience: {
              professionalHistory,
              internships: careerData.internships,
              militaryService: careerData.militaryService.completed
                ? careerData.militaryService
                : null,
            },
            sectionStrengths: {
              ...state.sectionStrengths,
              workExperience: workExperienceStrength,
            },
            lastUpdated: new Date().toISOString(),
          };
        }),

      syncProjects: (projects) =>
        set((state) => {
          // Calculate projects section strength
          let projectsStrength = 0;

          // Points based on number of personal projects, up to 3
          projectsStrength += Math.min(3, projects.personal.length);

          // Points based on team projects, up to 3
          projectsStrength += Math.min(3, projects.team.length);

          // Points based on hackathons, up to 2
          projectsStrength += Math.min(2, projects.hackathons.length);

          // Extra points for projects with high impact or recognition
          const highImpactProjects = [
            ...projects.personal,
            ...projects.team,
            ...projects.hackathons,
          ].filter((p) => p.users > 100 || p.stars > 50 || p.awards);

          projectsStrength += Math.min(2, highImpactProjects.length);

          // Cap at 10
          projectsStrength = Math.min(10, projectsStrength);

          return {
            projects,
            sectionStrengths: {
              ...state.sectionStrengths,
              projects: projectsStrength,
            },
            lastUpdated: new Date().toISOString(),
          };
        }),

      // Update additional sections
      updateAdditionalSection: (sectionType, items) =>
        set((state) => {
          // Calculate additional section strength
          let additionalStrength = 0;

          // Points based on volunteering activities, up to 3
          if (sectionType === "volunteering" || items.volunteering) {
            const volunteering =
              sectionType === "volunteering" ? items : items.volunteering;
            additionalStrength += Math.min(3, volunteering.length);
          } else {
            additionalStrength += Math.min(
              3,
              state.additional.volunteering.length
            );
          }

          // Points based on publications, up to 3
          if (sectionType === "publications" || items.publications) {
            const publications =
              sectionType === "publications" ? items : items.publications;
            additionalStrength += Math.min(3, publications.length);
          } else {
            additionalStrength += Math.min(
              3,
              state.additional.publications.length
            );
          }

          // Points based on professional memberships, up to 2
          if (
            sectionType === "professionalMemberships" ||
            items.professionalMemberships
          ) {
            const memberships =
              sectionType === "professionalMemberships"
                ? items
                : items.professionalMemberships;
            additionalStrength += Math.min(2, memberships.length);
          } else {
            additionalStrength += Math.min(
              2,
              state.additional.professionalMemberships.length
            );
          }

          // Points for leadership roles in professional organizations
          if (sectionType === "professionalMemberships") {
            const leadershipRoles = items.filter(
              (m) =>
                m.role &&
                (m.role.includes("Leader") ||
                  m.role.includes("Chair") ||
                  m.role.includes("President") ||
                  m.role.includes("Director"))
            );
            additionalStrength += Math.min(2, leadershipRoles.length);
          } else if (items.professionalMemberships) {
            const leadershipRoles = items.professionalMemberships.filter(
              (m) =>
                m.role &&
                (m.role.includes("Leader") ||
                  m.role.includes("Chair") ||
                  m.role.includes("President") ||
                  m.role.includes("Director"))
            );
            additionalStrength += Math.min(2, leadershipRoles.length);
          } else if (state.additional.professionalMemberships) {
            const leadershipRoles =
              state.additional.professionalMemberships.filter(
                (m) =>
                  m.role &&
                  (m.role.includes("Leader") ||
                    m.role.includes("Chair") ||
                    m.role.includes("President") ||
                    m.role.includes("Director"))
              );
            additionalStrength += Math.min(2, leadershipRoles.length);
          }

          // Cap at 10
          additionalStrength = Math.min(10, additionalStrength);

          const updatedAdditional = sectionType
            ? { ...state.additional, [sectionType]: items }
            : items;

          return {
            additional: updatedAdditional,
            sectionStrengths: {
              ...state.sectionStrengths,
              additional: additionalStrength,
            },
            lastUpdated: new Date().toISOString(),
          };
        }),

      // Update resume template
      setTemplate: (template) =>
        set({
          activeTemplate: template,
        }),

      unlockTemplate: (template) =>
        set((state) => ({
          unlockedTemplates: [...state.unlockedTemplates, template],
        })),

      // Calculate overall resume quality
      calculateResumeQuality: () =>
        set((state) => {
          // Weight factors for different sections
          const weights = {
            education: 0.25,
            skills: 0.2,
            workExperience: 0.3,
            projects: 0.15,
            additional: 0.1,
          };

          // Calculate weighted score
          let totalScore = 0;
          Object.entries(state.sectionStrengths).forEach(
            ([section, strength]) => {
              totalScore += strength * weights[section];
            }
          );

          // Round to nearest 0.1
          totalScore = Math.round(totalScore * 10) / 10;

          // Determine quality level
          let qualityLevel = "entry";
          if (totalScore >= 8) {
            qualityLevel = "executive";
          } else if (totalScore >= 6) {
            qualityLevel = "distinguished";
          } else if (totalScore >= 4) {
            qualityLevel = "professional";
          }

          return {
            qualityScore: totalScore,
            qualityLevel,
            lastUpdated: new Date().toISOString(),
          };
        }),

      // Reset resume to default state
      resetResume: () =>
        set({
          lastUpdated: null,
          qualityScore: 0,
          qualityLevel: "entry",
          activeTemplate: "basic",
          unlockedTemplates: ["basic"],
          personalInfo: {
            name: "",
            email: "",
            phone: "",
            address: "",
            linkedIn: "",
            github: "",
          },
          objective: "",
          education: {
            preUniversity: {
              entranceExamScore: 0,
              subjectBreakdown: {},
              preparatoryCourses: [],
            },
            university: {
              institution: "",
              prestigeRating: 0,
              degree: "",
              specialization: "",
              graduationDate: "",
              gpa: 0,
              deansList: false,
              thesis: null,
            },
            additionalEducation: {
              certifications: [],
              onlineCourses: [],
              workshops: [],
              internationalExperiences: [],
            },
          },
          skills: {
            technical: {},
            softSkills: [],
            languages: {},
          },
          workExperience: {
            professionalHistory: [],
            internships: [],
            militaryService: null,
          },
          projects: {
            personal: [],
            team: [],
            hackathons: [],
          },
          additional: {
            volunteering: [],
            publications: [],
            professionalMemberships: [],
          },
          sectionStrengths: {
            education: 0,
            skills: 0,
            workExperience: 0,
            projects: 0,
            additional: 0,
          },
        }),
    }),
    {
      name: "azerbaijan-it-sim-resume",
      getStorage: () => localStorage,
    }
  )
);
