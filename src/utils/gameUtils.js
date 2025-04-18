// utils/gameUtils.js

/**
 * Utility functions for the Azerbaijan IT Career Simulator game
 */

/**
 * Formats a date string for display
 * @param {string} dateString - ISO date string
 * @param {boolean} includeDay - Whether to include the day of the week
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, includeDay = false) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(includeDay && { weekday: "long" }),
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

/**
 * Formats a currency amount for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'AZN' for Azerbaijani Manat)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "AZN") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a time duration in seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

/**
 * Calculates the user's age based on game date and birth date
 * @param {string} birthDateString - ISO date string of birth date
 * @param {string} currentDateString - ISO date string of current game date
 * @returns {number} Age in years
 */
export const calculateAge = (birthDateString, currentDateString) => {
  const birthDate = new Date(birthDateString);
  const currentDate = new Date(currentDateString);

  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

/**
 * Generates a random date between two dates
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Date} Random date between start and end
 */
export const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

/**
 * Formats skill level as text
 * @param {number} level - Skill level (1-5)
 * @returns {string} Skill level text representation
 */
export const formatSkillLevel = (level) => {
  if (level >= 5) return "Expert";
  if (level >= 4) return "Advanced";
  if (level >= 3) return "Intermediate";
  if (level >= 2) return "Basic";
  return "Beginner";
};

/**
 * Formats skill name for display (converts snake_case to title case)
 * @param {string} skillKey - Skill key in snake_case
 * @returns {string} Formatted skill name
 */
export const formatSkillName = (skillKey) => {
  return skillKey
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Calculates the probability of success for a task based on attributes and skills
 * @param {Object} character - Character object with attributes and skills
 * @param {Object} task - Task object with requirements
 * @returns {number} Probability of success (0-1)
 */
export const calculateTaskSuccessProbability = (character, task) => {
  // Base probability
  let probability = 0.5;

  // Adjust based on relevant attributes
  if (task.relevantAttributes) {
    task.relevantAttributes.forEach((attr) => {
      const attrValue = character.attributes[attr.name] || 0;
      probability += (attrValue / 10) * attr.weight;
    });
  }

  // Adjust based on relevant skills
  if (task.relevantSkills) {
    task.relevantSkills.forEach((skill) => {
      const skillValue = character.skills[skill.name] || 0;
      probability += (skillValue / 5) * skill.weight;
    });
  }

  // Cap probability between 0.1 and 0.9
  return Math.min(0.9, Math.max(0.1, probability));
};

/**
 * Generates a random outcome based on probability
 * @param {number} probability - Probability of success (0-1)
 * @returns {boolean} Success (true) or failure (false)
 */
export const getRandomOutcome = (probability) => {
  return Math.random() < probability;
};

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Calculates GPA from a list of grades
 * @param {Array} grades - Array of grades (0-100)
 * @returns {number} GPA on a 4.0 scale
 */
export const calculateGPA = (grades) => {
  if (!grades || grades.length === 0) return 0;

  const gradePoints = grades.map((grade) => {
    if (grade >= 90) return 4.0;
    if (grade >= 80) return 3.0;
    if (grade >= 70) return 2.0;
    if (grade >= 60) return 1.0;
    return 0.0;
  });

  const sum = gradePoints.reduce((total, gp) => total + gp, 0);
  return sum / grades.length;
};

/**
 * Converts a date string to a different format
 * @param {string} dateString - ISO date string
 * @param {string} format - Output format ('short', 'medium', 'long')
 * @returns {string} Formatted date string
 */
export const convertDateFormat = (dateString, format = "medium") => {
  if (!dateString) return "";

  const date = new Date(dateString);

  switch (format) {
    case "short":
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    case "long":
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "relative":
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    default: // medium
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
  }
};

/**
 * Truncates text to a specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Generates initial character data based on selected difficulty
 * @param {string} difficulty - Game difficulty ('easy', 'normal', 'hard', 'realistic')
 * @returns {Object} Initial character data
 */
export const generateInitialCharacter = (difficulty) => {
  // Base attribute points based on difficulty
  let attrPoints = 30;
  let skillPoints = 20;

  switch (difficulty) {
    case "easy":
      attrPoints = 35;
      skillPoints = 25;
      break;
    case "normal":
      attrPoints = 30;
      skillPoints = 20;
      break;
    case "hard":
      attrPoints = 25;
      skillPoints = 15;
      break;
    case "realistic":
      attrPoints = 28;
      skillPoints = 18;
      break;
  }

  // Base attributes (will be adjusted by player during character creation)
  const attributes = {
    intelligence: Math.ceil(attrPoints / 6),
    creativity: Math.ceil(attrPoints / 6),
    charisma: Math.ceil(attrPoints / 6),
    discipline: Math.ceil(attrPoints / 6),
    adaptability: Math.ceil(attrPoints / 6),
    stress_resistance: Math.ceil(attrPoints / 6),
  };

  // Base skills (will be adjusted by player during character creation)
  const skills = {
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
  };

  return {
    attributes,
    skills,
    attrPointsRemaining:
      attrPoints - Object.values(attributes).reduce((sum, val) => sum + val, 0),
    skillPointsRemaining: skillPoints,
  };
};

/**
 * Calculates the effects of a game event choice
 * @param {Object} eventChoice - Event choice with effects
 * @param {Object} characterState - Current character state
 * @returns {Object} Updated character state after applying effects
 */
export const calculateEventEffects = (eventChoice, characterState) => {
  if (!eventChoice || !eventChoice.effects || !characterState) {
    return characterState;
  }

  const newState = { ...characterState };

  // Apply effects
  Object.entries(eventChoice.effects).forEach(([key, value]) => {
    if (typeof value === "number") {
      // Direct numeric effects
      if (
        key === "energy" ||
        key === "stress" ||
        key === "satisfaction" ||
        key === "health"
      ) {
        newState[key] = Math.max(
          0,
          Math.min(100, (newState[key] || 0) + value)
        );
      } else if (key === "salary") {
        newState[key] = Math.max(0, (newState[key] || 0) + value);
      } else {
        // Generic numeric value
        newState[key] = (newState[key] || 0) + value;
      }
    } else if (typeof value === "object") {
      // Nested objects (skills, connections, etc.)
      newState[key] = newState[key] || {};

      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (typeof nestedValue === "number") {
          if (key === "skills") {
            // Skills are capped at 5
            newState[key][nestedKey] = Math.max(
              1,
              Math.min(5, (newState[key][nestedKey] || 1) + nestedValue)
            );
          } else {
            // Generic nested value
            newState[key][nestedKey] =
              (newState[key][nestedKey] || 0) + nestedValue;
          }
        }
      });
    }
  });

  return newState;
};

export default {
  formatDate,
  formatCurrency,
  formatTime,
  calculateAge,
  getRandomDate,
  formatSkillLevel,
  formatSkillName,
  calculateTaskSuccessProbability,
  getRandomOutcome,
  getRandomInt,
  calculateGPA,
  convertDateFormat,
  truncateText,
  generateInitialCharacter,
  calculateEventEffects,
};
