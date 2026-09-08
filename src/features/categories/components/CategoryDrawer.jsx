import {
  Box,
  Center,
  Image as ChakraImage,
  IconButton,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AiOutlineHeart } from "react-icons/ai";
import { fetchArtworkCategories } from "../../../redux/slices/artworkCategoriesSlice";
import { loadAuthData } from "../../../services/authStorage";

const CategoryDrawer = ({ image, handleImageClick }) => {
  const dispatch = useDispatch();
  const { token } = loadAuthData();

  const { sizes } = useSelector((state) => state.sizes);
  const { artworkCategories = [] } = useSelector((s) => s.artworkCategories);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    dispatch(fetchArtworkCategories());
  }, [dispatch, token]);

  const supportedSizeIds = image?.supported_sizes || [];
  const matchedSizes = sizes.filter((size) =>
    supportedSizeIds.includes(size.id),
  );

  const categoryName =
    artworkCategories.find((cat) => cat.id === Number(image?.category))?.name ||
    "";

  const selectedSize = matchedSizes?.[0];
  const sizeLabel =
    selectedSize && selectedSize.width_cm && selectedSize.height_cm
      ? `${Number(selectedSize.width_cm).toFixed(0)} X ${Number(
          selectedSize.height_cm,
        ).toFixed(0)} inch`
      : "N/A";

  if (isLoading) {
    return (
      <Center
        w="100%"
        h="100%"
        minH="340px"
        borderRadius="16px"
        bg="white"
        boxShadow="0 4px 20px rgba(0,0,0,0.06)"
      >
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  return (
    <Box
      w="full"
      maxW="280px"
      bg="white"
      overflow="hidden"
      cursor="pointer"
      position="relative"
      onClick={() => handleImageClick(image)}
    >
      {/* Image area */}
      <Box
        position="relative"
        bg="#F8F8F8"
        p={5}
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="260px"
      >
        {/* Framed artwork */}
        <ChakraImage
          src={image.image_file || image?.image_url }
          maxH="100%"
          maxW="100%"
          h="auto"
          w="auto"
          objectFit="contain"
          objectPosition="center"
          display="block"
        />
      </Box>

      {/* Text info */}
      <Box>
        <Text
          fontSize="16px"
          fontWeight="700"
          color="neutral.900"
          fontFamily="body"
          noOfLines={1}
          mt={3}
          mb={1}
        >
          {categoryName || `Category #${image.id}`}
        </Text>

        <Text fontSize="14px" color="neutral.600" fontFamily="body">
          Size - {sizeLabel}
        </Text>
      </Box>
    </Box>
  );
};

export default CategoryDrawer;
