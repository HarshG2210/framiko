import {
  Badge,
  Box,
  Button,
  Code,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Image,
  Progress,
  SimpleGrid,
  Spinner,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  VStack,
  Wrap,
  WrapItem,
  keyframes,
  useToast,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  CopyIcon,
  EmailIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import { FaRegSmile, FaRocket } from "react-icons/fa";
import {
  FiAward,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiDownload,
  FiGift,
  FiGlobe,
  FiHeart,
  FiHome,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPackage,
  FiPhone,
  FiPrinter,
  FiShare2,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTruck,
  FiZap,
} from "react-icons/fi";
import { useEffect, useState } from "react";

import { fetchCartItems } from "../../../redux/slices/cartSlice";
import { loadAuthData } from "../../../services/authStorage";
import { normalizeMediaUrl } from "../../../utils/constant";
import { resetCheckout } from "../../../redux/slices/checkoutSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

/* ─── Animations ──────────────────────────────────────────────────────────── */
// const floatAnimation = keyframes`
//   0% { transform: translateY(0px); }
//   50% { transform: translateY(-10px); }
//   100% { transform: translateY(0px); }
// `;

// const shimmerAnimation = keyframes`
//   0% { background-position: -200% center; }
//   100% { background-position: 200% center; }
// `;

// const pulseAnimation = keyframes`
//   0% { transform: scale(1); opacity: 1; }
//   50% { transform: scale(1.05); opacity: 0.8; }
//   100% { transform: scale(1); opacity: 1; }
// `;

const confettiFall = keyframes`
  0% { transform: translateY(-100%) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
`;

/* ─── Confetti Component ──────────────────────────────────────────────────── */
const Confetti = () => {
  const colors = [
    "#F5A623",
    "#E94E77",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FF6B6B",
    "#FFEAA7",
  ];
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      pointerEvents="none"
      zIndex={9999}
      overflow="hidden"
    >
      {[...Array(50)].map((_, i) => (
        <Box
          key={i}
          position="absolute"
          top="-10px"
          left={`${Math.random() * 100}%`}
          w={`${Math.random() * 8 + 4}px`}
          h={`${Math.random() * 8 + 4}px`}
          bg={colors[Math.floor(Math.random() * colors.length)]}
          borderRadius={Math.random() > 0.5 ? "50%" : "2px"}
          animation={`${confettiFall} ${Math.random() * 3 + 2}s linear infinite`}
          animationDelay={`${Math.random() * 2}s`}
          transform={`rotate(${Math.random() * 360}deg)`}
        />
      ))}
    </Box>
  );
};

/* ─── Field Row ────────────────────────────────────────────────────────────── */
const humanizeKey = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const isPlainObject = (val) =>
  val !== null && typeof val === "object" && !Array.isArray(val);

const isImageKey = (key) =>
  /image|preview|thumbnail/i.test(key) && !/id$/i.test(key);

