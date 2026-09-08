import {
  Box,
  Image as ChakraImage,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import React from "react";

const CategoryCard = ({
  category,
  handleCategoryClick,
  artworksCategoriesImage,
  
}) => {
  const images = artworksCategoriesImage.filter(
    (img) => img.category === category.id
  );
  const coverImage = images[0]?.image_file;

  return (
    <VStack
      w={{ base: "140px", sm: "160px", md: "180px" }}
      h={{ base: "100px", md: "110px" }}
      spacing={2}
      px={3}
      py={2}
      borderRadius="xl"
      cursor="pointer"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: "lg",
      }}
      onClick={() => handleCategoryClick(category)}
      align="center"
      justify="center"
    >
      {/* Circular Image */}
      <Box
        w={{ base: "56px", md: "64px" }}
        h={{ base: "56px", md: "64px" }}
        borderRadius="full"
        overflow="hidden"
        boxShadow="md"
        flexShrink={0}
      >
        <ChakraImage
          src={coverImage}
          w="100%"
          h="100%"
          objectFit="cover"
          fallbackSrc="https://via.placeholder.com/64?text=Art"
        />
      </Box>

      {/* Category Name */}
      <Text
        fontWeight="600"
        fontSize={{ base: "sm", md: "md" }}
        color="neutral.800"
        textAlign="center"
        noOfLines={2}
        mt={1}
        fontFamily="body"
      >
        {category.name}
      </Text>
    </VStack>
  );
};

export default CategoryCard;
