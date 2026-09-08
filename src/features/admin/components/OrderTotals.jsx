import React from "react";
import { Grid, Box, Flex, Heading } from "@chakra-ui/react";
import { Field, SectionCard } from "./OrderUIComponents";
import { fmtCurrency } from "../utils/orderFormatters";

/**
 * Order totals section - subtotal, shipping, grand total
 * Memoized for performance
 */
const OrderTotals = React.memo(({ order }) => (
  <SectionCard>
    <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
      <Box>
        <Field label="Subtotal">{fmtCurrency(order.subtotal)}</Field>
        <Field label="Shipping">{fmtCurrency(order.shipping_amount)}</Field>
      </Box>
      <Flex justify={{ base: "flex-start", sm: "flex-end" }} align="center">
        <Heading size="md" color="blue.600">
          Grand Total: {fmtCurrency(order.total_amount)}
        </Heading>
      </Flex>
    </Grid>
  </SectionCard>
));

OrderTotals.displayName = "OrderTotals";

export default OrderTotals;
