import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  cancelOrder,
  fetchOrderDetails,
} from "../../../redux/slices/ordersSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import OrderReviewSection from "../../../features/reviews/components/OrderReviewSection";
import { normalizeMediaUrl } from "../../../utils/constant";
import { reviewsApi } from "../../../services/api";
import { useParams } from "react-router-dom";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const resolveMediaUrl = (url) => normalizeMediaUrl(url);

const fmtDate = (val) =>
  val
    ? new Date(val).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const fmtVal = (val) => {
  if (val === null || val === undefined || val === "") return "—";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  return String(val);
};

const fmtCurrency = (val) =>
  val === null || val === undefined || val === ""
    ? "—"
    : `₹${Number(val).toLocaleString("en-IN")}`;

const paymentColor = (s) =>
  ({ paid: "green", pending: "orange", failed: "red" })[s] ?? "gray";

const orderColor = (s) =>
  ({
    delivered: "green",
    confirmed: "blue",
    cancelled: "red",
    shipped: "purple",
  })[s] ?? "gray";

const shippingColor = (s) =>
  ({ DELIVERED: "green", SHIPPED: "purple", NEW: "blue", CANCELLED: "red" })[
    s
  ] ?? "gray";

/* ─── small primitives ────────────────────────────────────────────────────── */

const InfoRow = ({ label, value, children }) => (
  <Flex
    justify="space-between"
    align="flex-start"
    py={1.5}
    gap={4}
    borderBottomWidth="1px"
    borderColor="gray.100"
  >
    <Text fontSize="sm" color="gray.500" flexShrink={0} minW="45%">
      {label}
    </Text>
    <Box fontSize="sm" fontWeight="500" color="gray.800" textAlign="right">
      {children ?? fmtVal(value)}
    </Box>
  </Flex>
);

const Card = ({ title, icon, children, ...rest }) => (
  <Box
    bg="white"
    borderRadius="2xl"
    borderWidth="1px"
    borderColor="gray.100"
    boxShadow="sm"
    overflow="hidden"
    {...rest}
  >
    {(title || icon) && (
      <Flex
        align="center"
        gap={2}
        px={5}
        py={3.5}
        borderBottomWidth="1px"
        borderColor="gray.100"
        bg="gray.50"
      >
        {icon && <Text fontSize="lg">{icon}</Text>}
        {title && (
          <Heading size="sm" color="gray.700">
            {title}
          </Heading>
        )}
      </Flex>
    )}
    <Box px={5} py={4}>
      {children}
    </Box>
  </Box>
);

/* ─── Image gallery (lightbox + thumbnails) ───────────────────────────────── */