const FieldRow = ({ label, value, resolveMediaUrl, depth = 0 }) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "boolean") {
    return (
      <Flex justify="space-between" py={1}>
        <Text color="gray.600" fontSize="sm">
          {label}
        </Text>
        <Badge colorScheme={value ? "green" : "red"}>
          {value ? "Yes" : "No"}
        </Badge>
      </Flex>
    );
  }

  if (isImageKey(label) && typeof value === "string") {
    const url = resolveMediaUrl(value);
    return (
      <Box py={2}>
        <Text color="gray.600" fontSize="sm" mb={1}>
          {humanizeKey(label)}
        </Text>
        <Flex align="center" gap={3}>
          <Image
            src={url}
            alt={label}
            boxSize="60px"
            objectFit="cover"
            borderRadius="md"
            cursor="pointer"
            onClick={() => window.open(url, "_blank")}
            fallback={<Text fontSize="xs">No Image</Text>}
            border="1px solid"
            borderColor="gray.200"
          />
          <Text
            as="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            color="gold.500"
            fontSize="xs"
            wordBreak="break-all"
            flex={1}
          >
            {url}
          </Text>
        </Flex>
      </Box>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return (
      <Box py={1}>
        <Text color="gray.600" fontSize="sm" mb={1}>
          {humanizeKey(label)}
        </Text>
        <Wrap>
          {value.map((item, idx) =>
            isPlainObject(item) ? (
              <WrapItem key={idx} w="full">
                <Box
                  borderWidth="1px"
                  borderRadius="md"
                  p={2}
                  w="full"
                  bg="gray.50"
                >
                  <ObjectFields
                    obj={item}
                    resolveMediaUrl={resolveMediaUrl}
                    depth={depth + 1}
                  />
                </Box>
              </WrapItem>
            ) : (
              <WrapItem key={idx}>
                <Badge>{String(item)}</Badge>
              </WrapItem>
            ),
          )}
        </Wrap>
      </Box>
    );
  }

  if (isPlainObject(value)) {
    return (
      <Box py={2} pl={3} borderLeft="2px solid" borderColor="gold.200" my={1}>
        <Text fontWeight="600" color="gray.700" fontSize="sm" mb={1}>
          {humanizeKey(label)}
        </Text>
        <ObjectFields
          obj={value}
          resolveMediaUrl={resolveMediaUrl}
          depth={depth + 1}
        />
      </Box>
    );
  }

  return (
    <Flex justify="space-between" py={1} gap={4}>
      <Text color="gray.600" fontSize="sm">
        {humanizeKey(label)}
      </Text>
      <Text
        fontWeight="600"
        fontSize="sm"
        textAlign="right"
        wordBreak="break-word"
      >
        {String(value)}
      </Text>
    </Flex>
  );
};

const ObjectFields = ({ obj, resolveMediaUrl, depth = 0 }) => {
  if (!obj) return null;
  const entries = Object.entries(obj).filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );
  if (entries.length === 0) return null;
  return (
    <Stack spacing={0} divider={<Divider borderColor="gray.100" />}>
      {entries.map(([key, value]) => (
        <FieldRow
          key={key}
          label={key}
          value={value}
          resolveMediaUrl={resolveMediaUrl}
          depth={depth}
        />
      ))}
    </Stack>
  );
};

/* ─── Premium Section Card ────────────────────────────────────────────────── */
const PremiumSectionCard = ({
  icon,
  title,
  subtitle,
  children,
  accent = "gold.500",
  gradient,
}) => {
  const bgGradient = gradient || "linear(to-r, gray.50, white)";

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
      mb={5}
      boxShadow="0 4px 16px rgba(0,0,0,0.04)"
      transition="all 0.3s ease"
      _hover={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
      position="relative"
    >
      <Flex
        align="center"
        gap={3}
        px={5}
        py={3.5}
        bgGradient={bgGradient}
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Box
          bg="white"
          p={2}
          borderRadius="lg"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.100"
        >
          <Icon as={icon} color={accent} fontSize="18px" />
        </Box>
        <Box flex={1}>
          <Text fontWeight="700" fontSize="md" color="gray.800">
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="xs" color="gray.500" fontWeight="400">
              {subtitle}
            </Text>
          )}
        </Box>
      </Flex>
      <Box px={5} py={4}>
        {children}
      </Box>
    </Box>
  );
};

/* ─── Info Card ───────────────────────────────────────────────────────────── */
const InfoCard = ({
  icon,
  label,
  value,
  color = "gold.500",
  bg = "gold.50",
}) => (
  <Box
    bg={bg}
    p={3}
    borderRadius="xl"
    border="1px solid"
    borderColor={`${color}200`}
    textAlign="center"
    flex="1"
    minW="100px"
  >
    <Icon as={icon} color={color} fontSize="20px" mb={1} />
    <Text fontSize="xs" color="gray.500" fontWeight="600">
      {label}
    </Text>
    <Text fontSize="sm" fontWeight="700" color="gray.800">
      {value}
    </Text>
  </Box>
);

