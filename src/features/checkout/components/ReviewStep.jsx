import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  HStack,
  Icon,
  IconButton,
  Image,
  Progress,
  SimpleGrid,
  Spinner,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Textarea,
  Tooltip,
  VStack,
  Wrap,
  WrapItem,
  keyframes,
  useToast,
} from "@chakra-ui/react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import {
  FiArrowLeft,
  FiArrowRight,
  FiAward,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiCopy,
  FiCreditCard,
  FiDollarSign,
  FiExternalLink,
  FiGift,
  FiGlobe,
  FiHeart,
  FiImage,
  FiInfo,
  FiMap,
  FiMapPin,
  FiPackage,
  FiPercent,
  FiPhone,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTag,
  FiTruck,
  FiUser,
  FiZap,
} from "react-icons/fi";
import {
  fetchOrderDetails,
  nextStep,
  prevStep,
  setCustomerNotes,
} from "../../../redux/slices/checkoutSlice";
import { useDispatch, useSelector } from "react-redux";

import { normalizeMediaUrl } from "../../../utils/constant";
import ordersApi from "../../../services/api/ordersApi";
import { useState } from "react";

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const resolveMediaUrl = (url) => normalizeMediaUrl(url);

const fmtCurrency = (val) =>
  val !== null && val !== undefined
    ? `₹${Number(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    : "—";

/* ─── Item Type Badge ────────────────────────────────────────────────────── */
const ItemTypeBadge = ({ type }) => {
  const config = {
    artworkcategoryimage: {
      label: "Gallery Art",
      color: "purple",
      icon: FiStar,
    },
    customizedartwork: { label: "Custom Art", color: "green", icon: FiZap },
    product: { label: "Product", color: "green", icon: FiPackage },
  };
  const { label, color, icon } = config[type] || {
    label: type || "Item",
    color: "gray",
    icon: FiBox,
  };
  return (
    <Badge
      bg={`${color}.50`}
      color={`${color}.700`}
      border="1px solid"
      borderColor={`${color}.200`}
      px={3}
      py={1.5}
      borderRadius="full"
      fontSize="xs"
      fontWeight="600"
      display="flex"
      alignItems="center"
      gap={1}
    >
      <Icon as={icon} fontSize="10px" />
      {label}
    </Badge>
  );
};

/* ─── Premium Section Card ───────────────────────────────────────────────── */
const PremiumSectionCard = ({
  icon,
  title,
  subtitle,
  children,
  accent = "gold.500",
  gradient,
}) => {
  const bgGradient = gradient || "linear(to-r, gold.50, white)";

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
      mb={5}
      boxShadow="0 4px 12px rgba(0,0,0,0.05)"
      transition="all 0.3s ease"
      // _hover={{ boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        bgGradient: `linear(to-r, ${accent}, ${accent}.300)`,
        opacity: 0.6,
      }}
    >
      <Flex
        align="center"
        gap={4}
        px={6}
        py={4}
        bgGradient={bgGradient}
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Box
          bg="white"
          p={2.5}
          borderRadius="xl"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.100"
        >
          <Icon as={icon} color={accent} fontSize="20px" />
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
      <Box px={6} py={5}>
        {children}
      </Box>
    </Box>
  );
};

/* ─── Glowing Detail Row ─────────────────────────────────────────────────── */
const GlowingDetailRow = ({ label, value, even, icon }) => (
  <Flex
    bg={even ? "gray.50" : "white"}
    px={4}
    py={3}
    borderRadius="lg"
    justify="space-between"
    align="center"
    gap={4}
    transition="all 0.2s"
    _hover={{
      bg: "gold.50",
      transform: "translateX(4px)",
      borderLeftColor: "gold.400",
    }}
    borderLeft="3px solid"
    borderLeftColor={even ? "transparent" : "transparent"}
  >
    <Flex align="center" gap={2}>
      {icon && <Icon as={icon} color="gold.400" fontSize="14px" />}
      <Text
        fontSize="xs"
        color="gray.500"
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing="0.06em"
      >
        {label}
      </Text>
    </Flex>
    <Text
      fontSize="sm"
      color="gray.800"
      fontWeight="600"
      textAlign="right"
      wordBreak="break-word"
      flex={1}
    >
      {value ?? "—"}
    </Text>
  </Flex>
);

/* ─── Premium Image Card ─────────────────────────────────────────────────── */
const PremiumImageCard = ({ src, label, onCopy }) => {
  const url = resolveMediaUrl(src);
  const [isHovered, setIsHovered] = useState(false);
  if (!url) return null;

  return (
    <Box
      position="relative"
      borderRadius="xl"
      overflow="hidden"
      border="2px solid"
      borderColor="gray.200"
      transition="all 0.3s ease"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      _hover={{
        borderColor: "gold.400",
        zIndex: 2,
      }}
    >
      <Box position="relative" bg="white" p={2}>
        <Image
          src={url}
          alt={label}
          w="100%"
          h="130px"
          objectFit="contain"
          fallbackSrc="https://via.placeholder.com/150?text=No+Image"
          transition="all 0.3s ease"
          filter={isHovered ? "brightness(1.05)" : "none"}
        />
        <Badge
          position="absolute"
          top={3}
          left={3}
          bg="rgba(0,0,0,0.75)"
          color="white"
          fontSize="9px"
          px={3}
          py={1}
          borderRadius="full"
          backdropFilter="blur(8px)"
          border="1px solid rgba(255,255,255,0.1)"
        >
          {label}
        </Badge>
        {isHovered && (
          <Box
            position="absolute"
            inset={0}
            bg="rgba(0,0,0,0.3)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            backdropFilter="blur(2px)"
          >
            <IconButton
              icon={<FiExternalLink />}
              size="sm"
              variant="solid"
              colorScheme="white"
              aria-label="Open image"
              as="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              bg="white"
              color="gray.800"
              _hover={{ bg: "gold.500", color: "black" }}
            />
            <IconButton
              icon={<FiCopy />}
              size="sm"
              variant="solid"
              aria-label="Copy URL"
              onClick={() => {
                navigator.clipboard.writeText(url);
                onCopy?.();
              }}
              bg="white"
              color="gray.800"
              _hover={{ bg: "gold.500", color: "black" }}
            />
          </Box>
        )}
      </Box>
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h="2px"
        bgGradient="linear(to-r, gold.300, gold.500, gold.300)"
        opacity={isHovered ? 1 : 0}
        transition="opacity 0.3s ease"
      />
    </Box>
  );
};

/* ─── Premium Order Item ─────────────────────────────────────────────────── */
const PremiumOrderItem = ({ item, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const toast = useToast();

  const mainImage = resolveMediaUrl(
    item?.final_generated_image_url ||
      item?.preview_image_url ||
      item?.item_details?.final_image_url ||
      item?.item_details?.image_url ||
      item?.item_details?.image1_url ||
      item?.selected_frame_details?.image ||
      item?.selected_material_details?.image,
  );

  const itemTitle =
    item?.item_details?.name ||
    item?.item_details?.category ||
    item?.product_name ||
    item?.artwork_name ||
    "Item";

  const images = [
    { src: mainImage, label: "Main" },
    { src: item?.selected_frame_details?.image, label: "Frame" },
    { src: item?.selected_material_details?.image, label: "Material" },
    { src: item?.item_details?.image1_url, label: "Image 1" },
    { src: item?.item_details?.image2_url, label: "Image 2" },
    { src: item?.item_details?.image3_url, label: "Image 3" },
    { src: item?.item_details?.image4_url, label: "Image 4" },
    {
      src: item?.selected_artwork_category_image_details?.image_file,
      label: "Category",
    },
  ].filter((img) => img.src);

  const handleCopy = () => {
    toast({
      title: "✨ URL copied!",
      status: "success",
      duration: 1500,
      isClosable: true,
      position: "top-right",
    });
  };

  return (
    <Box
      position="relative"
      bg="white"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
      mb={4}
      boxShadow="0 2px 8px rgba(0,0,0,0.04)"
      transition="all 0.3s ease"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Border */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="3px"
        bgGradient="linear(to-r, gold.300, gold.500, rose.300)"
        opacity={isHovered ? 1 : 0.4}
        transition="opacity 0.3s ease"
      />

      {/* Item Header */}
      <Flex
        align="center"
        justify="space-between"
        px={5}
        py={4}
        bgGradient="linear(to-r, gray.50, white)"
        borderBottom="1px solid"
        borderColor="gray.200"
        flexWrap="wrap"
        gap={3}
      >
        <Flex align="center" gap={4}>
          <Box
            w="36px"
            h="36px"
            borderRadius="full"
            bgGradient="linear(to-r, gold.400, gold.500)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="black"
            fontWeight="800"
            fontSize="sm"
          >
            {index + 1}
          </Box>
          <Box>
            <Text fontWeight="700" fontSize="md" color="gray.800" noOfLines={1}>
              {itemTitle}
            </Text>
            <Text fontSize="xs" color="gray.500">
              ID: #{item.id || "N/A"}
            </Text>
          </Box>
        </Flex>
        <HStack spacing={2}>
          <ItemTypeBadge type={item?.item_type} />
          <Badge
            bg="blue.50"
            color="blue.700"
            px={3}
            py={1.5}
            borderRadius="full"
            border="1px solid"
            borderColor="blue.200"
          >
            <Icon as={FiShoppingBag} mr={1} fontSize="10px" />
            Qty: {item.quantity || 1}
          </Badge>
        </HStack>
      </Flex>

      <Box p={5}>
        {/* Images Grid */}
        {images.length > 0 && (
          <Box mb={5}>
            <Flex align="center" gap={2} mb={3}>
              <Icon as={FiImage} color="gold.500" />
              <Text fontSize="xs" color="gray.600" fontWeight="600">
                {images.length} Image{images.length > 1 ? "s" : ""}
              </Text>
              <Divider flex={1} borderColor="gray.200" />
            </Flex>
            <Wrap spacing={3}>
              {images.slice(0, isExpanded ? undefined : 4).map((img, idx) => (
                <WrapItem key={idx}>
                  <PremiumImageCard
                    src={img.src}
                    label={img.label}
                    onCopy={handleCopy}
                  />
                </WrapItem>
              ))}
            </Wrap>
            {images.length > 4 && (
              <Button
                variant="ghost"
                size="sm"
                color="gold.500"
                mt={3}
                onClick={() => setIsExpanded(!isExpanded)}
                rightIcon={isExpanded ? <FiArrowLeft /> : <FiArrowRight />}
                fontFamily="body"
              >
                {isExpanded ? "Show Less" : `View ${images.length - 4} More`}
              </Button>
            )}
          </Box>
        )}

        <Divider my={4} />

        {/* Pricing Summary */}
        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3} mb={4}>
          <Box
            bgGradient="linear(to-r, gray.50, white)"
            p={3.5}
            borderRadius="xl"
            textAlign="center"
            border="1px solid"
            borderColor="gray.100"
          >
            <Text fontSize="xs" color="gray.500" fontWeight="600">
              Unit Price
            </Text>
            <Text fontWeight="700" color="gray.800" fontSize="lg">
              {fmtCurrency(item.unit_price)}
            </Text>
          </Box>
          <Box
            bgGradient="linear(to-r, gray.50, white)"
            p={3.5}
            borderRadius="xl"
            textAlign="center"
            border="1px solid"
            borderColor="gray.100"
          >
            <Text fontSize="xs" color="gray.500" fontWeight="600">
              Quantity
            </Text>
            <Text fontWeight="700" color="gray.800" fontSize="lg">
              {item.quantity || 1}
            </Text>
          </Box>
          <Box
            bgGradient="linear(to-r, gold.50, white)"
            p={3.5}
            borderRadius="xl"
            textAlign="center"
            border="1px solid"
            borderColor="gold.200"
            boxShadow="0 2px 8px rgba(212, 175, 55, 0.1)"
          >
            <Text fontSize="xs" color="gold.600" fontWeight="600">
              Total
            </Text>
            <Text fontWeight="800" color="gold.600" fontSize="lg">
              {fmtCurrency(item.total_price)}
            </Text>
          </Box>
        </SimpleGrid>

        {/* Item Details Accordion */}
        <Accordion allowToggle>
          <AccordionItem border="none">
            <AccordionButton
              px={4}
              py={2.5}
              _hover={{ bg: "gold.50", borderRadius: "xl" }}
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.100"
              bg="gray.50"
            >
              <Box
                flex="1"
                textAlign="left"
                fontSize="sm"
                fontWeight="600"
                color="gray.600"
              >
                <Icon as={FiInfo} mr={2} color="gold.500" />
                View Full Specifications
              </Box>
              <AccordionIcon color="gold.500" />
            </AccordionButton>
            <AccordionPanel px={0} pb={0} pt={4}>
              <VStack spacing={1} align="stretch">
                {/* Item Details */}
                {item?.item_details && (
                  <Box>
                    <Text
                      fontSize="xs"
                      color="gold.600"
                      fontWeight="700"
                      mb={2}
                      textTransform="uppercase"
                      letterSpacing="0.08em"
                    >
                      <Icon as={FiPackage} mr={1} />
                      Item Specifications
                    </Text>
                    {[
                      ["Category", item.item_details.category],
                      ["Material", item.item_details.material],
                      ["Finish", item.item_details.finish],
                      ["Color", item.item_details.color],
                      ["Orientation", item.item_details.orientation],
                      ["Glass Type", item.item_details.glass_type],
                      ["Wall Mountable", item.item_details.wall_mountable],
                      ["Table Top", item.item_details.table_top],
                    ]
                      .filter(
                        ([, v]) =>
                          v !== null &&
                          v !== undefined &&
                          v !== "" &&
                          v !== "none",
                      )
                      .map(([label, value], i) => (
                        <GlowingDetailRow
                          key={label}
                          label={label}
                          value={
                            typeof value === "boolean"
                              ? value
                                ? "Yes ✅"
                                : "No ❌"
                              : value
                          }
                          even={i % 2 === 0}
                          icon={FiInfo}
                        />
                      ))}
                  </Box>
                )}

                {/* Size Details */}
                {item?.selected_size_details && (
                  <Box mt={3}>
                    <Text
                      fontSize="xs"
                      color="gold.600"
                      fontWeight="700"
                      mb={2}
                      textTransform="uppercase"
                      letterSpacing="0.08em"
                    >
                      <Icon as={FiMap} mr={1} />
                      Size Details
                    </Text>
                    {[
                      [
                        "Width x Height",
                        `${item.selected_size_details.width_cm} × ${item.selected_size_details.height_cm} inch`,
                      ],
                      ["Orientation", item.selected_size_details.orientation],
                    ]
                      .filter(([, v]) => v)
                      .map(([label, value], i) => (
                        <GlowingDetailRow
                          key={label}
                          label={label}
                          value={value}
                          even={i % 2 === 0}
                          icon={FiMap}
                        />
                      ))}
                  </Box>
                )}

                {/* Frame Details */}
                {item?.selected_frame_details && (
                  <Box mt={3}>
                    <Text
                      fontSize="xs"
                      color="gold.600"
                      fontWeight="700"
                      mb={2}
                      textTransform="uppercase"
                      letterSpacing="0.08em"
                    >
                      <Icon as={FiBox} mr={1} />
                      Frame Details
                    </Text>
                    {[
                      ["Name", item.selected_frame_details.name],
                      [
                        "Thickness",
                        `${item.selected_frame_details.thickness} inch`,
                      ],
                    ]
                      .filter(([, v]) => v)
                      .map(([label, value], i) => (
                        <GlowingDetailRow
                          key={label}
                          label={label}
                          value={value}
                          even={i % 2 === 0}
                          icon={FiBox}
                        />
                      ))}
                  </Box>
                )}

                {/* Material Details */}
                {item?.selected_material_details && (
                  <Box mt={3}>
                    <Text
                      fontSize="xs"
                      color="gold.600"
                      fontWeight="700"
                      mb={2}
                      textTransform="uppercase"
                      letterSpacing="0.08em"
                    >
                      <Icon as={FiTag} mr={1} />
                      Material Details
                    </Text>
                    {[
                      ["Name", item.selected_material_details.name],
                      [
                        "Description",
                        item.selected_material_details.description,
                      ],
                    ]
                      .filter(([, v]) => v)
                      .map(([label, value], i) => (
                        <GlowingDetailRow
                          key={label}
                          label={label}
                          value={value}
                          even={i % 2 === 0}
                          icon={FiTag}
                        />
                      ))}
                  </Box>
                )}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  );
};

/* ─── Main ReviewStep Component ─────────────────────────────────────────── */
const ReviewStep = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const { selectedAddress, selectedBillingAddress, customerNotes, loading } =
    useSelector((state) => state.checkout);

  const [isOrderPlacing, setIsOrderPlacing] = useState(false);

  const displayItems = Array.isArray(cartItems) ? cartItems : [];
  const subtotal = displayItems.reduce(
    (sum, i) => sum + Number(i.total_price || i.unit_price || 0),
    0,
  );
  const totalItems = displayItems.length;
  const totalQuantity = displayItems.reduce(
    (sum, i) => sum + Number(i.quantity || 1),
    0,
  );
  const shippingAmount = subtotal > 499 ? 0 : 0;
  const grandTotal = subtotal + shippingAmount;
  // const estimatedTax = Math.round(grandTotal * 0.12);
  const savings = subtotal > 499 ? 49 : 0;

  const handleCreateOrder = async () => {
    if (!selectedAddress?.id) {
      toast({
        title: "📍 No address selected",
        description: "Please go back and select a delivery address.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsOrderPlacing(true);
    try {
      // Do NOT create the final order yet. Create a Razorpay order and finalize
      // the backend order only after payment verification to avoid creating
      // orders for failed payments.
      const amountPaise = Math.round(Number(grandTotal || 0) * 100);

      // 2) Create Razorpay order on server
      const rpOrder = await ordersApi.createRazorpayOrder({
        amount: amountPaise,
        currency: "INR",
      });

      // Dynamically load Razorpay SDK if not already loaded
      const loadScript = (src) =>
        new Promise((resolve, reject) => {
          if (window.Razorpay) return resolve(true);
          const script = document.createElement("script");
          script.src = src;
          script.onload = () => resolve(true);
          script.onerror = () =>
            reject(new Error("Failed to load Razorpay SDK"));
          document.body.appendChild(script);
        });

      await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      const keyId =
        import.meta.env.VITE_RAZORPAY_KEY_ID || window.__RAZORPAY_KEY_ID;
      if (!keyId)
        throw new Error(
          "Razorpay key not configured in frontend (VITE_RAZORPAY_KEY_ID)",
        );

      const options = {
        key: keyId,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        name: "Framiko",
        description: "Order Payment",
        order_id: rpOrder.order_id,
        handler: async function (response) {
          try {
            // Finalize order on server after successful payment
            const verifyResp = await ordersApi.verifyRazorpayPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              shipping_address_id: selectedAddress.id,
              billing_address_id:
                selectedBillingAddress?.id || selectedAddress.id,
              customer_notes: customerNotes,
              payment_method: "razorpay",
            });

            const createdOrder = verifyResp.data || verifyResp;
            const serverOrderId =
              createdOrder?.id ||
              createdOrder?.order?.id ||
              createdOrder?.order_id ||
              createdOrder?.order?.order_id;

            if (serverOrderId) {
              await dispatch(fetchOrderDetails(serverOrderId));
              dispatch(nextStep());
            } else {
              toast({
                title: "Payment succeeded, but order not created",
                description: "Please contact support with your payment id",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-right",
              });
            }
          } catch (err) {
            toast({
              title: "Payment verification failed",
              description:
                err?.response?.data?.error ||
                err?.message ||
                "Could not verify payment",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });
          }
        },
        modal: {
          ondismiss: function () {
            toast({
              title: "Payment cancelled",
              description: "You closed the payment modal",
              status: "info",
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        toast({
          title: "Payment failed",
          description: resp?.error?.description || "Payment failed",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      });

      rzp.open();
    } catch (err) {
      toast({
        title: "Failed to place order",
        description: err?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsOrderPlacing(false);
    }
  };

  if (!selectedAddress) {
    return (
      <Flex direction="column" align="center" justify="center" py={20} gap={6}>
        <Box
          bg="white"
          borderRadius="2xl"
          border="2px dashed"
          borderColor="gold.300"
          p={10}
          textAlign="center"
          maxW="450px"
          boxShadow="0 8px 32px rgba(0,0,0,0.06)"
        >
          <Box
            w="80px"
            h="80px"
            borderRadius="full"
            bgGradient="linear(to-r, gold.100, gold.200)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mx="auto"
            mb={4}
          >
            <Icon as={FiMapPin} fontSize="36px" color="gold.500" />
          </Box>
          <Text
            fontSize="xl"
            fontWeight="700"
            color="gray.800"
            fontFamily="body"
          >
            No Address Selected
          </Text>
          <Text fontSize="sm" color="gray.500" mt={2} fontFamily="body">
            Please select a delivery address to continue with your order
          </Text>
          <Button
            mt={6}
            size="lg"
            variant="solid"
            leftIcon={<FiArrowLeft />}
            onClick={() => dispatch(prevStep())}
            fontFamily="body"
          >
            Go Back to Address
          </Button>
        </Box>
      </Flex>
    );
  }

  return (
    <Box position="relative">
      {/* Premium Header */}
      <Box
        mb={8}
        p={6}
        bgGradient="linear(to-r, gold.50, white, rose.50)"
        borderRadius="2xl"
        border="1px solid"
        borderColor="gold.100"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-50%"
          right="-10%"
          w="300px"
          h="300px"
          borderRadius="full"
          bgGradient="linear(to-r, gold.200, transparent)"
          opacity={0.1}
        />
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          gap={4}
        >
          <Flex align="center" gap={4}>
            <Box
              w="56px"
              h="56px"
              borderRadius="full"
              bgGradient="linear(to-r, gold.400, gold.500)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              animation={`${pulseAnimation} 2s ease-in-out infinite`}
            >
              <Icon as={FiCheckCircle} color="black" fontSize="28px" />
            </Box>
            <Box>
              <Text
                fontSize="2xl"
                fontWeight="800"
                color="gray.800"
                fontFamily="body"
              >
                Review Your Order
              </Text>
              <Text color="gray.500" fontSize="sm" fontFamily="body">
                <Icon as={FiClock} mr={1} />
                Please verify all details before placing your order
              </Text>
            </Box>
          </Flex>
          <Badge
            bgGradient="linear(to-r, gold.400, gold.500)"
            color="black"
            px={4}
            py={2.5}
            borderRadius="full"
            fontSize="md"
            fontWeight="700"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Icon as={FiShoppingBag} />
            {totalItems} {totalItems === 1 ? "Item" : "Items"}
          </Badge>
        </Flex>
      </Box>

      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={6}
        align="flex-start"
      >
        {/* ─── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <Box flex="1" minW={0}>
          {/* Delivery Address */}
          <PremiumSectionCard
            icon={FiMapPin}
            title="Delivery Address"
            subtitle="Verify your shipping details"
            accent="gold.500"
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
              <GlowingDetailRow
                label="Full Name"
                value={selectedAddress.full_name}
                even
                icon={FiUser}
              />
              <GlowingDetailRow
                label="Phone"
                value={selectedAddress.phone}
                even={false}
                icon={FiPhone}
              />
              <GlowingDetailRow
                label="Address"
                value={selectedAddress.address_line_1}
                even
                icon={FiMapPin}
              />
              {selectedAddress.address_line_2 && (
                <GlowingDetailRow
                  label="Locality"
                  value={selectedAddress.address_line_2}
                  even={false}
                  icon={FiMap}
                />
              )}
              <GlowingDetailRow
                label="City"
                value={selectedAddress.city}
                even
                icon={FiMap}
              />
              <GlowingDetailRow
                label="State"
                value={selectedAddress.state}
                even={false}
                icon={FiGlobe}
              />
              <GlowingDetailRow
                label="Country"
                value={selectedAddress.country}
                even
                icon={FiGlobe}
              />
              <GlowingDetailRow
                label="Postal Code"
                value={selectedAddress.postal_code}
                even={false}
                icon={FiMapPin}
              />
              {selectedAddress.landmark && (
                <GlowingDetailRow
                  label="Landmark"
                  value={selectedAddress.landmark}
                  even
                  icon={FiMapPin}
                />
              )}
            </SimpleGrid>
          </PremiumSectionCard>

          {/* Order Items */}
          <PremiumSectionCard
            icon={FiPackage}
            title={`Order Items`}
            subtitle={`${totalQuantity} units across ${totalItems} items`}
            accent="gold.500"
          >
            <VStack spacing={4} align="stretch">
              {displayItems.map((item, idx) => (
                <PremiumOrderItem
                  key={item.id || idx}
                  item={item}
                  index={idx}
                />
              ))}
            </VStack>
          </PremiumSectionCard>

          {/* Customer Notes */}
          <PremiumSectionCard
            icon={FiTag}
            title="Additional Notes"
            subtitle="Special instructions for delivery (optional)"
            accent="gold.400"
            gradient="linear(to-r, rose.50, white)"
          >
            <Textarea
              placeholder="Any special instructions for delivery (optional)"
              value={customerNotes}
              onChange={(e) => dispatch(setCustomerNotes(e.target.value))}
              borderRadius="xl"
              borderColor="gray.300"
              fontSize="sm"
              rows={3}
              _focus={{
                borderColor: "gold.500",
                boxShadow: "0 0 0 3px rgba(212, 175, 55, 0.2)",
              }}
              _placeholder={{ color: "gray.400" }}
              bg="white"
              transition="all 0.2s"
            />
          </PremiumSectionCard>
        </Box>

        {/* ─── RIGHT COLUMN: Premium Order Summary ────────────────────────── */}
        <Box
          w={{ base: "full", lg: "380px" }}
          flexShrink={0}
          position={{ lg: "sticky" }}
          top="24px"
        >
          <Box
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.200"
            overflow="hidden"
            boxShadow="0 8px 32px rgba(0,0,0,0.08)"
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              bgGradient: "linear(to-r, gold.300, gold.500, rose.300)",
            }}
          >
            {/* Header */}
            <Box px={6} py={5} bgGradient="linear(to-r, gray.800, gray.700)">
              <Flex align="center" justify="space-between">
                <Text
                  fontWeight="700"
                  fontSize="lg"
                  color="white"
                  fontFamily="body"
                >
                  Order Summary
                </Text>
                <Badge
                  bg="gold.500"
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                >
                  <Icon as={FiZap} mr={1} />
                  Express Checkout
                </Badge>
              </Flex>
            </Box>

            <Box px={6} py={5}>
              {/* Savings Banner */}
              {savings > 0 && (
                <Box
                  mb={4}
                  p={3}
                  bgGradient="linear(to-r, green.50, emerald.50)"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="green.200"
                  display="flex"
                  align="center"
                  gap={2}
                >
                  <Icon as={FiGift} color="green.500" fontSize="18px" />
                  <Text fontSize="sm" color="green.700" fontWeight="600">
                    You saved ₹{savings} on delivery! 🎉
                  </Text>
                </Box>
              )}

              {/* Items Count */}
              <Flex justify="space-between" mb={3}>
                <Text fontSize="sm" color="gray.600" fontFamily="body">
                  <Icon as={FiShoppingBag} mr={1} color="gold.500" />
                  Items ({totalItems})
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.800"
                  fontFamily="body"
                >
                  {totalQuantity} units
                </Text>
              </Flex>

              <Divider my={3} borderColor="gray.200" />

              {/* Pricing */}
              <VStack spacing={3} align="stretch" mb={4}>
                <Flex justify="space-between" py={1}>
                  <Text fontSize="sm" color="gray.600" fontFamily="body">
                    Subtotal
                  </Text>
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.800"
                    fontFamily="body"
                  >
                    {fmtCurrency(subtotal)}
                  </Text>
                </Flex>
                <Flex justify="space-between" py={1}>
                  <Text fontSize="sm" color="gray.600" fontFamily="body">
                    <Icon as={FiTruck} mr={1} color="gold.500" />
                    Shipping
                  </Text>
                  <Text
                    fontSize="sm"
                    fontWeight="700"
                    color={shippingAmount === 0 ? "green.500" : "gray.800"}
                    fontFamily="body"
                  >
                    {shippingAmount === 0 ? (
                      <span>
                        <Icon as={FiCheckCircle} mr={1} fontSize="12px" />
                        FREE
                      </span>
                    ) : (
                      fmtCurrency(shippingAmount)
                    )}
                  </Text>
                </Flex>
                {/* <Flex justify="space-between" py={1}>
                  <Text fontSize="sm" color="gray.600">
                    <Icon as={FiPercent} mr={1} color="gold.500" />
                    Tax (est.)
                  </Text>
                  <Text fontSize="sm" fontWeight="600" color="gray.800">
                    {fmtCurrency(estimatedTax)}
                  </Text>
                </Flex> */}
              </VStack>

              <Divider my={3} borderColor="gray.300" borderStyle="dashed" />

              {/* Grand Total */}
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="700" fontSize="lg" color="gray.800">
                  Grand Total
                </Text>
                <Box textAlign="right">
                  <Text fontWeight="800" fontSize="2xl" color="gold.600">
                    {fmtCurrency(grandTotal)}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Inclusive of all taxes
                  </Text>
                </Box>
              </Flex>

              {/* Delivery Time */}
              <Box
                mb={4}
                p={3}
                bgGradient="linear(to-r, blue.50, white)"
                borderRadius="xl"
                border="1px solid"
                borderColor="blue.200"
                display="flex"
                align="center"
                gap={3}
              >
                <Box
                  w="32px"
                  h="32px"
                  borderRadius="full"
                  bg="blue.500"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiClock} color="white" fontSize="14px" />
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="600">
                    Estimated Delivery
                  </Text>
                  <Text fontSize="sm" fontWeight="700" color="gray.800">
                    {new Date(
                      Date.now() + 5 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                    {" - "}
                    {new Date(
                      Date.now() + 7 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </Text>
                </Box>
              </Box>

              {/* Payment Method */}
              <Box
                mb={5}
                p={3.5}
                bgGradient="linear(to-r, gray.50, white)"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                transition="all 0.2s"
                _hover={{
                  borderColor: "gold.300",
                  boxShadow: "0 2px 8px rgba(212, 175, 55, 0.1)",
                }}
              >
                <Flex align="center" gap={3}>
                  <Box
                    w="40px"
                    h="40px"
                    borderRadius="full"
                    bgGradient="linear(to-r, gold.400, gold.500)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FiCreditCard} color="white" fontSize="18px" />
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="xs" color="gray.500" fontWeight="600">
                      Payment Method
                    </Text>
                    <Text fontSize="sm" fontWeight="700" color="gray.800">
                      Razorpay
                    </Text>
                  </Box>
                  <Badge
                    bg="green.50"
                    color="green.700"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                  >
                    <Icon as={FiShield} mr={1} />
                    Secure
                  </Badge>
                </Flex>
              </Box>

              {/* Action Buttons */}
              <VStack spacing={3}>
                <Button
                  w="full"
                  size="lg"
                  variant="solid"
                  rightIcon={<FiArrowRight />}
                  isLoading={isOrderPlacing || loading}
                  loadingText="Placing Order..."
                  onClick={handleCreateOrder}
                  fontFamily="body"
                >
                  <Icon as={FiZap} mr={2} />
                  Place Order
                </Button>
                <Button
                  w="full"
                  variant="outline"
                  leftIcon={<FiArrowLeft />}
                  onClick={() => dispatch(prevStep())}
                  fontFamily="body"
                >
                  Back to Address
                </Button>
              </VStack>

              {/* Trust Badges */}
              <Flex align="center" justify="center" gap={4} mt={4}>
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
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default ReviewStep;