const ItemGallery = ({ images }) => {
  const valid = images.filter((img) => resolveMediaUrl(img.src));
  const [activeIdx, setActiveIdx] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!valid.length) {
    return (
      <Flex
        w="100%"
        h="200px"
        bg="gray.50"
        borderRadius="xl"
        align="center"
        justify="center"
        borderWidth="1px"
        borderStyle="dashed"
        borderColor="gray.200"
      >
        <VStack spacing={1}>
          <Text fontSize="2xl">🖼️</Text>
          <Text fontSize="xs" color="gray.400">
            No images available
          </Text>
        </VStack>
      </Flex>
    );
  }

  const safeIdx = Math.min(activeIdx, valid.length - 1);
  const active = valid[safeIdx];

  return (
    <>
      <Box>
        {/* Main featured image */}
        <Box
          position="relative"
          w="100%"
          h={{ base: "220px", md: "280px" }}
          borderRadius="xl"
          overflow="hidden"
          bg="gray.50"
          borderWidth="2px"
          borderColor="blue.300"
          cursor="zoom-in"
          onClick={onOpen}
          mb={3}
          boxShadow="md"
        >
          <Image
            src={resolveMediaUrl(active.src)}
            alt={active.label}
            w="100%"
            h="100%"
            objectFit="contain"
            fallback={
              <Flex w="100%" h="100%" align="center" justify="center">
                <Spinner size="sm" />
              </Flex>
            }
          />
          <Badge
            position="absolute"
            top={2}
            left={2}
            colorScheme="blue"
            fontSize="xs"
            borderRadius="md"
            px={2}
            py={0.5}
          >
            {active.label}
          </Badge>
          <Badge
            position="absolute"
            top={2}
            right={2}
            bg="blackAlpha.600"
            color="white"
            fontSize="xs"
            borderRadius="md"
            px={2}
            py={0.5}
          >
            🔍 Click to enlarge
          </Badge>
        </Box>

        {/* Thumbnail strip */}
        {valid.length > 1 && (
          <Wrap spacing={2}>
            {valid.map((img, i) => {
              const isActive = i === safeIdx;
              return (
                <WrapItem key={`${img.label}-${i}`}>
                  <VStack spacing={1}>
                    <Box
                      as="button"
                      onClick={() => setActiveIdx(i)}
                      w="64px"
                      h="64px"
                      borderRadius="lg"
                      overflow="hidden"
                      borderWidth={isActive ? "3px" : "1px"}
                      borderColor={isActive ? "blue.500" : "gray.200"}
                      boxShadow={
                        isActive ? "0 0 0 2px rgba(66,153,225,0.35)" : "none"
                      }
                      transition="all 0.15s"
                      _hover={{ borderColor: "blue.300" }}
                      opacity={isActive ? 1 : 0.65}
                    >
                      <Image
                        src={resolveMediaUrl(img.src)}
                        alt={img.label}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      />
                    </Box>
                    <Text
                      fontSize="2xs"
                      fontWeight={isActive ? "700" : "400"}
                      color={isActive ? "blue.600" : "gray.400"}
                    >
                      {img.label}
                    </Text>
                  </VStack>
                </WrapItem>
              );
            })}
          </Wrap>
        )}
      </Box>

      {/* Lightbox */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
        <ModalOverlay bg="blackAlpha.900" />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" zIndex={10} />
          <ModalBody p={6}>
            <Flex direction="column" align="center" gap={4}>
              <Image
                src={resolveMediaUrl(active.src)}
                alt={active.label}
                maxH="75vh"
                maxW="90vw"
                objectFit="contain"
                borderRadius="xl"
              />
              <Text color="whiteAlpha.700" fontSize="sm">
                {active.label}
              </Text>
              {valid.length > 1 && (
                <Flex gap={2} align="center">
                  <Button
                    size="sm"
                    variant="ghost"
                    color="white"
                    _hover={{ bg: "whiteAlpha.200" }}
                    onClick={() =>
                      setActiveIdx((i) => (i - 1 + valid.length) % valid.length)
                    }
                  >
                    ←
                  </Button>
                  {valid.map((img, i) => (
                    <Box
                      key={i}
                      as="button"
                      onClick={() => setActiveIdx(i)}
                      w="48px"
                      h="48px"
                      borderRadius="md"
                      overflow="hidden"
                      borderWidth="2px"
                      borderColor={i === safeIdx ? "blue.400" : "transparent"}
                      opacity={i === safeIdx ? 1 : 0.5}
                      transition="all 0.15s"
                    >
                      <Image
                        src={resolveMediaUrl(img.src)}
                        alt={img.label}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                  <Button
                    size="sm"
                    variant="ghost"
                    color="white"
                    _hover={{ bg: "whiteAlpha.200" }}
                    onClick={() => setActiveIdx((i) => (i + 1) % valid.length)}
                  >
                    →
                  </Button>
                </Flex>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

/* ─── Status timeline ─────────────────────────────────────────────────────── */

const STEPS = [
  { key: "confirmed", label: "Confirmed", icon: "✅" },
  { key: "processing", label: "Processing", icon: "⚙️" },
  { key: "shipped", label: "Shipped", icon: "🚚" },
  { key: "delivered", label: "Delivered", icon: "📦" },
];

const StatusTimeline = ({ orderStatus, order }) => {
  const stepOrder = STEPS.map((s) => s.key);
  const currentIdx = stepOrder.indexOf(orderStatus?.toLowerCase()) ?? 0;

  return (
    <Box>
      <Flex align="center" justify="space-between" position="relative">
        {/* connector line */}
        <Box
          position="absolute"
          left="calc(12.5%)"
          right="calc(12.5%)"
          top="20px"
          h="2px"
          bg="gray.100"
          zIndex={0}
        />
        <Box
          position="absolute"
          left="calc(12.5%)"
          top="20px"
          h="2px"
          bg="blue.400"
          zIndex={1}
          transition="width 0.4s ease"
          w={
            currentIdx === 0
              ? "0%"
              : currentIdx === 1
                ? "33%"
                : currentIdx === 2
                  ? "66%"
                  : "100%"
          }
        />

        {STEPS.map((step, i) => {
          const done = i <= currentIdx;
          return (
            <VStack
              key={step.key}
              spacing={1}
              flex={1}
              position="relative"
              zIndex={2}
            >
              <Flex
                w="40px"
                h="40px"
                borderRadius="full"
                bg={done ? "blue.500" : "gray.100"}
                align="center"
                justify="center"
                fontSize="sm"
                borderWidth="2px"
                borderColor={done ? "blue.400" : "gray.200"}
                boxShadow={done ? "0 0 0 3px rgba(66,153,225,0.2)" : "none"}
                transition="all 0.3s"
              >
                {done ? (
                  step.icon
                ) : (
                  <Box w="8px" h="8px" borderRadius="full" bg="gray.300" />
                )}
              </Flex>
              <Text
                fontSize="2xs"
                fontWeight={done ? "700" : "400"}
                color={done ? "blue.600" : "gray.400"}
                textAlign="center"
              >
                {step.label}
              </Text>
            </VStack>
          );
        })}
      </Flex>

      {/* shipping/dates strip */}
      <Flex mt={5} gap={3} flexWrap="wrap">
        <Badge
          colorScheme={paymentColor(order.payment_status)}
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
        >
          💳 Payment: {fmtVal(order.payment_status)}
        </Badge>
        <Badge
          colorScheme={orderColor(order.order_status)}
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
        >
          📋 Order: {fmtVal(order.order_status)}
        </Badge>
        <Badge
          colorScheme={shippingColor(order.shipping_status)}
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
        >
          🚚 Shipping: {fmtVal(order.shipping_status)}
        </Badge>
      </Flex>
    </Box>
  );
};

/* ─── Order item card ─────────────────────────────────────────────────────── */

const OrderItemCard = ({ item, idx }) => {
  // Collect all images
  const images = [
    {
      src: item.final_generated_image_url || item.final_generated_image,
      label: "Final",
    },
    { src: item.preview_image_url || item.preview_image, label: "Preview" },
    { src: item.artwork_details?.image_url, label: "Artwork" },
    { src: item.artwork_details?.image1_url, label: "Alt 1" },
    { src: item.artwork_details?.image2_url, label: "Alt 2" },
    { src: item.artwork_details?.image3_url, label: "Alt 3" },
    { src: item.artwork_details?.image4_url, label: "Alt 4" },
    { src: item.artwork_details?.uploaded_image_url, label: "Uploaded" },
    {
      src: item.artwork_details?.user_uploaded_artwork?.image_url,
      label: "User Art",
    },
    {
      src: item.selected_artwork_category_image_details?.image_file,
      label: "Category",
    },
    { src: item.selected_frame_details?.image, label: "Frame" },
    { src: item.selected_material_details?.image, label: "Material" },
  ];

  const itemType = item.artwork_details?.type || "unknown";
  const typeColor =
    {
      product: "teal",
      customized_artwork: "purple",
      artwork_category_image: "orange",
    }[itemType] ?? "gray";
  const typeLabel =
    {
      product: "Product",
      customized_artwork: "Custom Artwork",
      artwork_category_image: "Gallery Artwork",
    }[itemType] ?? itemType;

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="gray.100"
      boxShadow="sm"
      overflow="hidden"
    >
      {/* Item header */}
      <Flex
        justify="space-between"
        align="center"
        px={5}
        py={3.5}
        bg="gray.50"
        borderBottomWidth="1px"
        borderColor="gray.100"
      >
        <HStack spacing={3}>
          <Tag colorScheme="blue" fontWeight="700" borderRadius="full">
            #{idx + 1}
          </Tag>
          <Box>
            <Text fontWeight="700" fontSize="sm" color="gray.800">
              {item.product_name || item.artwork_name || "Order Item"}
            </Text>
            {item.product_sku && (
              <Text fontSize="xs" color="gray.400" fontFamily="mono">
                SKU: {item.product_sku}
              </Text>
            )}
          </Box>
        </HStack>
        <HStack spacing={2}>
          <Badge
            colorScheme={typeColor}
            fontSize="xs"
            borderRadius="full"
            px={2}
          >
            {typeLabel}
          </Badge>
          <Badge
            colorScheme={orderColor(item.item_status)}
            fontSize="xs"
            borderRadius="full"
            px={2}
          >
            {fmtVal(item.item_status)}
          </Badge>
        </HStack>
      </Flex>

      <Box p={5}>
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(2, 1fr)",
          }}
          gap={6}
        >
          {/* Images */}
          <GridItem>
            <ItemGallery images={images} />
          </GridItem>

          {/* Details */}
          <GridItem>
            <Stack spacing={4}>
              {/* Pricing summary */}
              <SimpleGrid columns={3} gap={3}>
                {[
                  { label: "Qty", value: fmtVal(item.quantity) },
                  { label: "Unit Price", value: fmtCurrency(item.unit_price) },
                  { label: "Total", value: fmtCurrency(item.total_price) },
                ].map((stat) => (
                  <Box
                    key={stat.label}
                    bg="blue.50"
                    borderRadius="xl"
                    p={3}
                    textAlign="center"
                  >
                    <Text
                      fontSize="xs"
                      color="blue.500"
                      fontWeight="600"
                      mb={0.5}
                    >
                      {stat.label}
                    </Text>
                    <Text fontWeight="800" fontSize="sm" color="blue.700">
                      {stat.value}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>

              {/* Customization details */}
              <Box>
                {item.selected_artwork_category && (
                  <InfoRow
                    label="Artwork Category"
                    value={item.selected_artwork_category}
                  />
                )}
                {item.selected_size && (
                  <InfoRow label="Size">
                    <Text>{item.selected_size}</Text>
                    {item.selected_size_details && (
                      <Text fontSize="xs" color="gray.400">
                        {item.selected_size_details.width_cm} ×{" "}
                        {item.selected_size_details.height_cm} cm ·{" "}
                        {item.selected_size_details.orientation}
                      </Text>
                    )}
                  </InfoRow>
                )}
                {item.selected_frame && (
                  <InfoRow label="Frame">
                    <Text>{item.selected_frame}</Text>
                    {item.selected_frame_details?.description && (
                      <Text fontSize="xs" color="gray.400">
                        {item.selected_frame_details.description}
                      </Text>
                    )}
                  </InfoRow>
                )}
                {item.selected_material && (
                  <InfoRow label="Material" value={item.selected_material} />
                )}
                {item.selected_finish && (
                  <InfoRow label="Finish" value={item.selected_finish} />
                )}
                {item.selected_glass_type && (
                  <InfoRow
                    label="Glass Type"
                    value={item.selected_glass_type}
                  />
                )}
                {item.selected_orientation && (
                  <InfoRow
                    label="Orientation"
                    value={item.selected_orientation}
                  />
                )}
                {item.custom_notes && (
                  <InfoRow label="Custom Notes" value={item.custom_notes} />
                )}
              </Box>

              {/* Artwork info */}
              {item.artwork_details && (
                <Box bg="gray.50" borderRadius="xl" p={4}>
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.08em"
                    color="gray.500"
                    mb={2}
                  >
                    Artwork Info
                  </Text>
                  <InfoRow label="Name" value={item.artwork_details.name} />
                  <InfoRow label="Type" value={item.artwork_details.type} />
                  {item.artwork_details.category && (
                    <InfoRow
                      label="Category"
                      value={item.artwork_details.category}
                    />
                  )}
                  {item.artwork_details.sku && (
                    <InfoRow label="SKU" value={item.artwork_details.sku} />
                  )}
                  {item.artwork_details.is_completed !== undefined && (
                    <InfoRow
                      label="Completed"
                      value={item.artwork_details.is_completed}
                    />
                  )}

                  {/* User uploaded artwork */}
                  {item.artwork_details.user_uploaded_artwork && (
                    <Box
                      mt={3}
                      pt={3}
                      borderTopWidth="1px"
                      borderColor="gray.200"
                    >
                      <Text
                        fontSize="xs"
                        fontWeight="700"
                        color="gray.500"
                        mb={1.5}
                      >
                        User Uploaded Source
                      </Text>
                      <InfoRow
                        label="Name"
                        value={item.artwork_details.user_uploaded_artwork.name}
                      />
                      <InfoRow
                        label="Type"
                        value={item.artwork_details.user_uploaded_artwork.type}
                      />
                      <InfoRow
                        label="Is User Uploaded"
                        value={
                          item.artwork_details.user_uploaded_artwork
                            .is_user_uploaded
                        }
                      />
                    </Box>
                  )}
                </Box>
              )}

              {/* Selected category image details */}
              {item.selected_artwork_category_image_details && (
                <Box bg="orange.50" borderRadius="xl" p={4}>
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.08em"
                    color="orange.500"
                    mb={2}
                  >
                    Category Image
                  </Text>
                  <InfoRow
                    label="Description"
                    value={
                      item.selected_artwork_category_image_details.description
                    }
                  />
                  <InfoRow label="Supported Sizes">
                    {Array.isArray(
                      item.selected_artwork_category_image_details
                        .supported_sizes,
                    )
                      ? item.selected_artwork_category_image_details.supported_sizes.join(
                          ", ",
                        ) || "—"
                      : fmtVal(
                          item.selected_artwork_category_image_details
                            .supported_sizes,
                        )}
                  </InfoRow>
                </Box>
              )}

              {/* Timestamps */}
              <Box>
                <InfoRow label="Item Status">
                  <Badge colorScheme={orderColor(item.item_status)}>
                    {fmtVal(item.item_status)}
                  </Badge>
                </InfoRow>
                <InfoRow label="Created" value={fmtDate(item.created_at)} />
                <InfoRow label="Updated" value={fmtDate(item.updated_at)} />
              </Box>
            </Stack>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

/* ─── Main component ──────────────────────────────────────────────────────── */

const OrderDetails = ({ orderId, embedded = false }) => {
  const params = useParams();
  const resolvedOrderId = orderId ?? params.id;
  const dispatch = useDispatch();
  const toast = useToast();
  const { selectedOrder, loading } = useSelector((s) => s.orders);
  const [cancelling, setCancelling] = useState(false);
  const [reviewsMap, setReviewsMap] = useState({});

  useEffect(() => {
    if (!resolvedOrderId) return;
    dispatch(fetchOrderDetails(resolvedOrderId));
  }, [dispatch, resolvedOrderId]);

  const normalizeReviewContentType = (type) => {
    if (!type) return "product";
    if (type === "artwork_category_image" || type === "artworkcategoryimage") {
      return "artworkcategoryimage";
    }
    return type;
  };

  const getOrderItemObjectId = (item, contentType) => {
    const productId =
      item.product_id ||
      item.product?.id ||
      item.artwork_details?.id ||
      item.artwork_details?.product_id;
    const artworkCategoryImageId =
      item.selected_artwork_category_image_details?.id ||
      item.artwork_id ||
      item.artwork_details?.id;

    if (contentType === "product") {
      return productId;
    }

    if (contentType === "artworkcategoryimage") {
      return artworkCategoryImageId;
    }

    return productId || artworkCategoryImageId || item.id;
  };

  const fetchOrderItemReviews = async (contentType, objectId) => {
    try {
      const response = await reviewsApi.getReviews(contentType, objectId);
      const data = response?.data ?? response;
      return Array.isArray(data) ? data : data?.results || [];
    } catch (error) {
      console.error(
        `Failed to fetch reviews for ${contentType} ${objectId}:`,
        error,
      );
      return [];
    }
  };

  useEffect(() => {
    const allowedReviewTypes = ["product", "artworkcategoryimage"];
    const isDelivered =
      selectedOrder?.order_status?.toLowerCase() === "delivered";
    if (!isDelivered || !selectedOrder?.order_items) return;

    selectedOrder.order_items.forEach(async (item) => {
      const contentType = normalizeReviewContentType(
        item.artwork_details?.type,
      );
      const objectId = getOrderItemObjectId(item, contentType);
      if (!objectId || !allowedReviewTypes.includes(contentType)) return;

      const reviews = await fetchOrderItemReviews(contentType, objectId);
      setReviewsMap((prev) => ({
        ...prev,
        [`${contentType}-${objectId}`]: reviews,
      }));
    });
  }, [selectedOrder]);

  const handleCancelOrder = async () => {
    if (!resolvedOrderId) return;
    setCancelling(true);
    try {
      await dispatch(cancelOrder(resolvedOrderId)).unwrap();
      toast({
        title: "Order cancelled",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      dispatch(fetchOrderDetails(resolvedOrderId));
    } catch (err) {
      toast({
        title: "Could not cancel order",
        description: String(err),
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading || !selectedOrder) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <VStack spacing={3}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.400" fontSize="sm">
            Loading order details…
          </Text>
        </VStack>
      </Flex>
    );
  }

  const order = selectedOrder;
  const orderStatusLower = order.order_status?.toLowerCase();
  const isShipped = orderStatusLower === "shipped";
  const isCancellable = !["cancelled", "delivered", "shipped"].includes(
    orderStatusLower,
  );

  return (
    <Box maxW={embedded ? "100%" : "1100px"} mx="auto" fontFamily="body">
      {/* ── Header ── */}
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={4}
        mb={8}
      >
        <Box>
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.12em"
            textTransform="uppercase"
            color="blue.500"
            mb={1}
          >
            Order Details
          </Text>
          <Heading
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="800"
            color="gray.900"
          >
            {order.order_id}
          </Heading>
          <Text color="gray.400" fontSize="sm" mt={1}>
            Placed {fmtDate(order.created_at)} · {order.items_count} item
            {order.items_count !== 1 ? "s" : ""}
          </Text>
        </Box>

        {(isCancellable || isShipped) && (
          <Button
            variant="outline"
            borderRadius="xl"
            isLoading={cancelling}
            loadingText="Cancelling…"
            isDisabled={isShipped}
            onClick={
              isShipped
                ? () =>
                    toast({
                      title: "Cannot cancel a shipped order",
                      description:
                        "Your order is already on its way. Cancellation is not possible once shipped.",
                      status: "warning",
                      duration: 4000,
                      isClosable: true,
                    })
                : handleCancelOrder
            }
            size="md"
            _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
          >
            Cancel Order
          </Button>
        )}
        {orderStatusLower === "cancelled" && (
          <Badge
            colorScheme="red"
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
          >
            ✕ Order Cancelled
          </Badge>
        )}
        {isShipped && (
          <Badge
            colorScheme="purple"
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
          >
            🚚 Order Shipped
          </Badge>
        )}
      </Flex>

      <Stack spacing={6}>
        {/* ── Status timeline ── */}
        <Card title="Order Status" icon="📋">
          <StatusTimeline
            orderStatus={order.order_status}
            shippingStatus={order.shipping_status}
            order={order}
          />
        </Card>

        {/* ── Info grid ── */}
        <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={5}>
          {/* Shipping address */}
          <Card title="Shipping Address" icon="📍">
            <InfoRow
              label="Full Name"
              value={order.shipping_address?.full_name}
            />
            <InfoRow label="Phone" value={order.shipping_address?.phone} />
            <InfoRow
              label="Alternate Phone"
              value={order.shipping_address?.alternate_phone}
            />
            <InfoRow label="Address">
              <Text>
                {[
                  order.shipping_address?.address_line_1,
                  order.shipping_address?.address_line_2,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            </InfoRow>
            <InfoRow label="City / State">
              {order.shipping_address?.city}, {order.shipping_address?.state}
            </InfoRow>
            <InfoRow
              label="Postal Code"
              value={order.shipping_address?.postal_code}
            />
            <InfoRow label="Country" value={order.shipping_address?.country} />
            <InfoRow
              label="Landmark"
              value={order.shipping_address?.landmark}
            />
          </Card>

          {/* Payment details */}
          <Card title="Payment" icon="💳">
            <InfoRow label="Method" value={order.payment_method} />
            <InfoRow label="Status">
              <Badge
                colorScheme={paymentColor(order.payment_status)}
                borderRadius="full"
                px={2}
              >
                {fmtVal(order.payment_status)}
              </Badge>
            </InfoRow>
            <InfoRow label="Transaction ID" value={order.transaction_id} />
            <InfoRow
              label="Razorpay Order ID"
              value={order.razorpay_order_id}
            />
            <InfoRow
              label="Razorpay Payment ID"
              value={order.razorpay_payment_id}
            />
          </Card>

          {/* Tracking */}
          <Card title="Tracking & Shipping" icon="🚚">
            <InfoRow label="Shipping Status">
              <Badge
                colorScheme={shippingColor(order.shipping_status)}
                borderRadius="full"
                px={2}
              >
                {fmtVal(order.shipping_status)}
              </Badge>
            </InfoRow>
            <InfoRow
              label="Shiprocket Order ID"
              value={order.shiprocket_order_id}
            />
            <InfoRow label="Airway Bill" value={order.airway_bill_number} />
            <InfoRow label="Courier" value={order.courier_name} />
            <InfoRow label="Tracking URL">
              {order.tracking_url ? (
                <a href={order.tracking_url} target="_blank" rel="noreferrer">
                  <Text
                    as="span"
                    color="blue.500"
                    textDecor="underline"
                    fontSize="xs"
                  >
                    Track Package →
                  </Text>
                </a>
              ) : (
                "—"
              )}
            </InfoRow>
            <InfoRow label="Shipped At" value={fmtDate(order.shipped_at)} />
            <InfoRow label="Delivered At" value={fmtDate(order.delivered_at)} />
            <InfoRow label="Cancelled At" value={fmtDate(order.cancelled_at)} />
          </Card>
        </Grid>

        {/* ── Notes ── */}
        {(order.customer_notes || order.notes) && (
          <Card title="Notes" icon="📝">
            {order.customer_notes && (
              <InfoRow label="Your Note" value={order.customer_notes} />
            )}
            {order.notes && <InfoRow label="Admin Note" value={order.notes} />}
          </Card>
        )}

        {/* ── Order items ── */}
        <Box>
          <Flex align="center" gap={3} mb={4}>
            <Box h="2px" w="28px" bg="blue.400" borderRadius="full" />
            <Heading size="md" color="gray.800">
              Order Items · {order.order_items?.length ?? 0}
            </Heading>
          </Flex>
          <Stack spacing={5}>
            {order.order_items?.map((item, idx) => {
              const contentType = normalizeReviewContentType(
                item.artwork_details?.type,
              );
              const objectId = getOrderItemObjectId(item, contentType);
              const reviewKey = `${contentType}-${objectId}`;
              const itemReviews = reviewsMap[reviewKey] || [];

              return (
                <Box key={item.id ?? idx}>
                  <OrderItemCard item={item} idx={idx} />

                  {/* Review section for this item */}
                  <OrderReviewSection
                    order={order}
                    contentType={contentType}
                    objectId={objectId}
                    reviews={itemReviews}
                    onReviewAdded={() => {
                      fetchOrderItemReviews(contentType, objectId).then(
                        (reviews) => {
                          setReviewsMap((prev) => ({
                            ...prev,
                            [reviewKey]: reviews,
                          }));
                        },
                      );
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* ── Price summary ── */}
        <Card>
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap={6} alignItems="center">
            <Box>
              <InfoRow label="Subtotal" value={fmtCurrency(order.subtotal)} />
              <InfoRow label="Shipping">
                {order.shipping_amount === "0.00" || !order.shipping_amount ? (
                  <Badge colorScheme="green" borderRadius="full" px={2}>
                    Free
                  </Badge>
                ) : (
                  fmtCurrency(order.shipping_amount)
                )}
              </InfoRow>
              <Box pt={2} mt={1} borderTopWidth="1px" borderColor="gray.100">
                <Flex justify="space-between" align="center">
                  <Text fontWeight="700" color="gray.700">
                    Grand Total
                  </Text>
                  <Text fontWeight="800" fontSize="xl" color="blue.600">
                    {fmtCurrency(order.total_amount)}
                  </Text>
                </Flex>
              </Box>
            </Box>

            {/* Metadata */}
            <Box bg="gray.50" borderRadius="xl" p={4}>
              <Text
                fontSize="xs"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="0.08em"
                color="gray.400"
                mb={3}
              >
                Order Timestamps
              </Text>
              <InfoRow label="Placed" value={fmtDate(order.created_at)} />
              <InfoRow label="Updated" value={fmtDate(order.updated_at)} />
              <InfoRow label="Delivered" value={fmtDate(order.delivered_at)} />
              <InfoRow label="Cancelled" value={fmtDate(order.cancelled_at)} />
            </Box>
          </SimpleGrid>
        </Card>

        {/* ── Cancel CTA (bottom) ── */}
        {(isCancellable || isShipped) && (
          <Box
            p={5}
            bg={isShipped ? "orange.50" : "red.50"}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor={isShipped ? "orange.200" : "red.100"}
          >
            <Flex
              justify="space-between"
              align="center"
              flexWrap="wrap"
              gap={4}
            >
              <Box>
                <Text
                  fontWeight="700"
                  color={isShipped ? "orange.700" : "red.700"}
                  mb={0.5}
                >
                  {isShipped ? "Order Already Shipped" : "Need to cancel?"}
                </Text>
                <Text
                  fontSize="sm"
                  color={isShipped ? "orange.600" : "red.500"}
                >
                  {isShipped
                    ? "Your order is on its way and can no longer be cancelled. Please contact support if you have an issue."
                    : "You can cancel this order before it is shipped. Once shipped, cancellation is not available."}
                </Text>
              </Box>
              <Button
                variant={isShipped ? "solid" : "outline"}
                borderRadius="xl"
                isLoading={cancelling}
                loadingText="Cancelling…"
                isDisabled={isShipped}
                onClick={
                  isShipped
                    ? () =>
                        toast({
                          title: "Cannot cancel a shipped order",
                          description:
                            "Your order is already on its way. Cancellation is not possible once shipped.",
                          status: "warning",
                          duration: 4000,
                          isClosable: true,
                        })
                    : handleCancelOrder
                }
                _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
              >
                {isShipped ? "🚚 Already Shipped" : "Cancel Order"}
              </Button>
            </Flex>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default OrderDetails;
