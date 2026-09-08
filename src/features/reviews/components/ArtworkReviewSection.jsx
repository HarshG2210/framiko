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
} from "@chakra-ui/react";

import React from "react";
import { StarIcon } from "@chakra-ui/icons";
import { reviewsApi } from "../../../services/api/reviewsApi";

const ArtworkReviewSection = ({
  imageId,
  reviews = [],
  reviewSummary = { count: 0, average_rating: 0 },
  onReviewAdded,
}) => {
  const toast = useToast();
  const [rating, setRating] = React.useState(0);
  const [title, setTitle] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
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

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("title", title);
      formData.append("comment", comment);
      formData.append("object_id", imageId);
      formData.append("content_type", "artworkcategoryimage");

      images.forEach((img) => {
        formData.append("images", img);
      });

      await reviewsApi.createArtworkCategoryImageReview(imageId, formData);

      toast({
        title: "Review posted",
        description: "Thank you for your review!",
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

  return (
    <VStack align="stretch" spacing={6} mt={8}>
      <Box
        bg="white"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="gray.200"
        p={6}
        boxShadow="sm"
      >
        <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="lg">Artwork Reviews</Heading>
            <Text color="gray.500" mt={2}>
              Based on {reviewSummary.count} review
              {reviewSummary.count !== 1 ? "s" : ""}
            </Text>
          </Box>
          <HStack spacing={4}>
            <Box textAlign="right">
              <Text fontSize="3xl" fontWeight="800">
                {reviewSummary.average_rating.toFixed(1)}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Average rating
              </Text>
            </Box>
            <Button colorScheme="blue" onClick={() => setShowForm(true)}>
              Write a Review
            </Button>
          </HStack>
        </HStack>
      </Box>

      {showForm && (
        <Box p={6} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Rating</FormLabel>
              <HStack>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    w={6}
                    h={6}
                    cursor="pointer"
                    color={star <= rating ? "gold" : "gray.300"}
                    onClick={() => setRating(star)}
                  />
                ))}
              </HStack>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Brief summary of your review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Comment</FormLabel>
              <Textarea
                placeholder="Share your thoughts about this artwork..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Upload Images</FormLabel>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              {images.length > 0 && (
                <Text fontSize="sm" color="gray.500" mt={2}>
                  {images.length} image(s) selected
                </Text>
              )}
            </FormControl>

            <HStack justify="flex-end" pt={4}>
              <Button
                variant="outline"
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
                colorScheme="blue"
                isLoading={loading}
                onClick={handleSubmit}
              >
                Submit Review
              </Button>
            </HStack>
          </Stack>
        </Box>
      )}

      <Divider />

      <VStack align="stretch" spacing={4} pt={4}>
        {reviews.length === 0 ? (
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            borderColor="gray.200"
            bg="gray.50"
          >
            <Text color="gray.500">
              No reviews yet. Be the first to share your thoughts.
            </Text>
          </Box>
        ) : (
          reviews.map((review) => (
            <Box
              key={review.id}
              p={5}
              borderWidth="1px"
              borderRadius="2xl"
              borderColor="gray.200"
              bg="white"
              boxShadow="sm"
              transition="transform 0.2s, box-shadow 0.2s"
              _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
            >
              <HStack mb={3} align="flex-start" spacing={4}>
                <Avatar size="md" name={review.user?.username || "User"} />
                <Box flex={1}>
                  <HStack justify="space-between" flexWrap="wrap" gap={2}>
                    <Text fontWeight="700" fontSize="md">
                      {review.user?.username || "Anonymous"}
                    </Text>
                    <HStack spacing={1}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          w={4}
                          h={4}
                          color={i < review.rating ? "gold" : "gray.200"}
                        />
                      ))}
                    </HStack>
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </Text>
                </Box>
              </HStack>

              <Heading size="md" mb={2}>
                {review.title}
              </Heading>
              <Text color="gray.700" mb={4}>
                {review.comment}
              </Text>

              {review.images && review.images.length > 0 && (
                <HStack spacing={3} wrap="wrap">
                  {review.images.map((img, idx) => (
                    <Box
                      key={idx}
                      w="110px"
                      h="110px"
                      borderRadius="xl"
                      overflow="hidden"
                      bg="gray.100"
                    >
                      <img
                        src={img.image}
                        alt={`Review ${idx}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ))}
                </HStack>
              )}
            </Box>
          ))
        )}
      </VStack>
    </VStack>
  );
};

export default ArtworkReviewSection;
