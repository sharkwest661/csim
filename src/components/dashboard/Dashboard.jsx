// components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  GridItem,
  Flex,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  IconButton,
  VStack,
  HStack,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  useDisclosure,
  Icon,
  Avatar,
} from "@chakra-ui/react";
import {
  Calendar,
  Clock,
  ChevronRight,
  Heart,
  TrendingUp,
  Briefcase,
  FileText,
  Award,
  Coffee,
  Book,
  Users,
  DollarSign,
  Star,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCharacterStore } from "../../store/characterStore";
import { useCareerStore } from "../../store/careerStore";
import { useEducationStore } from "../../store/educationStore";
import { useResumeStore } from "../../store/resumeStore";
import { useGameStore } from "../../store/gameStore";
import { useGameEventsStore } from "../../store/gameEventsStore";
import GameEvent from "../GameEvent";
import MemoryGame from "../minigames/MemoryGame";
import LogicGame from "../minigames/LogicGame";
import { formatDate, formatCurrency } from "../../utils/gameUtils";

/**
 * Dashboard component - Main game interface showing character status,
 * current activities, and game progression
 */
const Dashboard = () => {
  const navigate = useNavigate();

  // Modals
  const {
    isOpen: isMemoryGameOpen,
    onOpen: onMemoryGameOpen,
    onClose: onMemoryGameClose,
  } = useDisclosure();

  const {
    isOpen: isLogicGameOpen,
    onOpen: onLogicGameOpen,
    onClose: onLogicGameClose,
  } = useDisclosure();

  // Game state
  const gameStarted = useGameStore((state) => state.gameStarted);
  const currentStage = useGameStore((state) => state.currentStage);
  const processGameDay = useGameStore((state) => state.processGameDay);
  const processGameWeek = useGameStore((state) => state.processGameWeek);
  const processGameMonth = useGameStore((state) => state.processGameMonth);

  // Game events
  const gameDate = useGameEventsStore((state) => state.currentDate);
  const energy = useGameEventsStore((state) => state.energy);
  const stress = useGameEventsStore((state) => state.stress);
  const satisfaction = useGameEventsStore((state) => state.satisfaction);
  const health = useGameEventsStore((state) => state.health);
  const stats = useGameEventsStore((state) => state.stats);
  const modifyEnergy = useGameEventsStore((state) => state.modifyEnergy);
  const modifyStress = useGameEventsStore((state) => state.modifyStress);
  const currentEvent = useGameEventsStore((state) => state.currentEvent);

  // Character info
  const characterName = useCharacterStore((state) => state.name);
  const characterGender = useCharacterStore((state) => state.gender);
  const characterAttrs = useCharacterStore((state) => state.attributes);
  const characterSkills = useCharacterStore((state) => state.skills);

  // Education info
  const university = useEducationStore((state) => state.university);
  const degreeProgram = useEducationStore((state) => state.degreeProgram);
  const currentSemester = useEducationStore((state) => state.currentSemester);
  const totalSemesters = useEducationStore((state) => state.totalSemesters);
  const gpa = useEducationStore((state) => state.gpa);
  const isEnrolled = useEducationStore((state) => state.isEnrolled);

  // Career info
  const currentJob = useCareerStore((state) => state.currentJob);
  const careerLevel = useCareerStore((state) => state.careerLevel);
  const salary = useCareerStore((state) => state.salary);
  const yearsOfExperience = useCareerStore((state) => state.yearsOfExperience);

  // Resume info
  const resumeQuality = useResumeStore((state) => state.qualityScore);
  const resumeLevel = useResumeStore((state) => state.qualityLevel);

  // Local state
  const [isAdvancingTime, setIsAdvancingTime] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const statBg = useColorModeValue("blue.50", "blue.900");

  // Find the most important skill based on level
  const getMostImportantSkills = () => {
    const skillEntries = Object.entries(characterSkills)
      .filter(([key]) => key !== "azerbaijani") // Exclude native language
      .sort((a, b) => b[1] - a[1]) // Sort by skill level (descending)
      .slice(0, 3); // Get top 3 skills

    return skillEntries.map(([key, value]) => ({
      name: key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      level: value,
    }));
  };

  // Get current activity based on game stage
  const getCurrentActivity = () => {
    switch (currentStage) {
      case "education":
        return isEnrolled
          ? `Studying ${degreeProgram} at ${university} (Semester ${currentSemester}/${totalSemesters})`
          : "Preparing for university";
      case "military":
        return "Completing mandatory military service";
      case "career":
        return currentJob
          ? `Working as ${currentJob.position} at ${currentJob.company}`
          : "Looking for employment";
      default:
        return "Character creation";
    }
  };

  // Handle time advancement
  const handleAdvanceTime = (duration) => {
    setIsAdvancingTime(true);

    // Process time based on duration
    if (duration === "day") {
      processGameDay();
    } else if (duration === "week") {
      processGameWeek();
    } else if (duration === "month") {
      processGameMonth();
    }

    // Add notification about time passing
    addNotification({
      title: `Time Advanced`,
      description: `You've advanced time by one ${duration}.`,
      type: "info",
    });

    setTimeout(() => {
      setIsAdvancingTime(false);
    }, 1000);
  };

  // Handle minigame completion
  const handleMinigameComplete = (gameType, result) => {
    // Handle results based on game type
    if (gameType === "memory") {
      if (result.success) {
        // Memory game success
        addNotification({
          title: "Memory Game Completed",
          description: `You scored ${result.score} points!`,
          type: "success",
        });

        // Improve related skills
        const currentLevel = characterSkills.programming_fundamentals || 1;
        useCharacterStore
          .getState()
          .setSkill(
            "programming_fundamentals",
            Math.min(5, currentLevel + 0.1)
          );

        // Reduce energy
        modifyEnergy(-10);
      } else {
        // Memory game failure
        addNotification({
          title: "Memory Game Failed",
          description: "You ran out of time or gave up.",
          type: "error",
        });

        // Increase stress
        modifyStress(5);
      }
    } else if (gameType === "logic") {
      if (result.success) {
        // Logic game success
        addNotification({
          title: "Logic Puzzle Completed",
          description: `You got ${result.correctAnswers} out of ${result.totalPatterns} patterns correct!`,
          type: "success",
        });

        // Improve related skills
        const currentLevel = characterSkills.critical_thinking || 1;
        useCharacterStore
          .getState()
          .setSkill("critical_thinking", Math.min(5, currentLevel + 0.1));

        // Reduce energy
        modifyEnergy(-10);
      } else {
        // Logic game failure
        addNotification({
          title: "Logic Puzzle Failed",
          description: "You ran out of time or gave up.",
          type: "error",
        });

        // Increase stress
        modifyStress(5);
      }
    }
  };

  // Add a notification
  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { ...notification, id }]);

    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  // If no game has been started, show a placeholder
  if (!gameStarted) {
    return (
      <Box mb={8}>
        <Card bg={cardBg} shadow="md" p={8} textAlign="center">
          <VStack spacing={4}>
            <AlertCircle size={48} color={accentColor} />
            <Heading size="lg">No Active Game</Heading>
            <Text>Please start a new game to see your dashboard.</Text>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => navigate("/")}
              mt={4}
            >
              Return to Home
            </Button>
          </VStack>
        </Card>
      </Box>
    );
  }

  return (
    <Box mb={8}>
      <HStack justifyContent="space-between" mb={6}>
        <Heading size="xl">Dashboard</Heading>

        <HStack>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDown size={18} />}
              colorScheme="green"
              isLoading={isAdvancingTime}
              loadingText="Advancing..."
            >
              Advance Time
            </MenuButton>
            <MenuList>
              <MenuItem
                icon={<Clock size={16} />}
                onClick={() => handleAdvanceTime("day")}
              >
                One Day
              </MenuItem>
              <MenuItem
                icon={<Calendar size={16} />}
                onClick={() => handleAdvanceTime("week")}
              >
                One Week
              </MenuItem>
              <MenuItem
                icon={<Calendar size={16} />}
                onClick={() => handleAdvanceTime("month")}
              >
                One Month
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>

      {/* Character Overview */}
      <Card bg={cardBg} shadow="md" mb={6}>
        <CardBody>
          <Grid
            templateColumns={{ base: "1fr", md: "auto 1fr auto" }}
            gap={4}
            alignItems="center"
          >
            <GridItem>
              <Avatar
                size="xl"
                name={characterName}
                src={null}
                bg={accentColor}
              />
            </GridItem>

            <GridItem>
              <VStack align="start" spacing={1}>
                <HStack>
                  <Heading size="md">{characterName}</Heading>
                  <Badge colorScheme="purple">{characterGender}</Badge>
                  <Badge
                    colorScheme={
                      careerLevel === "entry"
                        ? "blue"
                        : careerLevel === "professional"
                        ? "green"
                        : careerLevel === "distinguished"
                        ? "purple"
                        : "orange"
                    }
                  >
                    {careerLevel.charAt(0).toUpperCase() + careerLevel.slice(1)}{" "}
                    Level
                  </Badge>
                </HStack>
                <Text>{getCurrentActivity()}</Text>
                <HStack fontSize="sm" color="gray.500">
                  <Calendar size={14} />
                  <Text>
                    {gameDate
                      ? formatDate(gameDate, true)
                      : "Game date not set"}
                  </Text>
                </HStack>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack align="end">
                {currentJob && (
                  <Stat textAlign="right">
                    <StatLabel>Monthly Salary</StatLabel>
                    <StatNumber>{formatCurrency(salary)}</StatNumber>
                  </Stat>
                )}
                <HStack>
                  <Badge colorScheme="green">
                    {yearsOfExperience.toFixed(1)} Years Experience
                  </Badge>
                  <Badge colorScheme="blue">
                    Resume Quality: {resumeQuality.toFixed(1)}/10
                  </Badge>
                </HStack>
              </VStack>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>

      {/* Status and Actions Grid */}
      <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={6} mb={6}>
        {/* Left Column - Status Panels */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            {/* Vitals */}
            <Card bg={cardBg} shadow="sm">
              <CardHeader pb={0}>
                <Heading size="sm">Character Status</Heading>
              </CardHeader>
              <CardBody>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  <GridItem>
                    <VStack align="start" spacing={1}>
                      <HStack width="100%" justify="space-between">
                        <HStack>
                          <Icon as={Heart} color="red.500" />
                          <Text fontWeight="bold">Energy</Text>
                        </HStack>
                        <Text fontWeight="bold">{energy}%</Text>
                      </HStack>
                      <Progress
                        value={energy}
                        colorScheme="blue"
                        size="sm"
                        width="100%"
                        borderRadius="full"
                      />
                      <Text fontSize="xs" color="gray.500">
                        {energy > 70
                          ? "Well rested"
                          : energy > 40
                          ? "Somewhat tired"
                          : "Exhausted - rest needed"}
                      </Text>
                    </VStack>
                  </GridItem>

                  <GridItem>
                    <VStack align="start" spacing={1}>
                      <HStack width="100%" justify="space-between">
                        <HStack>
                          <Icon as={TrendingUp} color="orange.500" />
                          <Text fontWeight="bold">Stress</Text>
                        </HStack>
                        <Text fontWeight="bold">{stress}%</Text>
                      </HStack>
                      <Progress
                        value={stress}
                        colorScheme="red"
                        size="sm"
                        width="100%"
                        borderRadius="full"
                      />
                      <Text fontSize="xs" color="gray.500">
                        {stress < 30
                          ? "Relaxed"
                          : stress < 60
                          ? "Manageable stress"
                          : "High stress - take a break"}
                      </Text>
                    </VStack>
                  </GridItem>

                  <GridItem>
                    <VStack align="start" spacing={1}>
                      <HStack width="100%" justify="space-between">
                        <HStack>
                          <Icon as={Star} color="yellow.500" />
                          <Text fontWeight="bold">Satisfaction</Text>
                        </HStack>
                        <Text fontWeight="bold">{satisfaction}%</Text>
                      </HStack>
                      <Progress
                        value={satisfaction}
                        colorScheme="yellow"
                        size="sm"
                        width="100%"
                        borderRadius="full"
                      />
                    </VStack>
                  </GridItem>

                  <GridItem>
                    <VStack align="start" spacing={1}>
                      <HStack width="100%" justify="space-between">
                        <HStack>
                          <Icon as={Heart} color="pink.500" />
                          <Text fontWeight="bold">Health</Text>
                        </HStack>
                        <Text fontWeight="bold">{health}%</Text>
                      </HStack>
                      <Progress
                        value={health}
                        colorScheme="green"
                        size="sm"
                        width="100%"
                        borderRadius="full"
                      />
                    </VStack>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>

            {/* Current Activity */}
            <Card bg={cardBg} shadow="sm">
              <CardHeader pb={2}>
                <Heading size="sm">Current Activity</Heading>
              </CardHeader>
              <CardBody pt={0}>
                {currentStage === "education" && (
                  <Box>
                    {isEnrolled ? (
                      <VStack align="start" spacing={3}>
                        <HStack>
                          <Icon as={Book} color="blue.500" />
                          <Text fontWeight="bold">{university}</Text>
                        </HStack>
                        <Text>Studying {degreeProgram}</Text>
                        <Box width="100%">
                          <HStack justify="space-between" mb={1}>
                            <Text>Academic Progress</Text>
                            <Text fontWeight="bold">
                              Semester {currentSemester}/{totalSemesters}
                            </Text>
                          </HStack>
                          <Progress
                            value={(currentSemester / totalSemesters) * 100}
                            colorScheme="blue"
                            size="sm"
                            borderRadius="full"
                          />
                        </Box>
                        <HStack>
                          <Text>GPA:</Text>
                          <Badge
                            colorScheme={
                              gpa >= 3.5
                                ? "green"
                                : gpa >= 3.0
                                ? "blue"
                                : gpa >= 2.5
                                ? "yellow"
                                : "red"
                            }
                          >
                            {gpa.toFixed(2)}/4.0
                          </Badge>
                        </HStack>
                        <Button
                          leftIcon={<Book size={16} />}
                          colorScheme="blue"
                          size="sm"
                          onClick={() => navigate("/education")}
                        >
                          Manage Studies
                        </Button>
                      </VStack>
                    ) : (
                      <VStack align="center" spacing={3}>
                        <Text>You need to enroll in a university</Text>
                        <Button
                          leftIcon={<Book size={16} />}
                          colorScheme="blue"
                          onClick={() => navigate("/education")}
                        >
                          Apply to University
                        </Button>
                      </VStack>
                    )}
                  </Box>
                )}

                {currentStage === "military" && (
                  <VStack align="center" spacing={3}>
                    <Icon as={Award} boxSize={8} color="purple.500" />
                    <Text fontWeight="bold">Military Service</Text>
                    <Text>
                      You are currently completing your mandatory military
                      service.
                    </Text>
                    <Button
                      leftIcon={<Award size={16} />}
                      colorScheme="purple"
                      onClick={() => navigate("/military-service")}
                    >
                      View Service Details
                    </Button>
                  </VStack>
                )}

                {currentStage === "career" && (
                  <Box>
                    {currentJob ? (
                      <VStack align="start" spacing={3}>
                        <HStack>
                          <Icon as={Briefcase} color="green.500" />
                          <Text fontWeight="bold">{currentJob.position}</Text>
                        </HStack>
                        <Text>at {currentJob.company}</Text>
                        <Divider />
                        <HStack>
                          <Text>Salary:</Text>
                          <Badge colorScheme="green">
                            {formatCurrency(salary)}/month
                          </Badge>
                        </HStack>
                        <HStack>
                          <Text>Started:</Text>
                          <Text>{formatDate(currentJob.startDate)}</Text>
                        </HStack>
                        <Button
                          leftIcon={<Briefcase size={16} />}
                          colorScheme="green"
                          size="sm"
                          onClick={() => navigate("/career")}
                        >
                          Manage Career
                        </Button>
                      </VStack>
                    ) : (
                      <VStack align="center" spacing={3}>
                        <Text>You are currently unemployed</Text>
                        <Button
                          leftIcon={<Briefcase size={16} />}
                          colorScheme="green"
                          onClick={() => navigate("/career")}
                        >
                          Find a Job
                        </Button>
                      </VStack>
                    )}
                  </Box>
                )}
              </CardBody>
            </Card>

            {/* Game Stats */}
            <Card bg={cardBg} shadow="sm">
              <CardHeader pb={0}>
                <Heading size="sm">Game Statistics</Heading>
              </CardHeader>
              <CardBody>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                  gap={4}
                >
                  <GridItem>
                    <Stat>
                      <StatLabel>Days Played</StatLabel>
                      <StatNumber>{stats.daysPlayed}</StatNumber>
                    </Stat>
                  </GridItem>

                  <GridItem>
                    <Stat>
                      <StatLabel>Total Salary Earned</StatLabel>
                      <StatNumber>
                        {formatCurrency(stats.totalSalaryEarned)}
                      </StatNumber>
                    </Stat>
                  </GridItem>

                  <GridItem>
                    <Stat>
                      <StatLabel>Events Experienced</StatLabel>
                      <StatNumber>{stats.eventsExperienced}</StatNumber>
                    </Stat>
                  </GridItem>

                  <GridItem>
                    <Stat>
                      <StatLabel>Jobs Applied</StatLabel>
                      <StatNumber>{stats.jobsApplied}</StatNumber>
                      <StatHelpText>{stats.jobsAccepted} accepted</StatHelpText>
                    </Stat>
                  </GridItem>

                  <GridItem>
                    <Stat>
                      <StatLabel>Projects Completed</StatLabel>
                      <StatNumber>{stats.projectsCompleted}</StatNumber>
                    </Stat>
                  </GridItem>

                  <GridItem>
                    <Stat>
                      <StatLabel>Skills Learned</StatLabel>
                      <StatNumber>{stats.skillsLearned}</StatNumber>
                    </Stat>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>

        {/* Right Column - Actions and Skills */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            {/* Quick Actions */}
            <Card bg={cardBg} shadow="sm">
              <CardHeader pb={0}>
                <Heading size="sm">Quick Actions</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={3}>
                  <Button
                    leftIcon={<Coffee size={18} />}
                    colorScheme="teal"
                    width="full"
                    onClick={() => {
                      modifyEnergy(20);
                      modifyStress(-10);
                      handleAdvanceTime("day");

                      addNotification({
                        title: "Rest Day",
                        description: "You took a day off to rest and recover.",
                        type: "success",
                      });
                    }}
                  >
                    Rest for a Day
                  </Button>

                  <Button
                    leftIcon={<Brain size={18} />}
                    colorScheme="purple"
                    width="full"
                    onClick={onMemoryGameOpen}
                  >
                    Practice Memory Skills
                  </Button>

                  <Button
                    leftIcon={<TrendingUp size={18} />}
                    colorScheme="yellow"
                    width="full"
                    onClick={onLogicGameOpen}
                  >
                    Logic Puzzle Training
                  </Button>

                  <Button
                    leftIcon={<FileText size={18} />}
                    colorScheme="blue"
                    width="full"
                    onClick={() => navigate("/resume")}
                  >
                    Update Resume
                  </Button>

                  <Button
                    leftIcon={<Users size={18} />}
                    colorScheme="green"
                    width="full"
                    onClick={() => {
                      modifyEnergy(-10);
                      handleAdvanceTime("day");

                      // Random chance to improve networking
                      if (Math.random() > 0.7) {
                        // Improve communication skill
                        const currentLevel = characterSkills.communication || 1;
                        useCharacterStore
                          .getState()
                          .setSkill(
                            "communication",
                            Math.min(5, currentLevel + 0.1)
                          );

                        addNotification({
                          title: "Networking Success",
                          description:
                            "You made valuable connections at a networking event!",
                          type: "success",
                        });
                      } else {
                        addNotification({
                          title: "Networking Event",
                          description:
                            "You attended a networking event but didn't make any significant connections.",
                          type: "info",
                        });
                      }
                    }}
                  >
                    Attend Networking Event
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            {/* Key Skills */}
            <Card bg={cardBg} shadow="sm">
              <CardHeader pb={0}>
                <Heading size="sm">Key Skills</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={3} align="stretch">
                  {getMostImportantSkills().map((skill, index) => (
                    <HStack key={index} justify="space-between">
                      <Text>{skill.name}</Text>
                      <HStack>
                        <Progress
                          value={(skill.level / 5) * 100}
                          colorScheme="green"
                          size="sm"
                          width="100px"
                          borderRadius="full"
                        />
                        <Badge
                          colorScheme={
                            skill.level >= 4
                              ? "green"
                              : skill.level >= 3
                              ? "blue"
                              : skill.level >= 2
                              ? "yellow"
                              : "gray"
                          }
                        >
                          {skill.level.toFixed(1)}/5
                        </Badge>
                      </HStack>
                    </HStack>
                  ))}

                  <Divider />

                  <Button
                    size="sm"
                    rightIcon={<ChevronRight size={16} />}
                    variant="outline"
                    colorScheme="blue"
                    onClick={() => navigate("/character-creation")}
                  >
                    View All Skills
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            {/* Core Attributes */}
            <Card bg={cardBg} shadow="sm">
              <CardHeader pb={0}>
                <Heading size="sm">Core Attributes</Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  {Object.entries(characterAttrs).map(([key, value]) => (
                    <GridItem key={key}>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" fontWeight="bold">
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).replace("_", " ")}
                        </Text>
                        <HStack width="100%" spacing={2}>
                          <Progress
                            value={(value / 10) * 100}
                            colorScheme="blue"
                            size="sm"
                            flex="1"
                            borderRadius="full"
                          />
                          <Badge>{value}/10</Badge>
                        </HStack>
                      </VStack>
                    </GridItem>
                  ))}
                </Grid>
              </CardBody>
            </Card>

            {/* Notifications */}
            {notifications.length > 0 && (
              <Box position="fixed" bottom="20px" right="20px" zIndex="100">
                <VStack spacing={2} align="stretch">
                  {notifications.map((notification) => (
                    <Card
                      key={notification.id}
                      bg={
                        notification.type === "success"
                          ? "green.500"
                          : notification.type === "error"
                          ? "red.500"
                          : notification.type === "warning"
                          ? "orange.500"
                          : "blue.500"
                      }
                      color="white"
                      p={3}
                      borderRadius="md"
                      boxShadow="md"
                      maxW="300px"
                      className="fade-in"
                    >
                      <HStack align="start">
                        <Icon
                          as={
                            notification.type === "success"
                              ? CheckCircle
                              : notification.type === "error"
                              ? AlertCircle
                              : notification.type === "warning"
                              ? AlertCircle
                              : Bell
                          }
                          mt={1}
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold">{notification.title}</Text>
                          <Text fontSize="sm">{notification.description}</Text>
                        </VStack>
                      </HStack>
                    </Card>
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        </GridItem>
      </Grid>

      {/* Minigames */}
      <MemoryGame
        isOpen={isMemoryGameOpen}
        onClose={onMemoryGameClose}
        context="skill_development"
        difficulty="normal"
        onComplete={(result) => handleMinigameComplete("memory", result)}
      />

      <LogicGame
        isOpen={isLogicGameOpen}
        onClose={onLogicGameClose}
        context="skill_development"
        difficulty="normal"
        onComplete={(result) => handleMinigameComplete("logic", result)}
      />

      {/* Random Events Modal */}
      <GameEvent />
    </Box>
  );
};

export default Dashboard;
