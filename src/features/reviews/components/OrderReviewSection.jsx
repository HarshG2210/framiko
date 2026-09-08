import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { CheckCircleIcon, StarIcon } from "@chakra-ui/icons";

import React from "react";
import { reviewsApi } from "../../../services/api/reviewsApi";

const OrderReviewSection = ({
  order,
  contentType,
  objectId,
  reviews = [],
  onReviewAdded,
}) => {
  const toast = useToast();
  const [rating, setRating] = React.useState(0);
  const [title, setTitle] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  const allowedWritableTypes = ["product", "artworkcategoryimage"];
  const isDelivered = order?.order_status?.toLowerCase() === "delivered";
  const isWritableContent = allowedWritableTypes.includes(contentType);
  const canWriteReview = isDelivered && isWritableContent && Boolean(objectId);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    if (!isDelivered) {
      toast({
        title: "Order not delivered",
        description: "Reviews can only be submitted for delivered orders.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!rating || !title?.trim() || !comment?.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in rating, title, and comment.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!canWriteReview) {
      toast({
        title: "Review not allowed",
        description:
          "Reviews can only be submitted for products or gallery artwork items after delivery.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("title", title);
      formData.append("comment", comment);

      images.forEach((img) => {
        formData.append("images", img);
      });

      await reviewsApi.createOrderReview(contentType, objectId, formData);

      toast({
        title: "Review posted",
        description: "Thank you for your feedback!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setRating(0);
      setTitle("");
      setComment("");
      setImages([]);
      setShowForm(false);

      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      toast({
        title: "Failed to post review",
        description: error?.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isDelivered) {
    return (
      <Alert
        status="info"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="auto"
        py={6}
        borderRadius="lg"
        mt={6}
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Order Not Yet Delivered
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          You can review this item once your order is delivered.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Box mt={8}>
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <Box
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          p={6}
          borderRadius="lg"
          color="white"
        >
          <HStack spacing={3} mb={2}>
            <CheckCircleIcon w={6} h={6} />
            <Heading size="md">Share Your Experience</Heading>
          </HStack>
          <Text opacity={0.9}>
            Your feedback helps us improve. Thank you for your order!
          </Text>
        </Box>

        {!showForm && canWriteReview && (
          <Button
            colorScheme="purple"
            size="lg"
            onClick={() => setShowForm(true)}
            w="fit-content"
            boxShadow="lg"
            _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
            transition="all 0.2s"
          >
            Write a Review
          </Button>
        )}

        {!canWriteReview && isDelivered && (
          <Alert status="info" borderRadius="lg" p={4}>
            <AlertIcon />
            Reviews can only be submitted for product or gallery artwork items.
          </Alert>
        )}

        {showForm && canWriteReview && (
          <Box
            p={8}
            borderWidth="2px"
            borderRadius="lg"
            borderColor="purple.200"
            bg="purple.50"
          >
            <Stack spacing={6}>
              {/* Rating */}
              <FormControl>
                <FormLabel fontWeight="600" fontSize="lg">
                  How would you rate your order?
                </FormLabel>
                <HStack spacing={2} pt={2}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Box
                      key={star}
                      cursor="pointer"
                      transition="transform 0.2s"
                      _hover={{ transform: "scale(1.2)" }}
                      onClick={() => setRating(star)}
                    >
                      <StarIcon
                        w={8}
                        h={8}
                        color={star <= rating ? "#ffd700" : "gray.300"}
                      />
                    </Box>
                  ))}
                </HStack>
                {rating > 0 && (
                  <Text fontSize="sm" color="purple.600" mt={2} fontWeight="500">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </Text>
                )}
              </FormControl>

              <Divider />

              {/* Title */}
              <FormControl isRequired>
                <FormLabel fontWeight="600">Review Title</FormLabel>
                <Input
                  placeholder="e.g., 'Amazing quality and fast delivery'"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  size="lg"
                  borderRadius="md"
                  focusBorderColor="purple.500"
                />
              </FormControl>

              {/* Comment */}
              <FormControl isRequired>
                <FormLabel fontWeight="600">Your Review</FormLabel>
                <Textarea
                  placeholder="Tell us about your experience with this order. What did you like? Would you recommend it?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={6}
                  size="lg"
                  borderRadius="md"
                  focusBorderColor="purple.500"
                  resize="vertical"
                />
                <Text fontSize="xs" color="gray.500" mt={2}>
                  {comment.length} / 1000 characters
                </Text>
              </FormControl>

              {/* Images */}
              <FormControl>
                <FormLabel fontWeight="600">Add Photos (Optional)</FormLabel>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  size="lg"
                  p={2}
                />
                {images.length > 0 && (
                  <Box mt={3}>
                    <Grid templateColumns="repeat(auto-fill, minmax(80px, 1fr))" gap={3}>
                      {images.map((img, idx) => (
                        <GridItem key={idx}>
                          <Box
                            position="relative"
                            borderRadius="md"
                            overflow="hidden"
                            h="80px"
                            bg="gray.200"
                          >
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`Preview ${idx}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        </GridItem>
                      ))}
                    </Grid>
                    <Text fontSize="sm" color="gray.600" mt={2}>
                      {images.length} photo(s) selected
                    </Text>
                  </Box>
                )}
              </FormControl>

              {/* Action Buttons */}
              <HStack justify="flex-end" pt={6} spacing={4}>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setShowForm(false);
                    setRating(0);
                    setTitle("");
                    setComment("");
                    setImages([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="purple"
                  size="lg"
                  isLoading={loading}
                  onClick={handleSubmit}
                  boxShadow="lg"
                >
                  Submit Review
                </Button>
              </HStack>
            </Stack>
          </Box>
        )}

        {/* Existing Reviews */}
        {reviews && reviews.length > 0 && (
          <>
            <Divider my={4} />
            <VStack align="stretch" spacing={4}>
              <Heading size="md">Reviews from Customers</Heading>
              {reviews.map((review) => (
                <Box
                  key={review.id}
                  p={5}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor="gray.200"
                  bg="white"
                  _hover={{ boxShadow: "md", borderColor: "purple.200" }}
                  transition="all 0.2s"
                >
                  <HStack mb={3} align="flex-start">
                    <Avatar
                      size="sm"
                      name={review.user?.username || "User"}
                      bg="purple.500"
                    />
                    <Box flex={1}>
                      <HStack justify="space-between" mb={1}>
                        <Text fontWeight="600">
                          {review.user?.username || "Anonymous"}
                        </Text>
                        <HStack spacing={0.5}>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              w={4}
                              h={4}
                              color={i < (review.rating || 0) ? "gold" : "gray.300"}
                            />
                          ))}
                        </HStack>
                      </HStack>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </Text>
                    </Box>
                  </HStack>

                  <Heading size="sm" mb={2}>
                    {review.title}
                  </Heading>
                  <Text fontSize="sm" color="gray.700" mb={3}>
                    {review.comment}
                  </Text>

                  {review.images && review.images.length > 0 && (
                    <Grid
                      templateColumns="repeat(auto-fill, minmax(80px, 1fr))"
                      gap={2}
                      mt={3}
                    >
                      {review.images.map((img, idx) => (
                        <GridItem key={idx}>
                          <img
                            src={img.image}
                            alt={`Review ${idx}`}
                            style={{
                              width: "100%",
                              height: "80px",
                              borderRadius: "4px",
                              objectFit: "cover",
                            }}
                          />
                        </GridItem>
                      ))}
                    </Grid>
                  )}
                </Box>
              ))}
            </VStack>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default OrderReviewSection;
