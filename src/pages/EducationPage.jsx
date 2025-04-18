import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  Flex,
  Stack,
  Progress,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { useEducationStore } from "../store/educationStore";

function EducationPage() {
  // Use the correct pattern for accessing Zustand store
  // Select only the specific state and actions needed
  const semester = useEducationStore((state) => state.semester);
  const gpa = useEducationStore((state) => state.gpa);
  const energy = useEducationStore((state) => state.energy);
  const selectedCourses = useEducationStore((state) => state.selectedCourses);
  const courseGrades = useEducationStore((state) => state.courseGrades);
  const timeUnits = useEducationStore((state) => state.timeUnits);
  const allocatedTime = useEducationStore((state) => state.allocatedTime);
  const skills = useEducationStore((state) => state.skills);
  const activeEvent = useEducationStore((state) => state.activeEvent);
  const semesterHistory = useEducationStore((state) => state.semesterHistory);

  // Store actions
  const getAvailableCourses = useEducationStore(
    (state) => state.getAvailableCourses
  );
  const selectCourses = useEducationStore((state) => state.selectCourses);
  const allocateTime = useEducationStore((state) => state.allocateTime);
  const completeCourse = useEducationStore((state) => state.completeCourse);
  const advanceSemester = useEducationStore((state) => state.advanceSemester);
  const handleEvent = useEducationStore((state) => state.handleEvent);
  const studyCourse = useEducationStore((state) => state.studyCourse);

  // Local component state
  const [availableCourses, setAvailableCourses] = useState([]);
  const [tempTimeAllocation, setTempTimeAllocation] = useState({
    ...allocatedTime,
  });
  const [timeRemaining, setTimeRemaining] = useState(timeUnits);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);

  // Modal controls
  const {
    isOpen: isSelectCoursesOpen,
    onOpen: onOpenSelectCourses,
    onClose: onCloseSelectCourses,
  } = useDisclosure();

  const {
    isOpen: isAllocateTimeOpen,
    onOpen: onOpenAllocateTime,
    onClose: onCloseAllocateTime,
  } = useDisclosure();

  const {
    isOpen: isEventOpen,
    onOpen: onOpenEvent,
    onClose: onCloseEvent,
  } = useDisclosure();

  // Initialize or update available courses when semester changes
  useEffect(() => {
    const courses = getAvailableCourses();
    setAvailableCourses(courses);

    // Initialize selectedCourseIds from the store's selectedCourses
    setSelectedCourseIds(selectedCourses.map((course) => course.id));

    // Reset temp time allocation to match stored allocation
    setTempTimeAllocation({ ...allocatedTime });
    updateTimeRemaining({ ...allocatedTime });
  }, [semester, getAvailableCourses, selectedCourses, allocatedTime]);

  // Show event modal when active event exists
  useEffect(() => {
    if (activeEvent) {
      onOpenEvent();
    }
  }, [activeEvent, onOpenEvent]);

  // Update remaining time calculation
  const updateTimeRemaining = (allocation) => {
    const used = Object.values(allocation).reduce((sum, val) => sum + val, 0);
    setTimeRemaining(timeUnits - used);
  };

  // Handle time allocation changes
  const handleTimeAllocationChange = (activity, value) => {
    const newAllocation = { ...tempTimeAllocation, [activity]: value };
    setTempTimeAllocation(newAllocation);
    updateTimeRemaining(newAllocation);
  };

  // Save time allocation
  const saveTimeAllocation = () => {
    const success = allocateTime(tempTimeAllocation);
    if (success) {
      onCloseAllocateTime();
    } else {
      // Show error (exceeding time units)
      alert("Time allocation exceeds available time units!");
    }
  };

  // Toggle course selection
  const toggleCourseSelection = (courseId) => {
    setSelectedCourseIds((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        // Limit to 4 courses per semester
        if (prev.length < 4) {
          return [...prev, courseId];
        }
        return prev;
      }
    });
  };

  // Save course selection
  const saveSelectedCourses = () => {
    selectCourses(selectedCourseIds);
    onCloseSelectCourses();
  };

  // Handle study action for a course
  const handleStudyCourse = (courseId) => {
    studyCourse(courseId);
  };

  // Handle completing a course with a grade
  const handleCompleteCourse = (courseId, grade) => {
    completeCourse(courseId, grade);
  };

  // Handle event option selection
  const handleEventOption = (optionIndex) => {
    handleEvent(optionIndex);
    onCloseEvent();
  };

  // Get color for GPA display
  const getGpaColor = (gpa) => {
    if (gpa >= 3.5) return "green.500";
    if (gpa >= 3.0) return "blue.500";
    if (gpa >= 2.0) return "yellow.500";
    return "red.500";
  };

  // Get color for energy bar
  const getEnergyColor = (energy) => {
    if (energy > 70) return "green.500";
    if (energy > 40) return "yellow.500";
    return "red.500";
  };

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>University Education</Heading>
        <Stack direction="row" spacing={4}>
          <Stat
            textAlign="center"
            borderWidth="1px"
            borderRadius="lg"
            p={2}
            bgColor="blue.50"
          >
            <StatLabel>Semester</StatLabel>
            <StatNumber color="black">{semester}/8</StatNumber>
          </Stat>

          <Stat
            textAlign="center"
            borderWidth="1px"
            borderRadius="lg"
            p={2}
            bgColor="blue.50"
          >
            <StatLabel>GPA</StatLabel>
            <StatNumber color={getGpaColor(gpa)}>{gpa.toFixed(2)}</StatNumber>
          </Stat>
        </Stack>
      </Flex>

      <Box borderWidth="1px" borderRadius="lg" p={4} mb={6} bgColor="white">
        <Text fontWeight="bold" mb={2} color="gray.700">
          Energy Level
        </Text>
        <Box position="relative">
          <Progress
            value={energy}
            colorScheme={
              getEnergyColor(energy) === "green.500"
                ? "green"
                : getEnergyColor(energy) === "yellow.500"
                ? "yellow"
                : "red"
            }
            size="md"
            borderRadius="md"
          />
          <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            fontSize="sm"
            fontWeight="bold"
            color="gray.800"
            bg="white"
            px={2}
            borderRadius="md"
            textShadow="0px 0px 2px white"
          >
            {energy}/100
          </Text>
        </Box>
      </Box>

      <Tabs variant="enclosed" mb={6}>
        <TabList>
          <Tab>Courses</Tab>
          <Tab>Time Allocation</Tab>
          <Tab>Skills</Tab>
          <Tab>History</Tab>
        </TabList>

        <TabPanels>
          {/* Courses Tab */}
          <TabPanel>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">Current Courses</Heading>
              <Button
                colorScheme="blue"
                onClick={onOpenSelectCourses}
                isDisabled={selectedCourses.length === 4}
              >
                Select Courses
              </Button>
            </Flex>

            {selectedCourses.length === 0 ? (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <AlertDescription>
                  No courses selected for this semester. Click "Select Courses"
                  to begin.
                </AlertDescription>
              </Alert>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {selectedCourses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader bg="blue.50" p={3}>
                      <Heading size="sm">{course.name}</Heading>
                    </CardHeader>
                    <CardBody p={3}>
                      <Text>Credits: {course.credits}</Text>
                      <Text>
                        Difficulty:{" "}
                        {Array(course.difficulty).fill("★").join("")}
                      </Text>
                      <Text mt={2}>
                        Grade:{" "}
                        {courseGrades[course.id] ? (
                          <Badge
                            colorScheme={
                              courseGrades[course.id] === "A"
                                ? "green"
                                : courseGrades[course.id] === "B"
                                ? "blue"
                                : courseGrades[course.id] === "C"
                                ? "yellow"
                                : "red"
                            }
                          >
                            {courseGrades[course.id]}
                          </Badge>
                        ) : (
                          "Not graded"
                        )}
                      </Text>
                    </CardBody>
                    <CardFooter p={3} bg="gray.50">
                      <Stack direction="row" spacing={2}>
                        <Button
                          size="sm"
                          colorScheme="teal"
                          onClick={() => handleStudyCourse(course.id)}
                          isDisabled={energy < 5}
                        >
                          Study (+5%)
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleCompleteCourse(course.id, "A")}
                          isDisabled={courseGrades[course.id] === "A"}
                        >
                          Complete (A)
                        </Button>
                      </Stack>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </TabPanel>

          {/* Time Allocation Tab */}
          <TabPanel>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">Time Allocation</Heading>
              <Button colorScheme="blue" onClick={onOpenAllocateTime}>
                Adjust Allocation
              </Button>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box borderWidth="1px" borderRadius="md" p={4}>
                <Text fontWeight="bold" mb={2}>
                  Study
                </Text>
                <Progress
                  value={(allocatedTime.study / timeUnits) * 100}
                  colorScheme="blue"
                  size="sm"
                />
                <Text mt={1}>{allocatedTime.study} units</Text>
                <Text fontSize="sm" color="gray.600">
                  Improves academic knowledge and GPA
                </Text>
              </Box>

              <Box borderWidth="1px" borderRadius="md" p={4}>
                <Text fontWeight="bold" mb={2}>
                  Skill Development
                </Text>
                <Progress
                  value={(allocatedTime.skillDevelopment / timeUnits) * 100}
                  colorScheme="green"
                  size="sm"
                />
                <Text mt={1}>{allocatedTime.skillDevelopment} units</Text>
                <Text fontSize="sm" color="gray.600">
                  Improves technical skills
                </Text>
              </Box>

              <Box borderWidth="1px" borderRadius="md" p={4}>
                <Text fontWeight="bold" mb={2}>
                  Networking
                </Text>
                <Progress
                  value={(allocatedTime.networking / timeUnits) * 100}
                  colorScheme="purple"
                  size="sm"
                />
                <Text mt={1}>{allocatedTime.networking} units</Text>
                <Text fontSize="sm" color="gray.600">
                  Builds connections and soft skills
                </Text>
              </Box>

              <Box borderWidth="1px" borderRadius="md" p={4}>
                <Text fontWeight="bold" mb={2}>
                  Part-time Work
                </Text>
                <Progress
                  value={(allocatedTime.partTimeWork / timeUnits) * 100}
                  colorScheme="yellow"
                  size="sm"
                />
                <Text mt={1}>{allocatedTime.partTimeWork} units</Text>
                <Text fontSize="sm" color="gray.600">
                  Earns money and practical experience
                </Text>
              </Box>

              <Box borderWidth="1px" borderRadius="md" p={4}>
                <Text fontWeight="bold" mb={2}>
                  Extracurricular
                </Text>
                <Progress
                  value={(allocatedTime.extracurricular / timeUnits) * 100}
                  colorScheme="red"
                  size="sm"
                />
                <Text mt={1}>{allocatedTime.extracurricular} units</Text>
                <Text fontSize="sm" color="gray.600">
                  Builds teamwork and leadership
                </Text>
              </Box>
            </SimpleGrid>
          </TabPanel>

          {/* Skills Tab */}
          <TabPanel>
            <Heading size="md" mb={4}>
              Skills Development
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {Object.entries(skills).map(([skill, value]) => (
                <Box key={skill} borderWidth="1px" borderRadius="md" p={4}>
                  <Text fontWeight="bold" mb={2} textTransform="capitalize">
                    {skill.replace(/([A-Z])/g, " $1").trim()}
                  </Text>
                  <Progress
                    value={value}
                    max={100}
                    colorScheme="blue"
                    size="sm"
                  />
                  <Text mt={1}>{Math.round(value)}/100</Text>
                </Box>
              ))}
            </SimpleGrid>
          </TabPanel>

          {/* History Tab */}
          <TabPanel>
            <Heading size="md" mb={4}>
              Academic History
            </Heading>

            {semesterHistory.length === 0 ? (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <AlertDescription>
                  No semester history available yet. Complete your first
                  semester to see your record.
                </AlertDescription>
              </Alert>
            ) : (
              semesterHistory.map((record, index) => (
                <Box
                  key={index}
                  borderWidth="1px"
                  borderRadius="md"
                  p={4}
                  mb={4}
                >
                  <Flex justify="space-between" align="center">
                    <Heading size="sm">Semester {record.semester}</Heading>
                    <Badge
                      colorScheme={
                        getGpaColor(record.gpa) === "green.500"
                          ? "green"
                          : getGpaColor(record.gpa) === "blue.500"
                          ? "blue"
                          : getGpaColor(record.gpa) === "yellow.500"
                          ? "yellow"
                          : "red"
                      }
                    >
                      GPA: {record.gpa.toFixed(2)}
                    </Badge>
                  </Flex>

                  <Divider my={3} />

                  <Text fontWeight="bold" mb={2}>
                    Courses:
                  </Text>
                  {record.courses.map((course, i) => (
                    <Text key={i}>
                      {course.name}:{" "}
                      <Badge
                        colorScheme={
                          course.grade === "A"
                            ? "green"
                            : course.grade === "B"
                            ? "blue"
                            : course.grade === "C"
                            ? "yellow"
                            : course.grade === "Incomplete"
                            ? "gray"
                            : "red"
                        }
                      >
                        {course.grade}
                      </Badge>
                    </Text>
                  ))}
                </Box>
              ))
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Flex justify="center" mt={8}>
        <Button
          colorScheme="green"
          size="lg"
          onClick={advanceSemester}
          isDisabled={selectedCourses.length === 0}
        >
          Complete Semester & Advance
        </Button>
      </Flex>

      {/* Select Courses Modal */}
      <Modal
        isOpen={isSelectCoursesOpen}
        onClose={onCloseSelectCourses}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Courses for Semester {semester}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Select up to 4 courses for this semester. Choose wisely based on
              your interests and skills.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {availableCourses.map((course) => (
                <Box
                  key={course.id}
                  borderWidth="1px"
                  borderRadius="md"
                  p={3}
                  cursor="pointer"
                  onClick={() => toggleCourseSelection(course.id)}
                  bg={
                    selectedCourseIds.includes(course.id) ? "blue.50" : "white"
                  }
                  borderColor={
                    selectedCourseIds.includes(course.id)
                      ? "blue.500"
                      : "gray.200"
                  }
                >
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="bold">{course.name}</Text>
                    <Badge
                      colorScheme={
                        course.difficulty > 3
                          ? "red"
                          : course.difficulty > 2
                          ? "yellow"
                          : "green"
                      }
                    >
                      {Array(course.difficulty).fill("★").join("")}
                    </Badge>
                  </Flex>
                  <Text>Credits: {course.credits}</Text>
                </Box>
              ))}
            </SimpleGrid>

            <Box mt={4} p={2} borderRadius="md" bg="blue.50">
              <Text fontWeight="bold">
                Selected: {selectedCourseIds.length}/4 courses
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseSelectCourses}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={saveSelectedCourses}
              isDisabled={selectedCourseIds.length === 0}
            >
              Confirm Selection
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Allocate Time Modal */}
      <Modal
        isOpen={isAllocateTimeOpen}
        onClose={onCloseAllocateTime}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Allocate Time for Semester {semester}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              You have {timeUnits} time units to allocate across different
              activities. Choose wisely to balance academic success with skill
              development.
            </Text>

            <Box mb={6}>
              <Flex justify="space-between" align="center" mb={1}>
                <Text fontWeight="bold">
                  Remaining Time Units: {timeRemaining}
                </Text>
                <Badge colorScheme={timeRemaining >= 0 ? "green" : "red"}>
                  {timeRemaining >= 0 ? "Valid" : "Exceeds Limit"}
                </Badge>
              </Flex>
              <Progress
                value={(timeRemaining / timeUnits) * 100}
                colorScheme={timeRemaining >= 0 ? "green" : "red"}
                size="sm"
              />
            </Box>

            <Stack spacing={6}>
              <Box>
                <Text mb={2}>Study: {tempTimeAllocation.study} units</Text>
                <Slider
                  min={0}
                  max={timeUnits}
                  step={1}
                  value={tempTimeAllocation.study}
                  onChange={(val) => handleTimeAllocationChange("study", val)}
                  colorScheme="blue"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
              </Box>

              <Box>
                <Text mb={2}>
                  Skill Development: {tempTimeAllocation.skillDevelopment} units
                </Text>
                <Slider
                  min={0}
                  max={timeUnits}
                  step={1}
                  value={tempTimeAllocation.skillDevelopment}
                  onChange={(val) =>
                    handleTimeAllocationChange("skillDevelopment", val)
                  }
                  colorScheme="green"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
              </Box>

              <Box>
                <Text mb={2}>
                  Networking: {tempTimeAllocation.networking} units
                </Text>
                <Slider
                  min={0}
                  max={timeUnits}
                  step={1}
                  value={tempTimeAllocation.networking}
                  onChange={(val) =>
                    handleTimeAllocationChange("networking", val)
                  }
                  colorScheme="purple"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
              </Box>

              <Box>
                <Text mb={2}>
                  Part-time Work: {tempTimeAllocation.partTimeWork} units
                </Text>
                <Slider
                  min={0}
                  max={timeUnits}
                  step={1}
                  value={tempTimeAllocation.partTimeWork}
                  onChange={(val) =>
                    handleTimeAllocationChange("partTimeWork", val)
                  }
                  colorScheme="yellow"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
              </Box>

              <Box>
                <Text mb={2}>
                  Extracurricular: {tempTimeAllocation.extracurricular} units
                </Text>
                <Slider
                  min={0}
                  max={timeUnits}
                  step={1}
                  value={tempTimeAllocation.extracurricular}
                  onChange={(val) =>
                    handleTimeAllocationChange("extracurricular", val)
                  }
                  colorScheme="red"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseAllocateTime}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={saveTimeAllocation}
              isDisabled={timeRemaining < 0}
            >
              Confirm Allocation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Random Event Modal */}
      {activeEvent && (
        <Modal isOpen={isEventOpen} onClose={onCloseEvent} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{activeEvent.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>{activeEvent.description}</Text>

              <Stack spacing={3} mt={4}>
                {activeEvent.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleEventOption(index)}
                    colorScheme="blue"
                    variant={index === 0 ? "solid" : "outline"}
                  >
                    {option.label}
                  </Button>
                ))}
              </Stack>
            </ModalBody>
            <ModalFooter />
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}

export default EducationPage;
