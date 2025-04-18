// pages/MilitaryServicePage.jsx
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
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Calendar,
  ChevronRight,
  Shield,
  Flag,
  Star,
  Clock,
  Wrench,
} from "lucide-react";
import { useCareerStore } from "../store/careerStore";
import { useCharacterStore } from "../store/characterStore";
import { useGameStore } from "../store/gameStore";
import { useGameEventsStore } from "../store/gameEventsStore";

const MilitaryServicePage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Military service state
  const militaryService = useCareerStore((state) => state.militaryService);

  // Character state
  const character = useCharacterStore((state) => ({
    name: state.name,
    attributes: state.attributes,
    skills: state.skills,
  }));

  // Game state
  const advanceStage = useGameStore((state) => state.advanceStage);

  // Game events
  const gameDate = useGameEventsStore((state) => state.currentDate);
  const energy = useGameEventsStore((state) => state.energy);
  const stress = useGameEventsStore((state) => state.stress);
  const advanceTime = useGameEventsStore((state) => state.advanceTime);

  // Local state
  const [serviceProgress, setServiceProgress] = useState(0);
  const [timeSkipping, setTimeSkipping] = useState(false);

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

  // Calculate service progress percentage if dates are available
  useEffect(() => {
    if (militaryService.startDate && !militaryService.completed) {
      const startDate = new Date(militaryService.startDate);
      const currentDate = gameDate ? new Date(gameDate) : new Date();
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1); // 1 year of service

      const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
      const daysServed = (currentDate - startDate) / (1000 * 60 * 60 * 24);

      const progress = Math.min(
        100,
        Math.max(0, (daysServed / totalDays) * 100)
      );
      setServiceProgress(progress);

      // Auto-complete service if it's done
      if (progress >= 100 && !militaryService.completed) {
        completeMilitaryService();
      }
    }
  }, [gameDate, militaryService]);

  // Skip time in military service
  const skipServiceTime = () => {
    setTimeSkipping(true);

    // Simulate passing time in military service
    // Advance time by 1 month (30 days)
    advanceTime(30);

    setTimeout(() => {
      setTimeSkipping(false);

      // Random skill modifications during service
      const skills = character.skills;
      const skillsToModify = Object.keys(skills).filter(
        (key) =>
          ["discipline", "communication", "teamwork"].includes(key) ||
          Math.random() > 0.7 // Random chance to modify other skills
      );

      // Modify skills
      skillsToModify.forEach((skill) => {
        // Technical skills may degrade slightly
        if (
          [
            "programming_fundamentals",
            "web_development",
            "mobile_development",
            "database_management",
          ].includes(skill)
        ) {
          const degradeAmount = -0.1;
          useCharacterStore
            .getState()
            .setSkill(skill, Math.max(1, skills[skill] + degradeAmount));

          if (degradeAmount < 0) {
            toast({
              title: `Skill Degradation`,
              description: `Your ${skill.replace(
                "_",
                " "
              )} skill has decreased slightly due to lack of practice.`,
              status: "warning",
              duration: 3000,
              isClosable: true,
            });
          }
        }
        // Soft skills may improve
        else if (["discipline", "communication", "teamwork"].includes(skill)) {
          const improveAmount = 0.2;
          useCharacterStore
            .getState()
            .setSkill(skill, Math.min(5, skills[skill] + improveAmount));

          toast({
            title: `Skill Improvement`,
            description: `Your ${skill.replace(
              "_",
              " "
            )} skill has improved through military training.`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      });

      // Random events during service (simplified for now)
      if (Math.random() > 0.7) {
        // Random positive event
        toast({
          title: "Military Achievement",
          description:
            "You've been recognized for your exceptional service this month.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });

        // Add commendation
        const updatedService = { ...militaryService };
        updatedService.commendations = [
          ...(updatedService.commendations || []),
          "Excellence in Service",
        ];
        useCareerStore.getState().startMilitaryService(updatedService);
      }
    }, 1500);
  };

  // Complete military service
  const completeMilitaryService = () => {
    // Determine final rank based on character attributes and random chance
    const baseRankIndex = 0; // Private
    const disciplineBonus = Math.floor(character.attributes.discipline / 3);
    const charismaBonus = Math.floor(character.attributes.charisma / 3);
    const randomBonus = Math.floor(Math.random() * 2);

    const ranks = ["Private", "Lance Corporal", "Corporal", "Sergeant"];
    const finalRankIndex = Math.min(
      ranks.length - 1,
      baseRankIndex + disciplineBonus + charismaBonus + randomBonus
    );

    // Determine if character gets any commendations
    const commendations = [...(militaryService.commendations || [])];

    if (character.attributes.discipline >= 7 && commendations.length === 0) {
      commendations.push("Disciplined Service");
    }

    if (character.attributes.adaptability >= 7 && commendations.length <= 1) {
      commendations.push("Adaptability in Challenging Conditions");
    }

    // Complete military service
    useCareerStore.getState().completeMilitaryService({
      rank: ranks[finalRankIndex],
      commendations,
      endDate: new Date().toISOString(), // Current real date as a placeholder
      technicalRole:
        character.skills.programming_fundamentals > 3 ? "IT Department" : null,
    });

    // Advance to career stage
    advanceStage("career");

    // Navigate to career page
    navigate("/career");

    toast({
      title: "Military Service Completed",
      description: `Congratulations! You've completed your military service with the rank of ${ranks[finalRankIndex]}.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box mb={8}>
      <Heading size="xl" mb={6}>
        Military Service
      </Heading>

      {/* Game Date Display */}
      {gameDate && (
        <Text fontSize="md" color="gray.500" mb={4}>
          Current Date: {formatDate(gameDate)}
        </Text>
      )}

      {/* Military Service Card */}
      <Card bg={cardBg} shadow="md" mb={6}>
        <CardHeader>
          <HStack justifyContent="space-between">
            <Heading size="md">Mandatory Military Service</Heading>
            <Badge
              colorScheme={militaryService.completed ? "green" : "blue"}
              fontSize="md"
              px={2}
              py={1}
            >
              {militaryService.completed ? "Completed" : "In Progress"}
            </Badge>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            {!militaryService.completed ? (
              <>
                <Text>
                  As a male citizen, you're completing your mandatory military
                  service. This period will affect your skills and provide
                  unique experiences that can benefit your future IT career.
                </Text>

                <Box>
                  <HStack justify="space-between" mb={1}>
                    <Text fontWeight="bold">Service Progress</Text>
                    <Text>{Math.round(serviceProgress)}%</Text>
                  </HStack>
                  <Progress
                    value={serviceProgress}
                    colorScheme="green"
                    height="12px"
                    borderRadius="full"
                  />
                </Box>

                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={6}
                >
                  <GridItem>
                    <Card variant="outline">
                      <CardBody>
                        <VStack align="start" spacing={3}>
                          <HStack>
                            <Icon as={Flag} color="green.500" boxSize={5} />
                            <Text fontWeight="bold">Service Details</Text>
                          </HStack>
                          <Divider />
                          <HStack>
                            <Text fontWeight="bold" width="100px">
                              Branch:
                            </Text>
                            <Text>{militaryService.branch || "Army"}</Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="bold" width="100px">
                              Unit:
                            </Text>
                            <Text>
                              {militaryService.unit || "Regular Service"}
                            </Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="bold" width="100px">
                              Start Date:
                            </Text>
                            <Text>{formatDate(militaryService.startDate)}</Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="bold" width="100px">
                              Current Rank:
                            </Text>
                            <Text>{militaryService.rank || "Private"}</Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>

                  <GridItem>
                    <Card variant="outline">
                      <CardBody>
                        <VStack align="start" spacing={3}>
                          <HStack>
                            <Icon as={Star} color="yellow.500" boxSize={5} />
                            <Text fontWeight="bold">Achievements</Text>
                          </HStack>
                          <Divider />

                          {militaryService.commendations &&
                          militaryService.commendations.length > 0 ? (
                            militaryService.commendations.map(
                              (commendation, index) => (
                                <HStack key={index}>
                                  <Icon
                                    as={Award}
                                    color="yellow.500"
                                    boxSize={4}
                                  />
                                  <Text>{commendation}</Text>
                                </HStack>
                              )
                            )
                          ) : (
                            <Text fontStyle="italic">No commendations yet</Text>
                          )}

                          {militaryService.technicalRole && (
                            <HStack>
                              <Icon as={Wrench} color="blue.500" boxSize={4} />
                              <Text>
                                Technical Role: {militaryService.technicalRole}
                              </Text>
                            </HStack>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                </Grid>

                <Box
                  p={4}
                  bg={useColorModeValue("blue.50", "blue.900")}
                  borderRadius="md"
                >
                  <HStack mb={2}>
                    <Icon as={Shield} color="blue.500" boxSize={5} />
                    <Text fontWeight="bold">Service Impact on Skills</Text>
                  </HStack>
                  <Text fontSize="sm">
                    Military service strengthens discipline, teamwork, and
                    communication skills. However, technical skills may degrade
                    slightly due to limited practice time.
                  </Text>
                  <Divider my={3} />
                  <HStack justify="space-between" wrap="wrap">
                    <Badge colorScheme="green" p={1} m={1}>
                      +Discipline
                    </Badge>
                    <Badge colorScheme="green" p={1} m={1}>
                      +Teamwork
                    </Badge>
                    <Badge colorScheme="green" p={1} m={1}>
                      +Leadership
                    </Badge>
                    <Badge colorScheme="red" p={1} m={1}>
                      -Technical Skills
                    </Badge>
                  </HStack>
                </Box>
              </>
            ) : (
              // Completed service
              <VStack spacing={4} align="center">
                <Icon as={Award} color="green.500" boxSize={12} />
                <Heading size="md">Service Completed</Heading>
                <Text textAlign="center">
                  You have successfully completed your mandatory military
                  service. The experience has shaped your character and provided
                  valuable skills.
                </Text>
                <VStack align="start" spacing={2} width="100%">
                  <HStack>
                    <Text fontWeight="bold" width="120px">
                      Final Rank:
                    </Text>
                    <Text>{militaryService.rank}</Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Text fontWeight="bold" width="120px">
                      Commendations:
                    </Text>
                    <VStack align="start" spacing={1}>
                      {militaryService.commendations &&
                      militaryService.commendations.length > 0 ? (
                        militaryService.commendations.map(
                          (commendation, index) => (
                            <Text key={index}>{commendation}</Text>
                          )
                        )
                      ) : (
                        <Text fontStyle="italic">None</Text>
                      )}
                    </VStack>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold" width="120px">
                      Service Period:
                    </Text>
                    <Text>
                      {formatDate(militaryService.startDate)} -{" "}
                      {formatDate(militaryService.endDate)}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            )}
          </VStack>
        </CardBody>
        <CardFooter>
          {!militaryService.completed ? (
            <Button
              leftIcon={<Clock size={18} />}
              colorScheme="blue"
              onClick={skipServiceTime}
              width="full"
              isLoading={timeSkipping}
              loadingText="Time Passing..."
            >
              Skip 1 Month of Service
            </Button>
          ) : (
            <Button
              rightIcon={<ChevronRight size={18} />}
              colorScheme="green"
              onClick={() => navigate("/career")}
              width="full"
            >
              Begin Your Civilian Career
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Character Status */}
      {!militaryService.completed && (
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
      )}
    </Box>
  );
};

export default MilitaryServicePage;
