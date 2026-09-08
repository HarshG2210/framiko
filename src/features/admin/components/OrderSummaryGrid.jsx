import React from "react";
import { Grid, Badge } from "@chakra-ui/react";
import { Field, SectionCard } from "./OrderUIComponents";
import {
  fmtVal,
  fmtDate,
  paymentColor,
  orderColor,
  formatCustomerName,
} from "../utils/orderFormatters";

/**
 * Order summary grid - 3 columns: summary, customer, payment
 * Memoized to prevent unnecessary re-renders
 */
const OrderSummaryGrid = React.memo(({ order }) => (
  <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={5}>
    {/* Order Summary */}
    <SectionCard title="Order Summary">
      <Field label="Order ID">{fmtVal(order.order_id)}</Field>
      <Field label="Order DB ID">{fmtVal(order.id)}</Field>
      <Field label="Items Count">{fmtVal(order.items_count)}</Field>
      <Field label="Created At">{fmtDate(order.created_at)}</Field>
      <Field label="Updated At">{fmtDate(order.updated_at)}</Field>
      <Field label="Delivered At">{fmtDate(order.delivered_at)}</Field>
      <Field label="Cancelled At">{fmtDate(order.cancelled_at)}</Field>
      <Field label="Shipped At">{fmtDate(order.shipped_at)}</Field>
    </SectionCard>

    {/* Customer Info */}
    <SectionCard title="Customer">
      <Field label="Name">{formatCustomerName(order.user)}</Field>
      <Field label="Username">{fmtVal(order.user?.username)}</Field>
      <Field label="Email">{fmtVal(order.user?.email)}</Field>
      <Field label="User ID">{fmtVal(order.user?.id)}</Field>
    </SectionCard>

    {/* Payment & Status */}
    <SectionCard title="Payment & Status">
      <Field label="Payment Method">{fmtVal(order.payment_method)}</Field>
      <Field label="Payment Status">
        <Badge colorScheme={paymentColor(order.payment_status)}>
          {fmtVal(order.payment_status)}
        </Badge>
      </Field>
      <Field label="Order Status">
        <Badge colorScheme={orderColor(order.order_status)}>
          {fmtVal(order.order_status)}
        </Badge>
      </Field>
      <Field label="Shipping Status">{fmtVal(order.shipping_status)}</Field>
      <Field label="Transaction ID">{fmtVal(order.transaction_id)}</Field>
      <Field label="Razorpay Order ID">{fmtVal(order.razorpay_order_id)}</Field>
      <Field label="Razorpay Payment ID">
        {fmtVal(order.razorpay_payment_id)}
      </Field>
    </SectionCard>
  </Grid>
));

OrderSummaryGrid.displayName = "OrderSummaryGrid";

export default OrderSummaryGrid;
