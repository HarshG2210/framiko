import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Progress,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Spinner,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Tooltip,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineCheckCircle,
  AiOutlineHeart,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineSafety,
  AiOutlineShareAlt,
  AiOutlineStar,
} from "react-icons/ai";
import {
  FiAward,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiPackage,
  FiPercent,
  FiRefreshCw,
  FiShield,
  FiTrendingUp,
  FiTruck,
} from "react-icons/fi";
import {
  addProductWishlist,
  fetchProductWishlist,
  removeProductWishlist,
} from "../../../redux/slices/productWishlistSlice";
import { addToCart, fetchCartItems } from "../../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import ProductReviewSection from "../../../features/reviews/components/ProductReviewSection";
import { fetchProducts } from "../../../redux/slices/productsSlice";
import { loadAuthData } from "../../../services/authStorage";
import { reviewsApi } from "../../../services/api";
import { useParams } from "react-router-dom";

/* ─── Star Row ───────────────────────────────────────────────────────────── */
const StarRow = ({
  rating = 0,
  size = "16px",
  showCount = false,
  totalCount = 0,
}) => (
  <HStack spacing="2px">
    {[1, 2, 3, 4, 5].map((i) => (
      <Icon
        key={i}
        as={i <= Math.round(rating) ? AiFillStar : AiOutlineStar}
        color={i <= Math.round(rating) ? "#F5A623" : "#D1D5DB"}
        fontSize={size}
      />
    ))}
    {showCount && (
      <Text
        ml={2}
        fontSize="sm"
        color="neutral.600"
        fontWeight="500"
        fontFamily="body"
      >
        ({totalCount})
      </Text>
    )}
  </HStack>
);

/* ─── Rating Breakdown ──────────────────────────────────────────────────── */
const RatingBar = ({ star, count, percentage }) => (
  <Flex align="center" gap={3}>
    <Text
      fontSize="sm"
      fontWeight="500"
      color="neutral.600"
      w="20px"
      fontFamily="body"
    >
      {star}
    </Text>
    <Icon as={AiFillStar} color="brand.500" fontSize="13px" />
    <Box flex="1" position="relative">
      <Box h="6px" bg="gray.200" borderRadius="full" overflow="hidden" w="100%">
        <Box
          h="100%"
          bg="linear-gradient(90deg, #F5A623, #F7B731)"
          borderRadius="full"
          w={`${percentage || 0}%`}
          transition="width 0.8s ease"
        />
      </Box>
    </Box>
    <Text
      fontSize="sm"
      color="neutral.500"
      minW="30px"
      textAlign="right"
      fontFamily="body"
    >
      {count}
    </Text>
  </Flex>
);

/* ─── Delivery Promise ──────────────────────────────────────────────────── */
const DeliveryPromise = ({ icon, title, description, delay = 0 }) => (
  <Flex
    align="center"
    gap={3}
    p={3}
    bg="white"
    borderRadius="lg"
    border="1px solid #E5E7EB"
    _hover={{ borderColor: "#F5A623", shadow: "sm" }}
    transition="all 0.2s"
    opacity={delay ? 0 : 1}
    animation={delay ? `fadeIn 0.5s ease ${delay}s forwards` : undefined}
  >
    <Box
      w="40px"
      h="40px"
      borderRadius="lg"
      bg="#FFF8ED"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      <Icon as={icon} fontSize="20px" color="#F5A623" />
    </Box>
    <Box flex="1">
      <Text
        fontSize="sm"
        fontWeight="700"
        color="neutral.800"
        fontFamily="body"
      >
        {title}
      </Text>
      <Text fontSize="xs" color="neutral.500" fontFamily="body">
        {description}
      </Text>
    </Box>
  </Flex>
);

/* ─── Product Highlight Badge ──────────────────────────────────────────── */
const HighlightBadge = ({ icon, label }) => (
  <Flex
    align="center"
    gap={2}
    bg="neutral.100"
    px={3}
    py={1.5}
    borderRadius="full"
  >
    <Icon as={icon} fontSize="14px" color="brand.500" />
    <Text fontSize="xs" fontWeight="600" color="neutral.700" fontFamily="body">
      {label}
    </Text>
  </Flex>
);

