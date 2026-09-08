import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";

import React from "react";
import { newsletterApi } from "../../../services/api/newsletterApi";
import saleBanner from "../../../assets/images/News_Letter/peakpx.jpeg";

const NewsletterSection = () => {
  const toast = useToast();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubscribe = async () => {
    if (!email?.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      await newsletterApi.subscribe({ email: email.trim() });
      toast({
        title: "Subscribed successfully",
        description: "You have been added to our newsletter.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description:
          error?.message || "Something went wrong. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box w="full" overflow="hidden">
      <Box
        position="relative"
        w="full"
        minH={{ base: "420px", md: "520px" }}
        bgImage={`url(${saleBanner})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
      >
        {/* Soft white overlay */}
        <Box position="absolute" inset={0} bg="rgba(255, 255, 255, 0.78)" />

        {/* Content */}
        <Flex
          position="relative"
          zIndex={1}
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          minH={{ base: "420px", md: "520px" }}
          px={{ base: 5, md: 8 }}
          py={{ base: 12, md: 16 }}
        >
          <VStack spacing={0} maxW="720px" w="full">
            {/* Heading */}
            <Text
              fontSize="3.2rem"
              fontWeight="700"
              color="#1A1A1A"
              letterSpacing="-0.03em"
              lineHeight="1.1"
              mb={4}
            >
              Get 30% Off
            </Text>

            {/* Subtitle */}
            <Text
              fontSize="1.05rem"
              color="#333"
              lineHeight="1.55"
              maxW="540px"
              mb={10}
            >
              Subscribe to receive exclusive offers, new collection updates, and
              creative inspiration.
            </Text>

            {/* Email + Button */}
            <Box
              position="relative"
              w="full"
              maxW="620px"
            >
              <Input
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="#ffffff"
                color="#1A1A1A"
                border="1px solid"
                borderColor="rgba(0,0,0,0.06)"
                borderRadius="full"
                h="48px"
                pl={6}
                pr="180px"
                fontSize="md"
                _placeholder={{ color: "#B0B0B0", opacity: 1 }}
                _focus={{
                  borderColor: "rgba(0,0,0,0.1)",
                  boxShadow: "none",
                  bg: "rgba(255,255,255,0.7)",
                }}
                w="100%"
                minW={0}
              />

              <Button
                onClick={handleSubscribe}
                isLoading={loading}
                loadingText="Subscribing..."
                variant="solid"
                size="md"
                borderRadius="full"
                h="48px"
                px={6}
                fontSize="sm"
                fontWeight="600"
                whiteSpace="nowrap"
                position="absolute"
                right={0}
                top={0}
                minW="170px"
                zIndex={2}
              >
                Subscribe Now
              </Button>
            </Box>
          </VStack>
        </Flex>
      </Box>
    </Box>
  );
};

export default NewsletterSection;
