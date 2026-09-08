import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
} from "@chakra-ui/react";

import React from "react";

const FilterSection = ({ title, children }) => (
  <AccordionItem border="none">
    <AccordionButton
      px={0}
      py={3}
      _hover={{ bg: "transparent" }}
      _focus={{ boxShadow: "none" }}
    >
      <Text
        flex="1"
        textAlign="left"
        fontSize="sm"
        fontWeight="700"
        color="neutral.900"
        fontFamily="body"
        textTransform="uppercase"
        letterSpacing="0.06em"
      >
        {title}
      </Text>
      <AccordionIcon color="neutral.400" />
    </AccordionButton>
    <AccordionPanel px={0} pb={4}>
      {children}
    </AccordionPanel>
  </AccordionItem>
);

export default FilterSection;
