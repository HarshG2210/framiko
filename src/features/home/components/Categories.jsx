import {
  Box,
  Button,
  Center,
  Image as ChakraImage,
  Circle,
  HStack,
  Heading,
  IconButton,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import {
  clearSupportedSizes,
  fetchcategories,
  setSelectedCategoryImage,
  setSupportedSizes,
} from "../../../redux/slices/categoriesSlice";
import {
  setCropOriginalImage,
  setImageOrientation,
  setSelectedSize,
  setUploadedImage,
} from "../../../redux/slices/framePreviewSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import ArtworkDrawer from "../../categories/components/ArtworkDrawer";
import CategoryCard from "../../categories/components/CategoryCard";
import CategoryDrawer from "../../categories/components/CategoryDrawer";
import CropModal from "../../customization/components/Controls/CropModal";
import CustomDrawer from "../../categories/components/CustomDrawer";
import { fetchSizes } from "../../../redux/slices/sizesSlice";

const Categories = () => {
  const dispatch = useDispatch();

  const { artworksCategories, artworksCategoriesImage, loading, error } =
    useSelector((state) => state.categories);
  const { sizes } = useSelector((state) => state.sizes);

  const categoryDrawer = useDisclosure();
  const artworkDrawer = useDisclosure();
  const crop = useDisclosure();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryImages, setCategoryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageResolution, setImageResolution] = useState(null);

  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    dispatch(fetchcategories());
    dispatch(fetchSizes());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedImage?.image_file) return;
    const img = new Image();
    img.onload = () => {
      setImageResolution({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.src = selectedImage.image_file;
  }, [selectedImage]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 8);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 8);
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -280, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 280, behavior: "smooth" });
  };

  const handleCategoryClick = (category) => {
    const images = artworksCategoriesImage.filter(
      (img) => img.category === category.id,
    );
    setSelectedCategory(category);
    setCategoryImages(images);
    categoryDrawer.onOpen();
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    artworkDrawer.onOpen();
  };

  const handleAddToPreview = (image) => {
    try {
      let sizesArray = [];

      if (Array.isArray(image.supported_sizes)) {
        sizesArray = image.supported_sizes.map(Number);
      } else if (typeof image.supported_sizes === "string") {
        sizesArray = image.supported_sizes
          .split(",")
          .map((s) => parseInt(s.trim()));
      }

      dispatch(setSupportedSizes(sizesArray));

      dispatch(
        setUploadedImage({
          image: image.image_file || image?.image_url,
          fileName: "category-image.jpg",
          source: "artwork-category",
        }),
      );

      dispatch(
        setCropOriginalImage({
          image: image.image_file || image?.image_url,
        }),
      );

      dispatch(
        setSelectedCategoryImage({
          name: "category-image.jpg",
          preview: image.image_file || image?.image_url,
        }),
      );

      crop.onOpen();

      const img = new Image();
      img.onload = () => {
        const orientation =
          img.width > img.height
            ? "landscape"
            : img.height > img.width
              ? "portrait"
              : "square";

        dispatch(setImageOrientation(orientation));

        const supported = sizes.filter((s) => sizesArray.includes(s.id));
        if (supported.length > 0) {
          dispatch(setSelectedSize(supported[0]));
        }
      };
      img.src = image.image_file || image?.image_url;
    } catch {
      dispatch(clearSupportedSizes());
    }

    artworkDrawer.onClose();
    categoryDrawer.onClose();
  };

  const selectedSizeId = selectedImage?.supported_sizes?.[0];
  const matchedSize = sizes.find((size) => size.id === Number(selectedSizeId));

  if (loading)
    return (
      <Center w="100%" h="100%" minH="320px" borderRadius="2xl" bg="beige.50">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="neutral.200"
          color="brand.500"
          size="xl"
        />
      </Center>
    );

  if (error)
    return (
      <Box textAlign="center" py={10}>
        <Text color="red.500">{error}</Text>
      </Box>
    );

  return (
    <>
      <CropModal {...crop} />

      {/* ========== MAIN HERO SECTION (matches screenshot) ========== */}
      <Box
        bg="white"
        w="100%"
        // pt={{ base: 12, md: 16 }}
        // pb={{ base: 10, md: 14 }}
        position="relative"
        overflow="hidden"
        fontFamily="body"
        
      >
        {/* Subtle geometric accent (top right) */}
        <Box
          position="absolute"
          top={6}
          right={{ base: 4, md: 16 }}
          opacity={0.15}
          pointerEvents="none"
        >
          <svg width="120" height="90" viewBox="0 0 120 90" fill="none">
            <path
              d="M10 80 L60 10 L110 80 Z"
              stroke="#8B7355"
              strokeWidth="1.5"
            />
            <path d="M30 80 L60 30 L90 80 Z" stroke="#8B7355" strokeWidth="1" />
          </svg>
        </Box>

        <Box
          mx="auto"
          px={{ base: 5, md: 8 }}
          maxW="1400px"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
        >
          {/* Small label */}
          <Heading
            as="h2"
            fontFamily="heading"
            color="neutral.900"
            textAlign="left"
            mb={4}
          >
            Category
          </Heading>

          {/* ========== SCROLLABLE CATEGORIES ========== */}
          <Box position="relative" w="100%">
            {/* Left Arrow */}
            {showLeftArrow && (
              <IconButton
                icon={<ChevronLeftIcon boxSize={6} />}
                position="absolute"
                left={{ base: -3, md: -5 }}
                top="38%"
                transform="translateY(-50%)"
                zIndex={10}
                variant="solid"
                bg="neutral.900"
                color="white"
                borderRadius="full"
                size="md"
                boxShadow="lg"
                aria-label="Scroll left"
                onClick={scrollLeft}
               
              />
            )}

            {/* Scroll Container */}
            <Box
              ref={scrollContainerRef}
              overflowX="auto"
              overflowY="hidden"
              whiteSpace="nowrap"
              py={2}
              css={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
              onScroll={handleScroll}
            >
              <HStack
                spacing={{ base: 2, md: 14 }}
                display="inline-flex"
                pr={3}
              >
                {artworksCategories.map((cat) => {
                  const categoryImagesForCat = artworksCategoriesImage.filter(
                    (img) =>
                      Number(img.category) === Number(cat.id) ||
                      Number(img.category_id) === Number(cat.id),
                  );
                  const categoryCoverImage =
                    categoryImagesForCat[0]?.image_file ||
                    categoryImagesForCat[0]?.image_url;

                  return (
                    <VStack
                      key={cat.id}
                      spacing={2}
                      flexShrink={0}
                      cursor="pointer"
                      onClick={() => handleCategoryClick(cat)}
                      role="group"
                    >
                      <Circle
                        size={{ base: "64px", md: "72px" }}
                        bg="#F3EDE4"
                        border="1.5px solid"
                        borderColor="#D4C4A8"
                        transition="all 0.25s ease"
                        overflow="hidden"
                        _groupHover={{
                          borderColor: "#A67C52",
                          bg: "#EDE4D4",
                          transform: "scale(1.06)",
                        }}
                      >
                        {categoryCoverImage ? (
                          <ChakraImage
                            src={categoryCoverImage}
                            alt={cat.name}
                            w="100%"
                            h="100%"
                            objectFit="cover"
                          />
                        ) : (
                          <Text fontSize={{ base: "18px", md: "20px" }}>
                            {cat.name?.slice(0, 1) || "A"}
                          </Text>
                        )}
                      </Circle>

                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        color="neutral.700"
                        textAlign="center"
                        transition="color 0.2s"
                        fontFamily="body"
                        _groupHover={{ color: "brand.500" }}
                      >
                        {cat.name}
                      </Text>
                    </VStack>
                  );
                })}
              </HStack>
            </Box>

            {/* Right Arrow */}
            {showRightArrow && (
              <IconButton
                icon={<ChevronRightIcon boxSize={6} />}
                position="absolute"
                right={{ base: -3, md: -5 }}
                top="38%"
                transform="translateY(-50%)"
                zIndex={10}
                variant="solid"
                bg="neutral.900"
                color="white"
                borderRadius="full"
                size="md"
                boxShadow="lg"
                aria-label="Scroll right"
                onClick={scrollRight}
                _hover={{
                  bg: "neutral.800",
                  transform: "translateY(-50%) scale(1.08)",
                }}
                transition="all 0.2s"
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* ========== CATEGORY DRAWER ========== */}
      <CustomDrawer
        isOpen={categoryDrawer.isOpen}
        onClose={categoryDrawer.onClose}
        placement="top"
        overlayBg="whiteAlpha.800"
      >
        <Box
          bg="white"
          width="full"
          h="100%"
          display="flex"
          flexDirection="column"
          overflow="hidden"
        >
          <Box py={8} position="relative">
            <Box maxW="1200px" mx="auto" px={{ base: 6, md: 8 }}>
              <Box textAlign="center">
                <Heading
                  size={{ base: "xl", md: "2xl" }}
                  fontWeight="800"
                  fontFamily="heading"
                  color="neutral.900"
                >
                  {selectedCategory?.name}
                </Heading>
                <Text
                  mt={2}
                  color="neutral.600"
                  fontSize="lg"
                  fontFamily="body"
                >
                  {categoryImages.length} artworks curated
                </Text>
              </Box>

              <Box
                position="absolute"
                right={{ base: 4, md: 8 }}
                top="50%"
                transform="translateY(-50%)"
              >
                <Button
                  variant="solid"
                  size="sm"
                  borderRadius="full"
                  w="44px"
                  h="44px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="md"
                  onClick={categoryDrawer.onClose}
                  p={0}
                >
                  <CloseIcon boxSize={4} />
                </Button>
              </Box>
            </Box>
          </Box>

          <Box
            flex="1"
            overflowY="auto"
            css={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
            py={4}
          >
            <Box maxW="1200px" mx="auto">
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                spacing={{ base: 6, md: 8 }}
                justifyItems="center"
              >
                {categoryImages.map((image) => (
                  <Box key={`a-${image.id}`} w="full" maxW="320px">
                    <CategoryDrawer
                      image={image}
                      handleImageClick={handleImageClick}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </Box>
        </Box>
      </CustomDrawer>

      {/* ========== ARTWORK DRAWER ========== */}
      <CustomDrawer
        isOpen={artworkDrawer.isOpen}
        onClose={artworkDrawer.onClose}
        placement="right"
        overlayBg="blackAlpha.900"
      >
        <Box bg="black" color="white" w="100%" maxH="100%">
          {selectedImage && (
            <ArtworkDrawer
              isOpen={artworkDrawer.isOpen}
              onClose={artworkDrawer.onClose}
              selectedImage={selectedImage}
              matchedSize={matchedSize}
              imageResolution={imageResolution}
              handleAddToPreview={handleAddToPreview}
              handleImageClick={handleImageClick}
              selectedCategory={selectedCategory}
            />
          )}
        </Box>
      </CustomDrawer>
    </>
  );
};

export default Categories;
