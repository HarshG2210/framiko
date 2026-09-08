import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
  useToast,
  Icon,
  Flex,
  Badge,
  IconButton,
  Collapse,
  Progress,
  Tag,
  TagLabel,
  TagLeftIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image as ChakraImage,
  Spinner,
  SimpleGrid,
  Tooltip,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

import React, { useState, useRef } from "react";
import {
  StarIcon,
  SmallCloseIcon,
  AttachmentIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import {
  FiThumbsUp,
  FiThumbsDown,
  FiFlag,
  FiCamera,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { reviewsApi } from "../../../services/api/reviewsApi";

/* ─── Star Rating Component ─────────────────────────────────────────────── */
const StarRating = ({ rating, setRating, size = 24, readonly = false }) => (
  <HStack spacing={1}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Icon
        key={star}
        as={star <= rating ? AiFillStar : AiOutlineStar}
        w={size}
        h={size}
        color={star <= rating ? "#F5A623" : "#D1D5DB"}
        cursor={readonly ? "default" : "pointer"}
        onClick={() => !readonly && setRating?.(star)}
        onMouseEnter={() => !readonly && setRating?.(star)}
        transition="all 0.15s ease"
        _hover={!readonly ? { transform: "scale(1.15)" } : {}}
      />
    ))}
  </HStack>
);

/* ─── Review Filter Component ───────────────────────────────────────────── */
const ReviewFilter = ({ activeFilter, onFilterChange, counts }) => {
  const filters = [
    { label: "All", value: "all", count: counts.all },
    { label: "5 Star", value: 5, count: counts[5] },
    { label: "4 Star", value: 4, count: counts[4] },
    { label: "3 Star", value: 3, count: counts[3] },
    { label: "2 Star", value: 2, count: counts[2] },
    { label: "1 Star", value: 1, count: counts[1] },
  ];

  return (
    <HStack spacing={2} flexWrap="wrap" gap={2}>
      {filters.map((filter) => (
        <Button
          key={filter.label}
          size="sm"
          variant={activeFilter === filter.value ? "solid" : "outline"}
          onClick={() => onFilterChange(filter.value)}
          leftIcon={
            filter.value !== "all" && (
              <Icon
                as={AiFillStar}
                color={activeFilter === filter.value ? "white" : "#F5A623"}
              />
            )
          }
        >
          {filter.label}
          {filter.count > 0 && (
            <Badge
              ml={1}
              bg={activeFilter === filter.value ? "white" : "gray.100"}
              color={activeFilter === filter.value ? "#F5A623" : "gray.600"}
              borderRadius="full"
              px={1.5}
            >
              {filter.count}
            </Badge>
          )}
        </Button>
      ))}
    </HStack>
  );
};

