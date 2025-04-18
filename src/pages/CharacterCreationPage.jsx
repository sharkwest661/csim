// pages/CharacterCreationPage.jsx
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
  FormControl,
  FormLabel,
  Input,
  Select,
  Radio,
  RadioGroup,
  Stack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
  useColorModeValue,
  Container,
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
  Progress,
  Divider,
  useToast,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { User, Brain, Network, BookOpen, CheckCircle } from "lucide-react";
import { useCharacterStore } from "../store/characterStore";
import { useGameStore } from "../store/gameStore";

const CharacterCreationPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Game state
  const advanceStage = useGameStore((state) => state.advanceStage);

  // Character state
  const name = useCharacterStore((state) => state.name);
  const gender = useCharacterStore((state) => state.gender);
  const familyBackground = useCharacterStore((state) => state.familyBackground);
  const hometown = useCharacterStore((state) => state.hometown);
  const attributes = useCharacterStore((state) => state.attributes);
  const connections = useCharacterStore((state) => state.connections);
  const skills = useCharacterStore((state) => state.skills);
  const isCreated = useCharacterStore((state) => state.isCreated);

  // Character actions
  const setName = useCharacterStore((state) => state.setName);
  const setGender = useCharacterStore((state) => state.setGender);
  const setFamilyBackground = useCharacterStore(
    (state) => state.setFamilyBackground
  );
  const setHometown = useCharacterStore((state) => state.setHometown);
  const setAttribute = useCharacterStore((state) => state.setAttribute);
  const setConnection = useCharacterStore((state) => state.setConnection);
  const setSkill = useCharacterStore((state) => state.setSkill);
  const finalizeCharacter = useCharacterStore(
    (state) => state.finalizeCharacter
  );
  const getTotalAttributePoints = useCharacterStore(
    (state) => state.getTotalAttributePoints
  );
  const getTotalSkillPoints = useCharacterStore(
    (state) => state.getTotalSkillPoints
  );

  // Local state
  const [currentTab, setCurrentTab] = useState(0);
  const [showAttributeTooltip, setShowAttributeTooltip] = useState(false);
  const [activeAttributeTooltip, setActiveAttributeTooltip] = useState("");
  const [showConnectionTooltip, setShowConnectionTooltip] = useState(false);
  const [activeConnectionTooltip, setActiveConnectionTooltip] = useState("");

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const attributeColor = useColorModeValue("blue.500", "blue.300");
  const tooltipBg = useColorModeValue("gray.700", "gray.200");
  const tooltipColor = useColorModeValue("white", "gray.800");

  // Attribute descriptions
  const attributeDescriptions = {
    intelligence:
      "Affects exam performance, programming efficiency, and problem-solving speed.",
    creativity:
      "Affects innovative thinking, unique solutions, and product design.",
    charisma:
      "Affects interview performance, networking effectiveness, and team leadership.",
    discipline:
      "Affects project completion rate, deadline management, and consistent performance.",
    adaptability:
      "Affects response to industry changes, learning new technologies, and crisis management.",
    stress_resistance:
      "Affects work-life balance, performance under pressure, and burnout prevention.",
  };

  // Connection descriptions
  const connectionDescriptions = {
    academic:
      "Easier access to research projects, better recommendations for graduate programs, higher starting reputation with professors.",
    industry:
      "Enhanced internship opportunities, earlier job interview opportunities, better starting salary offers.",
    government:
      "Priority placement in government IT positions, access to classified or specialized projects, exemptions in bureaucratic processes.",
    entrepreneurial:
      "Better access to startup funding, mentorship opportunities from established entrepreneurs, enhanced chances for business partnerships.",
  };

  // Skill categories for organization
  const skillCategories = {
    technical: [
      "programming_fundamentals",
      "web_development",
      "mobile_development",
      "database_management",
      "networking",
      "cybersecurity_basics",
    ],
    language: ["english", "russian", "turkish", "azerbaijani"],
    soft: [
      "communication",
      "time_management",
      "teamwork",
      "critical_thinking",
      "technical_writing",
    ],
    business: [
      "project_management",
      "business_fundamentals",
      "financial_literacy",
      "marketing_basics",
    ],
  };

  // Format skill name for display
  const formatSkillName = (skillKey) => {
    return skillKey
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Go to next tab
  const goToNextTab = () => {
    if (currentTab < 4) {
      setCurrentTab(currentTab + 1);
    }
  };

  // Go to previous tab
  const goToPrevTab = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };

  // Check if current tab is complete
  const isTabComplete = () => {
    switch (currentTab) {
      case 0: // Basic Info
        return name && gender && familyBackground && hometown;
      case 1: // Attributes
        const totalAttrPoints = getTotalAttributePoints();
        return totalAttrPoints <= 30 && totalAttrPoints >= 25;
      case 2: // Connections
        const totalConn = Object.values(connections).reduce(
          (sum, val) => sum + val,
          0
        );
        return totalConn <= 10;
      case 3: // Skills
        const totalSkillPoints = getTotalSkillPoints();
        return totalSkillPoints <= 20;
      default:
        return true;
    }
  };

  // Complete character creation
  const completeCharacterCreation = () => {
    finalizeCharacter();
    advanceStage("pre_university"); // Changed from "education" to "pre_university"
    navigate("/pre-university-exam");

    toast({
      title: "Character created successfully!",
      description:
        "Your IT career journey begins now. Start with the university entrance exam to determine your education path.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  // Remaining attribute points
  const remainingAttributePoints = 30 - getTotalAttributePoints();

  // Remaining connection points
  const totalConnectionPoints = Object.values(connections).reduce(
    (sum, val) => sum + val,
    0
  );
  const remainingConnectionPoints = 10 - totalConnectionPoints;

  // Remaining skill points
  const remainingSkillPoints = 20 - getTotalSkillPoints();

  return (
    <Box mb={8}>
      <Heading size="xl" mb={6}>
        Character Creation
      </Heading>
      <Text fontSize="lg" mb={8}>
        Create your character by configuring their background, attributes,
        connections, and starting skills. These choices will influence your
        career journey throughout the game.
      </Text>

      <Tabs
        variant="enclosed"
        colorScheme="blue"
        index={currentTab}
        onChange={setCurrentTab}
      >
        <TabList>
          <Tab>
            <HStack>
              <User size={18} />
              <Text ml={2}>Basic Info</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <Brain size={18} />
              <Text ml={2}>Attributes</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <Network size={18} />
              <Text ml={2}>Connections</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <BookOpen size={18} />
              <Text ml={2}>Skills</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <CheckCircle size={18} />
              <Text ml={2}>Summary</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Basic Info Tab */}
          <TabPanel>
            <Card bg={cardBg} shadow="md" mb={4}>
              <CardHeader>
                <Heading size="md">Personal Information</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={6} align="start">
                  <FormControl isRequired>
                    <FormLabel>Character Name</FormLabel>
                    <Input
                      placeholder="Enter your character's name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup value={gender || ""} onChange={setGender}>
                      <Stack direction="row" spacing={8}>
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                      </Stack>
                    </RadioGroup>
                    {gender === "male" && (
                      <Text fontSize="sm" color="gray.500" mt={2}>
                        Male characters will complete mandatory military service
                        after university.
                      </Text>
                    )}
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Family Background</FormLabel>
                    <RadioGroup
                      value={familyBackground || ""}
                      onChange={setFamilyBackground}
                    >
                      <Stack direction="column" spacing={3}>
                        <Radio value="lower">
                          <Box>
                            <Text fontWeight="medium">Lower Class</Text>
                            <Text fontSize="sm" color="gray.500">
                              Limited financial support, higher resilience,
                              scholarship opportunities
                            </Text>
                          </Box>
                        </Radio>
                        <Radio value="middle">
                          <Box>
                            <Text fontWeight="medium">Middle Class</Text>
                            <Text fontSize="sm" color="gray.500">
                              Moderate financial support, balanced starting
                              position
                            </Text>
                          </Box>
                        </Radio>
                        <Radio value="higher">
                          <Box>
                            <Text fontWeight="medium">Higher Class</Text>
                            <Text fontSize="sm" color="gray.500">
                              Substantial financial backing, better equipment,
                              existing connections
                            </Text>
                          </Box>
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Hometown</FormLabel>
                    <Select
                      value={hometown}
                      onChange={(e) => setHometown(e.target.value)}
                    >
                      <option value="Baku">Baku</option>
                      <option value="Ganja">Ganja</option>
                      <option value="Sumqayit">Sumqayit</option>
                      <option value="Mingachevir">Mingachevir</option>
                      <option value="Shirvan">Shirvan</option>
                    </Select>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            <HStack justifyContent="flex-end" mt={6}>
              <Button
                colorScheme="blue"
                rightIcon={<Text>→</Text>}
                onClick={goToNextTab}
                isDisabled={!isTabComplete()}
              >
                Next: Attributes
              </Button>
            </HStack>
          </TabPanel>

          {/* Attributes Tab */}
          <TabPanel>
            <Card bg={cardBg} shadow="md" mb={4}>
              <CardHeader>
                <HStack justifyContent="space-between">
                  <Heading size="md">Core Attributes</Heading>
                  <Badge
                    colorScheme={
                      remainingAttributePoints >= 0 ? "green" : "red"
                    }
                    fontSize="md"
                    px={2}
                    py={1}
                  >
                    Points Remaining: {remainingAttributePoints}
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Distribute 30 points across six core attributes that will
                  influence your character's performance.
                </Text>
              </CardHeader>
              <CardBody>
                <VStack spacing={8} align="stretch">
                  {Object.entries(attributes).map(([key, value]) => (
                    <FormControl key={key}>
                      <HStack mb={1} justifyContent="space-between">
                        <FormLabel mb={0} fontWeight="bold">
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).replace("_", " ")}
                        </FormLabel>
                        <Text fontWeight="bold">{value}</Text>
                      </HStack>

                      <Slider
                        aria-label={`${key} slider`}
                        min={1}
                        max={10}
                        step={1}
                        value={value}
                        onChange={(val) => setAttribute(key, val)}
                        isDisabled={
                          remainingAttributePoints <= 0 &&
                          value < attributes[key]
                        }
                        colorScheme="blue"
                        onMouseEnter={() => {
                          setShowAttributeTooltip(true);
                          setActiveAttributeTooltip(key);
                        }}
                        onMouseLeave={() => {
                          setShowAttributeTooltip(false);
                          setActiveAttributeTooltip("");
                        }}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <Tooltip
                          hasArrow
                          bg={tooltipBg}
                          color={tooltipColor}
                          placement="top"
                          label={attributeDescriptions[key]}
                          isOpen={
                            showAttributeTooltip &&
                            activeAttributeTooltip === key
                          }
                        >
                          <SliderThumb boxSize={6} />
                        </Tooltip>
                      </Slider>

                      <HStack justifyContent="space-between" mt={1}>
                        <Text fontSize="xs">Low</Text>
                        <Text fontSize="xs">High</Text>
                      </HStack>
                    </FormControl>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            <HStack justifyContent="space-between" mt={6}>
              <Button
                variant="outline"
                leftIcon={<Text>←</Text>}
                onClick={goToPrevTab}
              >
                Back: Basic Info
              </Button>
              <Button
                colorScheme="blue"
                rightIcon={<Text>→</Text>}
                onClick={goToNextTab}
                isDisabled={!isTabComplete()}
              >
                Next: Connections
              </Button>
            </HStack>
          </TabPanel>

          {/* Connections Tab */}
          <TabPanel>
            <Card bg={cardBg} shadow="md" mb={4}>
              <CardHeader>
                <HStack justifyContent="space-between">
                  <Heading size="md">Social Connections</Heading>
                  <Badge
                    colorScheme={
                      remainingConnectionPoints >= 0 ? "green" : "red"
                    }
                    fontSize="md"
                    px={2}
                    py={1}
                  >
                    Points Remaining: {remainingConnectionPoints}
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Distribute 10 connection points across different sectors that
                  will influence your career opportunities.
                </Text>
              </CardHeader>
              <CardBody>
                <VStack spacing={8} align="stretch">
                  {Object.entries(connections).map(([key, value]) => (
                    <FormControl key={key}>
                      <HStack mb={1} justifyContent="space-between">
                        <FormLabel mb={0} fontWeight="bold">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </FormLabel>
                        <Text fontWeight="bold">{value}</Text>
                      </HStack>

                      <Slider
                        aria-label={`${key} slider`}
                        min={0}
                        max={5}
                        step={1}
                        value={value}
                        onChange={(val) => setConnection(key, val)}
                        isDisabled={
                          remainingConnectionPoints <= 0 &&
                          value < connections[key]
                        }
                        colorScheme="purple"
                        onMouseEnter={() => {
                          setShowConnectionTooltip(true);
                          setActiveConnectionTooltip(key);
                        }}
                        onMouseLeave={() => {
                          setShowConnectionTooltip(false);
                          setActiveConnectionTooltip("");
                        }}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <Tooltip
                          hasArrow
                          bg={tooltipBg}
                          color={tooltipColor}
                          placement="top"
                          label={connectionDescriptions[key]}
                          isOpen={
                            showConnectionTooltip &&
                            activeConnectionTooltip === key
                          }
                        >
                          <SliderThumb boxSize={6} />
                        </Tooltip>
                      </Slider>

                      <HStack justifyContent="space-between" mt={1}>
                        <Text fontSize="xs">None</Text>
                        <Text fontSize="xs">Strong</Text>
                      </HStack>
                    </FormControl>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            <HStack justifyContent="space-between" mt={6}>
              <Button
                variant="outline"
                leftIcon={<Text>←</Text>}
                onClick={goToPrevTab}
              >
                Back: Attributes
              </Button>
              <Button
                colorScheme="blue"
                rightIcon={<Text>→</Text>}
                onClick={goToNextTab}
                isDisabled={!isTabComplete()}
              >
                Next: Skills
              </Button>
            </HStack>
          </TabPanel>

          {/* Skills Tab */}
          <TabPanel>
            <Card bg={cardBg} shadow="md" mb={4}>
              <CardHeader>
                <HStack justifyContent="space-between">
                  <Heading size="md">Starting Skills</Heading>
                  <Badge
                    colorScheme={remainingSkillPoints >= 0 ? "green" : "red"}
                    fontSize="md"
                    px={2}
                    py={1}
                  >
                    Points Remaining: {remainingSkillPoints}
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Distribute 20 skill points to define your character's starting
                  capabilities. All skills start at level 1 by default.
                </Text>
              </CardHeader>
              <CardBody>
                <Tabs
                  variant="soft-rounded"
                  colorScheme="green"
                  size="sm"
                  mb={6}
                >
                  <TabList>
                    <Tab>Technical</Tab>
                    <Tab>Languages</Tab>
                    <Tab>Soft Skills</Tab>
                    <Tab>Business</Tab>
                  </TabList>

                  <TabPanels mt={4}>
                    {/* Technical Skills */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        {skillCategories.technical.map((skillKey) => (
                          <FormControl key={skillKey}>
                            <HStack justifyContent="space-between" mb={1}>
                              <FormLabel mb={0}>
                                {formatSkillName(skillKey)}
                              </FormLabel>
                              <Text fontWeight="bold">{skills[skillKey]}</Text>
                            </HStack>
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={skills[skillKey]}
                              onChange={(val) => setSkill(skillKey, val)}
                              isDisabled={
                                remainingSkillPoints <= 0 &&
                                skills[skillKey] < 5
                              }
                              colorScheme="green"
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb />
                            </Slider>
                          </FormControl>
                        ))}
                      </VStack>
                    </TabPanel>

                    {/* Languages */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        {skillCategories.language.map((skillKey) => (
                          <FormControl key={skillKey}>
                            <HStack justifyContent="space-between" mb={1}>
                              <FormLabel mb={0}>
                                {formatSkillName(skillKey)}
                              </FormLabel>
                              <Text fontWeight="bold">{skills[skillKey]}</Text>
                            </HStack>
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={skills[skillKey]}
                              onChange={(val) => setSkill(skillKey, val)}
                              isDisabled={
                                skillKey === "azerbaijani" || // Azerbaijani is fixed at 5
                                (remainingSkillPoints <= 0 &&
                                  skills[skillKey] < 5)
                              }
                              colorScheme="green"
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb />
                            </Slider>
                            {skillKey === "azerbaijani" && (
                              <Text fontSize="xs" color="gray.500">
                                As a native, your Azerbaijani language skill is
                                fixed at maximum level.
                              </Text>
                            )}
                          </FormControl>
                        ))}
                      </VStack>
                    </TabPanel>

                    {/* Soft Skills */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        {skillCategories.soft.map((skillKey) => (
                          <FormControl key={skillKey}>
                            <HStack justifyContent="space-between" mb={1}>
                              <FormLabel mb={0}>
                                {formatSkillName(skillKey)}
                              </FormLabel>
                              <Text fontWeight="bold">{skills[skillKey]}</Text>
                            </HStack>
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={skills[skillKey]}
                              onChange={(val) => setSkill(skillKey, val)}
                              isDisabled={
                                remainingSkillPoints <= 0 &&
                                skills[skillKey] < 5
                              }
                              colorScheme="green"
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb />
                            </Slider>
                          </FormControl>
                        ))}
                      </VStack>
                    </TabPanel>

                    {/* Business Skills */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        {skillCategories.business.map((skillKey) => (
                          <FormControl key={skillKey}>
                            <HStack justifyContent="space-between" mb={1}>
                              <FormLabel mb={0}>
                                {formatSkillName(skillKey)}
                              </FormLabel>
                              <Text fontWeight="bold">{skills[skillKey]}</Text>
                            </HStack>
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={skills[skillKey]}
                              onChange={(val) => setSkill(skillKey, val)}
                              isDisabled={
                                remainingSkillPoints <= 0 &&
                                skills[skillKey] < 5
                              }
                              colorScheme="green"
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb />
                            </Slider>
                          </FormControl>
                        ))}
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>

            <HStack justifyContent="space-between" mt={6}>
              <Button
                variant="outline"
                leftIcon={<Text>←</Text>}
                onClick={goToPrevTab}
              >
                Back: Connections
              </Button>
              <Button
                colorScheme="blue"
                rightIcon={<Text>→</Text>}
                onClick={goToNextTab}
                isDisabled={!isTabComplete()}
              >
                Next: Summary
              </Button>
            </HStack>
          </TabPanel>

          {/* Summary Tab */}
          <TabPanel>
            <Card bg={cardBg} shadow="md" mb={4}>
              <CardHeader>
                <Heading size="md">Character Summary</Heading>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Review your character before finalizing your choices.
                </Text>
              </CardHeader>
              <CardBody>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={6}
                >
                  {/* Basic Info */}
                  <GridItem>
                    <VStack align="start" spacing={3}>
                      <Heading size="sm">Personal Information</Heading>
                      <HStack>
                        <Text fontWeight="bold" width="120px">
                          Name:
                        </Text>
                        <Text>{name}</Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight="bold" width="120px">
                          Gender:
                        </Text>
                        <Text>{gender}</Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight="bold" width="120px">
                          Background:
                        </Text>
                        <Text>{familyBackground} class</Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight="bold" width="120px">
                          Hometown:
                        </Text>
                        <Text>{hometown}</Text>
                      </HStack>
                    </VStack>
                  </GridItem>

                  {/* Attributes */}
                  <GridItem>
                    <VStack align="start" spacing={3}>
                      <Heading size="sm">Core Attributes</Heading>
                      {Object.entries(attributes).map(([key, value]) => (
                        <HStack key={key} width="100%">
                          <Text fontWeight="bold" width="120px">
                            {key.charAt(0).toUpperCase() +
                              key.slice(1).replace("_", " ")}
                            :
                          </Text>
                          <Progress
                            value={value * 10}
                            min={0}
                            max={100}
                            colorScheme="blue"
                            size="sm"
                            width="100%"
                          />
                          <Text ml={2} fontWeight="bold">
                            {value}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </GridItem>

                  {/* Connections */}
                  <GridItem>
                    <VStack align="start" spacing={3}>
                      <Heading size="sm">Social Connections</Heading>
                      {Object.entries(connections).map(([key, value]) => (
                        <HStack key={key} width="100%">
                          <Text fontWeight="bold" width="120px">
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                          </Text>
                          <Progress
                            value={value * 20}
                            min={0}
                            max={100}
                            colorScheme="purple"
                            size="sm"
                            width="100%"
                          />
                          <Text ml={2} fontWeight="bold">
                            {value}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </GridItem>

                  {/* Top Skills */}
                  <GridItem>
                    <VStack align="start" spacing={3}>
                      <Heading size="sm">Notable Skills</Heading>
                      {Object.entries(skills)
                        .filter(
                          ([key, value]) => value >= 3 && key !== "azerbaijani"
                        )
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([key, value]) => (
                          <HStack key={key} width="100%">
                            <Text fontWeight="bold" width="160px">
                              {formatSkillName(key)}:
                            </Text>
                            <Progress
                              value={value * 20}
                              min={0}
                              max={100}
                              colorScheme="green"
                              size="sm"
                              width="100%"
                            />
                            <Text ml={2} fontWeight="bold">
                              {value}
                            </Text>
                          </HStack>
                        ))}
                    </VStack>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>

            <HStack justifyContent="space-between" mt={6}>
              <Button
                variant="outline"
                leftIcon={<Text>←</Text>}
                onClick={goToPrevTab}
              >
                Back: Skills
              </Button>
              <Button
                colorScheme="green"
                rightIcon={<CheckCircle size={18} />}
                onClick={completeCharacterCreation}
                isDisabled={!isTabComplete()}
              >
                Complete Character Creation
              </Button>
            </HStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Progress Indicator */}
      <Box position="relative" mt={8}>
        <Progress
          value={(currentTab + 1) * 20}
          size="sm"
          colorScheme="blue"
          borderRadius="full"
        />
        <HStack justify="space-between" mt={2}>
          <Text fontSize="sm">Basic Info</Text>
          <Text fontSize="sm">Attributes</Text>
          <Text fontSize="sm">Connections</Text>
          <Text fontSize="sm">Skills</Text>
          <Text fontSize="sm">Complete</Text>
        </HStack>
      </Box>
    </Box>
  );
};

export default CharacterCreationPage;
