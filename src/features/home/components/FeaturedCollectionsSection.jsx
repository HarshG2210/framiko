import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";

import { FiArrowUpRight } from "react-icons/fi";
import { fetchProductCategories } from "../../../redux/slices/productCategoriesSlice";
import { fetchProducts } from "../../../redux/slices/productsSlice";
import { useNavigate } from "react-router-dom";

/* Per-card descriptions matching the Figma copy exactly */
const CARD_DESCRIPTIONS = [
  "Stylish photo frames designed to elevate your living room walls. Turn everyday moments into eye-catching décor with timeless designs.",
  "Beautiful photo frames designed to make your walls look warm and stylish. Perfect for living rooms and everyday spaces.",
  "Personalize your workspace with photo frames that inspire focus and creativity. Add warmth without losing a professional look.",
];

const FeaturedCollectionsSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productsState = useSelector((s) => s.products);
  const products = Array.isArray(productsState)
    ? productsState
    : (productsState?.products ?? []);

  const productCategoriesState = useSelector((s) => s.productCategories);
  const categories = Array.isArray(productCategoriesState)
    ? productCategoriesState
    : (productCategoriesState?.categories ?? []);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductCategories());
  }, [dispatch]);

  /* One product per unique category — max 3 */
  const featuredCollections = useMemo(() => {
    if (!products.length || !categories.length) return [];

    const usedCategories = new Set();
    const result = [];

    for (let p of products) {
      if (!usedCategories.has(p.categories)) {
        const catObj = categories.find(
          (c) => Number(c.id) === Number(p.categories),
        );
        if (catObj) {
          result.push({ product: p, category: catObj });
          usedCategories.add(p.categories);
        }
      }
      if (result.length === 3) break;
    }

    return result;
  }, [products, categories]);

  return (
    <Box
      w="full"
      bg="#fff"
      // py={{ base: 14, md: 20 }}
      px={{ base: 6, md: 12 }}
    >
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
            Featured Collections
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
        {featuredCollections.map(({ product, category }, idx) => (
          <CollectionCard
            key={product.id}
            product={product}
            category={category}
            description={CARD_DESCRIPTIONS[idx] ?? ""}
            onNavigate={() => navigate("/products")}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

/* ── INDIVIDUAL CARD ── */
const CollectionCard = ({ product, category, description, onNavigate }) => {
  return (
    <Box
      position="relative"
      borderRadius="2xl"
      overflow="hidden"
      /* Tall card — image fills most of it */
      h={{ base: "460px", md: "520px" }}
      role="group"
      boxShadow="0 8px 28px rgba(0,0,0,0.08)"
    >
      {/* ── FULL-BLEED IMAGE ── */}
      <Image src={product.image} w="100%" h="100%" objectFit="cover" />

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
        /* Frosted white overlay — matches the semi-transparent panel in the Figma */
        bg="rgba(255, 255, 255, 0.72)"
        backdropFilter="blur(0.1px)"
        px={5}
        pt={5}
        pb={5}
        zIndex={2}
      >
        {/* Category name */}
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="700"
          color="#1A1A1A"
          fontFamily="heading"
          letterSpacing="0.03em"
          mb={2}
        >
          {category.name}
        </Text>

        {/* Description */}
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

        {/* Shop Now button */}

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

export default FeaturedCollectionsSection;