/* ─── Image Lightbox Component ──────────────────────────────────────────── */
const ImageLightbox = ({ images, isOpen, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") handlePrevious(e);
    if (e.key === "ArrowRight") handleNext(e);
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !images.length) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      zIndex="9999"
      bg="rgba(0, 0, 0, 0.92)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={onClose}
      cursor="pointer"
    >
      {/* Close Button */}
      <IconButton
        icon={<SmallCloseIcon />}
        position="absolute"
        top="20px"
        right="20px"
        size="lg"
        variant="ghost"
        color="white"
        _hover={{ bg: "rgba(255,255,255,0.1)" }}
        onClick={onClose}
        aria-label="Close lightbox"
        zIndex="10"
      />

      {/* Image Counter */}
      <Box
        position="absolute"
        bottom="30px"
        left="50%"
        transform="translateX(-50%)"
        color="white"
        bg="rgba(0,0,0,0.6)"
        px="4"
        py="2"
        borderRadius="full"
        fontSize="sm"
        zIndex="10"
      >
        {currentIndex + 1} / {images.length}
      </Box>

      {/* Main Image */}
      <Box
        maxW="90vw"
        maxH="85vh"
        onClick={(e) => e.stopPropagation()}
        cursor="default"
        position="relative"
      >
        <ChakraImage
          src={images[currentIndex].image}
          alt={`Review image ${currentIndex + 1}`}
          maxW="90vw"
          maxH="85vh"
          objectFit="contain"
          borderRadius="lg"
        />
      </Box>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <IconButton
            icon={<ChevronLeftIcon w={8} h={8} />}
            position="absolute"
            left="20px"
            top="50%"
            transform="translateY(-50%)"
            size="lg"
            variant="ghost"
            color="white"
            _hover={{ bg: "rgba(255,255,255,0.1)" }}
            onClick={handlePrevious}
            aria-label="Previous image"
            zIndex="10"
          />
          <IconButton
            icon={<ChevronRightIcon w={8} h={8} />}
            position="absolute"
            right="20px"
            top="50%"
            transform="translateY(-50%)"
            size="lg"
            variant="ghost"
            color="white"
            _hover={{ bg: "rgba(255,255,255,0.1)" }}
            onClick={handleNext}
            aria-label="Next image"
            zIndex="10"
          />
        </>
      )}

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <Box
          position="absolute"
          bottom="80px"
          left="50%"
          transform="translateX(-50%)"
          maxW="80vw"
          overflowX="auto"
          pb="2"
          zIndex="10"
          css={{
            "&::-webkit-scrollbar": { height: "4px" },
            "&::-webkit-scrollbar-track": {
              background: "rgba(255,255,255,0.1)",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255,255,255,0.3)",
              borderRadius: "full",
            },
          }}
        >
          <Wrap spacing={2} justify="center">
            {images.map((img, idx) => (
              <WrapItem key={idx}>
                <Box
                  as="button"
                  w="60px"
                  h="60px"
                  borderRadius="md"
                  overflow="hidden"
                  border="2px solid"
                  borderColor={idx === currentIndex ? "#F5A623" : "transparent"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  _hover={{ borderColor: "rgba(255,255,255,0.5)" }}
                  transition="all 0.2s"
                >
                  <ChakraImage
                    src={img.image}
                    alt={`Thumbnail ${idx + 1}`}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      )}
    </Box>
  );
};

