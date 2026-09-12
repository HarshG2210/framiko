import { AnimatePresence, motion } from "framer-motion";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  Skeleton,
  SkeletonText,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { productsApi, reviewsApi } from "../../../services/api";
import { useEffect, useState } from "react";

const MotionBox = motion(Box);

const ClientStoriesSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const productsRes = await productsApi.fetchProducts().catch(() => []);
        const products = Array.isArray(productsRes)
          ? productsRes
          : productsRes?.results || productsRes?.data || [];
        const productSlice = Array.isArray(products)
          ? products.slice(0, 8)
          : [];

        const productReviewPromises = productSlice.map((p) =>
          reviewsApi
            .getReviews("product", p.id)
            .then((data) => ({ data, meta: { type: "product", object: p } }))
            .catch(() => ({
              data: null,
              meta: { type: "product", object: p },
            })),
        );

        const responses = await Promise.all(productReviewPromises);
        const allReviews = [];
        responses.forEach((res) => {
          const data = res.data;
          const normalized = Array.isArray(data)
            ? data
            : Array.isArray(data?.reviews)
              ? data.reviews
              : Array.isArray(data?.results)
                ? data.results
                : [];
          normalized.forEach((rv) => {
            allReviews.push({
              ...rv,
              _source_type: "product",
              _source_object: res.meta.object,
            });
          });
        });

        allReviews.sort((a, b) => {
          const ta = new Date(a.created_at || a.created || 0).getTime();
          const tb = new Date(b.created_at || b.created || 0).getTime();
          return tb - ta;
        });

        if (!mounted) return;
        setReviews(allReviews);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        if (!mounted) return;
        setReviews([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => {
      mounted = false;
    };
  }, []);

  const total = reviews.length;

  const goNext = () => {
    setDirection(1);
    setPage((p) => (p + 1) % total);
  };

  const goPrev = () => {
    setDirection(-1);
    setPage((p) => (p - 1 + total) % total);
  };

  // Auto-advance every 1.5 seconds
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setPage((p) => (p + 1) % total);
    }, 2500);
    return () => clearInterval(timer);
  }, [total]);

  const review = reviews[page] || null;

  const Stars = ({ rating = 0 }) => (
    <HStack spacing={0.5}>
      {[...Array(5)].map((_, i) => (
        <Text
          key={i}
          fontSize="lg"
          color={i < rating ? "#C9AB7E" : "#E0DEDA"}
          lineHeight="1"
        >
          ★
        </Text>
      ))}
    </HStack>
  );

  return (
    <Box
      w="full"
      bg="#ffffff"
      py={{ base: 14, md: 20 }}
      px={{ base: 6, md: 12 }}
    >
      <Box maxW="800px" mx="auto" px={{ base: 6, md: 10 }}>
        {/* SECTION HEADER */}
        <VStack spacing={3} textAlign="center" mb={14}>
          <Text
            fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
            fontWeight="500"
            color="#D0D0D0"
            letterSpacing="-0.05em"
            fontFamily="heading"
            mb={4}
            lineHeight="1.05"
          >
            Client Stories
          </Text>
          <Text
            fontSize={{ base: "1rem", md: "1.2rem" }}
            color="#6a6a6a"
            maxW="860px"
            mx="auto"
            lineHeight="1.7"
            fontFamily="body"
          >
            Honest reviews from customers across our products
          </Text>
        </VStack>

        {/* CARD AREA */}
        {loading ? (
          <Box bg="#F7F5F1" borderRadius="2xl" p={{ base: 8, md: 12 }}>
            <Flex gap={5} align="flex-start" mb={6}>
              <Skeleton
                height="64px"
                width="64px"
                borderRadius="full"
                flexShrink={0}
              />
              <Box flex={1}>
                <Skeleton height="16px" width="35%" mb={3} />
                <Skeleton height="12px" width="20%" />
              </Box>
            </Flex>
            <SkeletonText noOfLines={4} spacing="4" />
          </Box>
        ) : review ? (
          <Box position="relative" overflow="hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <MotionBox
                key={page}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                bg="#FBF9F7"
                borderRadius="2xl"
                p={{ base: 8, md: 12 }}
                position="relative"
              >
                {/* Large decorative quote */}
                <Text
                  position="absolute"
                  top={4}
                  right={8}
                  fontSize="120px"
                  lineHeight="1"
                  color="#E8E4DE"
                  fontFamily="heading"
                  userSelect="none"
                  pointerEvents="none"
                >
                  "
                </Text>

                {/* Stars */}
                <Stars rating={review.rating || 0} />

                {/* Review title */}
                {review.title && (
                  <Text
                    mt={4}
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="700"
                    color="#1A1A1A"
                    fontFamily="heading"
                    letterSpacing="0.03em"
                    lineHeight="1.3"
                  >
                    {review.title}
                  </Text>
                )}

                {/* Comment */}
                <Text
                  mt={3}
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.600"
                  fontFamily="body"
                  lineHeight="1.85"
                >
                  {review.comment}
                </Text>

                {/* Divider */}
                <Box mt={8} mb={6} h="1px" bg="#E0DEDA" />

                {/* Author row */}
                <Flex
                  align="center"
                  justify="space-between"
                  flexWrap="wrap"
                  gap={3}
                >
                  <Flex align="center" gap={4}>
                    <Avatar
                      size="md"
                      name={review.user?.username || "User"}
                      src={review.user?.profile_picture || ""}
                      bg="#C9AB7E"
                      color="white"
                    />
                    <Box>
                      <Text
                        fontWeight="700"
                        fontSize="sm"
                        color="#1A1A1A"
                        fontFamily="body"
                      >
                        {review.user?.username || "Anonymous"}
                      </Text>
                      <Text fontSize="xs" color="gray.400" fontFamily="body">
                        {new Date(
                          review.created_at || review.created || Date.now(),
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Text>
                    </Box>
                  </Flex>

                  {review._source_object && (
                    <Box
                      as="button"
                      px={4}
                      py={1.5}
                      borderRadius="full"
                      border="1.5px solid #E0DEDA"
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.500"
                      fontFamily="body"
                      transition="none"
                      _hover={{ borderColor: "#C9AB7E", color: "#C9AB7E" }}
                      onClick={() =>
                        window.open(
                          `/products/${review._source_object.id}`,
                          "_blank",
                        )
                      }
                    >
                      View Product →
                    </Box>
                  )}
                </Flex>
              </MotionBox>
            </AnimatePresence>
          </Box>
        ) : (
          <Box bg="#F7F5F1" borderRadius="2xl" p={12} textAlign="center">
            <Text color="gray.400" fontFamily="body">
              No reviews yet.
            </Text>
          </Box>
        )}

        {/* PAGINATION */}
        {total > 1 && (
          <Flex mt={10} align="center" justify="center" gap={6}>
            <Box
              as="button"
              w="44px"
              h="44px"
              borderRadius="full"
              border="1.5px solid #1A1A1A"
              bg="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="#1A1A1A"
              cursor="pointer"
              transition="all 0.2s ease"
              _hover={{ bg: "#1A1A1A", color: "white" }}
              onClick={goPrev}
              aria-label="Previous"
            >
              <FiChevronLeft size={18} />
            </Box>

            {/* Dot indicators */}
            <HStack spacing={2}>
              {reviews.map((_, i) => (
                <Box
                  key={i}
                  as="button"
                  w={i === page ? "24px" : "8px"}
                  h="8px"
                  borderRadius="full"
                  bg={i === page ? "#1A1A1A" : "#E0DEDA"}
                  transition="all 0.3s ease"
                  onClick={() => {
                    setDirection(i > page ? 1 : -1);
                    setPage(i);
                  }}
                  aria-label={`Review ${i + 1}`}
                />
              ))}
            </HStack>

            <Box
              as="button"
              w="44px"
              h="44px"
              borderRadius="full"
              border="1.5px solid #1A1A1A"
              bg="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="#1A1A1A"
              cursor="pointer"
              transition="all 0.2s ease"
              _hover={{ bg: "#1A1A1A", color: "white" }}
              onClick={goNext}
              aria-label="Next"
            >
              <FiChevronRight size={18} />
            </Box>
          </Flex>
        )}

        {/* Counter */}
        {total > 0 && (
          <Text
            mt={4}
            textAlign="center"
            fontSize="xs"
            color="gray.400"
            fontFamily="body"
          >
            {page + 1} of {total} reviews
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default ClientStoriesSection;
