import { Box, Divider, SimpleGrid, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

import ArtworkCard from "../../ArtworkCard";
import ProductCard from "../../products/components/ProductCard";
import { fetchArtworkWishlist } from "../../../redux/slices/artworkWishlistSlice";
import { fetchProductWishlist } from "../../../redux/slices/productWishlistSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: productWishlist = [] } = useSelector(
    (s) => s.productWishlist || {},
  );

  const { items: artworkWishlist = [] } = useSelector(
    (s) => s.artworkWishlist || {},
  );

  useEffect(() => {
    dispatch(fetchProductWishlist());
    dispatch(fetchArtworkWishlist());
  }, [dispatch]);

  // Separate wishlist items by type from the unified response
  // Filter out items where item_details is null (product/artwork deleted)
  const artworkItems = artworkWishlist.filter(
    (item) =>
      ["artwork", "artworkcategoryimage"].includes(item.item_type) &&
      item.item_details !== null,
  );
  const productItems = productWishlist.filter(
    (item) => item.item_type === "product" && item.item_details !== null,
  );

  /* ================= HANDLERS ================= */

  const handleSelect = (artwork, frame) => {
    const params = new URLSearchParams();
    if (artwork?.id) params.set("artworkId", artwork.id);
    if (frame?.id) params.set("frameId", frame.id);
    navigate(`/customization?${params.toString()}`);
  };

  /* ================= UI ================= */

  const isEmpty = productItems.length === 0 && artworkItems.length === 0;

  return (
    <Box w="full">
      {isEmpty ? (
        <Box
          w="full"
          py={{ base: 20, md: 32 }}
          px={{ base: 6, md: 0 }}
          textAlign="center"
          bg="gray.50"
        >
          <Text
            fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
            fontWeight="500"
            color="#D0D0D0"
            letterSpacing="-0.05em"
            fontFamily="heading"
            mb={4}
            lineHeight="1.05"
          >
            {" "}
            Your Wishlist is Empty
          </Text>
          <Text
            fontSize={{ base: "1rem", md: "1.2rem" }}
            color="#6a6a6a"
            maxW="860px"
            mx="auto"
            lineHeight="1.7"
            fontFamily="body"
          >
            {" "}
            Add your favorite artworks and products to get started
          </Text>
        </Box>
      ) : (
        <>
          {/* ================= ARTWORKS SECTION ================= */}
          {artworkItems.length > 0 && (
            <Box w="full" py={{ base: 14, md: 20 }} bg="white">
              {/* Header */}
              <Box textAlign="center" mb={10} px={{ base: 6, md: 0 }}>
                <Text
                  fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
                  fontWeight="500"
                  color="#D0D0D0"
                  letterSpacing="-0.05em"
                  fontFamily="heading"
                  mb={4}
                  lineHeight="1.05"
                >
                  Saved Artworks
                </Text>
                <Text
                  fontSize={{ base: "1rem", md: "1.2rem" }}
                  color="#6a6a6a"
                  maxW="860px"
                  mx="auto"
                  lineHeight="1.7"
                  fontFamily="body"
                >
                  {artworkItems.length} item{artworkItems.length > 1 ? "s" : ""}{" "}
                  in your collection
                </Text>
              </Box>

              {/* Cards Grid */}
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 4 }}
                spacing={8}
                maxW="1200px"
                mx="auto"
                px={{ base: 6, md: 0 }}
              >
                {artworkItems.map((item) => {
                  const artwork = item.item_details;
                  const frame = item.selected_frame;

                  return (
                    <ArtworkCard
                      key={`art-${item.id}`}
                      artwork={artwork}
                      frame={frame}
                      onSelect={handleSelect}
                      context="wishlist"
                    />
                  );
                })}
              </SimpleGrid>
            </Box>
          )}

          {/* Divider */}
          {artworkItems.length > 0 && productItems.length > 0 && <Divider />}

          {/* ================= PRODUCTS SECTION ================= */}
          {productItems.length > 0 && (
            <Box w="full" py={{ base: 14, md: 20 }} bg="white">
              {/* Header */}
              <Box textAlign="center" mb={10} px={{ base: 6, md: 0 }}>
                <Text
                  fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
                  fontWeight="500"
                  color="#D0D0D0"
                  letterSpacing="-0.05em"
                  fontFamily="heading"
                  mb={4}
                  lineHeight="1.05"
                >
                  Saved Products
                </Text>
                <Text
                  fontSize={{ base: "1rem", md: "1.2rem" }}
                  color="#6a6a6a"
                  maxW="860px"
                  mx="auto"
                  lineHeight="1.7"
                  fontFamily="body"
                >
                  {productItems.length} item{productItems.length > 1 ? "s" : ""}{" "}
                  in your collection
                </Text>
              </Box>

              {/* Cards Grid */}
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 4 }}
                spacing={8}
                maxW="1200px"
                mx="auto"
                px={{ base: 6, md: 0 }}
              >
                {productItems.map((item) => (
                  <ProductCard key={item.id} product={item.item_details} />
                ))}
              </SimpleGrid>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default WishlistPage;
