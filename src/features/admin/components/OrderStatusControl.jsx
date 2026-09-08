import React from "react";
import {
  Box,
  Button,
  Flex,
  Select,
  Stack,
  Text,
  Badge,
  HStack,
  VStack,
  Icon,
  useToast,
} from "@chakra-ui/react";
import {
  CheckIcon,
  CloseIcon,
  TimeIcon,
  ArrowBackIcon,
} from "@chakra-ui/icons";
import { SectionCard } from "./OrderUIComponents";

/* ─── Status config ───────────────────────────────────────────────────────── */

const STATUSES = [
  {
    value: "pending",
    label: "Pending",
    colorScheme: "gray",
    badgeBg: "gray.100",
    badgeColor: "gray.700",
    iconColor: "gray.400",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    colorScheme: "gray",
    badgeBg: "gray.100",
    badgeColor: "gray.700",
    iconColor: "gray.400",
  },
  {
    value: "processing",
    label: "Processing",
    colorScheme: "blue",
    badgeBg: "blue.50",
    badgeColor: "blue.700",
    iconColor: "blue.400",
  },
  {
    value: "ready",
    label: "Ready to Ship",
    colorScheme: "green",
    badgeBg: "green.50",
    badgeColor: "green.700",
    iconColor: "green.400",
  },
  {
    value: "shipped",
    label: "Shipped",
    colorScheme: "teal",
    badgeBg: "teal.50",
    badgeColor: "teal.700",
    iconColor: "teal.400",
  },
  {
    value: "delivered",
    label: "Delivered",
    colorScheme: "teal",
    badgeBg: "teal.50",
    badgeColor: "teal.700",
    iconColor: "teal.500",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    colorScheme: "red",
    badgeBg: "red.50",
    badgeColor: "red.700",
    iconColor: "red.400",
  },
  {
    value: "returned",
    label: "Returned",
    colorScheme: "orange",
    badgeBg: "orange.50",
    badgeColor: "orange.700",
    iconColor: "orange.400",
  },
];

/* Flow stages — terminal statuses (cancelled/returned) are shown separately */
const FLOW_STAGES = ["pending", "processing", "ready", "shipped", "delivered"];

const getStatusInfo = (val) =>
  STATUSES.find((s) => s.value === val) || STATUSES[0];

/* ─── Step dot icon ───────────────────────────────────────────────────────── */

const StepIcon = ({ status, isDone, isActive, isCancelled, isReturned }) => {
  if (isDone) return <CheckIcon w={3} h={3} color="white" />;
  if (isCancelled) return <CloseIcon w={2.5} h={2.5} color="white" />;
  if (isReturned) return <ArrowBackIcon w={3} h={3} color="white" />;

  switch (status) {
    case "pending":
      return (
        <TimeIcon w={3} h={3} color={isActive ? "blue.500" : "gray.300"} />
      );
    case "processing":
      return (
        <Box
          w="8px"
          h="8px"
          borderRadius="full"
          bg={isActive ? "blue.500" : "gray.300"}
        />
      );
    case "ready":
      return (
        <Box
          w="8px"
          h="8px"
          borderRadius="sm"
          bg={isActive ? "blue.500" : "gray.300"}
        />
      );
    case "shipped":
      return (
        <Box
          w={3}
          h={3}
          as="span"
          fontSize="10px"
          color={isActive ? "blue.500" : "gray.300"}
          lineHeight={1}
        >
          ▲
        </Box>
      );
    case "delivered":
      return (
        <CheckIcon w={3} h={3} color={isActive ? "blue.500" : "gray.300"} />
      );
    default:
      return null;
  }
};

/* ─── Progress timeline ───────────────────────────────────────────────────── */

