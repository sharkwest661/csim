// pages/CareerPage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  Badge,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
  Flex,
  Icon,
  Avatar,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  List,
  ListItem,
  ListIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  ChevronRight,
  CreditCard,
  FilePlus,
  FileText,
  Search,
  Coffee,
  Users,
  TrendingUp,
  Heart,
  Clock,
  Copy,
  MessageSquare,
  Award,
  Laptop,
} from "lucide-react";
import { useCareerStore } from "../store/careerStore";
import { useCharacterStore } from "../store/characterStore";
import { useResumeStore } from "../store/resumeStore";
import { useGameStore } from "../store/gameStore";
import { useGameEventsStore } from "../store/gameEventsStore";
import { useDataStore } from "../store/dataStore";

const CareerPage = () => {
  const toast = useToast();
  const {
    isOpen: isJobModalOpen,
    onOpen: onJobModalOpen,
    onClose: onJobModalClose,
  } = useDisclosure();
  const {
    isOpen: isInterviewModalOpen,
    onOpen: onInterviewModalOpen,
    onClose: onInterviewModalClose,
  } = useDisclosure();

  // Career state
  const career = useCareerStore((state) => ({
    currentJob: state.currentJob,
    workExperiences: state.workExperiences,
    applications: state.applications,
    interviews: state.interviews,
    internships: state.internships,
    careerLevel: state.careerLevel,
    careerTrack: state.careerTrack,
    yearsOfExperience: state.yearsOfExperience,
    salary: state.salary,
    satisfaction: state.satisfaction,
  }));

  // Career actions
  const applyForJob = useCareerStore((state) => state.applyForJob);
  const updateApplicationStatus = useCareerStore(
    (state) => state.updateApplicationStatus
  );
  const scheduleInterview = useCareerStore((state) => state.scheduleInterview);
  const completeInterview = useCareerStore((state) => state.completeInterview);
  const acceptJobOffer = useCareerStore((state) => state.acceptJobOffer);
  const leaveCurrentJob = useCareerStore((state) => state.leaveCurrentJob);

  // Character state
  const character = useCharacterStore((state) => ({
    name: state.name,
    attributes: state.attributes,
    skills: state.skills,
  }));

  // Resume state
  const resumeQuality = useResumeStore((state) => state.qualityScore);
  const resumeLevel = useResumeStore((state) => state.qualityLevel);

  // Game events
  const gameDate = useGameEventsStore((state) => state.currentDate);
  const energy = useGameEventsStore((state) => state.energy);
  const stress = useGameEventsStore((state) => state.stress);
  const advanceTime = useGameEventsStore((state) => state.advanceTime);
  const modifyEnergy = useGameEventsStore((state) => state.modifyEnergy);
  const modifyStress = useGameEventsStore((state) => state.modifyStress);

  // Data store for job listings
  const generateJobListings = useDataStore(
    (state) => state.generateJobListings
  );
  const getCompany = useDataStore((state) => state.getCompany);

  // Local state
  const [activeJobTab, setActiveJobTab] = useState(0);
  const [jobListings, setJobListings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [isLeavingJob, setIsLeavingJob] = useState(false);

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AZN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate application success probability
  const calculateSuccessProbability = (job) => {
    // Base probability
    let probability = 0.5;

    // Resume quality factor (major impact)
    const resumeFactor = resumeQuality / 10; // 0 to 1 scale
    probability += resumeFactor * 0.3; // Up to 30% boost

    // Experience factor
    const experienceFactor = Math.min(1, career.yearsOfExperience / 5); // Cap at 5 years
    probability += experienceFactor * 0.1; // Up to 10% boost

    // Skills match factor
    let skillsMatch = 0;
    if (job.requiredSkills && job.requiredSkills.length > 0) {
      const matchedSkills = job.requiredSkills.filter((skillId) => {
        const skillKey = skillId.replace("-", "_");
        return character.skills[skillKey] && character.skills[skillKey] >= 3;
      }).length;

      skillsMatch = matchedSkills / job.requiredSkills.length;
    }
    probability += skillsMatch * 0.2; // Up to 20% boost

    // Level match factor (penalize applying for jobs too far above your level)
    const levelMap = {
      entry: 1,
      mid: 2,
      senior: 3,
      management: 4,
      executive: 5,
    };
    const resumeLevelMap = {
      entry: 1,
      professional: 2,
      distinguished: 3,
      executive: 4,
    };

    const jobLevelValue = levelMap[job.level] || 1;
    const userLevelValue = resumeLevelMap[resumeLevel] || 1;

    if (jobLevelValue > userLevelValue + 1) {
      // Severe penalty for applying way above your level
      probability -= 0.4;
    } else if (jobLevelValue > userLevelValue) {
      // Moderate penalty for applying above your level
      probability -= 0.2;
    }

    // Cap probability
    probability = Math.max(0.1, Math.min(0.9, probability));

    return probability;
  };

  // Search for jobs
  const searchForJobs = () => {
    setIsSearching(true);

    // Consume energy for job search
    modifyEnergy(-10);
    modifyStress(5);

    // Advance time by 3 days
    advanceTime(3);

    setTimeout(() => {
      // Generate job listings based on career level
      let level = null;
      if (resumeLevel === "entry") {
        level = "entry";
      } else if (resumeLevel === "professional") {
        level = Math.random() > 0.3 ? "mid" : "entry";
      } else if (resumeLevel === "distinguished") {
        level = Math.random() > 0.6 ? "senior" : "mid";
      } else {
        level = Math.random() > 0.7 ? "management" : "senior";
      }

      const newListings = generateJobListings(5, level);
      setJobListings(newListings);
      setIsSearching(false);

      toast({
        title: "Job Search Completed",
        description: `Found ${newListings.length} job listings matching your profile.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 1500);
  };

  // Apply for selected job
  const applyForSelectedJob = () => {
    if (!selectedJob) return;

    // Consume energy
    modifyEnergy(-5);
    modifyStress(10);

    // Advance time by 1 day
    advanceTime(1);

    // Apply for job
    applyForJob(selectedJob);

    // Close modal
    onJobModalClose();

    toast({
      title: "Application Submitted",
      description: `Your application for ${selectedJob.title} at ${selectedJob.company} has been submitted.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Process application result after a delay
    setTimeout(() => {
      // Determine application success
      const success = Math.random() < calculateSuccessProbability(selectedJob);

      if (success) {
        // Application successful, schedule interview
        const applicationId =
          career.applications[career.applications.length - 1].id;

        updateApplicationStatus(applicationId, "interview");

        const interviewDate = new Date();
        interviewDate.setDate(interviewDate.getDate() + 7); // Interview in 7 days

        scheduleInterview(applicationId, {
          company: selectedJob.company,
          position: selectedJob.title,
          date: interviewDate.toISOString(),
          type: "technical", // First interview is technical
        });

        toast({
          title: "Interview Invitation",
          description: `${
            selectedJob.company
          } has invited you for an interview on ${formatDate(
            interviewDate.toISOString()
          )}.`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else {
        // Application rejected
        const applicationId =
          career.applications[career.applications.length - 1].id;
        updateApplicationStatus(applicationId, "rejected");

        toast({
          title: "Application Rejected",
          description: `${selectedJob.company} has rejected your application. Keep trying!`,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    }, 5000);
  };

  // Prepare for interview
  const prepareForInterview = () => {
    if (!selectedInterview) return;

    setIsInterviewing(true);

    // Consume energy for interview preparation
    modifyEnergy(-15);
    modifyStress(15);

    // Advance time to interview date
    const interviewDate = new Date(selectedInterview.date);
    const currentDate = gameDate ? new Date(gameDate) : new Date();
    const daysDiff = Math.floor(
      (interviewDate - currentDate) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff > 0) {
      advanceTime(daysDiff);
    }

    // Simulate interview process
    setTimeout(() => {
      // Determine interview success based on attributes and skills
      const interviewType = selectedInterview.type;

      let successProbability = 0.5; // Base probability

      if (interviewType === "technical") {
        // Technical interview success based on intelligence and technical skills
        const intelligenceBonus = character.attributes.intelligence * 0.05; // Up to 50% boost

        // Check for relevant technical skills
        const relevantSkills = [
          "programming_fundamentals",
          "web_development",
          "mobile_development",
          "database_management",
        ];
        let skillsAverage = 0;
        relevantSkills.forEach((skill) => {
          skillsAverage += character.skills[skill] || 0;
        });
        skillsAverage /= relevantSkills.length;

        const skillsBonus = skillsAverage * 0.08; // Up to 40% boost

        successProbability += intelligenceBonus + skillsBonus;
      } else if (interviewType === "hr") {
        // HR interview success based on charisma and soft skills
        const charismaBonus = character.attributes.charisma * 0.06; // Up to 60% boost

        // Check for relevant soft skills
        const relevantSkills = ["communication", "teamwork"];
        let skillsAverage = 0;
        relevantSkills.forEach((skill) => {
          skillsAverage += character.skills[skill] || 0;
        });
        skillsAverage /= relevantSkills.length;

        const skillsBonus = skillsAverage * 0.06; // Up to 30% boost

        successProbability += charismaBonus + skillsBonus;
      } else if (interviewType === "final") {
        // Final interview considers overall fit
        const charismaBonus = character.attributes.charisma * 0.04;
        const intelligenceBonus = character.attributes.intelligence * 0.03;
        const adaptabilityBonus = character.attributes.adaptability * 0.03;

        successProbability +=
          charismaBonus + intelligenceBonus + adaptabilityBonus;
      }

      // Resume quality impact
      successProbability += (resumeQuality / 10) * 0.2;

      // Cap probability
      successProbability = Math.max(0.1, Math.min(0.9, successProbability));

      // Determine outcome
      const success = Math.random() < successProbability;

      // Complete the interview
      completeInterview(
        selectedInterview.id,
        success ? "passed" : "failed",
        `${
          success ? "Successfully completed" : "Failed"
        } ${interviewType} interview.`
      );

      if (success) {
        if (interviewType === "technical") {
          // Schedule HR interview next
          const applicationId = selectedInterview.applicationId;
          const hrInterviewDate = new Date();
          hrInterviewDate.setDate(hrInterviewDate.getDate() + 3); // HR interview in 3 days

          scheduleInterview(applicationId, {
            company: selectedInterview.company,
            position: selectedInterview.position,
            date: hrInterviewDate.toISOString(),
            type: "hr",
          });

          toast({
            title: "Technical Interview Passed",
            description: `You passed the technical interview at ${
              selectedInterview.company
            }. HR interview scheduled for ${formatDate(
              hrInterviewDate.toISOString()
            )}.`,
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        } else if (interviewType === "hr") {
          // Schedule final interview
          const applicationId = selectedInterview.applicationId;
          const finalInterviewDate = new Date();
          finalInterviewDate.setDate(finalInterviewDate.getDate() + 5); // Final interview in 5 days

          scheduleInterview(applicationId, {
            company: selectedInterview.company,
            position: selectedInterview.position,
            date: finalInterviewDate.toISOString(),
            type: "final",
          });

          toast({
            title: "HR Interview Passed",
            description: `You passed the HR interview at ${
              selectedInterview.company
            }. Final interview with management scheduled for ${formatDate(
              finalInterviewDate.toISOString()
            )}.`,
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        } else if (interviewType === "final") {
          // Final interview passed, receive job offer
          const application = career.applications.find(
            (app) => app.id === selectedInterview.applicationId
          );
          if (application) {
            updateApplicationStatus(application.id, "offer", {
              salaryOffered: application.jobDetails.salary,
            });

            toast({
              title: "Job Offer Received!",
              description: `Congratulations! ${
                selectedInterview.company
              } has offered you the position of ${
                selectedInterview.position
              } with a salary of ${formatCurrency(
                application.jobDetails.salary
              )}/month.`,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          }
        }
      } else {
        // Interview failed
        toast({
          title: `${
            interviewType.charAt(0).toUpperCase() + interviewType.slice(1)
          } Interview Failed`,
          description: `Unfortunately, you didn't pass the ${interviewType} interview at ${selectedInterview.company}. Learn from this experience and try again!`,
          status: "error",
          duration: 4000,
          isClosable: true,
        });

        // Update application status to rejected
        const applicationId = selectedInterview.applicationId;
        updateApplicationStatus(applicationId, "rejected");
      }

      setIsInterviewing(false);
      onInterviewModalClose();
    }, 2000);
  };

  // Accept job offer
  const acceptOffer = (application) => {
    // Consume energy
    modifyEnergy(-5);

    // Advance time by 1 day
    advanceTime(1);

    // Accept the job offer
    acceptJobOffer(application.id, {
      salary: application.salaryOffered,
      responsibilities: [
        "Developing and maintaining software applications",
        "Collaborating with cross-functional teams",
        "Participating in code reviews and technical discussions",
      ],
    });

    toast({
      title: "Job Accepted",
      description: `You've accepted the position of ${application.position} at ${application.company}. Your career journey continues!`,
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    // Update resume
    useGameStore.getState().syncResume();
  };

  // Resign from current job
  const resignFromJob = () => {
    setIsLeavingJob(true);

    // Consume energy
    modifyEnergy(-10);
    modifyStress(10);

    // Advance time by 14 days (2 weeks notice)
    advanceTime(14);

    setTimeout(() => {
      // Leave current job
      leaveCurrentJob("Voluntary resignation for career growth");

      setIsLeavingJob(false);

      toast({
        title: "Resignation Complete",
        description:
          "You've successfully resigned from your position. Time to look for new opportunities!",
        status: "info",
        duration: 4000,
        isClosable: true,
      });

      // Update resume
      useGameStore.getState().syncResume();
    }, 1500);
  };

  // Work for a day
  const workForDay = () => {
    // Consume energy for work
    modifyEnergy(-15);
    modifyStress(10);

    // Advance time by 1 day
    advanceTime(1);

    // Random work event
    const eventTypes = ["normal", "positive", "negative"];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    if (eventType === "normal") {
      toast({
        title: "Regular Workday",
        description:
          "You completed your tasks for the day without any notable events.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } else if (eventType === "positive") {
      toast({
        title: "Productive Day",
        description:
          "You had a productive day and received positive feedback from your manager!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Add a small chance to develop skills
      if (Math.random() < 0.3) {
        // Improve a random technical skill
        const technicalSkills = [
          "programming_fundamentals",
          "web_development",
          "mobile_development",
          "database_management",
        ];
        const randomSkill =
          technicalSkills[Math.floor(Math.random() * technicalSkills.length)];

        const currentLevel = character.skills[randomSkill] || 1;
        useCharacterStore
          .getState()
          .setSkill(randomSkill, Math.min(5, currentLevel + 0.1));

        toast({
          title: "Skill Improved",
          description: `Your ${randomSkill.replace(
            "_",
            " "
          )} skill has slightly improved through work experience.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } else if (eventType === "negative") {
      toast({
        title: "Challenging Day",
        description:
          "You faced some difficulties at work today. It was stressful, but you managed to get through it.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });

      // Additional stress
      modifyStress(5);
    }
  };

  // Rest for a day
  const restForDay = () => {
    // Recover energy and reduce stress
    modifyEnergy(25);
    modifyStress(-15);

    // Advance time by 1 day
    advanceTime(1);

    toast({
      title: "Rest Day",
      description:
        "You took a day off to rest and recover. Your energy is replenished and stress is reduced.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Initialize job listings on mount
  useEffect(() => {
    if (jobListings.length === 0) {
      searchForJobs();
    }
  }, []);

  return (
    <Box mb={8}>
      <Heading size="xl" mb={6}>
        Career
      </Heading>

      {/* Game Date Display */}
      {gameDate && (
        <Text fontSize="md" color="gray.500" mb={4}>
          Current Date: {formatDate(gameDate)}
        </Text>
      )}

      {/* Current Job Status */}
      <Card bg={cardBg} shadow="md" mb={6}>
        <CardHeader>
          <HStack justifyContent="space-between">
            <Heading size="md">Current Employment Status</Heading>
            <Badge
              colorScheme={career.currentJob ? "green" : "blue"}
              fontSize="md"
              px={2}
              py={1}
            >
              {career.currentJob ? "Employed" : "Seeking Work"}
            </Badge>
          </HStack>
        </CardHeader>
        <CardBody>
          {career.currentJob ? (
            <VStack spacing={6} align="stretch">
              <HStack>
                <Avatar
                  bg={useColorModeValue("blue.500", "blue.200")}
                  icon={<Building size={24} />}
                  size="lg"
                />
                <VStack align="start" spacing={0}>
                  <Heading size="md">{career.currentJob.position}</Heading>
                  <Text>{career.currentJob.company}</Text>
                  <HStack fontSize="sm" color="gray.500">
                    <Calendar size={14} />
                    <Text>
                      Started {formatDate(career.currentJob.startDate)}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                gap={6}
              >
                <GridItem>
                  <Stat>
                    <StatLabel>Monthly Salary</StatLabel>
                    <StatNumber>{formatCurrency(career.salary)}</StatNumber>
                    <StatHelpText>
                      {career.salary > 2000
                        ? "Above average"
                        : career.salary > 1000
                        ? "Average"
                        : "Entry level"}
                    </StatHelpText>
                  </Stat>
                </GridItem>

                <GridItem>
                  <Stat>
                    <StatLabel>Career Level</StatLabel>
                    <StatNumber>
                      {career.careerLevel.charAt(0).toUpperCase() +
                        career.careerLevel.slice(1)}
                    </StatNumber>
                    <StatHelpText>
                      {career.yearsOfExperience.toFixed(1)} years experience
                    </StatHelpText>
                  </Stat>
                </GridItem>

                <GridItem>
                  <Stat>
                    <StatLabel>Job Satisfaction</StatLabel>
                    <StatNumber>{career.satisfaction}/10</StatNumber>
                    <StatHelpText>
                      {career.satisfaction >= 8
                        ? "Very satisfied"
                        : career.satisfaction >= 6
                        ? "Satisfied"
                        : career.satisfaction >= 4
                        ? "Neutral"
                        : "Dissatisfied"}
                    </StatHelpText>
                  </Stat>
                </GridItem>
              </Grid>

              <Divider />

              <Box>
                <Heading size="sm" mb={3}>
                  Responsibilities
                </Heading>
                {career.currentJob.responsibilities &&
                career.currentJob.responsibilities.length > 0 ? (
                  <List spacing={2}>
                    {career.currentJob.responsibilities.map((resp, index) => (
                      <ListItem key={index}>
                        <ListIcon as={ChevronRight} color="green.500" />
                        {resp}
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Text fontStyle="italic">
                    No specific responsibilities listed
                  </Text>
                )}
              </Box>

              <Box>
                <Heading size="sm" mb={3}>
                  Projects
                </Heading>
                {career.currentJob.projects &&
                career.currentJob.projects.length > 0 ? (
                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    gap={4}
                  >
                    {career.currentJob.projects.map((project, index) => (
                      <GridItem key={index}>
                        <Card variant="outline" size="sm">
                          <CardBody>
                            <Text fontWeight="bold">{project.name}</Text>
                            <Text fontSize="sm">{project.description}</Text>
                          </CardBody>
                        </Card>
                      </GridItem>
                    ))}
                  </Grid>
                ) : (
                  <Text fontStyle="italic">No active projects</Text>
                )}
              </Box>

              <Divider />

              <HStack spacing={4}>
                <Button
                  leftIcon={<Briefcase size={18} />}
                  colorScheme="blue"
                  onClick={workForDay}
                >
                  Work for a Day
                </Button>

                <Button
                  leftIcon={<Coffee size={18} />}
                  variant="outline"
                  colorScheme="green"
                  onClick={restForDay}
                >
                  Rest for a Day
                </Button>

                <Button
                  leftIcon={<FilePlus size={18} />}
                  variant="outline"
                  colorScheme="purple"
                  onClick={searchForJobs}
                  isLoading={isSearching}
                  loadingText="Searching..."
                >
                  Look for New Jobs
                </Button>

                <Spacer />

                <Button
                  leftIcon={<Copy size={18} />}
                  colorScheme="red"
                  variant="outline"
                  onClick={resignFromJob}
                  isLoading={isLeavingJob}
                  loadingText="Resigning..."
                >
                  Resign
                </Button>
              </HStack>
            </VStack>
          ) : (
            <VStack spacing={6} align="stretch">
              <Box p={6} textAlign="center">
                <Icon as={Briefcase} boxSize={16} color="gray.400" mb={4} />
                <Heading size="md" mb={2}>
                  You are currently unemployed
                </Heading>
                <Text>
                  Search for job opportunities and apply to positions that match
                  your skills and experience.
                </Text>
              </Box>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                gap={6}
              >
                <GridItem>
                  <Stat>
                    <StatLabel>Resume Quality</StatLabel>
                    <StatNumber>{resumeQuality.toFixed(1)}/10</StatNumber>
                    <StatHelpText>
                      {resumeLevel.charAt(0).toUpperCase() +
                        resumeLevel.slice(1)}{" "}
                      Level
                    </StatHelpText>
                  </Stat>
                </GridItem>

                <GridItem>
                  <Stat>
                    <StatLabel>Experience</StatLabel>
                    <StatNumber>
                      {career.yearsOfExperience.toFixed(1)} years
                    </StatNumber>
                    <StatHelpText>
                      {career.careerLevel.charAt(0).toUpperCase() +
                        career.careerLevel.slice(1)}{" "}
                      Level
                    </StatHelpText>
                  </Stat>
                </GridItem>

                <GridItem>
                  <Stat>
                    <StatLabel>Job Applications</StatLabel>
                    <StatNumber>{career.applications.length}</StatNumber>
                    <StatHelpText>
                      {
                        career.applications.filter(
                          (app) => app.status === "offer"
                        ).length
                      }{" "}
                      offers received
                    </StatHelpText>
                  </Stat>
                </GridItem>
              </Grid>

              <Divider />

              <HStack spacing={4}>
                <Button
                  leftIcon={<Search size={18} />}
                  colorScheme="blue"
                  onClick={searchForJobs}
                  isLoading={isSearching}
                  loadingText="Searching..."
                >
                  Search for Jobs
                </Button>

                <Button
                  leftIcon={<FileText size={18} />}
                  variant="outline"
                  colorScheme="purple"
                  onClick={() => {
                    useGameStore.getState().syncResume();
                    toast({
                      title: "Resume Updated",
                      description:
                        "Your resume has been updated with your latest achievements.",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
                  }}
                >
                  Update Resume
                </Button>

                <Button
                  leftIcon={<Coffee size={18} />}
                  variant="outline"
                  colorScheme="green"
                  onClick={restForDay}
                >
                  Rest for a Day
                </Button>
              </HStack>
            </VStack>
          )}
        </CardBody>
      </Card>

      {/* Job Listings & Applications Tabs */}
      <Tabs
        colorScheme="blue"
        mb={6}
        index={activeJobTab}
        onChange={setActiveJobTab}
      >
        <TabList>
          <Tab>Job Listings</Tab>
          <Tab>Applications</Tab>
          <Tab>Interviews</Tab>
          <Tab>Job Offers</Tab>
        </TabList>

        <TabPanels>
          {/* Job Listings Tab */}
          <TabPanel px={0}>
            <Card bg={cardBg} shadow="sm">
              <CardHeader>
                <HStack justifyContent="space-between">
                  <Heading size="sm">Available Positions</Heading>
                  <Button
                    size="sm"
                    leftIcon={<Search size={14} />}
                    onClick={searchForJobs}
                    isLoading={isSearching}
                    colorScheme="blue"
                    variant="outline"
                  >
                    Refresh Listings
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody>
                {jobListings.length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    {jobListings.map((job) => {
                      const successProbability =
                        calculateSuccessProbability(job);
                      let probabilityColor = "red";
                      if (successProbability >= 0.7) probabilityColor = "green";
                      else if (successProbability >= 0.4)
                        probabilityColor = "orange";

                      // Check if already applied
                      const alreadyApplied = career.applications.some(
                        (app) =>
                          app.company === job.company &&
                          app.position === job.title
                      );

                      return (
                        <Card key={job.id} variant="outline" size="sm">
                          <CardBody>
                            <Grid
                              templateColumns={{ base: "1fr", md: "3fr 1fr" }}
                              gap={4}
                            >
                              <GridItem>
                                <VStack align="start" spacing={1}>
                                  <HStack>
                                    <Heading size="sm">{job.title}</Heading>
                                    <Badge
                                      colorScheme={
                                        job.level === "entry"
                                          ? "blue"
                                          : job.level === "mid"
                                          ? "green"
                                          : job.level === "senior"
                                          ? "purple"
                                          : "orange"
                                      }
                                    >
                                      {job.level.charAt(0).toUpperCase() +
                                        job.level.slice(1)}
                                    </Badge>
                                  </HStack>
                                  <Text>
                                    {job.company} - {job.location}
                                  </Text>
                                  <Text fontSize="sm" noOfLines={2}>
                                    {job.description}
                                  </Text>

                                  <HStack mt={2} spacing={4}>
                                    <Badge
                                      colorScheme="green"
                                      variant="outline"
                                    >
                                      {formatCurrency(job.salary)}/month
                                    </Badge>

                                    {job.remote && (
                                      <Badge
                                        colorScheme="blue"
                                        variant="outline"
                                      >
                                        Remote
                                      </Badge>
                                    )}

                                    <Badge colorScheme={probabilityColor}>
                                      {Math.round(successProbability * 100)}%
                                      Match
                                    </Badge>
                                  </HStack>
                                </VStack>
                              </GridItem>

                              <GridItem>
                                <VStack h="100%" justify="center">
                                  <Button
                                    colorScheme="blue"
                                    width="full"
                                    onClick={() => {
                                      setSelectedJob(job);
                                      onJobModalOpen();
                                    }}
                                    isDisabled={alreadyApplied}
                                  >
                                    {alreadyApplied
                                      ? "Applied"
                                      : "View & Apply"}
                                  </Button>
                                </VStack>
                              </GridItem>
                            </Grid>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </VStack>
                ) : (
                  <Box p={6} textAlign="center">
                    <Text>
                      No job listings available. Click "Refresh Listings" to
                      search for new opportunities.
                    </Text>
                  </Box>
                )}
              </CardBody>
            </Card>
          </TabPanel>

          {/* Applications Tab */}
          <TabPanel px={0}>
            <Card bg={cardBg} shadow="sm">
              <CardHeader>
                <Heading size="sm">Your Applications</Heading>
              </CardHeader>
              <CardBody>
                {career.applications.length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    {career.applications.map((application) => (
                      <Card key={application.id} variant="outline" size="sm">
                        <CardBody>
                          <Grid
                            templateColumns={{ base: "1fr", md: "3fr 1fr" }}
                            gap={4}
                          >
                            <GridItem>
                              <VStack align="start" spacing={1}>
                                <HStack>
                                  <Heading size="sm">
                                    {application.position}
                                  </Heading>
                                  <Badge
                                    colorScheme={
                                      application.status === "applied"
                                        ? "blue"
                                        : application.status === "interview"
                                        ? "purple"
                                        : application.status === "offer"
                                        ? "green"
                                        : "red"
                                    }
                                  >
                                    {application.status
                                      .charAt(0)
                                      .toUpperCase() +
                                      application.status.slice(1)}
                                  </Badge>
                                </HStack>
                                <Text>{application.company}</Text>
                                <Text fontSize="sm" color="gray.500">
                                  Applied on{" "}
                                  {formatDate(application.dateApplied)}
                                </Text>

                                {application.status === "offer" && (
                                  <HStack mt={2}>
                                    <Badge
                                      colorScheme="green"
                                      variant="outline"
                                    >
                                      Salary Offered:{" "}
                                      {formatCurrency(
                                        application.salaryOffered
                                      )}
                                      /month
                                    </Badge>
                                  </HStack>
                                )}
                              </VStack>
                            </GridItem>

                            <GridItem>
                              <VStack h="100%" justify="center">
                                {application.status === "offer" && (
                                  <Button
                                    colorScheme="green"
                                    width="full"
                                    onClick={() => acceptOffer(application)}
                                  >
                                    Accept Offer
                                  </Button>
                                )}

                                {application.status === "rejected" && (
                                  <Text fontSize="sm" color="red.500">
                                    Application rejected
                                  </Text>
                                )}

                                {application.status === "applied" && (
                                  <Text fontSize="sm" color="blue.500">
                                    Awaiting response
                                  </Text>
                                )}

                                {application.status === "interview" && (
                                  <Text fontSize="sm" color="purple.500">
                                    Interview scheduled
                                  </Text>
                                )}
                              </VStack>
                            </GridItem>
                          </Grid>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                ) : (
                  <Box p={6} textAlign="center">
                    <Text>
                      You haven't applied to any jobs yet. Browse job listings
                      to start applying.
                    </Text>
                  </Box>
                )}
              </CardBody>
            </Card>
          </TabPanel>

          {/* Interviews Tab */}
          <TabPanel px={0}>
            <Card bg={cardBg} shadow="sm">
              <CardHeader>
                <Heading size="sm">Your Interviews</Heading>
              </CardHeader>
              <CardBody>
                {career.interviews.length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    {career.interviews.map((interview) => (
                      <Card key={interview.id} variant="outline" size="sm">
                        <CardBody>
                          <Grid
                            templateColumns={{ base: "1fr", md: "3fr 1fr" }}
                            gap={4}
                          >
                            <GridItem>
                              <VStack align="start" spacing={1}>
                                <HStack>
                                  <Heading size="sm">
                                    {interview.position}
                                  </Heading>
                                  <Badge
                                    colorScheme={
                                      interview.type === "technical"
                                        ? "blue"
                                        : interview.type === "hr"
                                        ? "purple"
                                        : "green"
                                    }
                                  >
                                    {interview.type.charAt(0).toUpperCase() +
                                      interview.type.slice(1)}{" "}
                                    Interview
                                  </Badge>

                                  {interview.completed && (
                                    <Badge
                                      colorScheme={
                                        interview.result === "passed"
                                          ? "green"
                                          : "red"
                                      }
                                    >
                                      {interview.result === "passed"
                                        ? "Passed"
                                        : "Failed"}
                                    </Badge>
                                  )}
                                </HStack>
                                <Text>{interview.company}</Text>
                                <Text fontSize="sm" color="gray.500">
                                  Scheduled for {formatDate(interview.date)}
                                </Text>

                                {interview.notes && (
                                  <Text fontSize="sm" mt={1}>
                                    {interview.notes}
                                  </Text>
                                )}
                              </VStack>
                            </GridItem>

                            <GridItem>
                              <VStack h="100%" justify="center">
                                {!interview.completed && (
                                  <Button
                                    colorScheme="purple"
                                    width="full"
                                    onClick={() => {
                                      setSelectedInterview(interview);
                                      onInterviewModalOpen();
                                    }}
                                  >
                                    Prepare & Attend
                                  </Button>
                                )}

                                {interview.completed && (
                                  <Text
                                    fontSize="sm"
                                    color={
                                      interview.result === "passed"
                                        ? "green.500"
                                        : "red.500"
                                    }
                                  >
                                    {interview.result === "passed"
                                      ? "Interview successful"
                                      : "Interview unsuccessful"}
                                  </Text>
                                )}
                              </VStack>
                            </GridItem>
                          </Grid>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                ) : (
                  <Box p={6} textAlign="center">
                    <Text>
                      You don't have any interviews scheduled. Apply to jobs to
                      receive interview invitations.
                    </Text>
                  </Box>
                )}
              </CardBody>
            </Card>
          </TabPanel>

          {/* Job Offers Tab */}
          <TabPanel px={0}>
            <Card bg={cardBg} shadow="sm">
              <CardHeader>
                <Heading size="sm">Job Offers</Heading>
              </CardHeader>
              <CardBody>
                {career.applications.filter((app) => app.status === "offer")
                  .length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    {career.applications
                      .filter((app) => app.status === "offer")
                      .map((offer) => (
                        <Card key={offer.id} variant="outline" size="sm">
                          <CardBody>
                            <Grid
                              templateColumns={{ base: "1fr", md: "3fr 1fr" }}
                              gap={4}
                            >
                              <GridItem>
                                <VStack align="start" spacing={2}>
                                  <Heading size="sm">{offer.position}</Heading>
                                  <Text>{offer.company}</Text>

                                  <HStack mt={2}>
                                    <Icon as={CreditCard} color="green.500" />
                                    <Text fontWeight="bold">
                                      Salary:{" "}
                                      {formatCurrency(offer.salaryOffered)}
                                      /month
                                    </Text>
                                  </HStack>

                                  <Text fontSize="sm" color="gray.500">
                                    This offer will expire soon. Make your
                                    decision!
                                  </Text>
                                </VStack>
                              </GridItem>

                              <GridItem>
                                <VStack h="100%" justify="center" spacing={3}>
                                  <Button
                                    colorScheme="green"
                                    width="full"
                                    onClick={() => acceptOffer(offer)}
                                  >
                                    Accept Offer
                                  </Button>

                                  <Button
                                    variant="outline"
                                    colorScheme="red"
                                    size="sm"
                                    width="full"
                                    onClick={() => {
                                      updateApplicationStatus(
                                        offer.id,
                                        "rejected",
                                        {
                                          reasonForRejection:
                                            "Better opportunity elsewhere",
                                        }
                                      );

                                      toast({
                                        title: "Offer Declined",
                                        description: `You've declined the job offer from ${offer.company}.`,
                                        status: "info",
                                        duration: 3000,
                                        isClosable: true,
                                      });
                                    }}
                                  >
                                    Decline
                                  </Button>
                                </VStack>
                              </GridItem>
                            </Grid>
                          </CardBody>
                        </Card>
                      ))}
                  </VStack>
                ) : (
                  <Box p={6} textAlign="center">
                    <Text>
                      You don't have any current job offers. Successfully
                      complete interviews to receive offers.
                    </Text>
                  </Box>
                )}
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Character Status */}
      <Card bg={cardBg} shadow="md">
        <CardHeader>
          <Heading size="sm">Character Status</Heading>
        </CardHeader>
        <CardBody>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            <GridItem>
              <HStack>
                <Icon as={Heart} color="blue.500" />
                <Text fontWeight="bold" mb={1}>
                  Energy: {energy}%
                </Text>
              </HStack>
              <Progress
                value={energy}
                colorScheme="blue"
                height="8px"
                borderRadius="full"
              />
            </GridItem>

            <GridItem>
              <HStack>
                <Icon as={TrendingUp} color="red.500" />
                <Text fontWeight="bold" mb={1}>
                  Stress: {stress}%
                </Text>
              </HStack>
              <Progress
                value={stress}
                colorScheme="red"
                height="8px"
                borderRadius="full"
              />
            </GridItem>
          </Grid>
        </CardBody>
      </Card>

      {/* Job Details Modal */}
      <Modal isOpen={isJobModalOpen} onClose={onJobModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedJob?.title} at {selectedJob?.company}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedJob && (
              <VStack align="stretch" spacing={4}>
                <HStack>
                  <Badge
                    colorScheme={
                      selectedJob.level === "entry"
                        ? "blue"
                        : selectedJob.level === "mid"
                        ? "green"
                        : selectedJob.level === "senior"
                        ? "purple"
                        : "orange"
                    }
                  >
                    {selectedJob.level.charAt(0).toUpperCase() +
                      selectedJob.level.slice(1)}{" "}
                    Level
                  </Badge>

                  <Badge colorScheme="green">
                    {formatCurrency(selectedJob.salary)}/month
                  </Badge>

                  {selectedJob.remote && (
                    <Badge colorScheme="blue">Remote</Badge>
                  )}
                </HStack>

                <Box>
                  <Heading size="sm" mb={2}>
                    Job Description
                  </Heading>
                  <Text>{selectedJob.description}</Text>
                </Box>

                <Box>
                  <Heading size="sm" mb={2}>
                    Required Skills
                  </Heading>
                  {selectedJob.requiredSkills &&
                  selectedJob.requiredSkills.length > 0 ? (
                    <Wrap>
                      {selectedJob.requiredSkills.map((skillId, index) => {
                        const skillKey = skillId.replace("-", "_");
                        const skillValue = character.skills[skillKey] || 0;
                        const hasSkill = skillValue >= 3;

                        return (
                          <WrapItem key={index}>
                            <Badge
                              colorScheme={hasSkill ? "green" : "red"}
                              variant={hasSkill ? "solid" : "outline"}
                            >
                              {skillId.replace("-", " ")}
                              {hasSkill && " ✓"}
                            </Badge>
                          </WrapItem>
                        );
                      })}
                    </Wrap>
                  ) : (
                    <Text fontStyle="italic">No specific skills listed</Text>
                  )}
                </Box>

                <Box>
                  <Heading size="sm" mb={2}>
                    Company Information
                  </Heading>
                  <Text>
                    {selectedJob.company} - {selectedJob.location}
                  </Text>
                  {/* Additional company info could go here */}
                </Box>

                <Box
                  p={4}
                  bg={useColorModeValue("blue.50", "blue.900")}
                  borderRadius="md"
                >
                  <HStack mb={2}>
                    <Icon
                      as={FileText}
                      color={useColorModeValue("blue.500", "blue.200")}
                    />
                    <Heading size="sm">Resume Match Analysis</Heading>
                  </HStack>

                  <Text mb={2}>
                    Based on your resume quality and skills, you have a{" "}
                    {Math.round(calculateSuccessProbability(selectedJob) * 100)}
                    % chance of receiving an interview invitation.
                  </Text>

                  <Progress
                    value={calculateSuccessProbability(selectedJob) * 100}
                    colorScheme={
                      calculateSuccessProbability(selectedJob) >= 0.7
                        ? "green"
                        : calculateSuccessProbability(selectedJob) >= 0.4
                        ? "orange"
                        : "red"
                    }
                    height="8px"
                    borderRadius="full"
                    mb={2}
                  />

                  <Text fontSize="sm" color="gray.500">
                    Improve your resume or develop relevant skills to increase
                    your chances.
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onJobModalClose}>
              Close
            </Button>
            <Button
              colorScheme="blue"
              onClick={applyForSelectedJob}
              leftIcon={<FilePlus size={18} />}
            >
              Apply for Position
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Interview Modal */}
      <Modal
        isOpen={isInterviewModalOpen}
        onClose={onInterviewModalClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedInterview?.type.charAt(0).toUpperCase() +
              selectedInterview?.type.slice(1)}{" "}
            Interview at {selectedInterview?.company}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedInterview && (
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Heading size="sm" mb={2}>
                    Interview Details
                  </Heading>
                  <HStack>
                    <Icon as={Calendar} color="blue.500" />
                    <Text>
                      Scheduled for {formatDate(selectedInterview.date)}
                    </Text>
                  </HStack>
                  <HStack mt={2}>
                    <Icon as={Briefcase} color="purple.500" />
                    <Text>Position: {selectedInterview.position}</Text>
                  </HStack>
                </Box>

                <Box>
                  <Heading size="sm" mb={2}>
                    Interview Type
                  </Heading>
                  <Text>
                    {selectedInterview.type === "technical"
                      ? "This is a technical interview that will assess your programming and problem-solving skills. Be prepared to discuss your technical background and solve coding challenges."
                      : selectedInterview.type === "hr"
                      ? "This is an HR interview focusing on your soft skills, cultural fit, and career goals. Be prepared to discuss your background, motivations, and interpersonal abilities."
                      : "This is a final interview with management to evaluate your overall fit for the role. Be prepared to discuss your career goals, leadership style, and how you see yourself contributing to the company."}
                  </Text>
                </Box>

                <Box
                  p={4}
                  bg={useColorModeValue("blue.50", "blue.900")}
                  borderRadius="md"
                >
                  <Heading size="sm" mb={2}>
                    Interview Preparation
                  </Heading>

                  {selectedInterview.type === "technical" && (
                    <VStack align="start" spacing={2}>
                      <HStack>
                        <Icon as={Laptop} color="blue.500" />
                        <Text fontWeight="bold">Technical Skills Matter</Text>
                      </HStack>
                      <Text fontSize="sm">
                        Your intelligence ({character.attributes.intelligence}
                        /10) and technical skills will be crucial.
                      </Text>

                      <HStack>
                        <Icon as={MessageSquare} color="blue.500" />
                        <Text fontWeight="bold">Communication is Key</Text>
                      </HStack>
                      <Text fontSize="sm">
                        Explain your thought process clearly as you work through
                        problems.
                      </Text>
                    </VStack>
                  )}

                  {selectedInterview.type === "hr" && (
                    <VStack align="start" spacing={2}>
                      <HStack>
                        <Icon as={Users} color="purple.500" />
                        <Text fontWeight="bold">Soft Skills Showcase</Text>
                      </HStack>
                      <Text fontSize="sm">
                        Your charisma ({character.attributes.charisma}/10) and
                        communication skills will be most important.
                      </Text>

                      <HStack>
                        <Icon as={Briefcase} color="purple.500" />
                        <Text fontWeight="bold">Professional Experience</Text>
                      </HStack>
                      <Text fontSize="sm">
                        Be ready to discuss your past work experiences and what
                        you learned from them.
                      </Text>
                    </VStack>
                  )}

                  {selectedInterview.type === "final" && (
                    <VStack align="start" spacing={2}>
                      <HStack>
                        <Icon as={Award} color="green.500" />
                        <Text fontWeight="bold">Leadership Potential</Text>
                      </HStack>
                      <Text fontSize="sm">
                        Show your adaptability (
                        {character.attributes.adaptability}/10) and future
                        potential.
                      </Text>

                      <HStack>
                        <Icon as={TrendingUp} color="green.500" />
                        <Text fontWeight="bold">Career Vision</Text>
                      </HStack>
                      <Text fontSize="sm">
                        Articulate how this role fits into your broader career
                        goals.
                      </Text>
                    </VStack>
                  )}
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onInterviewModalClose}>
              Skip Interview
            </Button>
            <Button
              colorScheme="blue"
              onClick={prepareForInterview}
              isLoading={isInterviewing}
              loadingText="Interviewing..."
              leftIcon={<MessageSquare size={18} />}
            >
              Prepare & Attend
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CareerPage;
