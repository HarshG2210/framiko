import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  HStack,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { fetchOrders } from "../../../redux/slices/ordersSlice";
import { useNavigate } from "react-router-dom";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const fmtCurrency = (val) =>
  val === null || val === undefined
    ? "—"
    : `₹${Number(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const paymentColor = (s) =>
  ({ paid: "green", pending: "orange", failed: "red" })[s] ?? "gray";

const orderColor = (s) =>
  ({
    delivered: "green",
    confirmed: "blue",
    cancelled: "red",
    shipped: "purple",
    processing: "cyan",
  })[s] ?? "gray";

const orderIcon = (s) =>
  ({
    delivered: "✅",
    confirmed: "📋",
    cancelled: "✕",
    shipped: "🚚",
    processing: "⚙️",
  })[s] ?? "📦";

const paymentIcon = (s) =>
  ({ paid: "✅", pending: "⏳", failed: "❌" })[s] ?? "💳";

const FILTER_TABS = ["All", "confirmed", "shipped", "delivered", "cancelled"];

/* ─── OrderCard ───────────────────────────────────────────────────────────── */

const OrderCard = ({ order, onViewDetails }) => {
  const orderStatusLow = order.order_status?.toLowerCase();
  const isShipped = orderStatusLow === "shipped";
  const isDelivered = orderStatusLow === "delivered";
  const isCancelled = orderStatusLow === "cancelled";

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="gray.100"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      {/* ── Header ── */}
      <Flex justify="space-between" align="flex-start" px={5} pt={4} pb={3}>
        <Box minW={0}>
          <Text
            fontSize="xs"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.1em"
            color="gray.400"
            mb={0.5}
          >
            Order ID
          </Text>
          <Text
            fontFamily="mono"
            fontSize="xs"
            fontWeight="700"
            color="gray.800"
            isTruncated
          >
            {order.order_id}
          </Text>
        </Box>
        <Badge
          colorScheme={orderColor(orderStatusLow)}
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          fontWeight="700"
          flexShrink={0}
          ml={2}
        >
          {orderIcon(orderStatusLow)} {order.order_status}
        </Badge>
      </Flex>

      <Divider borderColor="gray.100" />

      {/* ── Stats row ── */}
      <SimpleGrid
        columns={3}
        px={5}
        py={3}
        gap={0}
        divider={<Box w="1px" bg="gray.100" />}
      >
        <Box textAlign="center" px={2}>
          <Text fontSize="xs" color="gray.400" mb={0.5}>
            Total
          </Text>
          <Text fontWeight="800" fontSize="sm" color="gray.800">
            {fmtCurrency(order.total_amount)}
          </Text>
        </Box>
        <Box textAlign="center" px={2}>
          <Text fontSize="xs" color="gray.400" mb={0.5}>
            Items
          </Text>
          <Text fontWeight="800" fontSize="sm" color="gray.800">
            {order.items_count ?? "—"}
          </Text>
        </Box>
        <Box textAlign="center" px={2}>
          <Text fontSize="xs" color="gray.400" mb={0.5}>
            Payment
          </Text>
          <Badge
            colorScheme={paymentColor(order.payment_status)}
            fontSize="xs"
            borderRadius="full"
            px={2}
          >
            {paymentIcon(order.payment_status)} {order.payment_status}
          </Badge>
        </Box>
      </SimpleGrid>

      <Divider borderColor="gray.100" />

      <Divider borderColor="gray.100" />

      {/* ── CTA ── */}
      <Box px={5} py={4} mt="auto">
        {isShipped && (
          <Box
            mb={3}
            px={3}
            py={2}
            bg="purple.50"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="purple.100"
          >
            <Text fontSize="xs" color="purple.600" fontWeight="600">
              🚚 Your order is on its way!
            </Text>
          </Box>
        )}
        {isDelivered && (
          <Box
            mb={3}
            px={3}
            py={2}
            bg="green.50"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="green.100"
          >
            <Text fontSize="xs" color="green.600" fontWeight="600">
              ✅ Order delivered successfully
            </Text>
          </Box>
        )}
        {isCancelled && (
          <Box
            mb={3}
            px={3}
            py={2}
            bg="red.50"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="red.100"
          >
            <Text fontSize="xs" color="red.500" fontWeight="600">
              ✕ This order was cancelled
            </Text>
          </Box>
        )}
        <Button
          w="100%"
          variant="solid"
          borderRadius="xl"
          size="sm"
          fontWeight="700"
          onClick={() => onViewDetails(order.id)}
        >
          View Details →
        </Button>
      </Box>
    </Box>
  );
};

/* ─── MyOrders ────────────────────────────────────────────────────────────── */

const MyOrders = ({ onViewDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((s) => s.orders);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const safeOrders = Array.isArray(orders) ? orders : [];

  const filtered =
    activeFilter === "All"
      ? safeOrders
      : safeOrders.filter(
          (o) => o.order_status?.toLowerCase() === activeFilter,
        );

  // Summary counts
  const counts = FILTER_TABS.reduce((acc, tab) => {
    acc[tab] =
      tab === "All"
        ? safeOrders.length
        : safeOrders.filter((o) => o.order_status?.toLowerCase() === tab)
            .length;
    return acc;
  }, {});

  const totalSpend = safeOrders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0,
  );

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <VStack spacing={3}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.400" fontSize="sm">
            Loading your orders…
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" fontFamily="body">
      {/* ── Page header ── */}
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={4}
        mb={8}
      >
        {/* Summary stats */}
        {safeOrders.length > 0 && (
          <SimpleGrid columns={3} gap={4}>
            {[
              {
                label: "Total Orders",
                value: safeOrders.length,
                color: "blue",
              },
              {
                label: "Total Spent",
                value: `₹${Number(totalSpend).toLocaleString("en-IN")}`,
                color: "green",
              },
              {
                label: "Shipped",
                value: counts["shipped"] || 0,
                color: "purple",
              },
            ].map((stat) => (
              <Box
                key={stat.label}
                bg={`${stat.color}.50`}
                borderRadius="xl"
                px={4}
                py={3}
                textAlign="center"
                borderWidth="1px"
                borderColor={`${stat.color}.100`}
                minW="90px"
              >
                <Text
                  fontSize="xs"
                  color={`${stat.color}.500`}
                  fontWeight="600"
                  mb={0.5}
                >
                  {stat.label}
                </Text>
                <Text
                  fontWeight="800"
                  fontSize="lg"
                  color={`${stat.color}.700`}
                >
                  {stat.value}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Flex>

      {/* ── Filter tabs ── */}
      {safeOrders.length > 0 && (
        <Flex gap={2} mb={6} flexWrap="wrap">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab;
            const count = counts[tab];
            if (tab !== "All" && count === 0) return null;
            return (
              <Button
                key={tab}
                size="sm"
                borderRadius="full"
                px={4}
                fontWeight="600"
                variant={isActive ? "solid" : "outline"}
                onClick={() => setActiveFilter(tab)}
                rightIcon={
                  <Badge
                    ml={1}
                    colorScheme={isActive ? "whiteAlpha" : "gray"}
                    bg={isActive ? "whiteAlpha.300" : "gray.100"}
                    color={isActive ? "white" : "gray.500"}
                    borderRadius="full"
                    fontSize="2xs"
                    px={1.5}
                  >
                    {count}
                  </Badge>
                }
              >
                {tab === "All"
                  ? "All"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            );
          })}
        </Flex>
      )}

      {/* ── Empty state ── */}
      {safeOrders.length === 0 ? (
        <Box
          py={20}
          textAlign="center"
          bg="gray.50"
          borderRadius="2xl"
          borderWidth="1px"
          borderStyle="dashed"
          borderColor="gray.200"
        >
          <Text fontSize="4xl" mb={4}>
            🛍️
          </Text>
          <Heading size="md" color="gray.500" mb={2}>
            No orders yet
          </Heading>
          <Text color="gray.400" fontSize="sm" mb={6}>
            Your orders will appear here once you place one.
          </Text>
          <Button
            variant="solid"
            borderRadius="xl"
            onClick={() => navigate("/")}
          >
            Start Shopping →
          </Button>
        </Box>
      ) : filtered.length === 0 ? (
        <Box
          py={16}
          textAlign="center"
          bg="gray.50"
          borderRadius="2xl"
          borderWidth="1px"
          borderStyle="dashed"
          borderColor="gray.200"
        >
          <Text fontSize="3xl" mb={3}>
            🔍
          </Text>
          <Heading size="sm" color="gray.500" mb={2}>
            No {activeFilter} orders
          </Heading>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setActiveFilter("All")}
          >
            View all orders
          </Button>
        </Box>
      ) : (
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(2, 1fr)",
          }}
          gap={5}
        >
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={(id) => {
                if (onViewDetails) {
                  onViewDetails(id);
                } else {
                  navigate(`/orders/${id}`);
                }
              }}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyOrders;
