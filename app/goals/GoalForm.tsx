// app/goals/GoalForm.tsx

'use client';

import { useState, useTransition, FormEvent } from 'react';
import { Box, Button, Heading, Input, Stack, Text, Textarea, FormControl, FormLabel } from '@chakra-ui/react';
import { generateGoalPlan } from '@/lib/api-ai';

export default function GoalForm({ onAddGoal }: { onAddGoal: (title: string, description: string) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      await onAddGoal(title.trim(), description.trim());
      setTitle('');
      setDescription('');
    });
  };

  const handleGenerateDescription = async () => {
    if (!title.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await generateGoalPlan(title.trim());
      setDescription(generated);
    } catch (error) {
      console.error('AI generation failed.', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} mb={10} maxW="md" mx="auto" px={6}>
      <Stack spacing={8}>
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            Set Your Next Goal
          </Heading>
          <Text color="gray.600" fontWeight="medium">
            Big achievements start with a clear vision. Let's get started!
          </Text>
        </Box>

        <FormControl isRequired>
          <FormLabel>Goal Title</FormLabel>
          <Input
            type="text"
            placeholder="What's your goal? (e.g., Run a marathon)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            focusBorderColor="blue.500"
            _hover={{ borderColor: 'blue.300' }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>
            Goal Description (Optional)
          </FormLabel>
          <Textarea
            placeholder="How will you achieve it?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            focusBorderColor="blue.500"
            _hover={{ borderColor: 'blue.300' }}
            minHeight="150px"
            resize="vertical"
            bg="white"
            boxShadow="sm"
          />
          {title.trim() && !description.trim() && (
            <Button
              type="button"
              variant="link"
              colorScheme="purple"
              size="sm"
              mt={2}
              onClick={handleGenerateDescription}
              isLoading={isGenerating}
            >
              Suggest description with AI
            </Button>
          )}
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          fontWeight="semibold"
          isDisabled={!title.trim() || isSubmitting || isGenerating}
          isLoading={isSubmitting}
        >
          Save Vision
        </Button>
      </Stack>
    </Box>
  );
}