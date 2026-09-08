import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Box, Flex, IconButton, Image, Text, useToast } from "@chakra-ui/react";
import {
  addProductWishlist,
  fetchProductWishlist,
  removeProductWishlist,
} from "../../../redux/slices/productWishlistSlice";
import { useDispatch, useSelector } from "react-redux";

import { loadAuthData } from "../../../services/authStorage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { items: wishlist = [], loading: wishlistLoading } = useSelector(
    (s) => s.productWishlist ?? {},
  );
  const { token } = loadAuthData();
  const safeProduct = product ?? {};
  const productId = safeProduct?.id;

  useEffect(() => {
    if (token) {
      dispatch(fetchProductWishlist());
    }
  }, [dispatch, token]);

  const isWishlisted = Array.isArray(wishlist)
    ? wishlist.some((w) => w && String(w.item_id) === String(productId))
    : false;

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!token) {
      toast({
        title: "Please login to use wishlist",
        status: "warning",
        duration: 2000,
      });
      return;
    }
    if (wishlistLoading) return;
    if (!productId) {
      toast({
        title: "Product information is unavailable",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    try {
      if (isWishlisted) {
        await dispatch(removeProductWishlist(productId)).unwrap();
        toast({
          title: "Removed from wishlist",
          status: "info",
          duration: 1800,
          isClosable: true,
        });
      } else {
        await dispatch(addProductWishlist(productId)).unwrap();
        toast({
          title: "Added to wishlist",
          status: "success",
          duration: 1800,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: "Wishlist action failed",
        status: "error",
        duration: 2000,
      });
    }
  };

  // Calculate discount percentage
  const originalPrice = Number(safeProduct.price || 0);
  const discountedPrice = Number(
    safeProduct.discount_price || safeProduct.price || 0,
  );
  const discountPercent =
    originalPrice > discountedPrice
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0;

  return (
    <Box
      w="full"
      maxW="280px"
      bg="white"
      cursor="pointer"
      position="relative"
      fontFamily="body"
      onClick={() => productId && navigate(`/products/${productId}`)}
    >
      {/* ── IMAGE AREA ── */}
      <Box
        bg="neutral.100"
        borderRadius="lg"
        overflow="hidden"
        position="relative"
        h={{ base: "240px", md: "280px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={4}
      >
        <Image
          src={safeProduct.image}
          h="100%"
          w="100%"
          objectFit="cover"
          transition="transform 0.4s ease"
          _groupHover={{ transform: "scale(1.04)" }}
        />

        {/* Heart button — top left, transparent bg */}
        <IconButton
          icon={isWishlisted ? <AiFillHeart /> : <AiOutlineHeart />}
          color={isWishlisted ? "brand.500" : "neutral.400"}
          position="absolute"
          top={3}
          left={3}
          bg="transparent"
          variant="ghost"
          _hover={{
            bg: "transparent",
            color: isWishlisted ? "brand.600" : "neutral.600",
          }}
          size="sm"
          zIndex={5}
          onClick={toggleWishlist}
          aria-label="wishlist"
          isLoading={wishlistLoading}
          isDisabled={wishlistLoading}
        />
      </Box>

      {/* ── TEXT INFO ── */}
      <Box px={1}>
        {/* Product name */}
        <Text
          fontSize="sm"
          fontWeight="600"
          color="neutral.900"
          fontFamily="body"
          mb={0.5}
          noOfLines={1}
        >
          {safeProduct.name || "Product"}
        </Text>

        {/* Size */}
        <Text
          fontSize="xs"
          color="neutral.500"
          fontFamily="body"
          mb={1.5}
        >
          Size - {safeProduct.size || "N/A"}
        </Text>

        {/* Price row */}
        <Flex align="center" gap={2} flexWrap="wrap">
          <Text
            fontSize="sm"
            fontWeight="700"
            color="neutral.900"
            fontFamily="body"
          >
            ₹{discountedPrice}
          </Text>

          {discountPercent > 0 && (
            <Text
              fontSize="xs"
              color="neutral.400"
              fontFamily="body"
              textDecoration="line-through"
            >
              ₹{originalPrice}
            </Text>
          )}

          {discountPercent > 0 && (
            <Text
              fontSize="xs"
              fontWeight="600"
              color="green.500"
              fontFamily="body"
            >
              {discountPercent}% Off
            </Text>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default ProductCard;
