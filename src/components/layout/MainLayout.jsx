// components/layout/MainLayout.jsx
import React, { useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  IconButton,
  useColorMode,
  useColorModeValue,
  Container,
  HStack,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  Settings,
  User,
  FileText,
  BookOpen,
  Briefcase,
  Award,
} from "lucide-react";
import { useGameStore } from "../../store/gameStore";
import { useSettingsStore } from "../../store/settingsStore";

const MainLayout = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const initialRenderRef = useRef(true);

  // Get settings from store - use selective state picking
  const darkMode = useSettingsStore((state) => state.darkMode);
  const toggleDarkMode = useSettingsStore((state) => state.toggleDarkMode);

  // Get game state to determine which navigation items to show - selective state picking
  const gameStarted = useGameStore((state) => state.gameStarted);
  const currentStage = useGameStore((state) => state.currentStage);

  // Background and text colors
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Handle theme toggle - update both Chakra UI and settings store
  const handleThemeToggle = () => {
    toggleDarkMode();
    toggleColorMode();
  };

  // One-time sync on initial mount only
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;

      // Only sync if they're out of sync
      if ((colorMode === "dark") !== darkMode) {
        toggleColorMode();
      }
    }
  }, [colorMode, darkMode, toggleColorMode]);

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      {/* Header */}
      <Flex
        as="header"
        position="fixed"
        top={0}
        width="full"
        shadow="sm"
        py={3}
        px={4}
        zIndex={10}
        bg={bgColor}
        color={textColor}
        borderBottomWidth="1px"
        borderBottomColor={borderColor}
        align="center"
      >
        <Heading size="md" cursor="pointer" onClick={() => navigate("/")}>
          <HStack>
            <Award
              size={24}
              color={colorMode === "light" ? "#0033A0" : "#4299E1"}
            />
            <Text>Azerbaijan IT Career Simulator</Text>
          </HStack>
        </Heading>

        <Spacer />

        <HStack spacing={2}>
          <IconButton
            aria-label={`Switch to ${
              colorMode === "light" ? "dark" : "light"
            } mode`}
            variant="ghost"
            icon={
              colorMode === "light" ? <Moon size={20} /> : <Sun size={20} />
            }
            onClick={handleThemeToggle}
          />

          <IconButton
            aria-label="Settings"
            variant="ghost"
            icon={<Settings size={20} />}
            onClick={() => navigate("/settings")}
          />
        </HStack>
      </Flex>

      {/* Sidebar Navigation - only show when game is started */}
      {gameStarted && (
        <Box
          as="nav"
          position="fixed"
          left={0}
          width="64px"
          top="61px" // Height of the header plus 1px for border
          bottom={0}
          bg={bgColor}
          borderRightWidth="1px"
          borderRightColor={borderColor}
          display={{ base: "none", md: "block" }}
        >
          <VStack spacing={6} mt={6} align="center">
            <IconButton
              aria-label="Character"
              variant={
                location.pathname.includes("character") ? "solid" : "ghost"
              }
              icon={<User size={24} />}
              onClick={() => navigate("/character-creation")}
              isDisabled={
                currentStage !== "character_creation" &&
                !location.pathname.includes("character")
              }
            />

            <IconButton
              aria-label="Education"
              variant={
                location.pathname.includes("education") ? "solid" : "ghost"
              }
              icon={<BookOpen size={24} />}
              onClick={() => navigate("/education")}
              isDisabled={
                currentStage !== "education" &&
                !location.pathname.includes("education")
              }
            />

            {/* Only show military service for male characters */}
            {currentStage === "military" && (
              <IconButton
                aria-label="Military Service"
                variant={
                  location.pathname.includes("military") ? "solid" : "ghost"
                }
                icon={<Award size={24} />}
                onClick={() => navigate("/military-service")}
              />
            )}

            <IconButton
              aria-label="Career"
              variant={location.pathname.includes("career") ? "solid" : "ghost"}
              icon={<Briefcase size={24} />}
              onClick={() => navigate("/career")}
              isDisabled={
                currentStage !== "career" &&
                !location.pathname.includes("career")
              }
            />

            <IconButton
              aria-label="Resume"
              variant={location.pathname.includes("resume") ? "solid" : "ghost"}
              icon={<FileText size={24} />}
              onClick={() => navigate("/resume")}
              isDisabled={!gameStarted}
            />
          </VStack>
        </Box>
      )}

      {/* Mobile bottom navigation - only show when game is started */}
      {gameStarted && (
        <Flex
          as="nav"
          position="fixed"
          bottom={0}
          width="full"
          py={2}
          px={4}
          bg={bgColor}
          borderTopWidth="1px"
          borderTopColor={borderColor}
          justify="space-around"
          display={{ base: "flex", md: "none" }}
          zIndex={10}
        >
          <IconButton
            aria-label="Character"
            variant="ghost"
            icon={<User size={20} />}
            onClick={() => navigate("/character-creation")}
            isDisabled={
              currentStage !== "character_creation" &&
              !location.pathname.includes("character")
            }
          />

          <IconButton
            aria-label="University Entrance Exam"
            variant={
              location.pathname.includes("pre-university") ? "solid" : "ghost"
            }
            icon={<BookOpen size={24} />}
            onClick={() => navigate("/pre-university-exam")}
            isDisabled={
              currentStage !== "pre_university" &&
              !location.pathname.includes("pre-university")
            }
          />

          <IconButton
            aria-label="Education"
            variant="ghost"
            icon={<BookOpen size={20} />}
            onClick={() => navigate("/education")}
            isDisabled={
              currentStage !== "education" &&
              !location.pathname.includes("education")
            }
          />

          <IconButton
            aria-label="Career"
            variant="ghost"
            icon={<Briefcase size={20} />}
            onClick={() => navigate("/career")}
            isDisabled={
              currentStage !== "career" && !location.pathname.includes("career")
            }
          />

          <IconButton
            aria-label="Resume"
            variant="ghost"
            icon={<FileText size={20} />}
            onClick={() => navigate("/resume")}
            isDisabled={!gameStarted}
          />
        </Flex>
      )}

      {/* Main content area */}
      <Container
        maxW="container.xl"
        pt="80px"
        pb={{ base: "70px", md: 4 }}
        pl={{ base: 4, md: "80px" }}
        pr={4}
        minH="100vh"
      >
        {children}
      </Container>
    </Box>
  );
};

export default MainLayout;
