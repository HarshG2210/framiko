import { Box, HStack, Text } from "@chakra-ui/react";

import { FiX } from "react-icons/fi";
import React from "react";

const FilterPill = ({ label, onRemove }) => (
  <HStack
    spacing={1}
    px={3}
    py={1}
    bg="beige.50"
    border="1.5px solid"
    borderColor="neutral.200"
    borderRadius="full"
    fontSize="xs"
    fontFamily="body"
    color="neutral.900"
  >
    <Text fontWeight="500" fontFamily="body">{label}</Text>
    <Box
      as="button"
      onClick={onRemove}
      color="neutral.400"
      _hover={{ color: "neutral.900" }}
      ml={1}
      display="flex"
      alignItems="center"
    >
      <FiX size={11} />
    </Box>
  </HStack>
);

export default FilterPill;
