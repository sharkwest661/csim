// pages/SettingsPage.jsx
import React from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Select,
  Switch,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Divider,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Save, Trash2, Volume2, Bell, Moon, Sun, Clock } from "lucide-react";
import { useSettingsStore } from "../store/settingsStore";
import { useGameStore } from "../store/gameStore";

const SettingsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  // Game state
  const gameStarted = useGameStore((state) => state.gameStarted);
  const resetGame = useGameStore((state) => state.resetGame);

  // Settings state
  const settings = useSettingsStore((state) => ({
    difficulty: state.difficulty,
    language: state.language,
    soundEffects: state.soundEffects,
    music: state.music,
    notifications: state.notifications,
    darkMode: state.darkMode,
    autosave: state.autosave,
    autosaveInterval: state.autosaveInterval,
    textSize: state.textSize,
    animationsEnabled: state.animationsEnabled,
    highContrastMode: state.highContrastMode,
    gameSpeed: state.gameSpeed,
  }));

  // Settings actions
  const setDifficulty = useSettingsStore((state) => state.setDifficulty);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const toggleSoundEffects = useSettingsStore(
    (state) => state.toggleSoundEffects
  );
  const toggleMusic = useSettingsStore((state) => state.toggleMusic);
  const toggleNotifications = useSettingsStore(
    (state) => state.toggleNotifications
  );
  const toggleDarkMode = useSettingsStore((state) => state.toggleDarkMode);
  const toggleAutosave = useSettingsStore((state) => state.toggleAutosave);
  const setAutosaveInterval = useSettingsStore(
    (state) => state.setAutosaveInterval
  );
  const setTextSize = useSettingsStore((state) => state.setTextSize);
  const toggleAnimations = useSettingsStore((state) => state.toggleAnimations);
  const toggleHighContrastMode = useSettingsStore(
    (state) => state.toggleHighContrastMode
  );
  const setGameSpeed = useSettingsStore((state) => state.setGameSpeed);
  const resetSettings = useSettingsStore((state) => state.resetSettings);

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");

  // Handle reset confirmation
  const handleResetSettings = () => {
    resetSettings();
    toast({
      title: "Settings reset",
      description: "All settings have been restored to defaults.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle reset game
  const handleResetGame = () => {
    resetGame();
    onClose();
    toast({
      title: "Game reset",
      description:
        "Your game progress has been reset. You can start a new career.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    navigate("/");
  };

  // Save settings
  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box mb={8}>
      <HStack justifyContent="space-between" mb={6}>
        <Heading size="xl">Settings</Heading>
        <HStack>
          <Button
            leftIcon={<Save size={18} />}
            colorScheme="green"
            onClick={saveSettings}
          >
            Save Settings
          </Button>
        </HStack>
      </HStack>

      <VStack spacing={6} align="stretch">
        {/* Game Settings */}
        <Card bg={cardBg} shadow="md">
          <CardHeader>
            <Heading size="md">Game Settings</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel>Difficulty</FormLabel>
                <Select
                  value={settings.difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  isDisabled={gameStarted}
                >
                  <option value="easy">
                    Easy - More forgiving job market, faster skill acquisition
                  </option>
                  <option value="normal">
                    Normal - Balanced experience reflecting realistic conditions
                  </option>
                  <option value="hard">
                    Hard - Competitive job market, slower progression
                  </option>
                  <option value="realistic">
                    Realistic - Economic fluctuations, unpredictable events
                  </option>
                </Select>
                {gameStarted && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    Difficulty cannot be changed during an active game.
                  </Text>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Language</FormLabel>
                <Select
                  value={settings.language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="azerbaijani">Azerbaijani</option>
                  <option value="english">English</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Game Speed</FormLabel>
                <HStack>
                  <Clock size={18} />
                  <Slider
                    aria-label="game-speed-slider"
                    min={0.5}
                    max={3}
                    step={0.5}
                    value={settings.gameSpeed}
                    onChange={setGameSpeed}
                    flex="1"
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                  <Text fontWeight="bold" minW="40px" textAlign="right">
                    {settings.gameSpeed}x
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Controls how quickly time passes in the game.
                </Text>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Autosave</FormLabel>
                <Switch
                  isChecked={settings.autosave}
                  onChange={toggleAutosave}
                />
              </FormControl>

              {settings.autosave && (
                <FormControl>
                  <FormLabel>Autosave Interval (minutes)</FormLabel>
                  <HStack>
                    <Slider
                      aria-label="autosave-interval-slider"
                      min={1}
                      max={30}
                      step={1}
                      value={settings.autosaveInterval}
                      onChange={setAutosaveInterval}
                      flex="1"
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                    <Text fontWeight="bold" minW="40px" textAlign="right">
                      {settings.autosaveInterval}m
                    </Text>
                  </HStack>
                </FormControl>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Audio & Visual Settings */}
        <Card bg={cardBg} shadow="md">
          <CardHeader>
            <Heading size="md">Audio & Visual Settings</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <HStack justifyContent="space-between">
                <HStack>
                  <Volume2 size={18} />
                  <Text>Sound Effects</Text>
                </HStack>
                <Switch
                  isChecked={settings.soundEffects}
                  onChange={toggleSoundEffects}
                />
              </HStack>

              <HStack justifyContent="space-between">
                <HStack>
                  <Volume2 size={18} />
                  <Text>Music</Text>
                </HStack>
                <Switch isChecked={settings.music} onChange={toggleMusic} />
              </HStack>

              <HStack justifyContent="space-between">
                <HStack>
                  <Bell size={18} />
                  <Text>Notifications</Text>
                </HStack>
                <Switch
                  isChecked={settings.notifications}
                  onChange={toggleNotifications}
                />
              </HStack>

              <HStack justifyContent="space-between">
                <HStack>
                  {settings.darkMode ? <Moon size={18} /> : <Sun size={18} />}
                  <Text>Dark Mode</Text>
                </HStack>
                <Switch
                  isChecked={settings.darkMode}
                  onChange={toggleDarkMode}
                />
              </HStack>

              <Divider />

              <FormControl>
                <FormLabel>Text Size</FormLabel>
                <Select
                  value={settings.textSize}
                  onChange={(e) => setTextSize(e.target.value)}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </Select>
              </FormControl>

              <HStack justifyContent="space-between">
                <Text>Enable Animations</Text>
                <Switch
                  isChecked={settings.animationsEnabled}
                  onChange={toggleAnimations}
                />
              </HStack>

              <HStack justifyContent="space-between">
                <Text>High Contrast Mode</Text>
                <Switch
                  isChecked={settings.highContrastMode}
                  onChange={toggleHighContrastMode}
                />
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Reset Options */}
        <Card bg={cardBg} shadow="md">
          <CardHeader>
            <Heading size="md">Reset Options</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <HStack justifyContent="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">Reset Settings</Text>
                  <Text fontSize="sm" color="gray.500">
                    Restore all settings to their default values.
                  </Text>
                </VStack>
                <Button
                  colorScheme="orange"
                  leftIcon={<Trash2 size={18} />}
                  onClick={handleResetSettings}
                >
                  Reset Settings
                </Button>
              </HStack>

              <Divider />

              <HStack justifyContent="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">Reset Game Progress</Text>
                  <Text fontSize="sm" color="gray.500">
                    Delete all game progress and start fresh. This cannot be
                    undone.
                  </Text>
                </VStack>
                <Button
                  colorScheme="red"
                  leftIcon={<Trash2 size={18} />}
                  onClick={onOpen}
                  isDisabled={!gameStarted}
                >
                  Reset Game
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      {/* Reset Game Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reset Game Progress
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to reset all game progress? This will delete
              your character and career history. This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleResetGame} ml={3}>
                Reset Game
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default SettingsPage;