const StatusTimeline = ({ currentStatus }) => {
  const isTerminal = ["cancelled", "returned"].includes(currentStatus);
  const activeIdx = FLOW_STAGES.indexOf(currentStatus);
  const info = getStatusInfo(currentStatus);

  if (isTerminal) {
    return (
      <Flex
        align="center"
        gap={3}
        px={4}
        py={3}
        bg={info.badgeBg}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={`${info.colorScheme}.100`}
      >
        <Box
          w="32px"
          h="32px"
          borderRadius="full"
          bg={currentStatus === "cancelled" ? "red.400" : "orange.400"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          {currentStatus === "cancelled" ? (
            <CloseIcon w={2.5} h={2.5} color="white" />
          ) : (
            <ArrowBackIcon w={3} h={3} color="white" />
          )}
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="600" color={info.badgeColor}>
            Order {info.label}
          </Text>
          <Text fontSize="xs" color="gray.500">
            This order has been {info.label.toLowerCase()}.
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
    <VStack align="stretch" spacing={0}>
      {FLOW_STAGES.map((stage, idx) => {
        const isDone = idx < activeIdx;
        const isActive = idx === activeIdx;
        const isLast = idx === FLOW_STAGES.length - 1;
        const stageInfo = getStatusInfo(stage);

        return (
          <Flex key={stage} align="flex-start" gap={3} position="relative">
            {/* Connector line */}
            {!isLast && (
              <Box
                position="absolute"
                left="15px"
                top="32px"
                w="2px"
                h="calc(100% - 8px)"
                bg={isDone ? "teal.400" : "gray.200"}
                transition="background 0.3s"
                zIndex={0}
              />
            )}

            {/* Dot */}
            <Box
              w="32px"
              h="32px"
              borderRadius="full"
              flexShrink={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={1}
              transition="all 0.2s"
              bg={isDone ? "teal.400" : isActive ? "white" : "gray.100"}
              borderWidth={isActive ? "2.5px" : "2px"}
              borderColor={
                isDone ? "teal.400" : isActive ? "blue.400" : "gray.200"
              }
              boxShadow={isActive ? "0 0 0 4px rgba(66,153,225,0.15)" : "none"}
            >
              <StepIcon status={stage} isDone={isDone} isActive={isActive} />
            </Box>

            {/* Label */}
            <Box pb={isLast ? 0 : 5} pt={1}>
              <Text
                fontSize="sm"
                fontWeight={isActive ? "600" : "400"}
                color={isDone ? "gray.500" : isActive ? "gray.800" : "gray.400"}
                lineHeight={1.3}
              >
                {stageInfo.label}
              </Text>
              {isActive && (
                <Text
                  fontSize="11px"
                  color="blue.500"
                  fontWeight="500"
                  mt="1px"
                >
                  Current
                </Text>
              )}
            </Box>
          </Flex>
        );
      })}
    </VStack>
  );
};

/* ─── Main component ──────────────────────────────────────────────────────── */

const normalizeStatus = (value) =>
  typeof value === "string" ? value.trim().replace(/^\"+|\"+$/g, "") : value;

const OrderStatusControl = React.memo(({ order, onUpdateStatus, loading }) => {
  const toast = useToast();
  const [status, setStatus] = React.useState(
    normalizeStatus(order?.order_status) || "pending",
  );

  React.useEffect(() => {
    setStatus(normalizeStatus(order?.order_status) || "pending");
  }, [order?.order_status]);

  const currentInfo = getStatusInfo(
    normalizeStatus(order?.order_status) || "pending",
  );
  const isUnchanged = status === order?.order_status;

  const handleSubmit = async () => {
    if (!status || isUnchanged) return;
    try {
      await onUpdateStatus(status);
      toast({
        title: "Status updated",
        description: `Order is now "${getStatusInfo(status).label}"`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch {
      toast({
        title: "Update failed",
        description: "Could not update the order status. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <SectionCard title="Order Status">
      <Stack spacing={5}>
        {/* ── Current status badge ── */}
        <Flex
          align="center"
          justify="space-between"
          px={4}
          py={3}
          bg="gray.50"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="gray.100"
        >
          <Box>
            <Text
              fontSize="xs"
              fontWeight="600"
              color="gray.400"
              textTransform="uppercase"
              letterSpacing="0.06em"
              mb={1}
            >
              Current status
            </Text>
            <Badge
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
              fontWeight="600"
              bg={currentInfo.badgeBg}
              color={currentInfo.badgeColor}
              textTransform="none"
            >
              {currentInfo.label}
            </Badge>
          </Box>
          <Box
            w="40px"
            h="40px"
            borderRadius="full"
            bg={currentInfo.badgeBg}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="18px"
          >
            {order?.order_status === "delivered" && "✓"}
            {order?.order_status === "shipped" && "▲"}
            {order?.order_status === "processing" && "⚙"}
            {order?.order_status === "pending" && "⏱"}
            {order?.order_status === "ready" && "📦"}
            {order?.order_status === "cancelled" && "✕"}
            {order?.order_status === "returned" && "↩"}
          </Box>
        </Flex>

        {/* ── Timeline ── */}
        <Box>
          <Text
            fontSize="xs"
            fontWeight="600"
            color="gray.400"
            textTransform="uppercase"
            letterSpacing="0.06em"
            mb={3}
          >
            Progress
          </Text>
          <StatusTimeline currentStatus={order?.order_status || "pending"} />
        </Box>

        {/* ── Update control ── */}
        <Box borderTopWidth="1px" borderColor="gray.100" pt={4}>
          <Text
            fontSize="xs"
            fontWeight="600"
            color="gray.400"
            textTransform="uppercase"
            letterSpacing="0.06em"
            mb={3}
          >
            Update status
          </Text>
          <HStack spacing={3}>
            <Select
              value={status}
              onChange={(e) => setStatus(normalizeStatus(e.target.value))}
              borderRadius="xl"
              borderColor="gray.200"
              fontSize="sm"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px #63B3ED",
              }}
              _hover={{ borderColor: "gray.300" }}
              bg="white"
              data-testid="admin-order-status-select"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>

            <Button
              colorScheme="blue"
              borderRadius="xl"
              px={6}
              fontSize="sm"
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Saving…"
              isDisabled={!status || isUnchanged}
              flexShrink={0}
            >
              Apply
            </Button>
          </HStack>

          {!isUnchanged && (
            <Flex align="center" gap={2} mt={2}>
              <Box
                w="6px"
                h="6px"
                borderRadius="full"
                bg="blue.400"
                flexShrink={0}
              />
              <Text fontSize="xs" color="blue.600">
                Will change to{" "}
                <Text as="span" fontWeight="600">
                  {getStatusInfo(status).label}
                </Text>
              </Text>
            </Flex>
          )}
        </Box>
      </Stack>
    </SectionCard>
  );
});

OrderStatusControl.displayName = "OrderStatusControl";
export default OrderStatusControl;
