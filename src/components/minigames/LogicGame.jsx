// components/minigames/LogicGame.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Progress,
  Badge,
  useColorModeValue,
  Card,
  Heading,
  Flex,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import {
  Clock,
  Award,
  Brain,
  RefreshCcw,
  Check,
  X,
  TrendingUp,
} from "lucide-react";
import { useCharacterStore } from "../../store/characterStore";
import { useMinigamesStore } from "../../store/minigamesStore";

/**
 * Logic Game Component - Used for problem-solving and technical assessments
 *
 * @param {Object} props
 * @param {string} props.context - Game context (e.g., 'skill_development', 'exam', 'interview')
 * @param {string} props.difficulty - Game difficulty ('easy', 'normal', 'hard')
 * @param {function} props.onComplete - Callback function when game completes
 * @param {boolean} props.isOpen - Whether the game modal is open
 * @param {function} props.onClose - Callback function to close the modal
 */
const LogicGame = ({
  context = "skill_development",
  difficulty = "normal",
  onComplete,
  isOpen,
  onClose,
}) => {
  const toast = useToast();

  // Access minigames store
  const activeMinigame = useMinigamesStore((state) => state.activeMinigame);
  const gameData = useMinigamesStore((state) => state.gameData);
  const isPlaying = useMinigamesStore((state) => state.isPlaying);
  const score = useMinigamesStore((state) => state.score);

  // Minigame actions
  const startMinigame = useMinigamesStore((state) => state.startMinigame);
  const submitLogicAnswer = useMinigamesStore(
    (state) => state.submitLogicAnswer
  );
  const endMinigame = useMinigamesStore((state) => state.endMinigame);

  // Character attributes that affect performance
  const intelligence = useCharacterStore(
    (state) => state.attributes.intelligence
  );
  const creativity = useCharacterStore((state) => state.attributes.creativity);

  // Local state
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes for the game
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const patternBg = useColorModeValue("blue.50", "blue.900");

  // Initialize game
  useEffect(() => {
    if (isOpen && !isPlaying) {
      startMinigame("logic", context, difficulty);
      setGameStarted(true);
      setGameCompleted(false);
      setTimeLeft(
        difficulty === "easy" ? 180 : difficulty === "normal" ? 150 : 120
      );
      setCurrentAnswer("");
    }
  }, [isOpen, isPlaying, startMinigame, context, difficulty]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameStarted && isPlaying && !gameCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStarted, isPlaying, gameCompleted, timeLeft]);

  // Check for timeout
  useEffect(() => {
    if (timeLeft <= 0 && gameStarted && isPlaying) {
      endMinigame();
      setGameCompleted(true);

      toast({
        title: "Time's up!",
        description: "You ran out of time. Better luck next time!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      if (onComplete) {
        onComplete({
          success: false,
          score: 0,
          reason: "timeout",
        });
      }
    }
  }, [timeLeft, gameStarted, isPlaying, endMinigame, toast, onComplete]);

  // Check for game completion
  useEffect(() => {
    if (gameData && gameData.completed && !gameCompleted) {
      setGameCompleted(true);

      toast({
        title: "Puzzle Completed!",
        description: `You scored ${score} points.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (onComplete) {
        const correctAnswers = gameData.patterns.filter(
          (p) => p.userAnswer === p.answer
        ).length;
        onComplete({
          success: correctAnswers / gameData.patterns.length >= 0.6, // Success if at least 60% correct
          score: score,
          correctAnswers,
          totalPatterns: gameData.patterns.length,
          timeSpent: 180 - timeLeft,
        });
      }
    }
  }, [gameData, gameCompleted, score, timeLeft, toast, onComplete]);

  // Handle submit answer
  const handleSubmitAnswer = () => {
    if (!isPlaying || gameCompleted || !gameData) return;

    // Convert answer to number if possible
    let answer = currentAnswer.trim();
    if (!isNaN(answer) && answer !== "") {
      answer = Number(answer);
    }

    submitLogicAnswer(answer);
    setCurrentAnswer("");
  };

  // Handle restart game
  const handleRestart = () => {
    startMinigame("logic", context, difficulty);
    setGameStarted(true);
    setGameCompleted(false);
    setTimeLeft(
      difficulty === "easy" ? 180 : difficulty === "normal" ? 150 : 120
    );
    setCurrentAnswer("");
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Get current pattern
  const getCurrentPattern = () => {
    if (!gameData || !gameData.patterns || gameData.patterns.length === 0) {
      return null;
    }

    return gameData.patterns[gameData.currentPattern];
  };

  const currentPattern = getCurrentPattern();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Logic Puzzle Game
          <Badge
            ml={2}
            colorScheme={
              difficulty === "easy"
                ? "green"
                : difficulty === "normal"
                ? "blue"
                : "red"
            }
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Game Info */}
            <HStack justify="space-between">
              <HStack>
                <Icon as={Clock} color="blue.500" />
                <Text fontWeight="bold">Time: {formatTime(timeLeft)}</Text>
              </HStack>

              <HStack>
                <Icon as={Brain} color="purple.500" />
                <Text fontWeight="bold">Intelligence: {intelligence}/10</Text>
              </HStack>

              <HStack>
                <Icon as={TrendingUp} color="orange.500" />
                <Text fontWeight="bold">Creativity: {creativity}/10</Text>
              </HStack>
            </HStack>

            {/* Timer Progress */}
            <Progress
              value={
                (timeLeft /
                  (difficulty === "easy"
                    ? 180
                    : difficulty === "normal"
                    ? 150
                    : 120)) *
                100
              }
              colorScheme={
                timeLeft > 60 ? "green" : timeLeft > 30 ? "orange" : "red"
              }
              size="sm"
              borderRadius="full"
            />

            {/* Progress Indicator */}
            {gameData && (
              <HStack spacing={2} justify="center">
                <Text fontSize="sm">
                  Puzzle {gameData.currentPattern + 1} of{" "}
                  {gameData.patterns.length}
                </Text>
                <Progress
                  value={
                    (gameData.currentPattern / gameData.patterns.length) * 100
                  }
                  colorScheme="blue"
                  size="xs"
                  width="100px"
                  borderRadius="full"
                />
              </HStack>
            )}

            {/* Current Pattern */}
            {currentPattern && !gameCompleted && (
              <Card p={6} bg={patternBg} shadow="md">
                <VStack spacing={4} align="center">
                  <Heading size="md">
                    Find the Next Number in the Sequence
                  </Heading>

                  <HStack spacing={4} fontSize="xl" fontWeight="bold">
                    {currentPattern.sequence.map((num, index) => (
                      <Box
                        key={index}
                        bg={cardBg}
                        p={3}
                        borderRadius="md"
                        minW="50px"
                        textAlign="center"
                        shadow="md"
                      >
                        {num}
                      </Box>
                    ))}
                    <Box
                      bg="gray.300"
                      p={3}
                      borderRadius="md"
                      minW="50px"
                      textAlign="center"
                      fontSize="xl"
                      fontWeight="bold"
                      shadow="md"
                    >
                      ?
                    </Box>
                  </HStack>

                  <HStack mt={4}>
                    <NumberInput
                      value={currentAnswer}
                      onChange={setCurrentAnswer}
                      min={-1000}
                      max={1000}
                      precision={2}
                    >
                      <NumberInputField
                        placeholder="Your answer"
                        width="150px"
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>

                    <Button
                      colorScheme="blue"
                      onClick={handleSubmitAnswer}
                      isDisabled={currentAnswer === ""}
                    >
                      Submit
                    </Button>
                  </HStack>

                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Find the pattern and enter the next number in the sequence.
                  </Text>
                </VStack>
              </Card>
            )}

            {/* Game Results (when completed) */}
            {gameCompleted && gameData && (
              <Card p={4} bg={useColorModeValue("blue.50", "blue.900")}>
                <VStack spacing={3}>
                  <Heading size="md">Game Results</Heading>

                  <HStack spacing={6}>
                    <Stat textAlign="center">
                      <StatLabel>Score</StatLabel>
                      <StatNumber>{score}</StatNumber>
                      <Icon
                        as={score > 500 ? Check : X}
                        color={score > 500 ? "green.500" : "red.500"}
                        boxSize={5}
                      />
                    </Stat>

                    <Stat textAlign="center">
                      <StatLabel>Correct Answers</StatLabel>
                      <StatNumber>
                        {
                          gameData.patterns.filter(
                            (p) => p.userAnswer === p.answer
                          ).length
                        }
                        /{gameData.patterns.length}
                      </StatNumber>
                      <StatHelpText>
                        {gameData.patterns.filter(
                          (p) => p.userAnswer === p.answer
                        ).length /
                          gameData.patterns.length >=
                        0.8
                          ? "Excellent"
                          : gameData.patterns.filter(
                              (p) => p.userAnswer === p.answer
                            ).length /
                              gameData.patterns.length >=
                            0.6
                          ? "Good"
                          : "Needs Improvement"}
                      </StatHelpText>
                    </Stat>

                    <Stat textAlign="center">
                      <StatLabel>Time</StatLabel>
                      <StatNumber>{formatTime(180 - timeLeft)}</StatNumber>
                    </Stat>
                  </HStack>

                  {/* Answer Review */}
                  <VStack align="stretch" spacing={3} width="100%" mt={4}>
                    <Heading size="sm">Answer Review</Heading>
                    {gameData.patterns.map((pattern, index) => (
                      <HStack key={index} justify="space-between">
                        <HStack>
                          <Text fontWeight="bold">Pattern {index + 1}:</Text>
                          <HStack>
                            {pattern.sequence.map((num, idx) => (
                              <Text key={idx}>{num}</Text>
                            ))}
                            <Text>→</Text>
                            <Text fontWeight="bold">{pattern.answer}</Text>
                          </HStack>
                        </HStack>

                        <HStack>
                          <Text>
                            Your answer:{" "}
                            {pattern.userAnswer !== null
                              ? pattern.userAnswer
                              : "Skipped"}
                          </Text>
                          <Icon
                            as={
                              pattern.userAnswer === pattern.answer ? Check : X
                            }
                            color={
                              pattern.userAnswer === pattern.answer
                                ? "green.500"
                                : "red.500"
                            }
                          />
                        </HStack>
                      </HStack>
                    ))}
                  </VStack>

                  <Text textAlign="center" mt={4}>
                    {score > 700
                      ? "Outstanding logical reasoning skills! You have a natural talent for pattern recognition."
                      : score > 500
                      ? "Good job! Your logical reasoning skills are well developed."
                      : score > 300
                      ? "Not bad, but there's room to improve your pattern recognition skills."
                      : "You should practice more logical reasoning and pattern recognition exercises."}
                  </Text>
                </VStack>
              </Card>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          {gameCompleted ? (
            <>
              <Button
                leftIcon={<RefreshCcw size={16} />}
                colorScheme="blue"
                mr={3}
                onClick={handleRestart}
              >
                Play Again
              </Button>
              <Button onClick={onClose}>Close</Button>
            </>
          ) : (
            <Button
              colorScheme="red"
              onClick={() => {
                endMinigame();
                setGameCompleted(true);
                onClose();
              }}
            >
              Quit Game
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LogicGame;
