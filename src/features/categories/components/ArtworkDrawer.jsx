import {
  Badge,
  Box,
  Button,
  Image as ChakraImage,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiImage, FiMaximize2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";

import ArtworkReviewSection from "../../reviews/components/ArtworkReviewSection";
import CategoryDrawer from "./CategoryDrawer";
import { CloseIcon } from "@chakra-ui/icons";
import CustomDrawer from "./CustomDrawer";
import { fetchArtworkCategories } from "../../../redux/slices/artworkCategoriesSlice";
import { fetchArtworkCategoryImages } from "../../../redux/slices/artworkCategoryImagesSlice";
import { reviewsApi } from "../../../services/api";

const ArtworkDrawer = ({
  isOpen,
  onClose,
  selectedImage,
  matchedSize,
  imageResolution,
  handleAddToPreview,
  handleImageClick,
}) => {
  const dispatch = useDispatch();

  const { artworkCategoryImages } = useSelector((s) => s.artworkCategoryImages);
  const { artworkCategories = [] } = useSelector((s) => s.artworkCategories);
  const { sizes } = useSelector((state) => state.sizes);

  const [showAllRelated, setShowAllRelated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSummary, setReviewSummary] = useState({
    count: 0,
    average_rating: 0,
  });

  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchArtworkCategoryImages());
      dispatch(fetchArtworkCategories());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (scrollRef.current && selectedImage?.id) {
      scrollRef.current.scrollTop = 0;
    }
  }, [selectedImage?.id]);

  const fetchImageReviews = async (imageId) => {
    if (!imageId) return;
    setReviewsLoading(true);
    try {
      const response = await reviewsApi.getReviews(
        "artworkcategoryimage",
        imageId,
      );
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
    } catch (error) {
      console.error("Failed to fetch artwork reviews:", error);
      setReviews([]);
      setReviewSummary({ count: 0, average_rating: 0 });
    } finally {
      setReviewsLoading(false);
    }
  };

  const selectedOrientation = useMemo(() => {
    if (!selectedImage?.supported_sizes?.length || !sizes.length) return null;
    const firstSizeId = Number(selectedImage.supported_sizes[0]);
    const sizeObj = sizes.find((s) => s.id === firstSizeId);
    return sizeObj?.orientation || null;
  }, [selectedImage, sizes]);

  useEffect(() => {
    if (selectedImage?.id) {
      fetchImageReviews(selectedImage.id);
    }
  }, [selectedImage?.id]);

  const orientationMatched = useMemo(() => {
    if (!selectedOrientation || !artworkCategoryImages?.length || !sizes.length)
      return [];
    return artworkCategoryImages.filter((art) => {
      if (!art.supported_sizes?.length) return false;
      return art.supported_sizes.some((sizeId) => {
        const sizeObj = sizes.find((s) => s.id === Number(sizeId));
        return sizeObj?.orientation === selectedOrientation;
      });
    });
  }, [artworkCategoryImages, selectedOrientation, sizes]);

  const orderedRelatedSuggestions = useMemo(() => {
    if (!selectedImage) return orientationMatched;
    const others = orientationMatched.filter(
      (art) => art.id !== selectedImage.id,
    );
    const sameCategory = others.filter(
      (art) => String(art.category) === String(selectedImage.category),
    );
    const otherCategory = others.filter(
      (art) => String(art.category) !== String(selectedImage.category),
    );
    return [...sameCategory, ...otherCategory];
  }, [orientationMatched, selectedImage]);

  const categoryName =
    artworkCategories.find((cat) => cat.id === Number(selectedImage?.category))
      ?.name || "";

  const description =
    selectedImage?.description ||
    "A stunning high-quality canvas print crafted to elevate modern interiors with timeless elegance.";

  const truncatedDescription =
    description.length > 160 ? description.slice(0, 160) + "..." : description;

  return (
    <CustomDrawer
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      overlayBg="blackAlpha.700"
    >
      <Box
        bg="#fff"
        color="black"
        w="100%"
        h="100%"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Scrollable content */}
        <Box
          ref={scrollRef}
          flex="1"
          overflowY="auto"
          css={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {/* Sticky header with close button */}
          <Box
            position="sticky"
            top={0}
            zIndex={20}
            bg="rgba(250,250,250,0.85)"
            backdropFilter="blur(12px)"
            borderBottom="1px solid"
            borderColor="blackAlpha.100"
            px={{ base: 4, md: 8 }}
            py={4}
          >
            <Flex justify="flex-end">
              <Box
                as="button"
                w="42px"
                h="42px"
                borderRadius="full"
                bg="white"
                boxShadow="0 2px 12px rgba(0,0,0,0.08)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s"
                _hover={{ bg: "gray.50", transform: "scale(1.05)" }}
                onClick={onClose}
              >
                <CloseIcon boxSize={3.5} color="gray.700" />
              </Box>
            </Flex>
          </Box>

          <Box maxW="1180px" mx="auto" px={{ base: 5, md: 8 }} pb={16}>
            {selectedImage && (
              <SimpleGrid
                columns={{ base: 1, lg: 2 }}
                spacing={{ base: 10, lg: 16 }}
                alignItems="start"
                mt={4}
              >
                {/* LEFT – Artwork Preview */}
                <Box>
                  <Box
                    bg="#F7F7F7"
                    p={{ base: 6, md: 8 }}
                    boxShadow="0 4px 24px rgba(0,0,0,0.06)"
                    border="1px solid"
                    borderColor="blackAlpha.50"
                  >
                    <Box
                      // bg="#F7F7F7"
                      p={6}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      minH={{ base: "320px", md: "420px" }}
                    >
                      <ChakraImage
                        src={
                          selectedImage.image_file || selectedImage?.image_url
                        }
                        maxH={{ base: "300px", md: "400px" }}
                        maxW="100%"
                        objectFit="cover"
                      />
                    </Box>
                  </Box>
                </Box>

                {/* RIGHT – Details */}
                <VStack align="stretch" spacing={7} pt={{ base: 0, lg: 2 }}>
                  {/* Title */}
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color="neutral.500"
                      letterSpacing="0.04em"
                      textTransform="uppercase"
                      mb={2}
                      fontFamily="body"
                    >
                      Premium Canvas Artwork
                    </Text>
                    <Heading
                      fontSize={{ base: "2xl", md: "3xl" }}
                      fontWeight="800"
                      lineHeight="1.2"
                      color="neutral.900"
                      letterSpacing="-0.02em"
                      fontFamily="body"
                    >
                      {categoryName || `Artwork #${selectedImage.id}`}
                    </Heading>
                  </Box>

                  <Divider borderColor="blackAlpha.100" />

                  {/* Description */}
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color="neutral.600"
                      mb={3}
                      fontFamily="body"
                    >
                      Description
                    </Text>
                    <Text
                      fontSize="md"
                      lineHeight="1.75"
                      color="neutral.700"
                      whiteSpace="pre-wrap"
                      fontFamily="body"
                    >
                      {isExpanded ? description : truncatedDescription}
                      {description.length > 160 && (
                        <Button
                          variant="ghost"
                          color="neutral.700"
                          fontWeight="600"
                          fontSize="md"
                          ml={1}
                          fontFamily="body"
                          onClick={() => setIsExpanded(!isExpanded)}
                          _hover={{ color: "neutral.900", bg: "transparent" }}
                          _active={{ bg: "transparent" }}
                        >
                          {isExpanded ? "Read less" : "Read more"}
                        </Button>
                      )}
                    </Text>
                  </Box>

                  <Divider borderColor="blackAlpha.100" />

                  {/* Size & Specs Card */}
                  <Box
                    bg="white"
                    borderRadius="16px"
                    p={6}
                    boxShadow="0 2px 12px rgba(0,0,0,0.04)"
                    border="1px solid"
                    borderColor="blackAlpha.50"
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color="gray.600"
                      mb={4}
                    >
                      Available Size & Specs
                    </Text>

                    {matchedSize ? (
                      <VStack align="start" spacing={3}>
                        <HStack spacing={3}>
                          <Badge
                            colorScheme="purple"
                            variant="subtle"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            textTransform="capitalize"
                          >
                            {matchedSize.orientation}
                          </Badge>
                        </HStack>

                        <HStack spacing={2} color="gray.700">
                          <Icon as={FiMaximize2} boxSize={4} />
                          <Text fontWeight="600" fontSize="lg">
                            {Number(matchedSize.width_cm).toFixed(0)} ×{" "}
                            {Number(matchedSize.height_cm).toFixed(0)} inch
                          </Text>
                        </HStack>

                        {imageResolution && (
                          <HStack spacing={2} color="gray.600">
                            <Icon as={FiImage} boxSize={4} />
                            <Text fontSize="md">
                              {imageResolution.width} × {imageResolution.height}{" "}
                              px
                            </Text>
                          </HStack>
                        )}

                        {matchedSize.price_multiplier && (
                          <Text
                            fontSize="xl"
                            fontWeight="800"
                            color="blue.600"
                            mt={1}
                          >
                            ₹{matchedSize.price_multiplier}
                          </Text>
                        )}
                      </VStack>
                    ) : (
                      <Text fontSize="sm" color="gray.500">
                        Size information not available
                      </Text>
                    )}
                  </Box>

                  {/* CTA */}
                  <Button
                    variant="solid"
                    fontFamily="body"
                    onClick={() => handleAddToPreview(selectedImage)}
                  >
                    Add to Preview
                  </Button>
                </VStack>
              </SimpleGrid>
            )}

            {/* ================= RELATED ARTWORKS ================= */}
            <Box mt={{ base: 16, md: 20 }}>
              <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="800"
                textAlign="center"
                mb={10}
                letterSpacing="-0.02em"
              >
                Related Artworks
              </Heading>

              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                spacing={{ base: 6, md: 7 }}
                justifyItems="center"
              >
                {(showAllRelated
                  ? orderedRelatedSuggestions.slice(0, 12)
                  : orderedRelatedSuggestions.slice(0, 4)
                ).map((img) => (
                  <Box key={img.id} w="100%" maxW="280px">
                    <CategoryDrawer
                      image={img}
                      handleImageClick={handleImageClick}
                    />
                  </Box>
                ))}
              </SimpleGrid>

              {orderedRelatedSuggestions.length > 4 && (
                <Flex justify="center" mt={12}>
                  <Button
                    variant="outline"
                    size="lg"
                    px={10}
                    h="52px"
                    fontFamily="body"
                    borderRadius="full"
                    fontWeight="600"
                    onClick={() => setShowAllRelated((prev) => !prev)}
                  >
                    {showAllRelated ? "View Less" : "View All"}
                  </Button>
                </Flex>
              )}
            </Box>

            {/* Reviews */}
            <Box mt={{ base: 16, md: 20 }}>
              {!reviewsLoading && (
                <ArtworkReviewSection
                  imageId={selectedImage?.id}
                  reviews={reviews}
                  reviewSummary={reviewSummary}
                  onReviewAdded={() => fetchImageReviews(selectedImage?.id)}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </CustomDrawer>
  );
};

export default ArtworkDrawer;
