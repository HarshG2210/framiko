import React from "react";
import { Grid, Stack, Text } from "@chakra-ui/react";
import { Field, SectionCard } from "./OrderUIComponents";
import { fmtVal, fmtDate } from "../utils/orderFormatters";

/**
 * Shipping address and tracking information grid
 * Memoized for performance
 */
const OrderShippingInfo = React.memo(({ order }) => (
  <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={5}>
    {/* Shipping Address */}
    <SectionCard title="Shipping Address">
      <Field label="Full Name">
        {fmtVal(order.shipping_address?.full_name)}
      </Field>
      <Field label="Phone">{fmtVal(order.shipping_address?.phone)}</Field>
      <Field label="Alternate Phone">
        {fmtVal(order.shipping_address?.alternate_phone)}
      </Field>
      <Field label="Address Line 1">
        {fmtVal(order.shipping_address?.address_line_1)}
      </Field>
      <Field label="Address Line 2">
        {fmtVal(order.shipping_address?.address_line_2)}
      </Field>
      <Field label="City">{fmtVal(order.shipping_address?.city)}</Field>
      <Field label="State">{fmtVal(order.shipping_address?.state)}</Field>
      <Field label="Postal Code">
        {fmtVal(order.shipping_address?.postal_code)}
      </Field>
      <Field label="Country">{fmtVal(order.shipping_address?.country)}</Field>
      <Field label="Landmark">{fmtVal(order.shipping_address?.landmark)}</Field>
      <Field label="Is Default">
        {fmtVal(order.shipping_address?.is_default)}
      </Field>
      <Field label="Address Created">
        {fmtDate(order.shipping_address?.created_at)}
      </Field>
      <Field label="Address Updated">
        {fmtDate(order.shipping_address?.updated_at)}
      </Field>
    </SectionCard>

    {/* Shipping & Tracking + Notes */}
    <Stack spacing={5}>
      <SectionCard title="Shipping & Tracking">
        <Field label="Shiprocket Order ID">
          {fmtVal(order.shiprocket_order_id)}
        </Field>
        <Field label="Airway Bill Number">
          {fmtVal(order.airway_bill_number)}
        </Field>
        <Field label="Courier Name">{fmtVal(order.courier_name)}</Field>
        <Field label="Tracking URL">
          {order.tracking_url ? (
            <a href={order.tracking_url} target="_blank" rel="noreferrer">
              <Text as="span" color="blue.600" textDecor="underline">
                {order.tracking_url}
              </Text>
            </a>
          ) : (
            "—"
          )}
        </Field>
      </SectionCard>

      <SectionCard title="Notes">
        <Field label="Admin Notes">{fmtVal(order.notes)}</Field>
        <Field label="Customer Notes">{fmtVal(order.customer_notes)}</Field>
      </SectionCard>
    </Stack>
  </Grid>
));

OrderShippingInfo.displayName = "OrderShippingInfo";

export default OrderShippingInfo;
