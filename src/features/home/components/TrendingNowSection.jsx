import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";

import ArtworkCard from "../../ArtworkCard";
import { fetchArtworkCategories } from "../../../redux/slices/artworkCategoriesSlice";
import { fetchArtworkCategoryImages } from "../../../redux/slices/artworkCategoryImagesSlice";
import { fetchFrames } from "../../../redux/slices/framesSlice";
import { fetchSizes } from "../../../redux/slices/sizesSlice";
import { useNavigate } from "react-router-dom";

const TrendingNowSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { artworkCategoryImages = [] } = useSelector(
    (s) => s.artworkCategoryImages,
  );
  const { frames = [] } = useSelector((s) => s.frames);

  useEffect(() => {
    dispatch(fetchArtworkCategoryImages());
    dispatch(fetchFrames());
    dispatch(fetchArtworkCategories());
    dispatch(fetchSizes());
  }, [dispatch]);

  // Pick 4 random artworks
  const selectedArtworks = useMemo(() => {
    if (!artworkCategoryImages.length) return [];
    const shuffled = [...artworkCategoryImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [artworkCategoryImages]);

  // Pick 4 random frames
  const selectedFrames = useMemo(() => {
    if (!frames.length) return [];
    const shuffled = [...frames].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }, [frames]);

  // Combine artworks with frames
  const trendingData = useMemo(() => {
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
      py={{ base: 14, md: 20 }}
      px={{ base: 6, md: 12 }}
    >
      {/* Header */}
      <Box textAlign="center" mb={10}>
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
          Trending Now
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
          Most loved pieces from our collection
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
        {trendingData.map((item, idx) => (
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

export default TrendingNowSection;
