import { Box, Heading, Text, VStack, HStack } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

const ReviewSection = () => {
  // ⭐ Static review data
  const reviews = [
    {
      id: 1,
      name: "Amit Sharma",
      comment: "Absolutely stunning print quality. Looks premium on my wall!",
      rating: 5,
    },
    {
      id: 2,
      name: "Neha Verma",
      comment: "Colors are vibrant and the framing preview helped a lot.",
      rating: 5,
    },
    {
      id: 3,
      name: "Rahul Mehta",
      comment:
        "Fast delivery and excellent canvas material. Highly recommended.",
      rating: 4,
    },
  ];

  return (
    <Box mt={10}>
      <Heading size="md" mb={4}>
        Customer Reviews
      </Heading>

      <VStack align="start" spacing={5}>
        {reviews.map((review) => (
          <Box
            key={review.id}
            p={4}
            w="100%"
            borderRadius="lg"
            border="1px solid black"
            borderColor="blackAlpha.200"
            bg="white"
          >
            {/* Name + Rating */}
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="600">{review.name}</Text>

              <HStack spacing={1}>
                {Array(review.rating)
                  .fill("")
                  .map((_, i) => (
                    <StarIcon key={i} boxSize={3} color="yellow.400" />
                  ))}
              </HStack>
            </HStack>

            {/* Comment */}
            <Text fontSize="sm" color="blackAlpha.600">
              {review.comment}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default ReviewSection;
