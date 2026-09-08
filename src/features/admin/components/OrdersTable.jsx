import React from "react";
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Badge,
} from "@chakra-ui/react";
import { AdminTableWithPagination } from "../../../layout/AdminUI";
import {
  fmtVal,
  fmtCurrency,
  fmtDate,
  paymentColor,
  orderColor,
  formatCustomerName,
} from "../utils/orderFormatters";

/**
 * Orders table - displays list of orders with pagination
 * Memoized to prevent re-renders when props haven't changed
 */
const OrdersTable = React.memo(({ table, onViewOrder }) => {
  const { page, setPage, totalPages, paginatedData } = table;

  return (
    <AdminTableWithPagination
      table={table}
      selectedCount={0}
      onDeleteSelected={() => {}}
      page={page}
      setPage={setPage}
      totalPages={totalPages}
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Order ID</Th>
            <Th>Customer</Th>
            <Th>Total</Th>
            <Th>Items</Th>
            <Th>Payment</Th>
            <Th>Status</Th>
            <Th>Date</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>

        <Tbody>
          {paginatedData.map((order) => (
            <Tr key={order.id}>
              <Td fontFamily="mono" fontSize="xs">
                {fmtVal(order.id)}
              </Td>
              <Td fontFamily="mono" fontSize="xs">
                {fmtVal(order.order_id)}
              </Td>

              <Td>{formatCustomerName(order.user)}</Td>

              <Td>{fmtCurrency(order.total_amount)}</Td>

              <Td>{fmtVal(order.items_count)}</Td>

              <Td>
                <Badge colorScheme={paymentColor(order.payment_status)}>
                  {fmtVal(order.payment_status)}
                </Badge>
              </Td>

              <Td>
                <Badge colorScheme={orderColor(order.order_status)}>
                  {fmtVal(order.order_status)}
                </Badge>
              </Td>

              <Td>{fmtDate(order.created_at)}</Td>

              <Td>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => onViewOrder(order.id)}
                >
                  View
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </AdminTableWithPagination>
  );
});

OrdersTable.displayName = "OrdersTable";

export default OrdersTable;
