// pages/EducationPage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Award,
  Calendar,
  Briefcase,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { useEducationStore } from "../store/educationStore";
import { useCharacterStore } from "../store/characterStore";
import { useGameStore } from "../store/gameStore";
import { useGameEventsStore } from "../store/gameEventsStore";
import { useDataStore } from "../store/dataStore";

const EducationPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Get university data
  const universities = useDataStore((state) => state.universities);
  const degreePrograms = useDataStore((state) => state.degreePrograms);

  // Education state
  const education = useEducationStore((state) => ({
    entranceExamScore: state.entranceExamScore,
    university: state.university,
    degreeProgram: state.degreeProgram,
    specialization: state.specialization,
    currentSemester: state.currentSemester,
    totalSemesters: state.totalSemesters,
    gpa: state.gpa,
    isEntranceExamCompleted: state.isEntranceExamCompleted,
    isEnrolled: state.isEnrolled,
    isGraduated: state.isGraduated,
  }));

  // Character state
  const character = useCharacterStore((state) => ({
    name: state.name,
    gender: state.gender,
    attributes: state.attributes,
    familyBackground: state.familyBackground,
  }));

  // Game state
  const advanceStage = useGameStore((state) => state.advanceStage);
  const processSemester = useGameStore((state) => state.processSemester);

  // Game events
  const gameDate = useGameEventsStore((state) => state.currentDate);
  const energy = useGameEventsStore((state) => state.energy);
  const stress = useGameEventsStore((state) => state.stress);

  // Local state
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [examLoading, setExamLoading] = useState(false);
  const [semesterLoading, setSemesterLoading] = useState(false);

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const highlightColor = useColorModeValue("blue.500", "blue.300");

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

  // Take entrance exam
  const takeEntranceExam = () => {
    setExamLoading(true);

    // Simulate exam time
    setTimeout(() => {
      // Calculate score based on character attributes
      const baseScore = 350; // Base score
      const intelligenceBonus = character.attributes.intelligence * 20; // Up to 200 points
      const disciplineBonus = character.attributes.discipline * 5; // Up to 50 points

      // Family background modifier
      let backgroundModifier = 1.0;
      switch (character.familyBackground) {
        case "lower":
          backgroundModifier = 0.9;
          break;
        case "middle":
          backgroundModifier = 1.0;
          break;
        case "higher":
          backgroundModifier = 1.1;
          break;
        default:
          backgroundModifier = 1.0;
      }

      // Calculate final score with some randomness
      const randomFactor = Math.random() * 100 - 50; // -50 to +50
      let finalScore = Math.floor(
        (baseScore + intelligenceBonus + disciplineBonus) * backgroundModifier +
          randomFactor
      );

      // Ensure score is within bounds (0-700)
      finalScore = Math.max(0, Math.min(700, finalScore));

      // Update education store
      useEducationStore.getState().setEntranceExamScore(finalScore);

      // Show result
      toast({
        title: "Entrance Exam Completed",
        description: `Your score: ${finalScore} out of 700`,
        status:
          finalScore >= 500
            ? "success"
            : finalScore >= 400
            ? "info"
            : "warning",
        duration: 5000,
        isClosable: true,
      });

      setExamLoading(false);
    }, 2000);
  };

  // Enroll in university
  const enrollInUniversity = () => {
    if (!selectedUniversity || !selectedProgram) {
      toast({
        title: "Selection Required",
        description: "Please select both a university and degree program.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Find the selected university and program data
    const university = universities.find((u) => u.id === selectedUniversity);
    const program = degreePrograms.find((p) => p.id === selectedProgram);

    // Check if score meets the threshold
    if (education.entranceExamScore < university.entranceScoreThreshold) {
      toast({
        title: "Application Rejected",
        description: `Your score (${education.entranceExamScore}) doesn't meet ${university.name}'s threshold (${university.entranceScoreThreshold}).`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Update education store
    useEducationStore.getState().enrollInUniversity({
      name: university.name,
      prestigeRating: university.prestigeRating,
      program: program.name,
      specialization: program.name, // Simple for now, could be more complex later
    });

    toast({
      title: "Enrollment Successful!",
      description: `You've been enrolled in ${program.name} at ${university.name}.`,
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  };

  // Complete a semester
  const completeSemester = () => {
    setSemesterLoading(true);

    // Process the semester in the game store
    processSemester();

    setTimeout(() => {
      setSemesterLoading(false);

      // Check if education is complete
      if (useEducationStore.getState().isGraduated) {
        toast({
          title: "Graduation!",
          description: `Congratulations! You have graduated with a GPA of ${useEducationStore
            .getState()
            .gpa.toFixed(2)}.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // If the character is male, go to military service
        if (character.gender === "male") {
          navigate("/military-service");
        } else {
          // If female, skip to career
          navigate("/career");
        }
      }
    }, 2000);
  };

  // Determine which education stage to show
  const renderEducationStage = () => {
    if (!education.isEntranceExamCompleted) {
      return (
        <Card bg={cardBg} shadow="md" mb={6}>
          <CardHeader>
            <Heading size="md">University Entrance Exam</Heading>
            <Text fontSize="sm" color="gray.500" mt={2}>
              Take the national entrance exam to qualify for university
              admission.
            </Text>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Text>
                The entrance exam tests your knowledge and aptitude for higher
                education. Your score will determine which universities you can
                apply to.
              </Text>

              <Box
                p={4}
                bg={useColorModeValue("blue.50", "blue.900")}
                borderRadius="md"
              >
                <HStack>
                  <Info
                    size={20}
                    color={useColorModeValue("#3182CE", "#90CDF4")}
                  />
                  <Text fontWeight="medium">
                    Your Intelligence: {character.attributes.intelligence}/10
                  </Text>
                </HStack>
                <Text fontSize="sm" ml={6} mt={1}>
                  Higher intelligence improves your exam performance.
                </Text>
              </Box>
            </VStack>
          </CardBody>
          <CardFooter>
            <Button
              leftIcon={<BookOpen size={18} />}
              colorScheme="blue"
              isLoading={examLoading}
              loadingText="Taking Exam..."
              onClick={takeEntranceExam}
              width="full"
            >
              Take Entrance Exam
            </Button>
          </CardFooter>
        </Card>
      );
    } else if (!education.isEnrolled) {
      return (
        <Card bg={cardBg} shadow="md" mb={6}>
          <CardHeader>
            <Heading size="md">University Application</Heading>
            <Text fontSize="sm" color="gray.500" mt={2}>
              Apply to a university based on your entrance exam score.
            </Text>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Stat>
                <StatLabel>Your Entrance Exam Score</StatLabel>
                <StatNumber>{education.entranceExamScore} / 700</StatNumber>
                <StatHelpText>
                  {education.entranceExamScore >= 600
                    ? "Excellent! You qualify for top universities."
                    : education.entranceExamScore >= 500
                    ? "Good score. You qualify for most universities."
                    : education.entranceExamScore >= 400
                    ? "Average score. Some universities may accept you."
                    : "Below average. Limited university options."}
                </StatHelpText>
              </Stat>

              <Divider />

              <Text fontWeight="bold">Select a University:</Text>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={4}
              >
                {universities.map((university) => (
                  <GridItem key={university.id}>
                    <Card
                      variant="outline"
                      borderWidth="1px"
                      borderColor={
                        selectedUniversity === university.id
                          ? highlightColor
                          : "gray.200"
                      }
                      bg={
                        selectedUniversity === university.id
                          ? useColorModeValue("blue.50", "blue.900")
                          : "transparent"
                      }
                      onClick={() => setSelectedUniversity(university.id)}
                      cursor="pointer"
                      _hover={{ borderColor: highlightColor }}
                      transition="all 0.2s"
                    >
                      <CardBody>
                        <VStack align="start" spacing={2}>
                          <Heading size="sm">{university.name}</Heading>
                          <Badge
                            colorScheme={
                              education.entranceExamScore >=
                              university.entranceScoreThreshold
                                ? "green"
                                : "red"
                            }
                          >
                            Min Score: {university.entranceScoreThreshold}
                          </Badge>
                          <HStack>
                            <Text fontWeight="bold">Prestige:</Text>
                            <HStack spacing={1}>
                              {[...Array(university.prestigeRating)].map(
                                (_, i) => (
                                  <Award
                                    key={i}
                                    size={14}
                                    color={useColorModeValue(
                                      "#3182CE",
                                      "#90CDF4"
                                    )}
                                  />
                                )
                              )}
                            </HStack>
                          </HStack>
                          <Text fontSize="sm">{university.description}</Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                ))}
              </Grid>

              <Text fontWeight="bold" mt={2}>
                Select a Degree Program:
              </Text>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={4}
              >
                {degreePrograms.map((program) => (
                  <GridItem key={program.id}>
                    <Card
                      variant="outline"
                      borderWidth="1px"
                      borderColor={
                        selectedProgram === program.id
                          ? highlightColor
                          : "gray.200"
                      }
                      bg={
                        selectedProgram === program.id
                          ? useColorModeValue("blue.50", "blue.900")
                          : "transparent"
                      }
                      onClick={() => setSelectedProgram(program.id)}
                      cursor="pointer"
                      _hover={{ borderColor: highlightColor }}
                      transition="all 0.2s"
                    >
                      <CardBody>
                        <VStack align="start" spacing={2}>
                          <Heading size="sm">{program.name}</Heading>
                          <Text fontSize="sm">{program.description}</Text>
                          <Text fontSize="sm" fontWeight="bold">
                            Career Paths:
                          </Text>
                          <HStack flexWrap="wrap">
                            {program.careers.map((career, index) => (
                              <Badge key={index} colorScheme="purple">
                                {career}
                              </Badge>
                            ))}
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                ))}
              </Grid>
            </VStack>
          </CardBody>
          <CardFooter>
            <Button
              leftIcon={<GraduationCap size={18} />}
              colorScheme="blue"
              onClick={enrollInUniversity}
              width="full"
              isDisabled={!selectedUniversity || !selectedProgram}
            >
              Enroll in University
            </Button>
          </CardFooter>
        </Card>
      );
    } else if (!education.isGraduated) {
      // Studying at university
      return (
        <>
          <Card bg={cardBg} shadow="md" mb={6}>
            <CardHeader>
              <HStack justifyContent="space-between">
                <Heading size="md">University Studies</Heading>
                <Badge colorScheme="blue" fontSize="md" px={2} py={1}>
                  Semester {education.currentSemester} of{" "}
                  {education.totalSemesters}
                </Badge>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <HStack wrap="wrap" spacing={4}>
                  <Stat flex="1" minW="150px">
                    <StatLabel>University</StatLabel>
                    <StatNumber fontSize="lg">
                      {education.university}
                    </StatNumber>
                  </Stat>

                  <Stat flex="1" minW="150px">
                    <StatLabel>Program</StatLabel>
                    <StatNumber fontSize="lg">
                      {education.degreeProgram}
                    </StatNumber>
                  </Stat>

                  <Stat flex="1" minW="150px">
                    <StatLabel>Current GPA</StatLabel>
                    <StatNumber fontSize="lg">
                      {education.gpa.toFixed(2)}
                    </StatNumber>
                  </Stat>
                </HStack>

                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Semester Progress
                  </Text>
                  <Progress
                    value={
                      (education.currentSemester / education.totalSemesters) *
                      100
                    }
                    colorScheme="blue"
                    height="8px"
                    borderRadius="full"
                  />
                  <HStack justifyContent="space-between" mt={1}>
                    <Text fontSize="sm">1st Year</Text>
                    <Text fontSize="sm">Graduation</Text>
                  </HStack>
                </Box>

                <Divider />

                <Text fontSize="lg" fontWeight="bold">
                  Current Semester Activities
                </Text>

                <Tabs variant="soft-rounded" colorScheme="blue" size="sm">
                  <TabList>
                    <Tab>Study</Tab>
                    <Tab>Skill Development</Tab>
                    <Tab>Social</Tab>
                    <Tab>Part-time Jobs</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <Text mb={4}>
                        Focus on your coursework to improve your GPA and
                        academic standing.
                      </Text>
                      <VStack align="stretch" spacing={4}>
                        <Text>
                          This section will be implemented with coursework
                          minigames and study options.
                        </Text>
                      </VStack>
                    </TabPanel>

                    <TabPanel>
                      <Text mb={4}>
                        Develop technical and soft skills outside of your
                        regular coursework.
                      </Text>
                      <VStack align="stretch" spacing={4}>
                        <Text>
                          This section will be implemented with skill
                          development activities.
                        </Text>
                      </VStack>
                    </TabPanel>

                    <TabPanel>
                      <Text mb={4}>
                        Build connections and relationships that can help your
                        future career.
                      </Text>
                      <VStack align="stretch" spacing={4}>
                        <Text>
                          This section will be implemented with networking and
                          social activities.
                        </Text>
                      </VStack>
                    </TabPanel>

                    <TabPanel>
                      <Text mb={4}>
                        Earn money and gain work experience with part-time
                        employment.
                      </Text>
                      <VStack align="stretch" spacing={4}>
                        <Text>
                          This section will be implemented with job
                          opportunities and work experiences.
                        </Text>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            </CardBody>
            <CardFooter>
              <Button
                leftIcon={<Calendar size={18} />}
                colorScheme="green"
                onClick={completeSemester}
                width="full"
                isLoading={semesterLoading}
                loadingText="Completing Semester..."
              >
                Complete Semester
              </Button>
            </CardFooter>
          </Card>

          <Card bg={cardBg} shadow="md">
            <CardHeader>
              <Heading size="sm">Character Status</Heading>
            </CardHeader>
            <CardBody>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={4}
              >
                <GridItem>
                  <Text fontWeight="bold" mb={1}>
                    Energy: {energy}%
                  </Text>
                  <Progress
                    value={energy}
                    colorScheme="blue"
                    height="8px"
                    borderRadius="full"
                  />
                </GridItem>

                <GridItem>
                  <Text fontWeight="bold" mb={1}>
                    Stress: {stress}%
                  </Text>
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
        </>
      );
    } else {
      // Graduated
      return (
        <Card bg={cardBg} shadow="md" mb={6}>
          <CardHeader>
            <Heading size="md">Graduation Completed</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="center">
              <GraduationCap
                size={48}
                color={useColorModeValue("#3182CE", "#90CDF4")}
              />
              <Heading size="md">Congratulations!</Heading>
              <Text textAlign="center">
                You have successfully graduated from {education.university} with
                a degree in {education.degreeProgram}.
              </Text>
              <Stat textAlign="center">
                <StatLabel>Final GPA</StatLabel>
                <StatNumber>{education.gpa.toFixed(2)}</StatNumber>
              </Stat>
            </VStack>
          </CardBody>
          <CardFooter>
            <Button
              rightIcon={<ChevronRight size={18} />}
              colorScheme="blue"
              onClick={() => {
                // Go to military service if male, otherwise go to career
                if (character.gender === "male") {
                  navigate("/military-service");
                } else {
                  navigate("/career");
                }
              }}
              width="full"
            >
              {character.gender === "male"
                ? "Proceed to Military Service"
                : "Begin Your Career"}
            </Button>
          </CardFooter>
        </Card>
      );
    }
  };

  return (
    <Box mb={8}>
      <Heading size="xl" mb={6}>
        Education
      </Heading>

      {/* Game Date Display */}
      {gameDate && (
        <Text fontSize="md" color="gray.500" mb={4}>
          Current Date: {formatDate(gameDate)}
        </Text>
      )}

      {renderEducationStage()}
    </Box>
  );
};

export default EducationPage;
