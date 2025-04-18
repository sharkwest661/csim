// dataStore.js
import { create } from "zustand";

// This store doesn't need persistence as it contains static data

export const useDataStore = create((set, get) => ({
  // University data
  universities: [
    {
      id: "asoiu",
      name: "Azerbaijan State Oil and Industry University",
      abbreviation: "ASOIU",
      prestigeRating: 8,
      location: "Baku",
      departments: [
        "Computer Science",
        "Information Technology",
        "Software Engineering",
      ],
      entranceScoreThreshold: 550,
      tuitionFees: 2000, // per year in AZN
      description:
        "One of the oldest technical universities in Azerbaijan, focusing on engineering and technology.",
    },
    {
      id: "bsu",
      name: "Baku State University",
      abbreviation: "BSU",
      prestigeRating: 9,
      location: "Baku",
      departments: ["Applied Mathematics and Cybernetics", "Computer Science"],
      entranceScoreThreshold: 600,
      tuitionFees: 2200,
      description:
        "The largest university in Azerbaijan with strong academic traditions and research focus.",
    },
    {
      id: "ada",
      name: "ADA University",
      abbreviation: "ADA",
      prestigeRating: 10,
      location: "Baku",
      departments: ["IT and Engineering", "Computer Science"],
      entranceScoreThreshold: 650,
      tuitionFees: 7500,
      description:
        "A modern university with international standards and English-language instruction.",
    },
    {
      id: "beu",
      name: "Baku Engineering University",
      abbreviation: "BEU",
      prestigeRating: 7,
      location: "Baku",
      departments: ["Computer Engineering", "Information Technologies"],
      entranceScoreThreshold: 500,
      tuitionFees: 1900,
      description:
        "A specialized engineering university with modern facilities and industry connections.",
    },
  ],

  // Degree programs
  degreePrograms: [
    {
      id: "cs",
      name: "Computer Science",
      description:
        "Focus on theoretical foundations of computing and practical programming skills.",
      departments: ["Computer Science", "Applied Mathematics and Cybernetics"],
      careers: ["Software Developer", "Data Scientist", "Algorithm Developer"],
    },
    {
      id: "it",
      name: "Information Technology",
      description:
        "Broad training in computer systems, networks, and business applications.",
      departments: [
        "Information Technology",
        "IT and Engineering",
        "Information Technologies",
      ],
      careers: ["IT Specialist", "System Administrator", "Network Engineer"],
    },
    {
      id: "se",
      name: "Software Engineering",
      description:
        "Focus on software development methodologies and large-scale project management.",
      departments: ["Software Engineering", "Computer Engineering"],
      careers: ["Software Engineer", "QA Engineer", "DevOps Engineer"],
    },
    {
      id: "is",
      name: "Information Security",
      description:
        "Focus on cybersecurity, cryptography, and secure software development.",
      departments: ["Information Technology", "Computer Science"],
      careers: [
        "Security Analyst",
        "Penetration Tester",
        "Security Consultant",
      ],
    },
  ],

  // Companies
  companies: [
    {
      id: "azerconnect",
      name: "Azerconnect",
      industry: "Telecommunications",
      size: "large",
      location: "Baku",
      reputation: 8,
      international: false,
      description:
        "A major IT service company in Azerbaijan, providing services to telecom companies.",
    },
    {
      id: "pasha",
      name: "PASHA Bank",
      industry: "Banking",
      size: "large",
      location: "Baku",
      reputation: 9,
      international: false,
      description:
        "One of the leading banks in Azerbaijan with a strong IT department.",
    },
    {
      id: "microsoft_az",
      name: "Microsoft Azerbaijan",
      industry: "Technology",
      size: "medium",
      location: "Baku",
      reputation: 10,
      international: true,
      description:
        "Local office of Microsoft, focusing on sales and support for Azerbaijan.",
    },
    {
      id: "azercell",
      name: "Azercell",
      industry: "Telecommunications",
      size: "large",
      location: "Baku",
      reputation: 8,
      international: false,
      description:
        "A major mobile operator in Azerbaijan with significant IT infrastructure.",
    },
    {
      id: "bp_az",
      name: "BP Azerbaijan",
      industry: "Oil & Gas",
      size: "large",
      location: "Baku",
      reputation: 9,
      international: true,
      description:
        "Local branch of BP with IT departments supporting oil and gas operations.",
    },
    {
      id: "socar",
      name: "SOCAR",
      industry: "Oil & Gas",
      size: "very_large",
      location: "Baku",
      reputation: 8,
      international: false,
      description:
        "The state oil company of Azerbaijan with extensive IT operations.",
    },
    {
      id: "asan",
      name: "ASAN Service",
      industry: "Government",
      size: "large",
      location: "Baku",
      reputation: 7,
      international: false,
      description:
        "Azerbaijan's e-government service provider with a focus on digital transformation.",
    },
    {
      id: "abb",
      name: "ABB Bank",
      industry: "Banking",
      size: "medium",
      location: "Baku",
      reputation: 7,
      international: false,
      description: "A major bank in Azerbaijan with growing IT infrastructure.",
    },
    {
      id: "neuron",
      name: "Neuron Technologies",
      industry: "Software Development",
      size: "small",
      location: "Baku",
      reputation: 6,
      international: false,
      description:
        "A local software development company focusing on custom solutions.",
    },
    {
      id: "techno_az",
      name: "Technolabs Azerbaijan",
      industry: "Software Development",
      size: "small",
      location: "Baku",
      reputation: 5,
      international: false,
      description:
        "A startup focused on mobile app development and web services.",
    },
  ],

  // Job titles
  jobTitles: [
    // Entry-level positions
    {
      id: "junior_dev",
      name: "Junior Developer",
      level: "entry",
      category: "development",
      description:
        "Entry-level programming position focusing on basic coding tasks.",
    },
    {
      id: "junior_qa",
      name: "Junior QA Engineer",
      level: "entry",
      category: "quality",
      description:
        "Entry-level position focused on manual testing and basic QA processes.",
    },
    {
      id: "helpdesk",
      name: "IT Helpdesk Specialist",
      level: "entry",
      category: "support",
      description:
        "First-line IT support providing technical assistance to users.",
    },
    {
      id: "junior_sysadmin",
      name: "Junior System Administrator",
      level: "entry",
      category: "infrastructure",
      description:
        "Entry-level position handling basic system maintenance and user support.",
    },

    // Mid-level positions
    {
      id: "mid_dev",
      name: "Middle Developer",
      level: "mid",
      category: "development",
      description:
        "Experienced developer capable of working independently on significant projects.",
    },
    {
      id: "mid_qa",
      name: "QA Engineer",
      level: "mid",
      category: "quality",
      description:
        "Experienced tester capable of creating test plans and automated tests.",
    },
    {
      id: "devops_eng",
      name: "DevOps Engineer",
      level: "mid",
      category: "infrastructure",
      description:
        "Specialist in automating and optimizing development and deployment processes.",
    },
    {
      id: "data_analyst",
      name: "Data Analyst",
      level: "mid",
      category: "data",
      description:
        "Professional who analyzes data and creates reports and visualizations.",
    },

    // Senior positions
    {
      id: "senior_dev",
      name: "Senior Developer",
      level: "senior",
      category: "development",
      description:
        "Highly experienced developer who mentors others and makes architecture decisions.",
    },
    {
      id: "tech_lead",
      name: "Technical Lead",
      level: "senior",
      category: "development",
      description:
        "Senior developer who leads a team and makes technical decisions.",
    },
    {
      id: "data_scientist",
      name: "Data Scientist",
      level: "senior",
      category: "data",
      description:
        "Advanced specialist who creates data models and algorithms.",
    },
    {
      id: "security_eng",
      name: "Security Engineer",
      level: "senior",
      category: "security",
      description:
        "Specialist in implementing and maintaining security systems and practices.",
    },

    // Management positions
    {
      id: "project_manager",
      name: "Project Manager",
      level: "management",
      category: "management",
      description:
        "Professional responsible for planning and executing projects.",
    },
    {
      id: "it_manager",
      name: "IT Manager",
      level: "management",
      category: "management",
      description: "Manager responsible for an IT department or function.",
    },
    {
      id: "cto",
      name: "Chief Technology Officer",
      level: "executive",
      category: "executive",
      description:
        "Executive responsible for technology strategy and leadership.",
    },
  ],

  // Skills
  skills: [
    // Programming languages
    {
      id: "javascript",
      name: "JavaScript",
      category: "programming",
      demand: 9,
      description:
        "Primary language for web development, both frontend and backend (Node.js).",
    },
    {
      id: "python",
      name: "Python",
      category: "programming",
      demand: 8,
      description:
        "Versatile language used for backend, data science, and automation.",
    },
    {
      id: "java",
      name: "Java",
      category: "programming",
      demand: 7,
      description:
        "Enterprise-focused language used for large-scale applications and Android.",
    },
    {
      id: "csharp",
      name: "C#",
      category: "programming",
      demand: 6,
      description:
        "Microsoft-ecosystem language used for Windows and enterprise applications.",
    },
    {
      id: "php",
      name: "PHP",
      category: "programming",
      demand: 5,
      description:
        "Web development language commonly used for server-side programming.",
    },

    // Frameworks and libraries
    {
      id: "react",
      name: "React",
      category: "frontend",
      demand: 9,
      description: "Popular JavaScript library for building user interfaces.",
    },
    {
      id: "angular",
      name: "Angular",
      category: "frontend",
      demand: 7,
      description: "Comprehensive frontend framework developed by Google.",
    },
    {
      id: "vue",
      name: "Vue.js",
      category: "frontend",
      demand: 6,
      description: "Progressive JavaScript framework for building UIs.",
    },
    {
      id: "node",
      name: "Node.js",
      category: "backend",
      demand: 8,
      description: "JavaScript runtime for server-side applications.",
    },
    {
      id: "django",
      name: "Django",
      category: "backend",
      demand: 6,
      description: "High-level Python web framework.",
    },

    // Databases
    {
      id: "sql",
      name: "SQL",
      category: "database",
      demand: 8,
      description: "Standard language for relational database management.",
    },
    {
      id: "mongodb",
      name: "MongoDB",
      category: "database",
      demand: 7,
      description: "Popular NoSQL database for document-oriented storage.",
    },

    // DevOps
    {
      id: "docker",
      name: "Docker",
      category: "devops",
      demand: 8,
      description:
        "Platform for developing, shipping, and running applications in containers.",
    },
    {
      id: "kubernetes",
      name: "Kubernetes",
      category: "devops",
      demand: 7,
      description:
        "System for automating deployment and scaling of containerized applications.",
    },
    {
      id: "ci_cd",
      name: "CI/CD",
      category: "devops",
      demand: 7,
      description:
        "Practices for automating testing and deployment of applications.",
    },

    // Soft skills
    {
      id: "teamwork",
      name: "Teamwork",
      category: "soft",
      demand: 9,
      description: "Ability to work effectively in a team environment.",
    },
    {
      id: "communication",
      name: "Communication",
      category: "soft",
      demand: 9,
      description: "Ability to clearly convey information and ideas.",
    },
    {
      id: "problem_solving",
      name: "Problem Solving",
      category: "soft",
      demand: 9,
      description: "Ability to identify and resolve complex technical issues.",
    },
    {
      id: "time_management",
      name: "Time Management",
      category: "soft",
      demand: 8,
      description: "Ability to prioritize tasks and meet deadlines.",
    },
  ],

  // Events
  events: [
    // Education events
    {
      id: "study_group",
      name: "Study Group Invitation",
      phase: "education",
      description:
        "You've been invited to join a study group for a challenging course.",
      choices: [
        {
          text: "Join the group",
          effects: {
            energy: -10,
            skills: { programming_fundamentals: +0.2 },
            connections: { academic: +1 },
          },
        },
        {
          text: "Decline and study alone",
          effects: {
            energy: -5,
            skills: { programming_fundamentals: +0.1 },
          },
        },
      ],
    },
    {
      id: "hackathon",
      name: "University Hackathon",
      phase: "education",
      description:
        "Your university is hosting a 48-hour hackathon with industry sponsors.",
      choices: [
        {
          text: "Participate with a team",
          effects: {
            energy: -30,
            stress: +20,
            skills: { teamwork: +0.3, problem_solving: +0.2 },
            resume: { projects: { hackathons: +1 } },
          },
        },
        {
          text: "Skip and focus on coursework",
          effects: {
            energy: -5,
            skills: { programming_fundamentals: +0.1 },
          },
        },
      ],
    },

    // Career events
    {
      id: "overtime_request",
      name: "Overtime Request",
      phase: "career",
      description:
        "Your manager asks if you can work overtime to complete an important project.",
      choices: [
        {
          text: "Accept the overtime",
          effects: {
            energy: -20,
            stress: +15,
            salary: +200,
            reputation: +10,
          },
        },
        {
          text: "Decline politely",
          effects: {
            energy: +5,
            stress: -5,
            reputation: -5,
          },
        },
      ],
    },
    {
      id: "job_offer",
      name: "Unexpected Job Offer",
      phase: "career",
      description:
        "A competitor company has approached you with a job offer. The salary is 15% higher than your current position.",
      choices: [
        {
          text: "Accept the new offer",
          effects: {
            energy: -10,
            stress: +10,
            salary: +15,
            reputation: 0,
          },
        },
        {
          text: "Use it to negotiate with current employer",
          effects: {
            energy: -5,
            stress: +5,
            salary: +10,
            reputation: +5,
          },
        },
        {
          text: "Decline the offer",
          effects: {
            energy: +0,
            stress: +0,
            salary: +0,
            reputation: +5,
          },
        },
      ],
    },

    // Personal events
    {
      id: "health_issue",
      name: "Minor Health Issue",
      phase: "any",
      description:
        "You've been feeling unwell due to long hours at the computer.",
      choices: [
        {
          text: "Take time off to recover",
          effects: {
            energy: +20,
            stress: -15,
            health: +10,
            salary: -100,
          },
        },
        {
          text: "Push through and keep working",
          effects: {
            energy: -15,
            stress: +10,
            health: -5,
          },
        },
      ],
    },
    {
      id: "family_obligation",
      name: "Family Obligation",
      phase: "any",
      description: "A family matter requires your attention and time.",
      choices: [
        {
          text: "Prioritize family",
          effects: {
            energy: -5,
            stress: -10,
            satisfaction: +15,
            reputation: -5,
          },
        },
        {
          text: "Focus on work/studies",
          effects: {
            energy: -10,
            stress: +10,
            satisfaction: -15,
            reputation: +5,
          },
        },
      ],
    },
  ],

  // Certifications
  certifications: [
    {
      id: "aws_associate",
      name: "AWS Certified Solutions Architect – Associate",
      provider: "Amazon Web Services",
      cost: 500,
      timeToComplete: 60, // Days
      difficulty: 7,
      demand: 8,
      validity: 730, // Days (2 years)
      description:
        "Validates technical expertise in designing and deploying secure and robust applications on AWS.",
    },
    {
      id: "az900",
      name: "Microsoft Azure Fundamentals (AZ-900)",
      provider: "Microsoft",
      cost: 300,
      timeToComplete: 30,
      difficulty: 4,
      demand: 7,
      validity: null, // Does not expire
      description:
        "Entry-level certification for understanding cloud concepts and Azure services.",
    },
    {
      id: "ccna",
      name: "Cisco Certified Network Associate (CCNA)",
      provider: "Cisco",
      cost: 600,
      timeToComplete: 90,
      difficulty: 6,
      demand: 7,
      validity: 1095, // 3 years
      description:
        "Validates skills to configure, operate, and troubleshoot medium-sized networks.",
    },
    {
      id: "comptia_sec",
      name: "CompTIA Security+",
      provider: "CompTIA",
      cost: 450,
      timeToComplete: 45,
      difficulty: 5,
      demand: 6,
      validity: 1095, // 3 years
      description:
        "Establishes core knowledge required of any cybersecurity role.",
    },
    {
      id: "pmp",
      name: "Project Management Professional (PMP)",
      provider: "Project Management Institute",
      cost: 700,
      timeToComplete: 120,
      difficulty: 8,
      demand: 8,
      validity: 1095, // 3 years
      description:
        "Internationally recognized certification for project management skills.",
    },
    {
      id: "scrum_master",
      name: "Certified ScrumMaster (CSM)",
      provider: "Scrum Alliance",
      cost: 400,
      timeToComplete: 14,
      difficulty: 4,
      demand: 7,
      validity: 730, // 2 years
      description:
        "Demonstrates knowledge of Scrum principles and the Scrum Master role.",
    },
  ],

  // Methods to access specific data
  getUniversity: (id) =>
    get().universities.find((university) => university.id === id),
  getDegreeProgram: (id) =>
    get().degreePrograms.find((program) => program.id === id),
  getCompany: (id) => get().companies.find((company) => company.id === id),
  getJobTitle: (id) => get().jobTitles.find((job) => job.id === id),
  getSkill: (id) => get().skills.find((skill) => skill.id === id),
  getEvent: (id) => get().events.find((event) => event.id === id),
  getCertification: (id) => get().certifications.find((cert) => cert.id === id),

  // Filter methods
  getJobsByLevel: (level) =>
    get().jobTitles.filter((job) => job.level === level),
  getSkillsByCategory: (category) =>
    get().skills.filter((skill) => skill.category === category),
  getEventsByPhase: (phase) =>
    get().events.filter(
      (event) => event.phase === phase || event.phase === "any"
    ),

  // Method to generate random job listings based on level
  generateJobListings: (count = 5, level = null) => {
    const companies = get().companies;
    const jobTitles = level ? get().getJobsByLevel(level) : get().jobTitles;
    const skills = get().skills;

    const listings = [];

    for (let i = 0; i < count; i++) {
      // Randomly select company and job title
      const company = companies[Math.floor(Math.random() * companies.length)];
      const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];

      // Determine salary range based on job level and company reputation
      let baseSalary;
      switch (jobTitle.level) {
        case "entry":
          baseSalary = 800 + company.reputation * 50;
          break;
        case "mid":
          baseSalary = 1500 + company.reputation * 80;
          break;
        case "senior":
          baseSalary = 2500 + company.reputation * 120;
          break;
        case "management":
          baseSalary = 3500 + company.reputation * 150;
          break;
        case "executive":
          baseSalary = 5000 + company.reputation * 300;
          break;
        default:
          baseSalary = 1000;
      }

      // Add some randomness to salary
      const salaryVariation = Math.floor(
        baseSalary * 0.2 * (Math.random() - 0.5)
      );
      const salary = baseSalary + salaryVariation;

      // Required skills based on job title
      const requiredSkillsCount =
        jobTitle.level === "entry"
          ? 2
          : jobTitle.level === "mid"
          ? 3
          : jobTitle.level === "senior"
          ? 4
          : 5;

      // Filter skills by category based on job
      let categoryFilter;
      switch (jobTitle.category) {
        case "development":
          categoryFilter = (skill) =>
            skill.category === "programming" ||
            skill.category === "frontend" ||
            skill.category === "backend";
          break;
        case "infrastructure":
          categoryFilter = (skill) =>
            skill.category === "devops" || skill.category === "database";
          break;
        case "data":
          categoryFilter = (skill) =>
            skill.category === "programming" || skill.category === "database";
          break;
        default:
          categoryFilter = () => true;
      }

      const relevantSkills = skills.filter(categoryFilter);
      const requiredSkills = [];

      // Randomly select skills
      for (
        let j = 0;
        j < requiredSkillsCount && j < relevantSkills.length;
        j++
      ) {
        const randomIndex = Math.floor(Math.random() * relevantSkills.length);
        requiredSkills.push(relevantSkills[randomIndex]);
        relevantSkills.splice(randomIndex, 1);
      }

      // Generate the job listing
      listings.push({
        id: `job_${company.id}_${jobTitle.id}_${Date.now()}_${i}`,
        companyId: company.id,
        company: company.name,
        titleId: jobTitle.id,
        title: jobTitle.name,
        level: jobTitle.level,
        salary,
        location: company.location,
        remote: Math.random() > 0.7, // 30% chance of remote job
        requiredSkills: requiredSkills.map((skill) => skill.id),
        description: `${company.name} is looking for a ${jobTitle.name} to join our team. ${jobTitle.description}`,
        postedDate: new Date().toISOString(),
        deadline: new Date(
          Date.now() +
            (14 + Math.floor(Math.random() * 14)) * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    }

    return listings;
  },
}));
