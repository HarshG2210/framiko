import { Box, Button, HStack, Link, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { Link as RouterLink } from "react-router-dom";

const COOKIE_KEY = "cookiesAccepted";

const CookieBanner = () => {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_KEY);
      setAccepted(stored === "true");
    } catch (err) {
      setAccepted(false);
      console.error("Error accessing localStorage:", err);
    }
  }, []);

  const acceptCookies = () => {
    try {
      localStorage.setItem(COOKIE_KEY, "true");
    } catch (err) {
      console.error("Error accessing localStorage:", err);
      // ignore storage failures
    }
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <Box
      position="fixed"
      bottom={4}
      left={4}
      right={4}
      bg="white"
      boxShadow="2xl"
      borderRadius="2xl"
      p={5}
      zIndex={99999}
      borderWidth="1px"
      borderColor="neutral.200"
      fontFamily="body"
    >
      <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
        <Box maxW={{ base: "100%", md: "70%" }}>
          <Text fontSize="sm" color="neutral.700" mb={1} fontWeight="500" fontFamily="body">
            We use cookies to personalize your experience, analyze site traffic,
            and deliver a faster, more secure checkout.
          </Text>
          <Text fontSize="sm" color="neutral.500" fontFamily="body">
            By accepting, you consent to our cookie policy. You can review and
            manage preferences any time in Cookie Settings.
          </Text>
        </Box>

        <HStack spacing={3} flexWrap="wrap">
          <Link
            as={RouterLink}
            to="/cookies"
            color="neutral.700"
            fontWeight="600"
            fontFamily="body"
            _hover={{ color: "neutral.900", textDecoration: "none" }}
          >
            Cookie settings
          </Link>
          <Button variant="solid" onClick={acceptCookies} fontFamily="body">
            Accept cookies
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
};

export default CookieBanner;
