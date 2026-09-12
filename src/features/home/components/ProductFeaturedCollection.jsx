import {
  Box,
  Button,
  Icon,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FiArrowUpRight } from "react-icons/fi";
import featuredImageOne from "../../../assets/images/Product_Featured_Section/P_F_S_1.png";
import featuredImageThree from "../../../assets/images/Product_Featured_Section/P_F_S_3.png";
import featuredImageTwo from "../../../assets/images/Product_Featured_Section/P_F_S_2.png";
import { useNavigate } from "react-router-dom";

const FEATURED_COLLECTIONS = [
  {
    id: 1,
    name: "Living Room Wall Décor",
    description:
      "Stylish photo frames designed to elevate your living room walls. Turn everyday moments into eye-catching décor with timeless designs.",
    image: featuredImageOne,
  },
  {
    id: 2,
    name: "Memories on Walls",
    description:
      "Beautiful photo frames designed to make your walls look warm and stylish. Perfect for living rooms and everyday spaces.",
    image: featuredImageTwo,
  },
  {
    id: 3,
    name: "Home Office Wall Décor",
    description:
      "Personalize your workspace with photo frames that inspire focus and creativity. Add warmth without losing a professional look.",
    image: featuredImageThree,
  },
];

const ProductFeaturedCollection = () => {
  const navigate = useNavigate();

  return (
    <Box w="full" bg="#fff" px={{ base: 6, md: 12 }}>
      {/* ── SECTION HEADER ── */}
      <VStack
        textAlign="center"
        mb={14}
        spacing={{ base: 8, md: 10 }}
        maxW="1200px"
        mx="auto"
      >
        <Box textAlign="center">
          <Text
            fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
            fontWeight="500"
            color="#D0D0D0"
            letterSpacing="-0.05em"
            fontFamily="heading"
            mb={4}
            lineHeight="1.05"
          >
            Product Featured Collections
          </Text>

          <Text
            fontSize={{ base: "1rem", md: "1.2rem" }}
            color="#6a6a6a"
            maxW="860px"
            mx="auto"
            lineHeight="1.7"
            fontFamily="body"
          >
            From the moment you upload your image to the final wall-ready
            preview, our seamless customization process makes framing easy and
            enjoyable.
          </Text>
        </Box>
      </VStack>

      {/* ── COLLECTION GRID ── */}
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        spacing={{ base: 8, md: 8 }}
        maxW="1200px"
        mx="auto"
      >
        {FEATURED_COLLECTIONS.map((item) => (
          <CollectionCard
            key={item.id}
            name={item.name}
            description={item.description}
            image={item.image}
            onNavigate={() => navigate("/products")}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

/* ── INDIVIDUAL CARD ── */
const CollectionCard = ({ name, description, image, onNavigate }) => {
  return (
    <Box
      position="relative"
      borderRadius="2xl"
      overflow="hidden"
      h={{ base: "460px", md: "520px" }}
      role="group"
      boxShadow="0 8px 28px rgba(0,0,0,0.08)"
    >
      {/* ── FULL-BLEED IMAGE ── */}
      <Image src={image} w="100%" h="100%" objectFit="cover" alt={name} />

      {/* ── ARROW BUTTON — top right ── */}
      <Box
        position="absolute"
        top={4}
        right={4}
        w="42px"
        h="42px"
        borderRadius="full"
        bg="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 2px 8px rgba(0,0,0,0.15)"
        zIndex={3}
        transition="background 0.2s ease"
      >
        <Icon as={FiArrowUpRight} fontSize="18px" color="#1A1A1A" />
      </Box>

      {/* ── GLASSMORPHISM BOTTOM OVERLAY ── */}
      <Box
        borderRadius="2xl"
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bg="rgba(255, 255, 255, 0.72)"
        backdropFilter="blur(0.1px)"
        px={5}
        pt={5}
        pb={5}
        zIndex={2}
      >
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="700"
          color="#1A1A1A"
          fontFamily="heading"
          letterSpacing="0.03em"
          mb={2}
        >
          {name}
        </Text>

        <Text
          fontSize="xs"
          color="gray.600"
          lineHeight="1.65"
          fontFamily="body"
          mb={4}
          noOfLines={2}
        >
          {description}
        </Text>

        <Button
          size="md"
          variant="solid"
          fontFamily="body"
          letterSpacing="0.02em"
          px={6}
          cursor="pointer"
          onClick={onNavigate}
        >
          Shop Now
        </Button>
      </Box>
    </Box>
  );
};

export default ProductFeaturedCollection;
