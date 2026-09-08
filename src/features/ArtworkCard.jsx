import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Box, Flex, IconButton, Text, useToast } from "@chakra-ui/react";
import {
  addArtworkWishlist,
  fetchArtworkWishlist,
  removeArtworkWishlist,
} from "../redux/slices/artworkWishlistSlice";
import { useDispatch, useSelector } from "react-redux";

import { loadAuthData } from "../services/authStorage";
import { useEffect } from "react";
import { useFrameBorder } from "./customization/hooks/useFrameBorder";

const ArtworkCard = ({ artwork, frame, onSelect, context = "default" }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { token } = loadAuthData();

  const sizesState = useSelector((state) => state.sizes);
  const sizes = Array.isArray(sizesState)
    ? sizesState
    : (sizesState?.sizes ?? []);
  const { items: wishlist = [], loading: wishlistLoading = false } =
    useSelector((state) => state.artworkWishlist ?? {});

  useEffect(() => {
    if (token && !wishlistLoading && !wishlist.length) {
      dispatch(fetchArtworkWishlist());
    }
  }, [dispatch, token, wishlist.length, wishlistLoading]);

  const selectedSizeId = artwork?.supported_sizes?.[0];
  const matchedSize = (Array.isArray(sizes) ? sizes : []).find(
    (size) => size.id === Number(selectedSizeId),
  );

  const isWishlisted = wishlist.some(
    (w) => String(w.item_id) === String(artwork?.id),
  );

  const widthValue = Number(matchedSize?.width_cm || 18);
  const heightValue = Number(matchedSize?.height_cm || 24);
  const orientation = (matchedSize?.orientation || "").toLowerCase();

  const frameSize = (() => {
    if (!matchedSize) return { w: "180px", h: "220px" };
    const aspectRatio = widthValue / Math.max(heightValue, 1);
    if (orientation === "landscape" || aspectRatio >= 1.1)
      return { w: "240px", h: "170px" };
    if (orientation === "portrait" || aspectRatio <= 0.9)
      return { w: "170px", h: "240px" };
    return { w: "210px", h: "210px" };
  })();

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!token) {
      toast({ title: "Please login to use wishlist", status: "warning" });
      return;
    }

    try {
      if (isWishlisted) {
        await dispatch(removeArtworkWishlist(artwork.id)).unwrap();
        toast({
          title: "Removed from wishlist",
          status: "info",
          duration: 1800,
          isClosable: true,
        });
      } else {
        await dispatch(
          addArtworkWishlist({ artworkId: artwork.id, frameId: frame?.id }),
        ).unwrap();
        toast({
          title: "Added to wishlist",
          status: "success",
          duration: 1800,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: error?.message || "Wishlist action failed",
        status: "error",
        duration: 2400,
        isClosable: true,
      });
    }
  };

  const { borderWidth, borderSlice } = useFrameBorder(
    frame,
    true,
    context,
    context === "wishlist",
  );

  // Price calculation based only on size and frame price addition
  const calculatedPrice =
    Number.isFinite(widthValue) && Number.isFinite(heightValue)
      ? widthValue * heightValue * Number(frame?.price_addition || 0)
      : 0;
  const formattedCalculatedPrice = calculatedPrice.toFixed(2);

  // Size label
  const widthCm = Number(matchedSize?.width_cm || 0).toFixed(0);
  const heightCm = Number(matchedSize?.height_cm || 0).toFixed(0);
  const sizeLabel = widthCm && heightCm ? `${widthCm} X ${heightCm} inch` : "N/A";

  return (
    <Box
      bg="white"
      cursor="pointer"
      position="relative"
      transition="all 0.3s ease"
      onClick={() => onSelect(artwork, frame)}
    >
      {/* ── IMAGE AREA ── */}
      <Box
        borderRadius="lg"
        overflow="hidden"
        position="relative"
        h="280px"
        mb={4}
        bg="#F5F5F5"
      >
        {/* Heart wishlist button */}
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
          zIndex={10}
          onClick={toggleWishlist}
          aria-label="wishlist"
        />

        {frame ? (
          /* ── WITH FRAME: centered framed artwork combo ── */
          <Flex justify="center" align="center" h="100%" py={6} px={4}>
            <Box
              position="relative"
              border={`${borderWidth}px solid transparent`}
              sx={{ borderImage: `url(${frame.image}) ${borderSlice} stretch` }}
              boxShadow="0 8px 24px rgba(0,0,0,0.18)"
              w={frameSize.w}
              h={frameSize.h}
              bg="white"
              flexShrink={0}
            >
              <Box
                as="img"
                src={artwork?.image_file || artwork?.image_url}
                alt="artwork"
                w="100%"
                h="100%"
                objectFit="cover"
                draggable={false}
              />
            </Box>
          </Flex>
        ) : (
          /* ── NO FRAME: image fills the entire gray area ── */
          <Box
            as="img"
            src={artwork?.image_file || artwork?.image_url}
            alt="artwork"
            w="100%"
            h="100%"
            objectFit="cover"
            draggable={false}
          />
        )}
      </Box>

      {/* ── TEXT INFO ── */}
      <Box px={1}>
        {/* Frame name or fallback */}
        <Text
          fontSize="sm"
          fontWeight="600"
          color="neutral.900"
          fontFamily="body"
          mb={0.5}
          noOfLines={1}
        >
          {frame?.name || "Art Collection"}
        </Text>

        {/* Size */}
        <Text
          fontSize="xs"
          color="neutral.500"
          fontFamily="body"
          mb={1.5}
        >
          Size : {sizeLabel}
        </Text>

        {/* Price row */}
        <Flex align="center" gap={2} flexWrap="wrap">
          <Text
            fontSize="sm"
            fontWeight="700"
            color="neutral.900"
            fontFamily="body"
          >
            ₹{formattedCalculatedPrice}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default ArtworkCard;
