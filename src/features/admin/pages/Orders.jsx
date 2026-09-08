import React, { useEffect } from "react";
import { Flex, Spinner, Box, Divider, VStack } from "@chakra-ui/react";
import { AdminPage, AdminTableShell, useAdminTable } from "../../../layout/AdminUI";
import {
  clearSelectedOrder,
  fetchAdminOrderDetails,
  fetchAllAdminOrders,
  updateAdminOrderStatus,
} from "../../../redux/slices/admin/adminOrdersSlice";
import { useDispatch, useSelector } from "react-redux";

// Import optimized components
import OrdersTable from "../components/OrdersTable";
import OrderHeader from "../components/OrderHeader";
import OrderSummaryGrid from "../components/OrderSummaryGrid";
import OrderStatusControl from "../components/OrderStatusControl";
import OrderShippingInfo from "../components/OrderShippingInfo";
import OrderItemsList from "../components/OrderItemsList";
import OrderTotals from "../components/OrderTotals";

/**
 * Main Orders Admin Page
 * Orchestrates order listing and detailed views with optimized sub-components
 */
const Orders = () => {
  const dispatch = useDispatch();

  const { orders, selectedOrder, loading } = useSelector(
    (state) =>
      state.admin?.orders ?? {
        orders: [],
        selectedOrder: null,
        loading: false,
      },
  );

  const table = useAdminTable(orders, 10);

  useEffect(() => {
    dispatch(fetchAllAdminOrders());
  }, [dispatch]);

  if (loading && !orders.length) {
    return (
      <Flex justify="center" py={20}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <AdminPage title="Orders" description="Manage customer orders">
      {!selectedOrder ? (
        // Orders list view
        <AdminTableShell title="All Orders">
          <OrdersTable
            table={table}
            orders={orders}
            onViewOrder={(orderId) =>
              dispatch(fetchAdminOrderDetails(orderId))
            }
          />
        </AdminTableShell>
      ) : (
        // Order details view
        <Box pb={10}>
          <OrderHeader
            order={selectedOrder}
            onBack={() => dispatch(clearSelectedOrder())}
          />

          <VStack align="stretch" spacing={6}>
            {/* Summary grid: order info, customer, payment */}
            <OrderSummaryGrid order={selectedOrder} />

            {/* Order status update control */}
            <OrderStatusControl
              order={selectedOrder}
              loading={loading}
              onUpdateStatus={(status) =>
                dispatch(updateAdminOrderStatus({
                  orderId: selectedOrder.id,
                  status,
                }))
              }
            />

            {/* Shipping address & tracking */}
            <OrderShippingInfo order={selectedOrder} />

            {/* Ordered items */}
            <OrderItemsList items={selectedOrder.order_items} />

            <Divider />

            {/* Totals */}
            <OrderTotals order={selectedOrder} />
          </VStack>
        </Box>
      )}
    </AdminPage>
  );
};
export default Orders;