/* ══════════════════════════════════════════════════════════════════════════ */

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const toast = useToast();

  const { products = [], loading } = useSelector((s) => s.products);
  const { items: wishlist = [], loading: wishlistLoading } = useSelector(
    (s) => s.productWishlist ?? {},
  );
  const cartItems = useSelector((s) => s.cart.cartItems ?? []);
  const cartLoading = useSelector((s) => s.cart.loading);
  const { token } = loadAuthData();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isVerifyingStock, setIsVerifyingStock] = useState(false);
  const [reviewSummary, setReviewSummary] = useState({
    count: 0,
    average_rating: 0,
  });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (!products.length) dispatch(fetchProducts());
    if (token) dispatch(fetchProductWishlist());
  }, [dispatch, products.length, token]);

  const fetchProductReviews = async (productId) => {
    if (!productId) return;
    setReviewsLoading(true);
    try {
      const response = await reviewsApi.getReviews("product", productId);
      const data = response?.data ?? response;
      const normalizedReviews = Array.isArray(data)
        ? data
        : Array.isArray(data?.reviews)
          ? data.reviews
          : Array.isArray(data?.results)
            ? data.results
            : [];
      setReviews(normalizedReviews);
      setReviewSummary({
        count: Number(data?.count ?? normalizedReviews.length),
        average_rating: Number(data?.average_rating ?? data?.avg_rating ?? 0),
      });
    } catch {
      setReviews([]);
      setReviewSummary({ count: 0, average_rating: 0 });
    } finally {
      setReviewsLoading(false);
    }
  };

  const product = products.find((p) => p.id === Number(id));

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
      setIsImageLoaded(false);
      fetchProductReviews(product.id);
    }
  }, [product, token]);

  const stockQuantity = Number(product?.quantity ?? 0);
  const isOutOfStock = !product?.is_active || stockQuantity <= 0;
  const isLowStock =
    !isOutOfStock &&
    (product?.is_low_stock === true ||
      stockQuantity <= Number(product?.low_stock_threshold ?? 5));
  const stockStatusColor = isOutOfStock
    ? "#DC2626"
    : isLowStock
      ? "#DC2626"
      : "#16A34A";
  const stockStatusText = isOutOfStock
    ? "Out of Stock"
    : isLowStock
      ? `${stockQuantity} left in stock`
      : "In Stock";
  const canIncrease = quantity < stockQuantity;
  const canDecrease = quantity > 1;

  useEffect(() => {
    if (stockQuantity > 0 && quantity > stockQuantity)
      setQuantity(stockQuantity);
  }, [quantity, stockQuantity]);

  const getCartQty = (items = cartItems, pid = product?.id) => {
    const target = String(pid ?? "");
    if (!target) return 0;
    return (items || []).reduce((total, item) => {
      const ids = [
        item?.product_id,
        item?.product?.id,
        item?.item_id,
        item?.item_details?.id,
        item?.id,
      ];
      if (ids.some((c) => String(c ?? "") === target))
        return total + Number(item?.quantity ?? 0);
      return total;
    }, 0);
  };

  const handleAddToCart = async () => {
    if (!token) {
      toast({ title: "Please login to add items to cart", status: "warning" });
      return;
    }
    if (!product?.id || !product.is_active) return;

    let latestProduct = product;
    setIsVerifyingStock(true);
    let latestCart = cartItems;
    try {
      const rp = await dispatch(fetchProducts()).unwrap();
      const list = Array.isArray(rp) ? rp : rp?.products || rp?.results || [];
      const found = list.find((p) => p.id === Number(product.id));
      if (found) latestProduct = found;
      const rc = await dispatch(fetchCartItems()).unwrap();
      latestCart = rc?.items || rc?.cart_items || rc || [];
    } catch {
      toast({ title: "Couldn't verify stock", status: "error" });
      setIsVerifyingStock(false);
      return;
    }
    setIsVerifyingStock(false);

    const latestStock = Number(latestProduct?.quantity ?? 0);
    const inCart = getCartQty(latestCart);
    const remaining = Math.max(0, latestStock - inCart);

    if (!latestProduct?.is_active || latestStock <= 0) {
      toast({ title: "This product is out of stock", status: "error" });
      return;
    }
    if (remaining <= 0) {
      toast({ title: "Max quantity already in cart", status: "warning" });
      return;
    }
    if (quantity > remaining) {
      toast({ title: `Only ${remaining} more available`, status: "warning" });
      setQuantity(remaining);
      return;
    }

    try {
      await dispatch(
        addToCart({
          content_type: "product",
          product_id: Number(product.id),
          quantity: Number(quantity),
        }),
      ).unwrap();
      await dispatch(fetchCartItems()).unwrap();
      toast({
        title: "Added to cart!",
        description: `${quantity} × ${product.name} added successfully`,
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch {
      toast({ title: "Failed to add to cart", status: "error" });
    }
  };

  const isWishlisted = wishlist.some(
    (w) => String(w.item_id) === String(product?.id),
  );
  const toggleWishlist = async () => {
    if (!token) {
      toast({ title: "Please login to use wishlist", status: "warning" });
      return;
    }
    if (wishlistLoading) return;
    try {
      if (isWishlisted) {
        await dispatch(removeProductWishlist(product.id)).unwrap();
        toast({ title: "Removed from wishlist", status: "info" });
      } else {
        await dispatch(addProductWishlist(product.id)).unwrap();
        toast({ title: "Added to wishlist! ❤️", status: "success" });
      }
    } catch {
      toast({ title: "Wishlist error", status: "error" });
    }
  };

  const images = [
    product?.image,
    product?.image1,
    product?.image2,
    product?.image3,
    product?.image4,
  ].filter(Boolean);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || "Product",
          text: `Check out this product: ${product?.name || ""}`,
          url: shareUrl,
        });
        return;
      } catch {
        // fall back to clipboard copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Unable to share",
        description: "Please copy the link manually.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  const discountPercent = product?.discount_price
    ? Math.round(
        ((product.price - product.discount_price) / product.price) * 100,
      )
    : 0;

  const avgRating = reviewSummary.average_rating || 0;
  const totalCount = reviewSummary.count || 0;

  if (loading || !product) {
    return (
      <Box bg="neutral.50" minH="100vh" fontFamily="body">
        <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            <VStack align="stretch" spacing={4}>
              <Skeleton height="400px" borderRadius="xl" />
              <HStack spacing={2}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    width="70px"
                    height="70px"
                    borderRadius="lg"
                  />
                ))}
              </HStack>
            </VStack>
            <VStack align="stretch" spacing={4}>
              <Skeleton height="30px" width="60%" />
              <Skeleton height="20px" width="40%" />
              <Skeleton height="50px" width="80%" />
              <SkeletonText noOfLines={3} spacing={3} />
              <Skeleton height="100px" />
            </VStack>
          </SimpleGrid>
        </Box>
      </Box>
    );
  }

  return (
    <Box bg="white" minH="100vh" fontFamily="body">
      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* ══ LEFT: IMAGES ═══════════════════════════════════════════════ */}
          <Box>
            <Box position="sticky" top="24px">
              {/* Main Image */}
              <Box
                bg="white"
                borderRadius="xl"
                border="1px solid #E5E7EB"
                overflow="hidden"
                position="relative"
                mb={4}
                shadow="sm"
              >
                {/* Wishlist Button */}
                <IconButton
                  icon={
                    isWishlisted ? (
                      <AiFillHeart size={22} />
                    ) : (
                      <AiOutlineHeart size={22} />
                    )
                  }
                  color={isWishlisted ? "brand.500" : "neutral.400"}
                  variant="ghost"
                  position="absolute"
                  top={4}
                  right={4}
                  zIndex={10}
                  size="lg"
                  onClick={toggleWishlist}
                  isLoading={wishlistLoading}
                  aria-label="Add to wishlist"
                />

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    zIndex={10}
                    bg="rgba(0,0,0,0.75)"
                    color="white"
                    px={6}
                    py={3}
                    borderRadius="full"
                    fontSize="lg"
                    fontWeight="700"
                    backdropFilter="blur(4px)"
                  >
                    OUT OF STOCK
                  </Box>
                )}

                <Image
                  src={selectedImage}
                  alt={product.name}
                  w="100%"
                  h={{ base: "300px", md: "500px" }}
                  objectFit="contain"
                  p={6}
                  filter={
                    isOutOfStock ? "grayscale(0.3) brightness(0.9)" : "none"
                  }
                  onLoad={() => setIsImageLoaded(true)}
                  opacity={isImageLoaded ? 1 : 0}
                  transition="opacity 0.4s ease"
                />
                {!isImageLoaded && (
                  <Flex
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    align="center"
                    justify="center"
                    bg="gray.50"
                  >
                    <Spinner size="lg" color="#F5A623" />
                  </Flex>
                )}
              </Box>

              {/* Thumbnails */}
              <HStack
                spacing={2}
                overflowX="auto"
                pb={2}
                css={{
                  "&::-webkit-scrollbar": { height: "4px" },
                  "&::-webkit-scrollbar-track": { background: "#E5E7EB" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#F5A623",
                    borderRadius: "full",
                  },
                }}
              >
                {images.map((img, idx) => (
                  <Box
                    key={idx}
                    as="button"
                    flexShrink={0}
                    w="80px"
                    h="80px"
                    bg="white"
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={selectedImage === img ? "#F5A623" : "#E5E7EB"}
                    overflow="hidden"
                    onClick={() => {
                      setSelectedImage(img);
                      setIsImageLoaded(false);
                    }}
                    _hover={{ borderColor: "#F5A623" }}
                    transition="all 0.2s"
                    position="relative"
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      w="100%"
                      h="100%"
                      objectFit="contain"
                      p={1}
                    />
                    {selectedImage === img && (
                      <Box
                        position="absolute"
                        bottom="0"
                        left="0"
                        right="0"
                        h="3px"
                        bg="#F5A623"
                      />
                    )}
                  </Box>
                ))}
              </HStack>

              {/* Share Button */}
              <Button
                mt={4}
                w="full"
                variant="outline"
                border="1.5px solid"
                borderColor="neutral.200"
                color="neutral.700"
                borderRadius="lg"
                fontWeight="600"
                fontSize="sm"
                leftIcon={<AiOutlineShareAlt />}
                onClick={handleShare}
              >
                Share this product
              </Button>
            </Box>
          </Box>

          {/* ══ RIGHT: PRODUCT INFO ════════════════════════════════════════ */}
          <VStack align="stretch" spacing={4}>
            {/* ── Product Title & Ratings ── */}
            <Box
              bg="white"
              borderRadius="xl"
              border="1px solid #E5E7EB"
              p={6}
              shadow="sm"
            >
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="700"
                color="neutral.900"
                mb={2}
                lineHeight="1.3"
                fontFamily="heading"
              >
                {product.name}
              </Text>

              <Flex align="center" gap={3} flexWrap="wrap" mb={2}>
                <StarRow
                  rating={avgRating}
                  size="18px"
                  showCount
                  totalCount={totalCount}
                />
                <Text
                  fontSize="sm"
                  color="brand.600"
                  fontWeight="600"
                  fontFamily="body"
                >
                  {totalCount} ratings
                </Text>
              </Flex>

              {product.sku && (
                <Text fontSize="xs" color="gray.400">
                  SKU: {product.sku}
                </Text>
              )}
            </Box>

            {/* ── Price Section ── */}
            <Box
              bg="white"
              borderRadius="xl"
              border="1px solid #E5E7EB"
              p={6}
              shadow="sm"
            >
              <Flex align="baseline" gap={3} flexWrap="wrap">
                <Text
                  fontSize="3xl"
                  fontWeight="800"
                  color="neutral.900"
                  fontFamily="body"
                >
                  ₹
                  {Number(
                    product.discount_price || product.price,
                  ).toLocaleString("en-IN")}
                </Text>
                {product.discount_price && (
                  <>
                    <Text
                      fontSize="lg"
                      color="neutral.400"
                      textDecoration="line-through"
                      fontFamily="body"
                    >
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </Text>
                    <Badge
                      bg="#DC2626"
                      color="white"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      {discountPercent}% off
                    </Badge>
                  </>
                )}
              </Flex>

              {product.discount_price && (
                <Text
                  fontSize="sm"
                  color="green.600"
                  fontWeight="600"
                  mt={1}
                  fontFamily="body"
                >
                  You save: ₹
                  {(
                    Number(product.price) - Number(product.discount_price)
                  ).toFixed(0)}
                </Text>
              )}

              <Text fontSize="xs" color="neutral.500" mt={1} fontFamily="body">
                Inclusive of all taxes
              </Text>

              {/* Tax & Delivery Info */}
              <Flex gap={4} mt={3} flexWrap="wrap">
                <Tag size="md" bg="#EFF6FF" color="#1E40AF" borderRadius="full">
                  <TagLeftIcon as={AiOutlineCheckCircle} />
                  <TagLabel>Free Delivery</TagLabel>
                </Tag>
                <Tag size="md" bg="#F0FDF4" color="#15803D" borderRadius="full">
                  <TagLeftIcon as={FiClock} />
                  <TagLabel>In Stock</TagLabel>
                </Tag>
              </Flex>
            </Box>

            {/* ── Highlights ── */}
            {product.description && (
              <Box
                bg="white"
                borderRadius="xl"
                border="1px solid #E5E7EB"
                p={6}
                shadow="sm"
              >
                <Text fontWeight="700" color="gray.800" mb={3}>
                  About this item
                </Text>
                <Text fontSize="sm" color="gray.600" lineHeight="1.7">
                  {product.description}
                </Text>

                <Flex gap={2} mt={4} flexWrap="wrap">
                  <HighlightBadge icon={FiAward} label="Premium Quality" />
                  <HighlightBadge icon={FiTrendingUp} label="Best Seller" />
                  {discountPercent > 0 && (
                    <HighlightBadge icon={FiPercent} label="Special Price" />
                  )}
                </Flex>
              </Box>
            )}

            {/* ── Quantity & Cart ── */}
            <Box
              bg="white"
              borderRadius="xl"
              border="1px solid #E5E7EB"
              p={6}
              shadow="sm"
            >
              {/* Stock Status */}
              <Flex align="center" justify="space-between" mb={4}>
                <Text fontWeight="600" color="neutral.700" fontFamily="body">
                  Quantity
                </Text>
                {!isOutOfStock && (
                  <Flex align="center" gap={2}>
                    <Box
                      w="8px"
                      h="8px"
                      borderRadius="full"
                      bg={stockStatusColor}
                    />
                    <Text
                      fontSize="sm"
                      color={stockStatusColor}
                      fontWeight="600"
                    >
                      {stockStatusText}
                    </Text>
                  </Flex>
                )}
              </Flex>

              {/* Quantity Stepper */}
              <Flex align="center" gap={4} mb={5}>
                <Flex
                  align="center"
                  border="2px solid #E5E7EB"
                  borderRadius="lg"
                  overflow="hidden"
                  bg="white"
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    borderRadius="none"
                    isDisabled={!canDecrease || isOutOfStock}
                    onClick={() =>
                      canDecrease &&
                      !isOutOfStock &&
                      setQuantity((q) => Math.max(1, q - 1))
                    }
                    _disabled={{ opacity: 0.3, cursor: "not-allowed" }}
                    minW="44px"
                    h="44px"
                  >
                    <AiOutlineMinus />
                  </Button>
                  <Text
                    minW="52px"
                    textAlign="center"
                    fontSize="lg"
                    fontWeight="700"
                    color="gray.800"
                    borderX="2px solid #E5E7EB"
                    lineHeight="44px"
                  >
                    {quantity}
                  </Text>
                  <Button
                    size="sm"
                    variant="ghost"
                    borderRadius="none"
                    isDisabled={!canIncrease || isOutOfStock}
                    onClick={() => {
                      if (!token) {
                        toast({ title: "Please login", status: "warning" });
                        return;
                      }
                      if (canIncrease && !isOutOfStock)
                        setQuantity((q) => q + 1);
                    }}
                    _disabled={{ opacity: 0.3, cursor: "not-allowed" }}
                    minW="44px"
                    h="44px"
                  >
                    <AiOutlinePlus />
                  </Button>
                </Flex>

                {!isOutOfStock && quantity >= stockQuantity && (
                  <Text fontSize="xs" color="#F59E0B" fontWeight="600">
                    Max quantity reached
                  </Text>
                )}
              </Flex>

              {/* Action Buttons */}
              <VStack spacing={3}>
                <Button
                  w="full"
                  h="54px"
                  variant="brand"
                  borderRadius="lg"
                  fontWeight="700"
                  fontSize="md"
                  isLoading={cartLoading || isVerifyingStock}
                  loadingText={isVerifyingStock ? "Checking..." : "Adding..."}
                  isDisabled={isOutOfStock}
                  onClick={handleAddToCart}
                  _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
                  transition="all 0.2s"
                  leftIcon={<Icon as={AiOutlineCheckCircle} />}
                >
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
              </VStack>
            </Box>

            {/* ── Delivery & Returns ── */}
            <Box
              bg="white"
              borderRadius="xl"
              border="1px solid #E5E7EB"
              p={6}
              shadow="sm"
            >
              <Text fontWeight="700" color="gray.800" mb={4}>
                Delivery & Returns
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                <DeliveryPromise
                  icon={FiTruck}
                  title="Free Delivery"
                  description="No minimum order value"
                  delay={0}
                />
                <DeliveryPromise
                  icon={FiPackage}
                  title="Quick Dispatch"
                  description="Ships within 24 hours"
                  delay={0.1}
                />
                <DeliveryPromise
                  icon={FiRefreshCw}
                  title="Easy Returns"
                  description="7 days replacement policy"
                  delay={0.2}
                />
                <DeliveryPromise
                  icon={FiShield}
                  title="Secure Checkout"
                  description="Payment protection"
                  delay={0.3}
                />
              </SimpleGrid>
            </Box>

            {/* ── Specifications ── */}
            <Box
              bg="white"
              borderRadius="xl"
              border="1px solid #E5E7EB"
              overflow="hidden"
              shadow="sm"
            >
              <Accordion allowToggle defaultIndex={[0]}>
                <AccordionItem border="none">
                  <AccordionButton px={6} py={4} _hover={{ bg: "gray.50" }}>
                    <Box
                      flex="1"
                      textAlign="left"
                      fontWeight="700"
                      color="gray.800"
                    >
                      Product Specifications
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel px={6} pb={4}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      {[
                        { label: "Category", value: product.category_name },
                        { label: "Color", value: product.color },
                        { label: "Material", value: product.material },
                        { label: "Finish", value: product.finish },
                        { label: "Size", value: product.size },
                        {
                          label: "Weight",
                          value: product.weight ? `${product.weight} g` : null,
                        },
                        { label: "Orientation", value: product.orientation },
                        { label: "Glass Type", value: product.glass_type },
                        {
                          label: "Wall Mount",
                          value:
                            product.wall_mountable != null
                              ? product.wall_mountable
                                ? "Yes"
                                : "No"
                              : null,
                        },
                        {
                          label: "Table Top",
                          value:
                            product.table_top != null
                              ? product.table_top
                                ? "Yes"
                                : "No"
                              : null,
                        },
                      ]
                        .filter((r) => r.value)
                        .map((row) => (
                          <Box
                            key={row.label}
                            p={3}
                            bg="gray.50"
                            borderRadius="lg"
                          >
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              fontWeight="600"
                            >
                              {row.label}
                            </Text>
                            <Text
                              fontSize="sm"
                              color="gray.800"
                              fontWeight="500"
                              mt={1}
                            >
                              {row.value}
                            </Text>
                          </Box>
                        ))}
                    </SimpleGrid>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          </VStack>
        </SimpleGrid>

        {/* ─── Reviews Section ─── */}
        {!reviewsLoading && (
          <Box
            mt={8}
            bg="white"
            borderRadius="xl"
            border="1px solid #E5E7EB"
            p={{ base: 4, md: 8 }}
            shadow="sm"
          >
            <ProductReviewSection
              productId={product?.id}
              reviews={reviews}
              reviewSummary={reviewSummary}
              onReviewAdded={() => fetchProductReviews(product?.id)}
            />
          </Box>
        )}
      </Box>

      {/* ─── CSS Animation ─── */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
};

export default ProductDetails;
