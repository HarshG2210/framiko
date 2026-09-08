import React from "react";
import { Box, Flex, Text, Heading } from "@chakra-ui/react";

/**
 * Reusable label/value field for displaying order information
 */
const Field = ({ label, children }) => (
  <Flex
    justify="space-between"
    align="flex-start"
    py={1.5}
    borderBottomWidth="1px"
    borderColor="gray.100"
    gap={4}
  >
    <Text fontSize="sm" color="gray.500" minW="40%">
      {label}
    </Text>
    <Box fontSize="sm" fontWeight="500" color="gray.800" textAlign="right">
      {children}
    </Box>
  </Flex>
);

/**
 * Reusable card wrapper for grouped information sections
 */
const SectionCard = React.memo(({ title, children, ...rest }) => (
  <Box
    bg="white"
    borderWidth="1px"
    borderColor="gray.200"
    borderRadius="xl"
    p={5}
    boxShadow="sm"
    {...rest}
  >
    {title && (
      <Heading size="sm" mb={3} color="gray.700">
        {title}
      </Heading>
    )}
    {children}
  </Box>
));

SectionCard.displayName = "SectionCard";

export { Field, SectionCard };
