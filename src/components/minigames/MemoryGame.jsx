// components/minigames/MemoryGame.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  GridItem,
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
} from "@chakra-ui/react";
import { Clock, Award, Brain, RefreshCcw, Check, X } from "lucide-react";
import { useCharacterStore } from "../../store/characterStore";
import { useMinigamesStore } from "../../store/minigamesStore";

/**
 * Memory Game Component - Used for skill development and technical interviews
 *
 * @param {Object} props
 * @param {string} props.context - Game context (e.g., 'skill_development', 'exam', 'interview')
 * @param {string} props.difficulty - Game difficulty ('easy', 'normal', 'hard')
 * @param {function} props.onComplete - Callback function when game completes
 * @param {boolean} props.isOpen - Whether the game modal is open
 * @param {function} props.onClose - Callback function to close the modal
 */
const MemoryGame = ({
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
  const flipCard = useMinigamesStore((state) => state.flipCard);
  const unflipCards = useMinigamesStore((state) => state.unflipCards);
  const endMinigame = useMinigamesStore((state) => state.endMinigame);

  // Character attributes that affect performance
  const intelligence = useCharacterStore(
    (state) => state.attributes.intelligence
  );

  // Local state
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes for the game
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const cardBackColor = useColorModeValue("blue.500", "blue.300");
  const cardFrontColor = useColorModeValue("gray.100", "gray.600");

  // Initialize game
  useEffect(() => {
    if (isOpen && !isPlaying) {
      startMinigame("memory", context, difficulty);
      setGameStarted(true);
      setGameCompleted(false);
      setTimeLeft(
        difficulty === "easy" ? 120 : difficulty === "normal" ? 90 : 60
      );
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
        title: "Game Completed!",
        description: `You scored ${score} points.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (onComplete) {
        onComplete({
          success: true,
          score: score,
          moves: gameData.moves,
          timeSpent: 120 - timeLeft,
        });
      }
    }
  }, [gameData, gameCompleted, score, timeLeft, toast, onComplete]);

  // Handle card click
  const handleCardClick = (cardId) => {
    if (!isPlaying || gameCompleted) return;

    flipCard(cardId);

    // If 2 cards are flipped, schedule unflipping if they don't match
    if (
      gameData &&
      gameData.flippedCards &&
      gameData.flippedCards.length === 2
    ) {
      const card1 = gameData.flippedCards[0];
      const card2 = gameData.flippedCards[1];

      if (card1.symbol !== card2.symbol) {
        setTimeout(() => {
          unflipCards();
        }, 1000);
      }
    }
  };

  // Handle restart game
  const handleRestart = () => {
    startMinigame("memory", context, difficulty);
    setGameStarted(true);
    setGameCompleted(false);
    setTimeLeft(
      difficulty === "easy" ? 120 : difficulty === "normal" ? 90 : 60
    );
  };

  // Calculate grid size based on pairs
  const getGridSize = () => {
    if (!gameData) return { columns: 4, rows: 3 };

    const totalCards = gameData.items.length;

    if (totalCards <= 12) return { columns: 4, rows: 3 };
    if (totalCards <= 16) return { columns: 4, rows: 4 };
    return { columns: 6, rows: 4 };
  };

  const { columns, rows } = getGridSize();

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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
          Memory Game
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

              {gameData && (
                <HStack>
                  <Icon as={Award} color="orange.500" />
                  <Text fontWeight="bold">Moves: {gameData.moves}</Text>
                </HStack>
              )}
            </HStack>

            {/* Timer Progress */}
            <Progress
              value={
                (timeLeft /
                  (difficulty === "easy"
                    ? 120
                    : difficulty === "normal"
                    ? 90
                    : 60)) *
                100
              }
              colorScheme={
                timeLeft > 30 ? "green" : timeLeft > 10 ? "orange" : "red"
              }
              size="sm"
              borderRadius="full"
            />

            {/* Game Board */}
            {gameData && gameData.items && (
              <Grid
                templateColumns={`repeat(${columns}, 1fr)`}
                templateRows={`repeat(${rows}, 1fr)`}
                gap={2}
                mt={4}
              >
                {gameData.items.map((card) => (
                  <GridItem key={card.id}>
                    <Button
                      h="70px"
                      w="100%"
                      bg={
                        card.flipped || card.matched
                          ? cardFrontColor
                          : cardBackColor
                      }
                      color={card.flipped || card.matched ? "black" : "white"}
                      fontSize="xl"
                      onClick={() => handleCardClick(card.id)}
                      disabled={card.flipped || card.matched || gameCompleted}
                      border="2px solid"
                      borderColor={card.matched ? "green.400" : "transparent"}
                      _hover={{
                        bg:
                          card.flipped || card.matched
                            ? cardFrontColor
                            : cardBackColor,
                        opacity: 0.8,
                      }}
                    >
                      {card.flipped || card.matched ? card.symbol : "?"}
                    </Button>
                  </GridItem>
                ))}
              </Grid>
            )}

            {/* Game Results (when completed) */}
            {gameCompleted && (
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

                    {gameData && (
                      <Stat textAlign="center">
                        <StatLabel>Moves</StatLabel>
                        <StatNumber>{gameData.moves}</StatNumber>
                        <StatHelpText>
                          {gameData.moves < gameData.totalPairs * 3
                            ? "Excellent"
                            : gameData.moves < gameData.totalPairs * 4
                            ? "Good"
                            : "Average"}
                        </StatHelpText>
                      </Stat>
                    )}

                    <Stat textAlign="center">
                      <StatLabel>Time</StatLabel>
                      <StatNumber>{formatTime(120 - timeLeft)}</StatNumber>
                    </Stat>
                  </HStack>

                  <Text textAlign="center">
                    {score > 700
                      ? "Outstanding performance! Your memory is exceptional."
                      : score > 500
                      ? "Good job! You completed the memory challenge successfully."
                      : score > 300
                      ? "Not bad, but there's room for improvement."
                      : "You need more practice with memory exercises."}
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

export default MemoryGame;
