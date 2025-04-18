// pages/HomePage.jsx
import React, { useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Container,
  Flex,
  Image,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Award, Briefcase, BookOpen, Code, Globe, Server } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { useSettingsStore } from "../store/settingsStore";

const HomePage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Game state
  const gameStarted = useGameStore((state) => state.gameStarted);
  const currentStage = useGameStore((state) => state.currentStage);
  const startNewGame = useGameStore((state) => state.startNewGame);
  const lastSaved = useGameStore((state) => state.lastSaved);

  // Settings
  const difficulty = useSettingsStore((state) => state.difficulty);
  const language = useSettingsStore((state) => state.language);

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const highlightColor = useColorModeValue("azerbaijan.blue", "blue.400");

  // Start a new game
  const handleStartNewGame = () => {
    startNewGame();
    navigate("/character-creation");
    toast({
      title: "New game started!",
      description: "Create your character to begin your IT career journey.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Continue existing game
  const handleContinueGame = () => {
    // Navigate to the appropriate page based on current game stage
    switch (currentStage) {
      case "character_creation":
        navigate("/character-creation");
        break;
      case "education":
        navigate("/education");
        break;
      case "military":
        navigate("/military-service");
        break;
      case "career":
        navigate("/career");
        break;
      case "game_over":
        navigate("/");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <Box>
      {/* Game Title Section */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        py={10}
        textAlign="center"
      >
        <Heading
          size="2xl"
          mb={6}
          bgGradient="linear(to-r, azerbaijan.blue, azerbaijan.green)"
          bgClip="text"
        >
          Azerbaijan IT Career Simulator
        </Heading>

        <Text fontSize="xl" maxW="3xl" mb={8}>
          Experience the journey of an IT professional in Azerbaijan! Start from
          university education, navigate the local tech industry, and build a
          successful career through strategic choices and skill development.
        </Text>

        {/* Game Actions */}
        <HStack spacing={6} mt={4}>
          {gameStarted && lastSaved ? (
            <Button
              leftIcon={<Briefcase size={20} />}
              colorScheme="blue"
              size="lg"
              onClick={handleContinueGame}
            >
              Continue Career
            </Button>
          ) : null}

          <Button
            leftIcon={<Award size={20} />}
            colorScheme="green"
            size="lg"
            onClick={handleStartNewGame}
          >
            Start New Career
          </Button>

          <Button
            leftIcon={<Globe size={20} />}
            variant="outline"
            colorScheme="blue"
            size="lg"
            onClick={() => navigate("/settings")}
          >
            Settings
          </Button>
        </HStack>
      </Flex>

      {/* Game Features */}
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
        mt={12}
        mb={8}
      >
        <GridItem>
          <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" height="100%">
            <BookOpen
              size={36}
              color={useColorModeValue("#0033A0", "#4299E1")}
            />
            <Heading size="md" mt={4} mb={2}>
              Education
            </Heading>
            <Text>
              Begin at university with entrance exams, navigate coursework, and
              build foundational skills for your IT career.
            </Text>
          </Box>
        </GridItem>

        <GridItem>
          <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" height="100%">
            <Code size={36} color={useColorModeValue("#0033A0", "#4299E1")} />
            <Heading size="md" mt={4} mb={2}>
              Skill Development
            </Heading>
            <Text>
              Master programming languages, frameworks, and soft skills while
              balancing technical depth with career advancement.
            </Text>
          </Box>
        </GridItem>

        <GridItem>
          <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" height="100%">
            <Briefcase
              size={36}
              color={useColorModeValue("#0033A0", "#4299E1")}
            />
            <Heading size="md" mt={4} mb={2}>
              Career Paths
            </Heading>
            <Text>
              Choose between local companies, international corporations,
              government positions, or entrepreneurship.
            </Text>
          </Box>
        </GridItem>

        <GridItem>
          <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" height="100%">
            <Server size={36} color={useColorModeValue("#0033A0", "#4299E1")} />
            <Heading size="md" mt={4} mb={2}>
              Dynamic Resume
            </Heading>
            <Text>
              Your resume evolves automatically based on achievements, directly
              impacting career opportunities and advancement.
            </Text>
          </Box>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2, lg: 2 }}>
          <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" height="100%">
            <Heading size="md" mb={4}>
              Current Game Settings
            </Heading>
            <HStack spacing={8}>
              <Stat>
                <StatLabel>Difficulty</StatLabel>
                <StatNumber>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </StatNumber>
                <StatHelpText>Career challenge level</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Language</StatLabel>
                <StatNumber>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </StatNumber>
                <StatHelpText>Game interface language</StatHelpText>
              </Stat>
            </HStack>
          </Box>
        </GridItem>
      </Grid>

      {/* Footer/Credits */}
      <Box textAlign="center" opacity={0.7} mt={16} mb={8}>
        <Text>
          Created with ❤️ for IT professionals and students in Azerbaijan
        </Text>
        <Text fontSize="sm" mt={2}>
          Based on the rich IT ecosystem of Baku and beyond
        </Text>
      </Box>
    </Box>
  );
};

export default HomePage;
