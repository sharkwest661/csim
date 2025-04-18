// pages/ResumePage.jsx
import React, { useState, useEffect, useRef } from "react";
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
  Grid,
  GridItem,
  Flex,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  List,
  ListItem,
  ListIcon,
  Select,
  Wrap,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import {
  FileText,
  Award,
  BookOpen,
  Briefcase,
  Code,
  Globe,
  Download,
  ChevronRight,
  CheckCircle,
  Star,
  RefreshCcw,
  Calendar,
} from "lucide-react";
import { useResumeStore } from "../store/resumeStore";
import { useCharacterStore } from "../store/characterStore";
import { useEducationStore } from "../store/educationStore";
import { useCareerStore } from "../store/careerStore";
import { useGameStore } from "../store/gameStore";

const ResumePage = () => {
  const toast = useToast();
  const initialRenderRef = useRef(true);

  // Local state
  const [activeView, setActiveView] = useState("basic"); // 'basic', 'detailed', 'analysis'

  // Resume state - use selective state picking
  const personalInfo = useResumeStore((state) => state.personalInfo);
  const objective = useResumeStore((state) => state.objective);
  const education = useResumeStore((state) => state.education);
  const skills = useResumeStore((state) => state.skills);
  const workExperience = useResumeStore((state) => state.workExperience);
  const projects = useResumeStore((state) => state.projects);
  const additional = useResumeStore((state) => state.additional);
  const sectionStrengths = useResumeStore((state) => state.sectionStrengths);
  const qualityScore = useResumeStore((state) => state.qualityScore);
  const qualityLevel = useResumeStore((state) => state.qualityLevel);
  const activeTemplate = useResumeStore((state) => state.activeTemplate);
  const unlockedTemplates = useResumeStore((state) => state.unlockedTemplates);
  const lastUpdated = useResumeStore((state) => state.lastUpdated);

  // Resume actions
  const syncFromCharacter = useResumeStore((state) => state.syncFromCharacter);
  const syncFromEducation = useResumeStore((state) => state.syncFromEducation);
  const syncFromCareer = useResumeStore((state) => state.syncFromCareer);
  const calculateResumeQuality = useResumeStore(
    (state) => state.calculateResumeQuality
  );
  const setTemplate = useResumeStore((state) => state.setTemplate);

  // Character state - use selective state picking
  const characterName = useCharacterStore((state) => state.name);
  const characterGender = useCharacterStore((state) => state.gender);
  const characterAttributes = useCharacterStore((state) => state.attributes);
  const characterSkills = useCharacterStore((state) => state.skills);

  // Education state - use selective state picking
  const university = useEducationStore((state) => state.university);
  const degreeProgram = useEducationStore((state) => state.degreeProgram);
  const specialization = useEducationStore((state) => state.specialization);
  const educationGpa = useEducationStore((state) => state.gpa);
  const isGraduated = useEducationStore((state) => state.isGraduated);

  // Career state - use selective state picking
  const workExperiences = useCareerStore((state) => state.workExperiences);
  const currentJob = useCareerStore((state) => state.currentJob);
  const internships = useCareerStore((state) => state.internships);
  const militaryService = useCareerStore((state) => state.militaryService);

  // Game state
  const syncResume = useGameStore((state) => state.syncResume);

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const resumeBg = useColorModeValue("gray.50", "gray.800");
  const accentColor = useColorModeValue("blue.600", "blue.300");
  const sectionBg = useColorModeValue("gray.100", "gray.700");

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
    }).format(date);
  };

  // Sync resume data from all sources - only on initial render
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      refreshResume();
    }
  }, []);

  // Assemble character data
  const getCharacterData = () => ({
    name: characterName,
    gender: characterGender,
    attributes: characterAttributes,
    skills: characterSkills,
  });

  // Assemble education data
  const getEducationData = () => ({
    university,
    degreeProgram,
    specialization,
    gpa: educationGpa,
    isGraduated,
  });

  // Assemble career data
  const getCareerData = () => ({
    workExperiences,
    currentJob,
    internships,
    militaryService,
  });

  // Sync resume data from all sources
  const refreshResume = () => {
    // Get fresh data from stores
    const characterData = getCharacterData();
    const educationData = getEducationData();
    const careerData = getCareerData();

    // Sync with character store
    syncFromCharacter(characterData);

    // Sync with education store if applicable
    if (educationData.university) {
      syncFromEducation(educationData);
    }

    // Sync with career store if applicable
    if (
      careerData.workExperiences.length > 0 ||
      careerData.currentJob ||
      careerData.internships.length > 0
    ) {
      syncFromCareer(careerData);
    }

    // Calculate overall quality
    calculateResumeQuality();

    toast({
      title: "Resume Updated",
      description: "Your resume has been synced with your latest achievements.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Get quality level color
  const getQualityLevelColor = (level) => {
    switch (level) {
      case "entry":
        return "blue";
      case "professional":
        return "green";
      case "distinguished":
        return "purple";
      case "executive":
        return "orange";
      default:
        return "gray";
    }
  };

  // Get section strength color
  const getSectionStrengthColor = (strength) => {
    if (strength >= 8) return "green";
    if (strength >= 5) return "blue";
    if (strength >= 3) return "orange";
    return "red";
  };

  return (
    <Box mb={8}>
      <HStack justifyContent="space-between" mb={6}>
        <Heading size="xl">Resume</Heading>

        <HStack>
          <Button
            leftIcon={<RefreshCcw size={18} />}
            colorScheme="blue"
            variant="outline"
            onClick={refreshResume}
          >
            Update Resume
          </Button>

          <Button
            leftIcon={<Download size={18} />}
            colorScheme="green"
            variant="solid"
            onClick={() =>
              toast({
                title: "Resume Downloaded",
                description: "Your resume has been saved to your device.",
                status: "success",
                duration: 3000,
                isClosable: true,
              })
            }
          >
            Export PDF
          </Button>
        </HStack>
      </HStack>

      {/* Resume Quality Card */}
      <Card bg={cardBg} shadow="md" mb={6}>
        <CardHeader>
          <HStack justifyContent="space-between">
            <Heading size="md">Resume Quality</Heading>
            <Badge
              colorScheme={getQualityLevelColor(qualityLevel)}
              fontSize="md"
              px={2}
              py={1}
            >
              {qualityLevel.charAt(0).toUpperCase() + qualityLevel.slice(1)}{" "}
              Level
            </Badge>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Box>
              <HStack justify="space-between" mb={1}>
                <Text fontWeight="bold">Overall Quality</Text>
                <Text fontWeight="bold">{qualityScore.toFixed(1)}/10</Text>
              </HStack>
              <Progress
                value={qualityScore * 10}
                colorScheme={getQualityLevelColor(qualityLevel)}
                height="10px"
                borderRadius="full"
              />
            </Box>

            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(5, 1fr)",
              }}
              gap={4}
            >
              {Object.entries(sectionStrengths).map(([section, strength]) => (
                <GridItem key={section}>
                  <VStack align="start" spacing={1}>
                    <HStack justify="space-between" width="100%">
                      <Text fontSize="sm" fontWeight="bold">
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </Text>
                      <Text fontSize="sm" fontWeight="bold">
                        {strength}/10
                      </Text>
                    </HStack>
                    <Progress
                      value={strength * 10}
                      colorScheme={getSectionStrengthColor(strength)}
                      height="6px"
                      width="100%"
                      borderRadius="full"
                    />
                  </VStack>
                </GridItem>
              ))}
            </Grid>

            <Divider />

            <HStack wrap="wrap">
              <Text fontWeight="bold" mr={2}>
                Template:
              </Text>
              <Select
                value={activeTemplate}
                onChange={(e) => setTemplate(e.target.value)}
                width="auto"
                size="sm"
              >
                {unlockedTemplates.map((template) => (
                  <option key={template} value={template}>
                    {template.charAt(0).toUpperCase() + template.slice(1)}{" "}
                    Template
                  </option>
                ))}
              </Select>

              <Text fontSize="sm" color="gray.500" ml={4}>
                {unlockedTemplates.length < 4 &&
                  `${
                    4 - unlockedTemplates.length
                  } more templates unlock with higher quality`}
              </Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Resume View Tabs */}
      <Tabs
        colorScheme="blue"
        mb={6}
        onChange={(index) =>
          setActiveView(["basic", "detailed", "analysis"][index])
        }
      >
        <TabList>
          <Tab>Basic View</Tab>
          <Tab>Detailed View</Tab>
          <Tab>Analysis View</Tab>
        </TabList>
      </Tabs>

      {/* Resume Document */}
      {activeView === "basic" && (
        <Card bg={resumeBg} shadow="md" p={6} borderWidth="1px">
          {/* Header */}
          <VStack spacing={2} align="center" mb={6}>
            <Heading size="xl">{personalInfo.name || characterName}</Heading>

            <HStack
              spacing={6}
              fontSize="sm"
              color="gray.600"
              wrap="wrap"
              justify="center"
            >
              {personalInfo.email && <Text>{personalInfo.email}</Text>}

              {personalInfo.phone && <Text>{personalInfo.phone}</Text>}

              {personalInfo.linkedIn && <Text>{personalInfo.linkedIn}</Text>}

              {personalInfo.github && <Text>{personalInfo.github}</Text>}
            </HStack>
          </VStack>

          {/* Objective */}
          {objective && (
            <Box mb={6}>
              <Heading size="md" color={accentColor} mb={2}>
                Career Objective
              </Heading>
              <Divider mb={2} />
              <Text>{objective}</Text>
            </Box>
          )}

          {/* Education */}
          <Box mb={6}>
            <Heading size="md" color={accentColor} mb={2}>
              Education
            </Heading>
            <Divider mb={3} />

            {education.university.institution ? (
              <VStack align="start" spacing={1} mb={4}>
                <HStack justify="space-between" width="100%">
                  <Heading size="sm">
                    {education.university.institution}
                  </Heading>
                  <Text fontSize="sm">
                    {formatDate(education.university.graduationDate)}
                  </Text>
                </HStack>
                <Text>
                  {education.university.degree} in{" "}
                  {education.university.specialization}
                </Text>
                <Text fontSize="sm">
                  GPA: {education.university.gpa.toFixed(2)}
                </Text>

                {education.university.deansList && (
                  <HStack>
                    <Icon as={Award} color="yellow.500" boxSize={4} />
                    <Text fontSize="sm">Dean's List</Text>
                  </HStack>
                )}

                {education.university.thesis && (
                  <Text fontSize="sm">
                    <Text as="span" fontWeight="bold">
                      Thesis:
                    </Text>{" "}
                    {education.university.thesis.title}
                  </Text>
                )}
              </VStack>
            ) : (
              <Text fontStyle="italic">No education details available</Text>
            )}

            {/* Certifications */}
            {education.additionalEducation.certifications.length > 0 && (
              <Box mt={4}>
                <Heading size="sm" mb={2}>
                  Certifications
                </Heading>
                <List spacing={1}>
                  {education.additionalEducation.certifications.map(
                    (cert, index) => (
                      <ListItem key={index} fontSize="sm">
                        <ListIcon as={CheckCircle} color="green.500" />
                        {cert.name} ({formatDate(cert.date)})
                      </ListItem>
                    )
                  )}
                </List>
              </Box>
            )}
          </Box>

          {/* Skills */}
          <Box mb={6}>
            <Heading size="md" color={accentColor} mb={2}>
              Skills
            </Heading>
            <Divider mb={3} />

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={6}
            >
              {/* Technical Skills */}
              <GridItem>
                <Heading size="sm" mb={2}>
                  Technical Skills
                </Heading>
                {Object.keys(skills.technical).length > 0 ? (
                  <Wrap spacing={2}>
                    {Object.entries(skills.technical).map(([skill, level]) => (
                      <WrapItem key={skill}>
                        <Badge colorScheme="blue" p={1}>
                          {skill}: {level}
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                ) : (
                  <Text fontStyle="italic">No technical skills listed</Text>
                )}
              </GridItem>

              {/* Languages */}
              <GridItem>
                <Heading size="sm" mb={2}>
                  Languages
                </Heading>
                {Object.keys(skills.languages).length > 0 ? (
                  <Wrap spacing={2}>
                    {Object.entries(skills.languages).map(
                      ([language, level]) => (
                        <WrapItem key={language}>
                          <Badge colorScheme="purple" p={1}>
                            {language.charAt(0).toUpperCase() +
                              language.slice(1)}
                            : {level}
                          </Badge>
                        </WrapItem>
                      )
                    )}
                  </Wrap>
                ) : (
                  <Text fontStyle="italic">No languages listed</Text>
                )}
              </GridItem>
            </Grid>

            {/* Soft Skills */}
            {skills.softSkills.length > 0 && (
              <Box mt={4}>
                <Heading size="sm" mb={2}>
                  Soft Skills
                </Heading>
                <Wrap spacing={2}>
                  {skills.softSkills.map((skill, index) => (
                    <WrapItem key={index}>
                      <Badge colorScheme="green" p={1}>
                        {skill.charAt(0).toUpperCase() + skill.slice(1)}
                      </Badge>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            )}
          </Box>

          {/* Work Experience */}
          <Box mb={6}>
            <Heading size="md" color={accentColor} mb={2}>
              Work Experience
            </Heading>
            <Divider mb={3} />

            {workExperience.professionalHistory.length > 0 ? (
              <VStack align="start" spacing={4} mb={4}>
                {workExperience.professionalHistory.map((job, index) => (
                  <Box key={index} width="100%">
                    <HStack justify="space-between" width="100%">
                      <Heading size="sm">{job.position}</Heading>
                      <Text fontSize="sm">
                        {formatDate(job.startDate)} - {formatDate(job.endDate)}
                      </Text>
                    </HStack>
                    <Text>{job.company}</Text>

                    {job.responsibilities &&
                      job.responsibilities.length > 0 && (
                        <List spacing={1} mt={2}>
                          {job.responsibilities.slice(0, 3).map((resp, idx) => (
                            <ListItem key={idx} fontSize="sm">
                              <ListIcon as={ChevronRight} color="blue.500" />
                              {resp}
                            </ListItem>
                          ))}
                        </List>
                      )}
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text fontStyle="italic">No work experience listed</Text>
            )}

            {/* Internships */}
            {workExperience.internships.length > 0 && (
              <Box mt={4}>
                <Heading size="sm" mb={2}>
                  Internships
                </Heading>
                <VStack align="start" spacing={2}>
                  {workExperience.internships.map((internship, index) => (
                    <Box key={index} width="100%">
                      <HStack justify="space-between" width="100%">
                        <Text fontWeight="bold">
                          {internship.position} at {internship.company}
                        </Text>
                        <Text fontSize="sm">
                          {formatDate(internship.startDate)} -{" "}
                          {formatDate(internship.endDate)}
                        </Text>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Military Service */}
            {workExperience.militaryService &&
              workExperience.militaryService.completed && (
                <Box mt={4} p={3} bg={sectionBg} borderRadius="md">
                  <HStack mb={1}>
                    <Icon as={Award} color="green.500" boxSize={5} />
                    <Heading size="sm">Military Service</Heading>
                  </HStack>
                  <Text fontSize="sm">
                    {workExperience.militaryService.branch},{" "}
                    {workExperience.militaryService.rank}
                  </Text>
                  <Text fontSize="sm">
                    {formatDate(workExperience.militaryService.startDate)} -{" "}
                    {formatDate(workExperience.militaryService.endDate)}
                  </Text>

                  {workExperience.militaryService.technicalRole && (
                    <Text fontSize="sm" mt={1}>
                      <Text as="span" fontWeight="bold">
                        Technical Role:
                      </Text>{" "}
                      {workExperience.militaryService.technicalRole}
                    </Text>
                  )}
                </Box>
              )}
          </Box>

          {/* Projects */}
          {(projects.personal.length > 0 ||
            projects.team.length > 0 ||
            projects.hackathons.length > 0) && (
            <Box mb={6}>
              <Heading size="md" color={accentColor} mb={2}>
                Projects
              </Heading>
              <Divider mb={3} />

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={4}
              >
                {projects.personal.slice(0, 2).map((project, index) => (
                  <GridItem key={index}>
                    <Card variant="outline" size="sm">
                      <CardBody>
                        <Heading size="sm" mb={1}>
                          {project.name}
                        </Heading>
                        <Text fontSize="sm" noOfLines={2}>
                          {project.description}
                        </Text>
                        {project.technologies && (
                          <Wrap mt={2} spacing={1}>
                            {project.technologies.map((tech, idx) => (
                              <WrapItem key={idx}>
                                <Badge colorScheme="gray" fontSize="xs">
                                  {tech}
                                </Badge>
                              </WrapItem>
                            ))}
                          </Wrap>
                        )}
                      </CardBody>
                    </Card>
                  </GridItem>
                ))}
              </Grid>
            </Box>
          )}

          {/* Last Updated */}
          <Text fontSize="xs" textAlign="right" mt={8} color="gray.500">
            Last Updated: {lastUpdated ? formatDate(lastUpdated) : "Never"}
          </Text>
        </Card>
      )}

      {/* Detailed View */}
      {activeView === "detailed" && (
        <Card bg={resumeBg} shadow="md" p={6} borderWidth="1px">
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Detailed resume view will show an interactive, expandable version of
            all resume sections.
          </Text>

          <Text>This view would include:</Text>

          <List spacing={2} mt={4}>
            <ListItem>
              <ListIcon as={ChevronRight} color="blue.500" />
              Expandable sections for each resume category
            </ListItem>
            <ListItem>
              <ListIcon as={ChevronRight} color="blue.500" />
              Full details of all work experiences, projects, and achievements
            </ListItem>
            <ListItem>
              <ListIcon as={ChevronRight} color="blue.500" />
              Interactive elements to highlight key resume components
            </ListItem>
            <ListItem>
              <ListIcon as={ChevronRight} color="blue.500" />
              Customization options for the resume layout
            </ListItem>
          </List>
        </Card>
      )}

      {/* Analysis View */}
      {activeView === "analysis" && (
        <Card bg={resumeBg} shadow="md" p={6} borderWidth="1px">
          <VStack spacing={6} align="stretch">
            <Heading size="md">Resume Strength Analysis</Heading>

            <Box>
              <Text fontWeight="bold" mb={3}>
                Section Breakdown
              </Text>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={6}
              >
                {Object.entries(sectionStrengths).map(([section, strength]) => (
                  <GridItem key={section}>
                    <Card variant="outline" size="sm">
                      <CardBody>
                        <HStack justifyContent="space-between" mb={2}>
                          <Heading size="sm">
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                          </Heading>
                          <Badge
                            colorScheme={getSectionStrengthColor(strength)}
                            fontSize="md"
                          >
                            {strength}/10
                          </Badge>
                        </HStack>
                        <Progress
                          value={strength * 10}
                          colorScheme={getSectionStrengthColor(strength)}
                          height="8px"
                          borderRadius="full"
                          mb={3}
                        />

                        <Text fontSize="sm">
                          {strength >= 8
                            ? "Exceptional. This section is a major strength of your resume."
                            : strength >= 6
                            ? "Strong. This section effectively showcases your qualifications."
                            : strength >= 4
                            ? "Average. This section meets basic expectations but could be improved."
                            : "Needs work. Focus on developing this section to improve overall resume quality."}
                        </Text>
                      </CardBody>
                    </Card>
                  </GridItem>
                ))}
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Text fontWeight="bold" mb={3}>
                Improvement Suggestions
              </Text>
              <VStack align="stretch" spacing={3}>
                {sectionStrengths.education < 5 && (
                  <Card
                    variant="outline"
                    borderLeftWidth="4px"
                    borderLeftColor="blue.400"
                  >
                    <CardBody>
                      <HStack mb={2}>
                        <Icon as={BookOpen} color="blue.500" boxSize={5} />
                        <Heading size="sm">
                          Strengthen Education Section
                        </Heading>
                      </HStack>
                      <Text fontSize="sm">
                        Improve your education section by earning
                        certifications, participating in academic competitions,
                        or improving your GPA.
                      </Text>
                    </CardBody>
                  </Card>
                )}

                {sectionStrengths.skills < 5 && (
                  <Card
                    variant="outline"
                    borderLeftWidth="4px"
                    borderLeftColor="green.400"
                  >
                    <CardBody>
                      <HStack mb={2}>
                        <Icon as={Code} color="green.500" boxSize={5} />
                        <Heading size="sm">Develop Your Skills</Heading>
                      </HStack>
                      <Text fontSize="sm">
                        Focus on developing more technical skills or improving
                        your proficiency in existing skills. Consider learning
                        new programming languages or frameworks.
                      </Text>
                    </CardBody>
                  </Card>
                )}

                {sectionStrengths.workExperience < 5 && (
                  <Card
                    variant="outline"
                    borderLeftWidth="4px"
                    borderLeftColor="purple.400"
                  >
                    <CardBody>
                      <HStack mb={2}>
                        <Icon as={Briefcase} color="purple.500" boxSize={5} />
                        <Heading size="sm">Gain More Work Experience</Heading>
                      </HStack>
                      <Text fontSize="sm">
                        Seek internships, part-time positions, or volunteer
                        opportunities to build your professional experience.
                        Focus on roles that develop relevant skills for your
                        career path.
                      </Text>
                    </CardBody>
                  </Card>
                )}

                {sectionStrengths.projects < 5 && (
                  <Card
                    variant="outline"
                    borderLeftWidth="4px"
                    borderLeftColor="orange.400"
                  >
                    <CardBody>
                      <HStack mb={2}>
                        <Icon as={Code} color="orange.500" boxSize={5} />
                        <Heading size="sm">Build More Projects</Heading>
                      </HStack>
                      <Text fontSize="sm">
                        Create personal projects that showcase your skills and
                        creativity. Participate in hackathons or join team
                        projects to demonstrate your collaboration abilities.
                      </Text>
                    </CardBody>
                  </Card>
                )}

                {sectionStrengths.additional < 5 && (
                  <Card
                    variant="outline"
                    borderLeftWidth="4px"
                    borderLeftColor="red.400"
                  >
                    <CardBody>
                      <HStack mb={2}>
                        <Icon as={Star} color="red.500" boxSize={5} />
                        <Heading size="sm">Expand Additional Sections</Heading>
                      </HStack>
                      <Text fontSize="sm">
                        Participate in volunteering, publish technical articles,
                        or join professional organizations to add depth to your
                        resume and stand out from other candidates.
                      </Text>
                    </CardBody>
                  </Card>
                )}

                {Object.values(sectionStrengths).every(
                  (strength) => strength >= 5
                ) && (
                  <Card
                    variant="outline"
                    borderLeftWidth="4px"
                    borderLeftColor="green.400"
                  >
                    <CardBody>
                      <HStack mb={2}>
                        <Icon as={CheckCircle} color="green.500" boxSize={5} />
                        <Heading size="sm">Well-Balanced Resume</Heading>
                      </HStack>
                      <Text fontSize="sm">
                        Your resume has good strength across all sections.
                        Continue developing in all areas to move toward an
                        executive-level resume.
                      </Text>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            </Box>

            <Divider />

            <Box>
              <Text fontWeight="bold" mb={3}>
                Career Level Compatibility
              </Text>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={6}
              >
                <GridItem>
                  <Card variant="outline">
                    <CardBody>
                      <HStack justifyContent="space-between" mb={2}>
                        <Heading size="sm">Entry Level Positions</Heading>
                        <Badge colorScheme="green">Compatible</Badge>
                      </HStack>
                      <Text fontSize="sm">
                        Your resume is well-suited for entry-level positions in
                        the IT industry.
                      </Text>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card variant="outline">
                    <CardBody>
                      <HStack justifyContent="space-between" mb={2}>
                        <Heading size="sm">Middle Level Positions</Heading>
                        <Badge
                          colorScheme={
                            qualityLevel === "entry" ? "red" : "green"
                          }
                        >
                          {qualityLevel === "entry"
                            ? "Not Compatible"
                            : "Compatible"}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm">
                        {qualityLevel === "entry"
                          ? "Your resume needs improvement to qualify for mid-level positions."
                          : "Your resume meets requirements for mid-level positions."}
                      </Text>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card variant="outline">
                    <CardBody>
                      <HStack justifyContent="space-between" mb={2}>
                        <Heading size="sm">Senior Level Positions</Heading>
                        <Badge
                          colorScheme={
                            qualityLevel === "distinguished" ||
                            qualityLevel === "executive"
                              ? "green"
                              : "red"
                          }
                        >
                          {qualityLevel === "distinguished" ||
                          qualityLevel === "executive"
                            ? "Compatible"
                            : "Not Compatible"}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm">
                        {qualityLevel === "distinguished" ||
                        qualityLevel === "executive"
                          ? "Your resume qualifies you for senior-level positions."
                          : "Your resume needs significant improvement for senior roles."}
                      </Text>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card variant="outline">
                    <CardBody>
                      <HStack justifyContent="space-between" mb={2}>
                        <Heading size="sm">Executive Positions</Heading>
                        <Badge
                          colorScheme={
                            qualityLevel === "executive" ? "green" : "red"
                          }
                        >
                          {qualityLevel === "executive"
                            ? "Compatible"
                            : "Not Compatible"}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm">
                        {qualityLevel === "executive"
                          ? "Your resume demonstrates leadership and expertise suitable for executive roles."
                          : "Executive positions require a higher level of achievement and experience."}
                      </Text>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </Box>
          </VStack>
        </Card>
      )}
    </Box>
  );
};

export default ResumePage;
