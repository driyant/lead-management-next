"use client";

import { Box, Heading, Text, Button } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box p={8}>
      <Heading mb={4}>Lead Manager Dashboard</Heading>
      <Text mb={4}>Chakra UI</Text>
      <Button colorScheme="blue">Test Button</Button>
    </Box>
  );
}
