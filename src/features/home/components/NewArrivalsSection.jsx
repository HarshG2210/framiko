import { Box, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import ArtworkCard from "../../ArtworkCard";
import { fetchArtworkCategories } from "../../../redux/slices/artworkCategoriesSlice";
import { fetchArtworkCategoryImages } from "../../../redux/slices/artworkCategoryImagesSlice";
import { fetchFrames } from "../../../redux/slices/framesSlice";
import { fetchSizes } from "../../../redux/slices/sizesSlice";
import { useNavigate } from "react-router-dom";

const NewArrivalsSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const artworkCategoryImagesState = useSelector(
    (s) => s.artworkCategoryImages,
  );
  const artworkCategoryImages = Array.isArray(artworkCategoryImagesState)
    ? artworkCategoryImagesState
    : (artworkCategoryImagesState?.artworkCategoryImages ?? []);

  const framesState = useSelector((s) => s.frames);
  const frames = Array.isArray(framesState)
    ? framesState
    : (framesState?.frames ?? []);

  const artworkCategoriesState = useSelector((s) => s.artworkCategories);
  const artworkCategories = Array.isArray(artworkCategoriesState)
    ? artworkCategoriesState
    : (artworkCategoriesState?.artworkCategories ?? []);

  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchArtworkCategoryImages());
    dispatch(fetchFrames());
    dispatch(fetchArtworkCategories());
    dispatch(fetchSizes());
  }, [dispatch]);

  const displayedCategories = useMemo(() => {
    return (Array.isArray(artworkCategories) ? artworkCategories : []).slice(
      0,
      4,
    );
  }, [artworkCategories]);

  const filteredArtworks = useMemo(() => {
    if (activeCategory === "all") return artworkCategoryImages;
    return artworkCategoryImages.filter(
      (a) => String(a.category) === String(activeCategory),
    );
  }, [artworkCategoryImages, activeCategory]);

  const selectedArtworks = useMemo(() => {
    if (!filteredArtworks.length) return [];
    const shuffled = [...filteredArtworks].sort(() => 0.5 - Math.random());
    return activeCategory === "all"
      ? shuffled.slice(0, 8)
      : shuffled.slice(0, 4);
  }, [filteredArtworks, activeCategory]);

  const selectedFrames = useMemo(() => {
    if (!frames.length) return [];
    const shuffled = [...frames].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }, [frames]);

  const displayData = useMemo(() => {
    return selectedArtworks.map((art, i) => ({
      artwork: art,
      frame: selectedFrames[i % selectedFrames.length],
    }));
  }, [selectedArtworks, selectedFrames]);

  const handleSelect = (artwork, frame) => {
    const params = new URLSearchParams();
    if (artwork?.id) params.set("artworkId", artwork.id);
    if (frame?.id) params.set("frameId", frame.id);
    navigate(`/customization?${params.toString()}`);
  };

  return (
    <Box
      w="full"
      bg="#ffffff"
      // py={{ base: 14, md: 20 }}
      px={{ base: 6, md: 12 }}
    >
      {/* ── SECTION HEADER ── */}
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
          New Arrivals
        </Text>
        <Text
          fontSize={{ base: "1rem", md: "1.2rem" }}
          color="#6a6a6a"
          maxW="860px"
          mx="auto"
          lineHeight="1.7"
          fontFamily="body"
        >
          Fresh additions to inspire your space
        </Text>
      </Box>

      {/* ── CATEGORY PILLS ── */}
      <HStack
        justify="center"
        spacing={3}
        mb={10}
        flexWrap="wrap"
        px={{ base: 6, md: 0 }}
      >
        <CategoryPill
          label="All"
          isActive={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        />
        {displayedCategories.map((cat) => (
          <CategoryPill
            key={cat.id}
            label={cat.name}
            isActive={activeCategory === String(cat.id)}
            onClick={() => setActiveCategory(String(cat.id))}
          />
        ))}
      </HStack>

      {/* ── CARDS GRID ── */}
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 4 }}
        spacing={6}
        maxW="1200px"
        mx="auto"
      >
        {displayData.map((item, idx) => (
          <ArtworkCard
            key={idx}
            artwork={item.artwork}
            frame={item.frame}
            onSelect={handleSelect}
            context="trending"
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

/* ── CATEGORY PILL ── */
const CategoryPill = ({ label, isActive, onClick }) => (
  <Box
    as="button"
    px={6}
    py={2}
    borderRadius="full"
    fontWeight={isActive ? "700" : "500"}
    fontSize="sm"
    fontFamily="body"
    letterSpacing="0.02em"
    bg={isActive ? "#1A1A1A" : "white"}
    color={isActive ? "white" : "#555555"}
    border="1.5px solid"
    borderColor={isActive ? "#1A1A1A" : "#E0DEDA"}
    transition="none"
    boxShadow={isActive ? "0 4px 14px rgba(0,0,0,0.18)" : "none"}
    _hover={{
      bg: isActive ? "#1A1A1A" : "white",
      borderColor: isActive ? "#1A1A1A" : "#E0DEDA",
    }}
    _focus={{ boxShadow: "none" }}
    onClick={onClick}
  >
    {label}
  </Box>
);

export default NewArrivalsSection;
