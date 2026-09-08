import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";

export default function ReturnPolicy() {
  return (
    <Box
      maxW="1000px"
      mx="auto"
      py={{ base: 12, md: 16 }}
      px={{ base: 6, md: 10 }}
      fontFamily="body"
    >
      <Stack spacing={5}>
        <Heading as="h1" mb={2} fontFamily="heading" color="neutral.900">
          Return Policy
        </Heading>

        <Text color="neutral.600" lineHeight="tall">
          Return and refund policy details.
        </Text>

        <Button variant="brand" size="md" alignSelf="flex-start">
          Contact support
        </Button>
      </Stack>
    </Box>
  );
}
