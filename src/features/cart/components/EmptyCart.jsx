import { Box, Button, Center, Icon, Text, VStack } from "@chakra-ui/react";

import { FiShoppingBag } from "react-icons/fi";

const EmptyCart = ({ onClose }) => (
  <Center h="full" px={6}>
    <VStack spacing={6}>
      <Box
        w="120px"
        h="120px"
        borderRadius="full"
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={FiShoppingBag} fontSize="48px" color="gray.400" />
      </Box>
      <VStack spacing={2}>
        <Text fontSize="2xl" fontWeight="700" color="gray.700" fontFamily="body">
          Your cart is empty
        </Text>
        <Text color="gray.500" textAlign="center" fontFamily="body">
          Looks like you haven't added anything yet.
          <br />
          Let's find something you'll love!
        </Text>
      </VStack>
      <Button
        onClick={onClose}
        px={8}
        variant="solid"
        size="md"
        fontFamily="body"
      >
        Continue Shopping
      </Button>
    </VStack>
  </Center>
);

export default EmptyCart;
