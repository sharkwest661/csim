// components/GameEvent.jsx
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Box,
  VStack,
  HStack,
  Divider,
  Badge,
  useColorModeValue,
  Icon,
  Flex,
} from "@chakra-ui/react";
import {
  AlertTriangle,
  Award,
  Check,
  ChevronsUp,
  ChevronsDown,
  Lightbulb,
  Users,
  Briefcase,
  Heart,
  TrendingUp,
  DollarSign,
  Star,
  Clock,
} from "lucide-react";
import { useGameEventsStore } from "../store/gameEventsStore";

/**
 * Game Event Component - Displays random events that occur during gameplay
 */
const GameEvent = () => {
  // Game events store
  const currentEvent = useGameEventsStore((state) => state.currentEvent);
  const completeEvent = useGameEventsStore((state) => state.completeEvent);

  // Colors
  const cardBg = useColorModeValue("white", "gray.800");

  // If no current event, don't render anything
  if (!currentEvent) {
    return null;
  }

  // Handle choice selection
  const handleChoice = (choiceIndex) => {
    // Get selected choice
    const choice = currentEvent.choices[choiceIndex];

    // Create outcome based on choice effects
    const outcome = {
      type: calculateOutcomeType(choice.effects),
      effects: choice.effects,
      description: generateOutcomeDescription(choice.effects),
    };

    // Complete the event with the selected choice and outcome
    completeEvent(choiceIndex, outcome);
  };

  // Calculate if outcome is positive, negative, or neutral
  const calculateOutcomeType = (effects) => {
    if (!effects) return "neutral";

    let positiveCount = 0;
    let negativeCount = 0;

    // Count positive and negative effects
    Object.entries(effects).forEach(([key, value]) => {
      if (typeof value === "number") {
        if (key === "stress" || key === "reputation") {
          // For stress, negative change is positive outcome
          // For reputation, positive change is positive outcome
          if (
            (key === "stress" && value < 0) ||
            (key === "reputation" && value > 0)
          ) {
            positiveCount++;
          } else if (
            (key === "stress" && value > 0) ||
            (key === "reputation" && value < 0)
          ) {
            negativeCount++;
          }
        } else {
          // For other numeric effects, positive change is positive outcome
          if (value > 0) {
            positiveCount++;
          } else if (value < 0) {
            negativeCount++;
          }
        }
      } else if (typeof value === "object") {
        // For nested objects (skills, connections, etc.), recursively calculate
        const nestedType = calculateOutcomeType(value);
        if (nestedType === "positive") positiveCount++;
        else if (nestedType === "negative") negativeCount++;
      }
    });

    // Determine overall outcome type
    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  };

  // Generate a description of the outcome based on effects
  const generateOutcomeDescription = (effects) => {
    if (!effects) return "Your decision has been made.";

    const descriptions = [];

    // Generate descriptions for each effect
    Object.entries(effects).forEach(([key, value]) => {
      if (typeof value === "number") {
        if (key === "energy") {
          if (value > 0)
            descriptions.push(`Your energy increased by ${value} points.`);
          else if (value < 0)
            descriptions.push(
              `Your energy decreased by ${Math.abs(value)} points.`
            );
        } else if (key === "stress") {
          if (value > 0)
            descriptions.push(`Your stress increased by ${value} points.`);
          else if (value < 0)
            descriptions.push(
              `Your stress decreased by ${Math.abs(value)} points.`
            );
        } else if (key === "satisfaction") {
          if (value > 0)
            descriptions.push(
              `Your job satisfaction increased by ${value} points.`
            );
          else if (value < 0)
            descriptions.push(
              `Your job satisfaction decreased by ${Math.abs(value)} points.`
            );
        } else if (key === "salary") {
          if (value > 0)
            descriptions.push(`Your salary increased by ${value}%.`);
          else if (value < 0)
            descriptions.push(`Your salary decreased by ${Math.abs(value)}%.`);
        } else if (key === "reputation") {
          if (value > 0)
            descriptions.push(`Your professional reputation improved.`);
          else if (value < 0)
            descriptions.push(`Your professional reputation suffered.`);
        }
      } else if (typeof value === "object") {
        if (key === "skills") {
          const skillChanges = [];
          Object.entries(value).forEach(([skill, change]) => {
            if (change > 0) {
              skillChanges.push(`${skill.replace("_", " ")} +${change}`);
            } else if (change < 0) {
              skillChanges.push(`${skill.replace("_", " ")} ${change}`);
            }
          });

          if (skillChanges.length > 0) {
            descriptions.push(`Skill changes: ${skillChanges.join(", ")}`);
          }
        } else if (key === "connections") {
          const connectionChanges = [];
          Object.entries(value).forEach(([connection, change]) => {
            if (change > 0) {
              connectionChanges.push(`${connection} connections +${change}`);
            } else if (change < 0) {
              connectionChanges.push(`${connection} connections ${change}`);
            }
          });

          if (connectionChanges.length > 0) {
            descriptions.push(
              `Connection changes: ${connectionChanges.join(", ")}`
            );
          }
        } else if (key === "resume") {
          descriptions.push(
            `Your resume has been updated with new experiences.`
          );
        }
      }
    });

    // If no descriptions were generated, return a default message
    if (descriptions.length === 0) {
      return "Your decision has been made, but its effects are yet to be seen.";
    }

    return descriptions.join(" ");
  };

  // Get icon for event type
  const getEventIcon = () => {
    const eventPhase = currentEvent.phase;

    switch (eventPhase) {
      case "education":
        return Lightbulb;
      case "career":
        return Briefcase;
      case "military":
        return Award;
      default:
        return AlertTriangle;
    }
  };

  // Get icon for effect type
  const getEffectIcon = (effectKey) => {
    switch (effectKey) {
      case "energy":
        return Heart;
      case "stress":
        return TrendingUp;
      case "salary":
        return DollarSign;
      case "reputation":
        return Star;
      case "skills":
        return Lightbulb;
      case "connections":
        return Users;
      default:
        return Clock;
    }
  };

  const EventIcon = getEventIcon();

  return (
    <Modal
      isOpen={!!currentEvent}
      onClose={() => {}}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <Icon as={EventIcon} color="blue.500" />
            <Text>Random Event</Text>
            <Badge
              ml={2}
              colorScheme={
                currentEvent.phase === "education"
                  ? "blue"
                  : currentEvent.phase === "career"
                  ? "green"
                  : currentEvent.phase === "military"
                  ? "purple"
                  : "gray"
              }
            >
              {currentEvent.phase.charAt(0).toUpperCase() +
                currentEvent.phase.slice(1)}
            </Badge>
          </HStack>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="xl" fontWeight="bold">
              {currentEvent.name}
            </Text>
            <Text>{currentEvent.description}</Text>

            <Divider />

            <Text fontWeight="bold">What will you do?</Text>

            <VStack spacing={3} align="stretch">
              {currentEvent.choices.map((choice, index) => (
                <Button
                  key={index}
                  onClick={() => handleChoice(index)}
                  colorScheme={
                    index === 0 ? "blue" : index === 1 ? "green" : "purple"
                  }
                  variant="outline"
                  justifyContent="flex-start"
                  height="auto"
                  p={4}
                  whiteSpace="normal"
                  textAlign="left"
                >
                  <VStack align="start" spacing={2} width="100%">
                    <Text fontWeight="bold">{choice.text}</Text>

                    {choice.effects && (
                      <Flex wrap="wrap" gap={2} mt={1}>
                        {Object.entries(choice.effects).map(
                          ([key, value], i) => {
                            if (typeof value === "number") {
                              const isPositive =
                                (key === "stress" && value < 0) ||
                                (key !== "stress" && value > 0);
                              const EffectIcon = getEffectIcon(key);

                              return (
                                <Badge
                                  key={i}
                                  colorScheme={isPositive ? "green" : "red"}
                                  variant="subtle"
                                  display="flex"
                                  alignItems="center"
                                >
                                  <Icon as={EffectIcon} size={12} mr={1} />
                                  <Text>
                                    {key}: {value > 0 ? "+" : ""}
                                    {value}
                                  </Text>
                                </Badge>
                              );
                            }
                            return null;
                          }
                        )}
                      </Flex>
                    )}
                  </VStack>
                </Button>
              ))}
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GameEvent;