/* ─── Individual Review Card ───────────────────────────────────────────── */
const ReviewCard = ({ review, isVerified = false, helpfulCount = 0 }) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpful, setHelpful] = useState(helpfulCount);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const textRef = useRef(null);
  const [needsExpand, setNeedsExpand] = useState(false);

  React.useEffect(() => {
    if (textRef.current) {
      const lineHeight = 24;
      const maxHeight = lineHeight * 3;
      setNeedsExpand(textRef.current.scrollHeight > maxHeight);
    }
  }, [review.comment]);

  const handleHelpful = () => {
    setIsHelpful(true);
    setHelpful((prev) => prev + 1);
  };

  const openLightbox = (imageIndex) => {
    setSelectedImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="xl"
      borderColor="gray.200"
      bg="white"
      boxShadow="sm"
      transition="all 0.3s ease"
      _hover={{ boxShadow: "md", borderColor: "gray.300" }}
    >
      {/* Review Header */}
      <Flex align="flex-start" gap={4} mb={3}>
        <Avatar
          size="md"
          name={review.user?.username || "User"}
          color="white"
          icon={<Icon as={FiUser} fontSize="20px" />}
        />
        <Box flex={1}>
          <Flex align="center" gap={2} flexWrap="wrap" mb={1}>
            <Text fontWeight="700" fontSize="md" color="gray.800">
              {review.user?.username || "Anonymous"}
            </Text>
            {isVerified && (
              <Badge
                bg="#16A34A"
                color="white"
                px={2}
                py={0.5}
                borderRadius="full"
                fontSize="xs"
              >
                <Icon as={FiCheckCircle} mr={1} fontSize="10px" />
                Verified Purchase
              </Badge>
            )}
            {review.rating >= 4 && (
              <Badge
                bg="#FFF8ED"
                color="#F5A623"
                border="1px solid #F5A623"
                px={2}
                py={0.5}
                borderRadius="full"
                fontSize="xs"
              >
                <Icon as={FiAward} mr={1} fontSize="10px" />
                Top Review
              </Badge>
            )}
          </Flex>
          <Flex align="center" gap={2} flexWrap="wrap">
            <StarRating rating={review.rating} readonly size={8} />
            <Text fontSize="xs" color="gray.500">
              {new Date(review.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </Flex>
        </Box>
      </Flex>

      {/* Review Title */}
      <Heading size="sm" mb={2} color="gray.800" fontWeight="600">
        {review.title}
      </Heading>

      {/* Review Comment */}
      <Box ref={textRef}>
        <Text
          color="gray.600"
          fontSize="sm"
          lineHeight="1.7"
          noOfLines={isExpanded ? undefined : 3}
          dangerouslySetInnerHTML={{ __html: review.comment }}
        />
      </Box>

      {needsExpand && (
        <Button
          variant="link"
          color="#F5A623"
          fontSize="sm"
          mt={1}
          onClick={() => setIsExpanded(!isExpanded)}
          rightIcon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </Button>
      )}

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <Box mt={4}>
          <Flex align="center" gap={2} mb={2}>
            <Icon as={FiCamera} color="gray.400" />
            <Text fontSize="xs" color="gray.500" fontWeight="500">
              {review.images.length} customer image
              {review.images.length > 1 ? "s" : ""}
            </Text>
          </Flex>
          <Wrap spacing={2}>
            {review.images
              .slice(0, showImages ? undefined : 4)
              .map((img, idx) => (
                <WrapItem key={idx}>
                  <Box
                    position="relative"
                    borderRadius="lg"
                    overflow="hidden"
                    bg="gray.100"
                    w="100px"
                    h="100px"
                    cursor="pointer"
                    onClick={() => openLightbox(idx)}
                    _hover={{ opacity: 0.8 }}
                    transition="opacity 0.2s"
                  >
                    <ChakraImage
                      src={img.image}
                      alt={`Review image ${idx + 1}`}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  </Box>
                </WrapItem>
              ))}
          </Wrap>
          {review.images.length > 4 && !showImages && (
            <Button
              variant="link"
              fontSize="sm"
              mt={2}
              onClick={() => setShowImages(true)}
            >
              + View {review.images.length - 4} more images
            </Button>
          )}
          {showImages && review.images.length > 4 && (
            <Button
              variant="link"
              fontSize="sm"
              mt={2}
              onClick={() => setShowImages(false)}
            >
              Show less
            </Button>
          )}
        </Box>
      )}

      {/* Image Lightbox */}
      {review.images && review.images.length > 0 && (
        <ImageLightbox
          images={review.images}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          initialIndex={selectedImageIndex}
        />
      )}

      {/* Review Actions */}
      <Flex
        align="center"
        gap={4}
        mt={4}
        pt={4}
        borderTop="1px solid"
        borderColor="gray.100"
      >
        <Button
          size="sm"
          variant="ghost"
          color={isHelpful ? "#F5A623" : "gray.500"}
          leftIcon={<FiThumbsUp />}
          onClick={handleHelpful}
          isDisabled={isHelpful}
          _hover={{ bg: "gray.50" }}
          _disabled={{ opacity: 0.7, cursor: "default" }}
        >
          Helpful ({helpful})
        </Button>

        <Tooltip label="Report this review">
          <IconButton
            size="sm"
            variant="ghost"
            icon={<FiFlag />}
            color="gray.400"
            aria-label="Report review"
            _hover={{ color: "red.500" }}
          />
        </Tooltip>
      </Flex>
    </Box>
  );
};

