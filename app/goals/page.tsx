// app/goals/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Heading, Stack, Text, Alert, AlertIcon, Spinner, Badge, Center, Wrap, WrapItem } from '@chakra-ui/react';
import { Goal } from '@/types/goal';
import { getGoals, createGoal, deleteGoal, updateGoal } from '@/lib/api';
import { analyzeSentiment, predictGoalSuccess, extractKeywords } from '@/lib/api-ai';
import GoalForm from './GoalForm';

interface GoalWithInsights extends Goal {
  sentiment?: string;
  successScore?: number;
  keywords?: string[];
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalWithInsights[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const refreshGoals = async () => {
    const data = await getGoals();
    setGoals(data);
    await enrichGoalsWithInsights(data);
  };

  const enrichGoalsWithInsights = async (goals: Goal[]) => {
    setLoadingInsights(true);
    try {
      const enriched = await Promise.all(
        goals.map(async (goal) => {
          const [sentiment, successScore, keywords] = await Promise.all([
            analyzeSentiment(goal.description || goal.title),
            predictGoalSuccess(goal.title, goal.description || ''),
            extractKeywords(goal.description || goal.title, 3),
          ]);
          return { ...goal, sentiment, successScore, keywords };
        })
      );
      setGoals(enriched);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    refreshGoals();
  }, []);

  const handleAddGoal = async (title: string, description: string) => {
    await createGoal({ title, description });
    refreshGoals();
  };

  const handleDeleteGoal = async (id: string) => {
    await deleteGoal(id);
    refreshGoals();
  };

  const handleUpdateGoal = async (id: string) => {
    await updateGoal(id, 'Completed');
    refreshGoals();
  };

  // Helper to get gradient color for badges based on type and value
  const getBadgeGradient = (type: 'sentiment' | 'tags' | 'success', value?: string | number) => {
    if (type === 'sentiment') {
      if (value === 'POSITIVE') return 'linear(to-r, green.400, teal.500)';
      if (value === 'NEGATIVE') return 'linear(to-r, red.400, pink.500)';
      return 'linear(to-r, gray.400, gray.500)';
    }
    if (type === 'success') {
      if (typeof value === 'number') {
        if (value >= 75) return 'linear(to-r, blue.400, cyan.500)';
        if (value >= 40) return 'linear(to-r, yellow.400, orange.500)';
        return 'linear(to-r, red.400, pink.500)';
      }
      return 'linear(to-r, blue.400, cyan.500)';
    }
    if (type === 'tags') {
      return 'linear(to-r, purple.400, pink.500)';
    }
    return undefined;
  };

  return (
    <Box minH="100vh" bg="gray.50" overflowX="hidden" px={{ base: 2, md: 4 }} py={{ base: 6, md: 10 }}>
      <Box maxW={{ base: '100%', md: '6xl', xl: '7xl' }} mx="auto">
        {/* Header Section */}
        <Box textAlign="center" mb={{ base: 6, md: 10 }} px={{ base: 2, md: 0 }}>
          <Heading
            as="h1"
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
            fontWeight="extrabold"
            color="blue.700"
            lineHeight="shorter"
            mb={3}
            letterSpacing="tight"
          >
            Your Vision Board
          </Heading>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            color="gray.600"
            maxW="3xl"
            mx="auto"
            fontWeight="medium"
            letterSpacing="wide"
            opacity={0.8}
          >
            Define your dreams. Track your progress. Celebrate your wins.
          </Text>
        </Box>

        {/* Info Alert */}
        <Alert
          status="info"
          mb={{ base: 6, md: 8 }}
          borderRadius="lg"
          bg="blue.50"
          px={{ base: 3, md: 6 }}
          py={{ base: 3, md: 4 }}
          boxShadow="sm"
          fontWeight="semibold"
          letterSpacing="wide"
        >
          <AlertIcon />
          Progress is built one small goal at a time. Keep moving forward!
        </Alert>

        {/* New Goal Section with subtle background */}
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          py={{ base: 6, md: 8 }}
          px={{ base: 4, md: 8 }}
          mb={{ base: 8, md: 12 }}
          maxW={{ base: '100%', md: '4xl' }}
          mx="auto"
          textAlign="center"
        >
          <Heading
            as="h2"
            fontSize={{ base: '2xl', md: '3xl' }}
            mb={4}
            fontWeight="bold"
            color="blue.600"
            letterSpacing="wide"
          >
            Set a New Goal
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600" mb={6} maxW="xl" mx="auto" opacity={0.85}>
            Start shaping your future by defining a clear and inspiring goal right now.
          </Text>
          <GoalForm onAddGoal={handleAddGoal} />
        </Box>

        {/* Goals Overview Section */}
        <Box>
          <Heading
            as="h2"
            fontSize={{ base: '2xl', md: '3xl' }}
            mb={{ base: 5, md: 8 }}
            fontWeight="extrabold"
            color="gray.700"
            textAlign="center"
            letterSpacing="tight"
          >
            Your Goals Overview
          </Heading>

          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="lg"
            w="full"
            py={{ base: 6, md: 8 }}
            px={{ base: 4, md: 8 }}
            maxW={{ base: '100%', md: '6xl', xl: '7xl' }}
            mx="auto"
          >
            <Stack spacing={{ base: 5, md: 7 }} align="stretch">
              {goals.length === 0 ? (
                <Center py={16} flexDirection="column" px={4}>
                  <Text
                    fontSize={{ base: 'lg', md: 'xl' }}
                    color="gray.600"
                    fontWeight="semibold"
                    textAlign="center"
                    maxW="lg"
                    mb={4}
                    letterSpacing="wider"
                    lineHeight="short"
                  >
                    Your vision board is empty — let's create your first goal and start turning dreams into reality!
                  </Text>
                  <Button
                    colorScheme="blue"
                    size="md"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    boxShadow="md"
                    _hover={{ bg: 'blue.600' }}
                  >
                    Set Your First Goal
                  </Button>
                </Center>
              ) : (
                goals.map((goal) => (
                  <Box
                    key={goal.id}
                    p={{ base: 5, md: 6 }}
                    w="full"
                    borderWidth="1px"
                    borderRadius="xl"
                    boxShadow="base"
                    transition="all 0.35s ease"
                    _hover={{
                      boxShadow: 'xl',
                      transform: 'translateY(-6px)',
                      borderColor: 'blue.400',
                    }}
                    bg="white"
                    borderColor="gray.200"
                    overflow="hidden"
                    mb={{ base: 5, md: 6 }}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Heading
                        as="h3"
                        size="lg"
                        mb={3}
                        color="blue.700"
                        fontSize={{ base: 'lg', md: 'xl' }}
                        letterSpacing="wide"
                        fontWeight="semibold"
                      >
                        {goal.title}
                      </Heading>
                      <Text
                        mb={2}
                        color="gray.700"
                        fontSize={{ base: 'sm', md: 'md' }}
                        noOfLines={3}
                        lineHeight="short"
                        opacity={0.9}
                      >
                        {goal.description}
                      </Text>
                      {loadingInsights ? (
                        <Center mt={4} py={6}>
                          <Spinner size="md" />
                        </Center>
                      ) : (
                        <>
                          <Wrap spacing={3} mt={2} mb={2} align="center">
                            {goal.sentiment && (
                              <WrapItem>
                                <Badge
                                  bgGradient={getBadgeGradient('sentiment', goal.sentiment)}
                                  color="white"
                                  fontSize={{ base: 'xs', md: 'sm' }}
                                  fontWeight="semibold"
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                  letterSpacing="wider"
                                  textTransform="uppercase"
                                  boxShadow="sm"
                                >
                                  Sentiment: {goal.sentiment}
                                </Badge>
                              </WrapItem>
                            )}
                            {goal.successScore !== undefined && (
                              <WrapItem>
                                <Badge
                                  bgGradient={getBadgeGradient('success', goal.successScore)}
                                  color="white"
                                  fontSize={{ base: 'xs', md: 'sm' }}
                                  fontWeight="semibold"
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                  letterSpacing="wider"
                                  boxShadow="sm"
                                >
                                  Success Prediction: {goal.successScore}%
                                </Badge>
                              </WrapItem>
                            )}
                            {goal.keywords && goal.keywords.length > 0 && (
                              <WrapItem>
                                <Badge
                                  bgGradient={getBadgeGradient('tags')}
                                  color="white"
                                  fontSize={{ base: 'xs', md: 'sm' }}
                                  fontWeight="semibold"
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                  letterSpacing="wider"
                                  boxShadow="sm"
                                >
                                  Tags: {goal.keywords.join(', ')}
                                </Badge>
                              </WrapItem>
                            )}
                          </Wrap>
                        </>
                      )}
                    </Box>

                    <Box mt={4} display="flex" flexDirection={{ base: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ base: 'stretch', sm: 'center' }} gap={{ base: 3, sm: 0 }}>
                      <Badge
                        colorScheme="gray"
                        variant="subtle"
                        fontWeight="medium"
                        fontSize={{ base: 'xs', md: 'sm' }}
                        px={3}
                        py={1}
                        borderRadius="md"
                        textAlign="center"
                        flexShrink={0}
                      >
                        Status: {goal.status}
                      </Badge>
                      <Stack
                        direction={{ base: 'column', sm: 'row' }}
                        spacing={{ base: 2, md: 4 }}
                        mt={{ base: 2, sm: 0 }}
                        flexShrink={0}
                      >
                        <Button
                          colorScheme="green"
                          variant="solid"
                          size="md"
                          minW="140px" // <-- Optional for better mobile spacing
                          px={5}
                          _hover={{ bg: 'green.600' }}
                          onClick={() => handleUpdateGoal(goal.id)}
                        >
                          Mark Completed
                        </Button>
                        <Button
                          colorScheme="red"
                          variant="outline"
                          size="md"
                          minW="100px" // <-- Optional to keep Delete looking good
                          px={5}
                          _hover={{ bg: 'red.50' }}
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Box>
                  </Box>
                ))
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}