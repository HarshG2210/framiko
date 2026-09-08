import React from "react";
import { Box, Heading, Stack } from "@chakra-ui/react";
import OrderItemCard from "./OrderItemCard";

/**
 * List of ordered items
 * Memoized for performance
 */
const OrderItemsList = React.memo(({ items = [] }) => (
  <Box>
    <Heading size="md" mb={4}>
      Ordered Items ({items.length})
    </Heading>

    <Stack spacing={5}>
      {items.map((item, idx) => (
        <OrderItemCard key={item.id ?? idx} item={item} index={idx} />
      ))}
    </Stack>
  </Box>
));

OrderItemsList.displayName = "OrderItemsList";

export default OrderItemsList;