/* ─── Main ProductReviewSection Component ──────────────────────────────── */
const ProductReviewSection = ({
  productId,
  reviews = [],
  reviewSummary = { count: 0, average_rating: 0 },
  onReviewAdded,
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  // Calculate rating distribution
  const getRatingDistribution = () => {
    const distribution = { all: reviews.length };
    for (let i = 1; i <= 5; i++) {
      distribution[i] = reviews.filter(
        (r) => Math.round(r.rating) === i,
      ).length;
    }
    return distribution;
  };

  const distribution = getRatingDistribution();

  // Filter reviews based on active filter
  const filteredReviews = React.useMemo(() => {
    if (activeFilter === "all") return reviews;
    return reviews.filter((r) => Math.round(r.rating) === activeFilter);
  }, [reviews, activeFilter]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!rating || !title?.trim() || !comment?.trim()) {
      toast({
        title: "Missing fields",
        description: "Please provide a rating, title, and detailed review.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("title", title);
      formData.append("comment", comment);
      formData.append("object_id", productId);
      formData.append("content_type", "product");

      images.forEach((img) => {
        formData.append("images", img);
      });

      await reviewsApi.createProductReview(productId, formData);

      toast({
        title: "Review submitted! 🎉",
        description: "Thank you for sharing your experience with others.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });

      setRating(0);
      setTitle("");
      setComment("");
      setImages([]);
      setImagePreviewUrls([]);
      onClose();

      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      toast({
        title: "Failed to post review",
        description: error?.message || "Please try again later.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URLs
  React.useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const avgRating = reviewSummary.average_rating || 0;
  const totalCount = reviewSummary.count || 0;

  return (
    <VStack align="stretch" spacing={6}>
      {/* ─── Review Summary Header ─────────────────────────────────────────── */}
      <Box
        bg="white"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.200"
        p={6}
        boxShadow="sm"
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          gap={4}
        >
          <Flex align="center" gap={6} flexWrap="wrap">
            {/* Rating Display */}
            <Flex align="center" gap={4}>
              <Box textAlign="center" minW="80px">
                <Text
                  fontSize="5xl"
                  fontWeight="800"
                  lineHeight="1"
                  color="gray.900"
                >
                  {avgRating.toFixed(1)}
                </Text>
                <StarRating rating={avgRating} readonly size={18} />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {totalCount} rating{totalCount !== 1 ? "s" : ""}
                </Text>
              </Box>
            </Flex>

            {/* Rating Progress Bars */}
            <Box flex={1} minW="150px" maxW="300px">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star] || 0;
                const percentage =
                  totalCount > 0 ? (count / totalCount) * 100 : 0;
                return (
                  <Flex key={star} align="center" gap={2} mb={1}>
                    <Text
                      fontSize="xs"
                      fontWeight="500"
                      color="gray.600"
                      minW="24px"
                    >
                      {star}
                    </Text>
                    <Box flex={1}>
                      <Box
                        h="6px"
                        bg="gray.100"
                        borderRadius="full"
                        overflow="hidden"
                      >
                        <Box
                          h="100%"
                          bg="linear-gradient(90deg, #F5A623, #F7B731)"
                          borderRadius="full"
                          w={`${percentage}%`}
                          transition="width 0.8s ease"
                        />
                      </Box>
                    </Box>
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      minW="24px"
                      textAlign="right"
                    >
                      {count}
                    </Text>
                  </Flex>
                );
              })}
            </Box>
          </Flex>

          {/* Write Review Button */}
          <Button
            size="lg"
            onClick={onOpen}
            leftIcon={<Icon as={AiFillStar} />}
            px={8}
            borderRadius="full"
          >
            Write a Review
          </Button>
        </Flex>
      </Box>

      {/* ─── Review Filters ────────────────────────────────────────────────── */}
      <Box>
        <ReviewFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={distribution}
        />
        <Text fontSize="sm" color="gray.500" mt={2}>
          Showing {filteredReviews.length} of {reviews.length} reviews
        </Text>
      </Box>

      {/* ─── Review List ───────────────────────────────────────────────────── */}
      <VStack align="stretch" spacing={4}>
        {filteredReviews.length === 0 ? (
          <Box
            p={10}
            borderWidth="1px"
            borderRadius="xl"
            borderColor="gray.200"
            bg="gray.50"
            textAlign="center"
          >
            <Icon as={FiUser} fontSize="48px" color="gray.300" mb={3} />
            <Text color="gray.500" fontSize="lg" fontWeight="500">
              No reviews yet
            </Text>
            <Text color="gray.400" fontSize="sm" mt={1}>
              Be the first to share your experience with this product
            </Text>
            <Button mt={4} onClick={onOpen}>
              Write a Review
            </Button>
          </Box>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isVerified={review.is_verified || false}
              helpfulCount={review.helpful_count || 0}
            />
          ))
        )}
      </VStack>

      {/* ─── Write Review Modal ───────────────────────────────────────────── */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        closeOnOverlayClick={false}
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl" maxH="90vh" overflow="auto">
          <ModalHeader borderBottom="1px solid" borderColor="gray.100">
            <Flex align="center" gap={3}>
              <Box bg="#FFF8ED" p={2} borderRadius="full">
                <Icon as={AiFillStar} color="#F5A623" fontSize="20px" />
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="700">
                  Write a Review
                </Text>
                <Text fontSize="sm" color="gray.500" fontWeight="400">
                  Share your experience with this product
                </Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton mt={2} />

          <ModalBody py={6}>
            <Stack spacing={5}>
              {/* Rating */}
              <FormControl isRequired>
                <FormLabel fontWeight="600" color="gray.700">
                  Overall Rating
                </FormLabel>
                <Box p={3} bg="gray.50" borderRadius="lg">
                  <StarRating rating={rating} setRating={setRating} size={10} />
                  {rating > 0 && (
                    <Text fontSize="sm" color="gray.600" mt={2}>
                      {rating === 5
                        ? "Excellent! 🌟"
                        : rating === 4
                          ? "Very Good! 👍"
                          : rating === 3
                            ? "Good 🤔"
                            : rating === 2
                              ? "Not Great 😕"
                              : "Poor 😞"}
                    </Text>
                  )}
                </Box>
              </FormControl>

              {/* Title */}
              <FormControl isRequired>
                <FormLabel fontWeight="600" color="gray.700">
                  Review Title
                </FormLabel>
                <Input
                  placeholder="e.g., Great product, highly recommend!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  size="lg"
                  borderRadius="lg"
                  borderColor="gray.300"
                  _focus={{
                    borderColor: "#F5A623",
                    boxShadow: "0 0 0 1px #F5A623",
                  }}
                />
              </FormControl>

              {/* Comment */}
              <FormControl isRequired>
                <FormLabel fontWeight="600" color="gray.700">
                  Detailed Review
                </FormLabel>
                <Textarea
                  placeholder="What did you like or dislike about this product? Share your experience to help others..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  borderRadius="lg"
                  borderColor="gray.300"
                  _focus={{
                    borderColor: "#F5A623",
                    boxShadow: "0 0 0 1px #F5A623",
                  }}
                />
                <Text fontSize="xs" color="gray.400" mt={1}>
                  Minimum 10 characters
                </Text>
              </FormControl>

              {/* Image Upload */}
              <FormControl>
                <FormLabel fontWeight="600" color="gray.700">
                  Add Photos (Optional)
                </FormLabel>
                <Box
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="lg"
                  p={4}
                  bg="gray.50"
                  transition="all 0.2s"
                  _hover={{ borderColor: "#F5A623", bg: "#FFF8ED" }}
                >
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    display="none"
                    id="review-image-upload"
                  />
                  <label htmlFor="review-image-upload">
                    <Flex
                      direction="column"
                      align="center"
                      gap={2}
                      cursor="pointer"
                    >
                      <Icon as={FiCamera} fontSize="32px" color="gray.400" />
                      <Text fontSize="sm" color="gray.500">
                        Click to upload images
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        PNG, JPG, GIF up to 5MB each
                      </Text>
                    </Flex>
                  </label>
                </Box>

                {/* Image Previews */}
                {imagePreviewUrls.length > 0 && (
                  <SimpleGrid columns={{ base: 3, md: 4 }} spacing={3} mt={3}>
                    {imagePreviewUrls.map((url, idx) => (
                      <Box
                        key={idx}
                        position="relative"
                        borderRadius="lg"
                        overflow="hidden"
                        aspectRatio="1/1"
                        bg="gray.100"
                      >
                        <ChakraImage
                          src={url}
                          alt={`Upload ${idx + 1}`}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                        <IconButton
                          icon={<SmallCloseIcon />}
                          size="xs"
                          position="absolute"
                          top={1}
                          right={1}
                          bg="rgba(0,0,0,0.6)"
                          color="white"
                          borderRadius="full"
                          _hover={{ bg: "rgba(0,0,0,0.8)" }}
                          onClick={() => removeImage(idx)}
                          aria-label="Remove image"
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                )}
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter borderTop="1px solid" borderColor="gray.100" gap={3}>
            <Button
              variant="ghost"
              onClick={() => {
                onClose();
                setRating(0);
                setTitle("");
                setComment("");
                setImages([]);
                setImagePreviewUrls([]);
              }}
            >
              Cancel
            </Button>
            <Button
              isLoading={loading}
              loadingText="Submitting..."
              onClick={handleSubmit}
              px={6}
              leftIcon={<CheckIcon />}
            >
              Submit Review
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ProductReviewSection;
