import { Box, CircularProgress, Text, VStack } from "@chakra-ui/react";

const LoadingPage = ({ message = "Loading..." }) => {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      bg="neutral.50"
      fontFamily="body"
    >
      <VStack spacing={4} textAlign="center">
        <CircularProgress
          isIndeterminate
          color="brand.500"
          size="80px"
          thickness="8px"
        />
        <Text
          fontSize="lg"
          fontWeight="semibold"
          color="neutral.800"
          fontFamily="body"
        >
          {message}
        </Text>
      </VStack>
    </Box>
  );
};

export default LoadingPage;
