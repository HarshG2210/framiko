import React from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Badge,
  Button,
  Text,
} from "@chakra-ui/react";
import {
  fmtVal,
  fmtDate,
  paymentColor,
  orderColor,
} from "../utils/orderFormatters";

/**
 * Order detail header with title, badges, and back button
 * Memoized for performance
 */
const OrderHeader = React.memo(({ order, onBack }) => (
  <Flex
    justify="space-between"
    align={{ base: "flex-start", md: "center" }}
    direction={{ base: "column", md: "row" }}
    gap={3}
    mb={6}
  >
    <Box>
      <Heading size="lg">Order {fmtVal(order.order_id)}</Heading>
      <Text color="gray.500" fontSize="sm">
        Internal ID: {fmtVal(order.id)} · Placed {fmtDate(order.created_at)}
      </Text>
    </Box>

    <HStack>
      <Badge
        colorScheme={paymentColor(order.payment_status)}
        px={3}
        py={1}
        borderRadius="full"
        fontSize="sm"
      >
        Payment: {fmtVal(order.payment_status)}
      </Badge>
      <Badge
        colorScheme={orderColor(order.order_status)}
        px={3}
        py={1}
        borderRadius="full"
        fontSize="sm"
      >
        Order: {fmtVal(order.order_status)}
      </Badge>
      <Button variant="outline" onClick={onBack}>
        ← Back
      </Button>
    </HStack>
  </Flex>
));

OrderHeader.displayName = "OrderHeader";

export default OrderHeader;