/* ─── Main ConfirmationStep ───────────────────────────────────────────────── */
const ConfirmationStep = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const [showConfetti, setShowConfetti] = useState(true);

  const { order } = useSelector((state) => state.checkout);

  useEffect(() => {
    const { token } = loadAuthData();
    if (token) {
      dispatch(fetchCartItems());
    }
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  if (!order) {
    return (
      <Flex direction="column" align="center" justify="center" py={20} gap={6}>
        <Box
          bg="white"
          borderRadius="2xl"
          p={10}
          textAlign="center"
          maxW="400px"
          boxShadow="0 8px 32px rgba(0,0,0,0.06)"
        >
          <Icon as={FiPackage} fontSize="48px" color="gray.300" mb={4} />
          <Heading size="md" color="gray.700" fontFamily="body">
            Order Not Found
          </Heading>
          <Text color="gray.500" mt={2} fontFamily="body">
            We couldn't find your order details. Please try again.
          </Text>
          <Button
            mt={6}
            variant="solid"
            fontFamily="body"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </Box>
      </Flex>
    );
  }

  const shippingAddress = order.shipping_address || {};
  // const shiprocket = order.shiprocket || {};

  const resolveMediaUrl = (url) => normalizeMediaUrl(url);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      status: "success",
      duration: 1500,
      isClosable: true,
      position: "top-right",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Order Confirmation",
        text: `Order #${order.order_id} confirmed!`,
        url: window.location.href,
      });
    } else {
      handleCopy(window.location.href);
    }
  };

  return (
    <Box maxW="1400px" mx="auto" position="relative">
      {showConfetti && <Confetti />}

      {/* ─── Success Header ────────────────────────────────────────────────── */}
      <Box
        bgGradient="linear(to-r, green.50, emerald.50, white)"
        border="1px solid"
        borderColor="green.200"
        borderRadius="2xl"
        p={8}
        mb={8}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-50%"
          right="-10%"
          w="400px"
          h="400px"
          borderRadius="full"
          bgGradient="linear(to-r, green.200, transparent)"
          opacity={0.1}
        />
        <Flex direction={{ base: "column", md: "row" }} align="center" gap={6}>
          <Box
            w="80px"
            h="80px"
            borderRadius="full"
            bgGradient="linear(to-r, green.400, green.500)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 8px 32px rgba(72, 187, 120, 0.3)"
            // animation={`${floatAnimation} 3s ease-in-out infinite`}
            flexShrink={0}
          >
            <Icon as={CheckCircleIcon} color="white" boxSize={10} />
          </Box>
          <Box flex={1}>
            <Flex align="center" gap={3} flexWrap="wrap">
              <Heading size="lg" color="green.700" fontFamily="body">
                Order Confirmed! 🎉
              </Heading>
              <Badge
                bgGradient="linear(to-r, gold.400, gold.500)"
                color="black"
                px={3}
                py={1.5}
                borderRadius="full"
                fontSize="sm"
                // animation={`${pulseAnimation} 2s ease-in-out infinite`}
                fontFamily="body"
              >
                <Icon as={FiZap} mr={1} />
                Order #{order.order_id}
              </Badge>
            </Flex>
            <Text mt={2} color="gray.600" fontFamily="body">
              Thank you for your purchase! We'll send you a confirmation email
              with your order details.
            </Text>
            <Flex gap={3} mt={3} flexWrap="wrap">
              <Button
                size="sm"
                leftIcon={<Icon as={FiShare2} />}
                variant="outline"
                fontFamily="body"
                onClick={handleShare}
              >
                Share
              </Button>
              <Button
                size="sm"
                leftIcon={<Icon as={FiDownload} />}
                variant="outline"
                fontFamily="body"
                isDisabled
              >
                Download Invoice
              </Button>
              <Button
                size="sm"
                leftIcon={<Icon as={FiPrinter} />}
                variant="outline"
                fontFamily="body"
                isDisabled
              >
                Print
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>

      {/* ─── Quick Stats ────────────────────────────────────────────────────── */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
        <InfoCard
          icon={FiPackage}
          label="Order Status"
          value={order.order_status || "Processing"}
          color="blue.500"
          bg="blue.50"
        />
        <InfoCard
          icon={FiTruck}
          label="Shipping Status"
          value={order.shipping_status || "Pending"}
          color="purple.500"
          bg="purple.50"
        />
        <InfoCard
          icon={FiCreditCard}
          label="Payment Status"
          value={order.payment_status || "Paid"}
          color="green.500"
          bg="green.50"
        />
        <InfoCard
          icon={FiClock}
          label="Expected Delivery"
          value={new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000,
          ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
          color="gold.500"
          bg="gold.50"
        />
      </SimpleGrid>

      {/* ─── Main Content ───────────────────────────────────────────────────── */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* LEFT COLUMN */}
        <VStack spacing={5} align="stretch">
          {/* Order Information */}
          <PremiumSectionCard
            icon={FiPackage}
            title="Order Details"
            subtitle={`Placed on ${new Date(
              order.created_at,
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}`}
          >
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="600">
                  Order ID
                </Text>
                <Text fontWeight="700" fontSize="md" color="gray.800">
                  #{order.order_id}
                </Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="600">
                  Payment Method
                </Text>
                <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                  {order.payment_method}
                </Badge>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="600">
                  Payment Status
                </Text>
                <Badge
                  colorScheme={
                    order.payment_status === "paid" ? "green" : "orange"
                  }
                  fontSize="sm"
                  px={3}
                  py={1}
                >
                  {order.payment_status}
                </Badge>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="600">
                  Order Status
                </Text>
                <Badge
                  colorScheme={
                    order.order_status === "completed" ? "green" : "blue"
                  }
                  fontSize="sm"
                  px={3}
                  py={1}
                >
                  {order.order_status}
                </Badge>
              </Box>
            </SimpleGrid>

            {/* Tracking Info */}
            {order.tracking_url && (
              <Box
                mt={3}
                p={3}
                bg="blue.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="blue.200"
              >
                <Flex align="center" gap={2}>
                  <Icon as={FiTruck} color="blue.500" />
                  <Text fontSize="sm" fontWeight="600" color="blue.700">
                    Track Your Order
                  </Text>
                  <Button
                    size="xs"
                    as="a"
                    href={order.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    rightIcon={<ExternalLinkIcon />}
                    variant="outline"
                    fontFamily="body"
                  >
                    Track Now
                  </Button>
                </Flex>
              </Box>
            )}
          </PremiumSectionCard>

          {/* Shipping Address */}
          <PremiumSectionCard
            icon={FiMapPin}
            title="Delivery Address"
            subtitle="Where we'll send your order"
            gradient="linear(to-r, blue.50, white)"
            accent="blue.500"
          >
            <VStack align="stretch" spacing={2}>
              <Text fontWeight="700" fontSize="md" color="gray.800">
                {shippingAddress.full_name}
              </Text>
              <Text fontSize="sm" color="gray.600">
                <Icon as={FiPhone} mr={2} color="gray.400" />
                {shippingAddress.phone}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {shippingAddress.address_line_1}
                {shippingAddress.address_line_2 &&
                  `, ${shippingAddress.address_line_2}`}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {shippingAddress.city}, {shippingAddress.state} -{" "}
                {shippingAddress.postal_code}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {shippingAddress.country}
              </Text>
              {shippingAddress.landmark && (
                <Text fontSize="sm" color="gray.500">
                  <Icon as={FiMapPin} mr={2} color="gray.400" fontSize="12px" />
                  Landmark: {shippingAddress.landmark}
                </Text>
              )}
            </VStack>
          </PremiumSectionCard>

          {/* Customer Notes */}
          {order.customer_notes && (
            <PremiumSectionCard
              icon={FiMessageSquare}
              title="Customer Notes"
              accent="rose.500"
              gradient="linear(to-r, rose.50, white)"
            >
              <Text color="gray.700" fontStyle="italic">
                "{order.customer_notes}"
              </Text>
            </PremiumSectionCard>
          )}
        </VStack>

        {/* RIGHT COLUMN */}
        <VStack spacing={5} align="stretch">
          {/* Order Summary */}
          <PremiumSectionCard
            icon={FiShoppingBag}
            title={`Order Items (${order.items_count || 0})`}
            subtitle="Review your items"
            gradient="linear(to-r, gold.50, white)"
          >
            <VStack spacing={4} align="stretch">
              {order.order_items?.map((item) => {
                const preview = resolveMediaUrl(
                  item.final_generated_image_url ||
                    item.preview_image_url ||
                    item.image_url ||
                    item.image ||
                    item.artwork_details?.image_url ||
                    item.artwork_details?.image ||
                    item.artwork_details?.image1_url ||
                    item.artwork_details?.image2_url ||
                    item.artwork_details?.image3_url ||
                    item.artwork_details?.image4_url ||
                    item.selected_artwork_category_image_details?.image_file ||
                    item.selected_artwork_category_image_details?.image,
                );

                return (
                  <Box
                    key={item.id}
                    borderWidth="1px"
                    borderRadius="xl"
                    borderColor="gray.200"
                    p={4}
                    bg="white"
                    transition="all 0.2s"
                    _hover={{ borderColor: "gold.300", boxShadow: "sm" }}
                  >
                    <Flex gap={4}>
                      {/* Image */}
                      {preview && (
                        <Box
                          flexShrink={0}
                          w="80px"
                          h="80px"
                          bg="gray.50"
                          borderRadius="lg"
                          overflow="hidden"
                        >
                          <Image
                            src={preview}
                            alt={item.product_name || item.artwork_name}
                            w="100%"
                            h="100%"
                            objectFit="contain"
                            cursor="pointer"
                            onClick={() => window.open(preview, "_blank")}
                            fallback={
                              <Icon
                                as={FiPackage}
                                color="gray.300"
                                fontSize="32px"
                                mt={3}
                              />
                            }
                          />
                        </Box>
                      )}

                      {/* Details */}
                      <Box flex={1}>
                        <Flex justify="space-between" align="start" gap={2}>
                          <Box flex={1}>
                            <Text
                              fontWeight="700"
                              fontSize="sm"
                              color="gray.800"
                              noOfLines={1}
                            >
                              {item.product_name ||
                                item.artwork_name ||
                                "Custom Artwork"}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              Qty: {item.quantity}
                            </Text>
                            <Flex gap={2} mt={1} flexWrap="wrap">
                              {item.selected_size && (
                                <Badge
                                  size="sm"
                                  bg="gray.100"
                                  color="gray.600"
                                  fontSize="10px"
                                >
                                  Size: {item.selected_size}
                                </Badge>
                              )}
                              {item.selected_frame && (
                                <Badge
                                  size="sm"
                                  bg="gray.100"
                                  color="gray.600"
                                  fontSize="10px"
                                >
                                  Frame: {item.selected_frame}
                                </Badge>
                              )}
                              {item.selected_material && (
                                <Badge
                                  size="sm"
                                  bg="gray.100"
                                  color="gray.600"
                                  fontSize="10px"
                                >
                                  Material: {item.selected_material}
                                </Badge>
                              )}
                            </Flex>
                          </Box>
                          <Box textAlign="right">
                            <Text
                              fontWeight="700"
                              color="gold.600"
                              fontSize="sm"
                            >
                              ₹{item.total_price}
                            </Text>
                            <Text
                              fontSize="xs"
                              color="gray.400"
                              textDecoration="line-through"
                            >
                              ₹{item.unit_price}
                            </Text>
                          </Box>
                        </Flex>
                      </Box>
                    </Flex>
                  </Box>
                );
              })}
            </VStack>
          </PremiumSectionCard>

          {/* Payment Summary */}
          <PremiumSectionCard
            icon={FiCreditCard}
            title="Payment Summary"
            gradient="linear(to-r, green.50, white)"
            accent="green.500"
          >
            <VStack spacing={3} align="stretch">
              <Flex justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  Subtotal
                </Text>
                <Text fontSize="sm" fontWeight="600" color="gray.800">
                  ₹{order.subtotal}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  <Icon as={FiTruck} mr={1} color="gold.500" />
                  Shipping
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color={order.shipping_amount === 0 ? "green.500" : "gray.800"}
                >
                  {order.shipping_amount === 0
                    ? "FREE"
                    : `₹${order.shipping_amount}`}
                </Text>
              </Flex>

              <Divider borderColor="gray.200" />

              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontWeight="700" fontSize="md" color="gray.800">
                    Grand Total
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Inclusive of all taxes
                  </Text>
                </Box>
                <Text fontWeight="800" fontSize="xl" color="gold.600">
                  ₹{order.total_amount}
                </Text>
              </Flex>
            </VStack>
          </PremiumSectionCard>

          {/* Actions */}
          <Box
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.200"
            p={6}
            boxShadow="0 4px 16px rgba(0,0,0,0.04)"
          >
            <VStack spacing={3}>
              <Button
                w="full"
                size="lg"
                variant="solid"
                leftIcon={<Icon as={FiShoppingBag} />}
                fontFamily="body"
                onClick={() => {
                  dispatch(resetCheckout());
                  navigate("/");
                }}
              >
                Continue Shopping
              </Button>
              <Button
                w="full"
                variant="outline"
                leftIcon={<Icon as={FiPackage} />}
                fontFamily="body"
                isDisabled
              >
                View All Orders
              </Button>
            </VStack>

            {/* Trust Badges */}
            <Flex
              align="center"
              justify="center"
              gap={4}
              mt={4}
              pt={4}
              borderTop="1px solid"
              borderColor="gray.100"
            >
              <Flex align="center" gap={1}>
                <Icon as={FiShield} color="green.500" fontSize="12px" />
                <Text fontSize="xs" color="gray.500">
                  Secure Checkout
                </Text>
              </Flex>
              <Box w="1px" h="12px" bg="gray.300" />
              <Flex align="center" gap={1}>
                <Icon as={FiAward} color="gold.500" fontSize="12px" />
                <Text fontSize="xs" color="gray.500">
                  100% Authentic
                </Text>
              </Flex>
              <Box w="1px" h="12px" bg="gray.300" />
              <Flex align="center" gap={1}>
                <Icon as={FiHeart} color="rose.500" fontSize="12px" />
                <Text fontSize="xs" color="gray.500">
                  Trusted Store
                </Text>
              </Flex>
            </Flex>
          </Box>

          {/* Shipping Details */}
          {(order.courier_name || order.airway_bill_number) && (
            <PremiumSectionCard
              icon={FiTruck}
              title="Shipping Details"
              accent="purple.500"
              gradient="linear(to-r, purple.50, white)"
            >
              <VStack align="stretch" spacing={2}>
                {order.courier_name && (
                  <Flex justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Courier
                    </Text>
                    <Text fontSize="sm" fontWeight="600" color="gray.800">
                      {order.courier_name}
                    </Text>
                  </Flex>
                )}
                {order.airway_bill_number && (
                  <Flex justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Airway Bill
                    </Text>
                    <Text fontSize="sm" fontWeight="600" color="gray.800">
                      {order.airway_bill_number}
                    </Text>
                  </Flex>
                )}
              </VStack>
            </PremiumSectionCard>
          )}
        </VStack>
      </SimpleGrid>

      {/* ─── Footer Message ──────────────────────────────────────────────────── */}
      <Box
        mt={8}
        p={6}
        bgGradient="linear(to-r, gold.50, rose.50, white)"
        borderRadius="2xl"
        border="1px solid"
        borderColor="gold.100"
        textAlign="center"
      >
        <Icon as={FaRegSmile} fontSize="32px" color="gold.500" mb={2} />
        <Text fontWeight="700" color="gray.800">
          Thank you for shopping with us! 🎉
        </Text>
        <Text fontSize="sm" color="gray.500">
          We hope you love your purchase. We'll keep you updated on your order
          status.
        </Text>
      </Box>
    </Box>
  );
};

export default ConfirmationStep;
