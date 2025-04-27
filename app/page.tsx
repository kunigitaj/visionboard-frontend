// app/page.tsx

'use client';

import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <Box as="main" py={16} px={6} textAlign="center">
      <VStack spacing={6}>
        <Heading as="h1" size="2xl">
          Welcome to VisionBoard
        </Heading>
        <Text fontSize="lg" color="gray.600" maxW="xl">
          Track your goals with simplicity, clarity, and the power of AI. 
          Set meaningful targets, gain smart insights, and stay motivated every step of the way.
        </Text>
        <Link href="/goals" passHref>
          <Button colorScheme="blue" size="lg">
            View Your Goals
          </Button>
        </Link>
      </VStack>
    </Box>
  );
}