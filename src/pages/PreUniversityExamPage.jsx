// pages/PreUniversityExamPage.jsx
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
  Grid,
  GridItem,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Award, ChevronRight, Brain } from "lucide-react";
import { useEducationStore } from "../store/educationStore";
import { useGameStore } from "../store/gameStore";

const PreUniversityExamPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Education state - use selective state picking
  const entranceExamScore = useEducationStore(
    (state) => state.entranceExamScore
  );
  const setEntranceExamScore = useEducationStore(
    (state) => state.setEntranceExamScore
  );
  const setSubjectBreakdown = useEducationStore(
    (state) => state.setSubjectBreakdown
  );

  // Game state
  const advanceStage = useGameStore((state) => state.advanceStage);
  const currentStage = useGameStore((state) => state.currentStage);

  // Local state for quiz
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [universitiesAvailable, setUniversitiesAvailable] = useState([]);

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");

  // Sample exam questions (in a real app, these would be more comprehensive)
  const examQuestions = [
    {
      id: "q1",
      subject: "Mathematics",
      question: "What is the derivative of f(x) = x² + 3x + 5?",
      options: ["f'(x) = 2x + 3", "f'(x) = x² + 3", "f'(x) = 2x", "f'(x) = 3"],
      correctAnswer: 0,
    },
    {
      id: "q2",
      subject: "Computer Science",
      question:
        "Which data structure follows the Last In First Out (LIFO) principle?",
      options: ["Queue", "Stack", "Linked List", "Binary Tree"],
      correctAnswer: 1,
    },
    {
      id: "q3",
      subject: "Physics",
      question: "What is the SI unit of electric current?",
      options: ["Volt", "Watt", "Ampere", "Ohm"],
      correctAnswer: 2,
    },
    {
      id: "q4",
      subject: "Language",
      question: "Which of the following is NOT a programming language?",
      options: ["Python", "Java", "HTML", "Oracle"],
      correctAnswer: 3,
    },
    {
      id: "q5",
      subject: "Logic",
      question: "If A implies B, and B implies C, then:",
      options: [
        "A implies C",
        "C implies A",
        "A and C are unrelated",
        "None of the above",
      ],
      correctAnswer: 0,
    },
    {
      id: "q6",
      subject: "Computer Science",
      question: "What does CPU stand for?",
      options: [
        "Central Processing Unit",
        "Computer Personal Unit",
        "Central Program Utility",
        "Computer Processing Utility",
      ],
      correctAnswer: 0,
    },
    {
      id: "q7",
      subject: "Mathematics",
      question: "What is the value of π (pi) to two decimal places?",
      options: ["3.41", "3.14", "3.12", "3.21"],
      correctAnswer: 1,
    },
  ];

  // Handle answer selection
  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex,
    });
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // If this is the last question, calculate score
      calculateExamScore();
    }
  };

  // Calculate exam score based on answers
  const calculateExamScore = () => {
    setIsProcessing(true);

    // Simulate some processing time
    setTimeout(() => {
      // Count correct answers
      let correctCount = 0;
      let subjectScores = {};

      examQuestions.forEach((question) => {
        const userAnswer = answers[question.id];
        if (userAnswer === question.correctAnswer) {
          correctCount++;
        }

        // Track subject performance
        if (!subjectScores[question.subject]) {
          subjectScores[question.subject] = { correct: 0, total: 0 };
        }

        subjectScores[question.subject].total++;

        if (userAnswer === question.correctAnswer) {
          subjectScores[question.subject].correct++;
        }
      });

      // Calculate percentage correct and convert to 700-point scale
      const percentage = correctCount / examQuestions.length;
      const score = Math.round(percentage * 700);

      // Convert subject scores to percentages
      const subjectBreakdown = {};
      Object.entries(subjectScores).forEach(([subject, scores]) => {
        subjectBreakdown[subject] = Math.round(
          (scores.correct / scores.total) * 100
        );
      });

      // Determine available universities based on score
      const availableUniversities = [];

      if (score >= 650) {
        availableUniversities.push({
          id: "ada",
          name: "ADA University",
          prestigeRating: 10,
          description:
            "A modern university with international standards and English-language instruction.",
          threshold: 650,
        });
      }

      if (score >= 600) {
        availableUniversities.push({
          id: "bsu",
          name: "Baku State University",
          prestigeRating: 9,
          description:
            "The largest university in Azerbaijan with strong academic traditions and research focus.",
          threshold: 600,
        });
      }

      if (score >= 550) {
        availableUniversities.push({
          id: "asoiu",
          name: "Azerbaijan State Oil and Industry University",
          prestigeRating: 8,
          description:
            "One of the oldest technical universities in Azerbaijan, focusing on engineering and technology.",
          threshold: 550,
        });
      }

      if (score >= 500) {
        availableUniversities.push({
          id: "beu",
          name: "Baku Engineering University",
          prestigeRating: 7,
          description:
            "A specialized engineering university with modern facilities and industry connections.",
          threshold: 500,
        });
      }

      // Always ensure at least one university is available
      if (availableUniversities.length === 0) {
        availableUniversities.push({
          id: "regional",
          name: "Regional Technical College",
          prestigeRating: 5,
          description:
            "A local college offering basic technical education and IT training.",
          threshold: 400,
        });
      }

      // Save the data to the education store
      setEntranceExamScore(score);
      setSubjectBreakdown(subjectBreakdown);

      // Update local state
      setExamScore(score);
      setUniversitiesAvailable(availableUniversities);
      setExamCompleted(true);
      setIsProcessing(false);
    }, 1500);
  };

  // Select a university and proceed
  const selectUniversity = (universityId) => {
    // Here you would set the selected university in the education store
    useEducationStore.getState().setUniversity(universityId);

    // Advance to education stage
    advanceStage("education");

    // Navigate to education page
    navigate("/education");

    toast({
      title: "University Selected",
      description: `You've been accepted to ${
        universitiesAvailable.find((u) => u.id === universityId).name
      }!`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  // Retry the exam
  const retryExam = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setExamCompleted(false);
    setExamScore(0);
  };

  return (
    <Box mb={8}>
      <Heading size="xl" mb={6}>
        University Entrance Exam
      </Heading>

      {!examCompleted ? (
        <Card bg={cardBg} shadow="md" mb={6}>
          <CardHeader>
            <HStack justifyContent="space-between">
              <Heading size="md">
                Question {currentQuestion + 1} of {examQuestions.length}
              </Heading>
              <Badge colorScheme="blue">
                {examQuestions[currentQuestion].subject}
              </Badge>
            </HStack>
          </CardHeader>

          <CardBody>
            <VStack spacing={6} align="stretch">
              <Text fontSize="xl" fontWeight="medium">
                {examQuestions[currentQuestion].question}
              </Text>

              <RadioGroup
                value={
                  answers[examQuestions[currentQuestion].id] !== undefined
                    ? answers[examQuestions[currentQuestion].id].toString()
                    : ""
                }
                onChange={(value) =>
                  handleAnswerSelect(
                    examQuestions[currentQuestion].id,
                    parseInt(value)
                  )
                }
              >
                <Stack direction="column" spacing={4}>
                  {examQuestions[currentQuestion].options.map(
                    (option, index) => (
                      <Radio key={index} value={index.toString()}>
                        {option}
                      </Radio>
                    )
                  )}
                </Stack>
              </RadioGroup>

              <Progress
                value={(currentQuestion / examQuestions.length) * 100}
                colorScheme="blue"
                size="sm"
                borderRadius="full"
              />
            </VStack>
          </CardBody>

          <CardFooter>
            <Button
              colorScheme="blue"
              rightIcon={<ChevronRight />}
              onClick={handleNextQuestion}
              isDisabled={
                answers[examQuestions[currentQuestion].id] === undefined
              }
              width="full"
            >
              {currentQuestion < examQuestions.length - 1
                ? "Next Question"
                : "Complete Exam"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <VStack spacing={6}>
          {/* Exam Results Card */}
          <Card bg={cardBg} shadow="md" width="full">
            <CardHeader bg={useColorModeValue("blue.50", "blue.900")}>
              <HStack justifyContent="space-between">
                <Heading size="md">Exam Results</Heading>
                <Badge
                  colorScheme={
                    examScore >= 600
                      ? "green"
                      : examScore >= 500
                      ? "blue"
                      : "yellow"
                  }
                  fontSize="lg"
                  px={3}
                  py={1}
                >
                  {examScore} / 700
                </Badge>
              </HStack>
            </CardHeader>

            <CardBody>
              <VStack spacing={6} align="stretch">
                <Text>
                  You've completed the university entrance exam with a score of{" "}
                  <strong>{examScore}</strong> out of 700. This score determines
                  which universities you can apply to.
                </Text>

                <Divider />

                <Heading size="sm">Subject Breakdown</Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  {Object.entries(
                    useEducationStore.getState().subjectBreakdown
                  ).map(([subject, score]) => (
                    <GridItem key={subject}>
                      <HStack justifyContent="space-between">
                        <Text>{subject}:</Text>
                        <Badge
                          colorScheme={
                            score >= 80
                              ? "green"
                              : score >= 60
                              ? "blue"
                              : "yellow"
                          }
                        >
                          {score}%
                        </Badge>
                      </HStack>
                      <Progress
                        value={score}
                        colorScheme={
                          score >= 80
                            ? "green"
                            : score >= 60
                            ? "blue"
                            : "yellow"
                        }
                        size="sm"
                        mt={1}
                      />
                    </GridItem>
                  ))}
                </Grid>
              </VStack>
            </CardBody>
          </Card>

          {/* University Selection Card */}
          <Card bg={cardBg} shadow="md" width="full">
            <CardHeader>
              <Heading size="md">Available Universities</Heading>
            </CardHeader>

            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text>
                  Based on your entrance exam score, you can apply to the
                  following universities:
                </Text>

                {universitiesAvailable.map((university) => (
                  <Card key={university.id} variant="outline">
                    <CardBody>
                      <HStack justifyContent="space-between" mb={2}>
                        <Heading size="sm">{university.name}</Heading>
                        <HStack>
                          <Badge colorScheme="purple">
                            Prestige: {university.prestigeRating}/10
                          </Badge>
                          <Badge colorScheme="blue">
                            Min Score: {university.threshold}
                          </Badge>
                        </HStack>
                      </HStack>

                      <Text fontSize="sm" mb={3}>
                        {university.description}
                      </Text>

                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => selectUniversity(university.id)}
                        rightIcon={<ChevronRight size={16} />}
                      >
                        Select This University
                      </Button>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </CardBody>

            <CardFooter>
              <Button
                leftIcon={<BookOpen size={18} />}
                colorScheme="blue"
                variant="outline"
                onClick={retryExam}
                width="full"
              >
                Retake Exam
              </Button>
            </CardFooter>
          </Card>
        </VStack>
      )}

      {isProcessing && (
        <Box mt={8}>
          <Alert status="info">
            <AlertIcon />
            <AlertTitle mr={2}>Processing Your Exam</AlertTitle>
            <AlertDescription>
              Your answers are being graded, please wait...
            </AlertDescription>
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default PreUniversityExamPage;
