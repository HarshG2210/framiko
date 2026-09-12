import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";

import saleBanner from "../../../assets/images/sale-img.jpg";
import { useNavigate } from "react-router-dom";

const SpecialWinterSaleSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      w="full"
      bg="#ffffff"
      py={{ base: 14, md: 20 }}
      px={{ base: 6, md: 12 }}
    >
      {/* Header */}
      <Box textAlign="center" mb={10}>
        <Text
          fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
          fontWeight="500"
          color="#D0D0D0"
          letterSpacing="-0.05em"
          fontFamily="heading"
          mb={4}
          lineHeight="1.05"
        >
          {" "}
          Special Winter Sale{" "}
        </Text>
        <Text
          fontSize={{ base: "1rem", md: "1.2rem" }}
          color="#6a6a6a"
          maxW="860px"
          mx="auto"
          lineHeight="1.7"
          fontFamily="body"
        >
          {" "}
          Limited-time deals on premium frames—up to 30% off while stocks
          last.{" "}
        </Text>
      </Box>
      <Box
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="0 8px 28px rgba(0,0,0,0.08)"
        maxW="1200px"
        mx="auto"
      >
        <Flex direction={{ base: "column", md: "row" }} h={{ md: "500px" }}>
          {/* ── LEFT: IMAGE ── */}
          <Box flex="1.1" position="relative">
            <Image
              src={saleBanner}
              alt="Winter Sale"
              w="full"
              h="full"
              objectFit="cover"
            />

            {/* Warm tan discount badge — matches icon circle color */}
            <Box
              position="absolute"
              top={4}
              left={4}
              bg="#C9AB7E"
              color="white"
              px={4}
              py={1}
              borderRadius="full"
              fontSize="xs"
              fontWeight="700"
              fontFamily="body"
              letterSpacing="0.04em"
            >
              30% OFF
            </Box>
          </Box>

          {/* ── RIGHT: CONTENT ── */}
          <Flex
            flex="1"
            bg="#1A1A1A"
            color="white"
            align="center"
            px={{ base: 8, md: 12 }}
            py={{ base: 10, md: 0 }}
          >
            <Flex
              direction="column"
              justify="center"
              maxW="360px"
              textAlign={{ base: "center", md: "left" }}
              mx={{ base: "auto", md: 0 }}
              gap={4}
            >
              {/* Limited Time badge — warm tan to stay consistent */}
              <Box alignSelf={{ base: "center", md: "flex-start" }}>
                <Text
                  display="inline-block"
                  bg="#C9AB7E"
                  color="white"
                  px={4}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="700"
                  fontFamily="body"
                  letterSpacing="0.06em"
                >
                  Limited Time Offer
                </Text>
              </Box>

              {/* Heading — monospace light gray matching section titles */}
              <Text
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="700"
                color="#BBBBBB"
                fontFamily="heading"
                letterSpacing="0.08em"
                lineHeight="1.2"
              >
                Special Winter Sale
              </Text>

              {/* Description — Inter, muted white */}
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color="whiteAlpha.700"
                fontFamily="body"
                lineHeight="1.75"
              >
                Up to 30% off on premium frames &amp; wall art. Elevate your
                space with timeless pieces at unbeatable prices.
              </Text>

              {/* CTA — solid black pill with circle arrow, matching site-wide button style */}
              <Box alignSelf={{ base: "center", md: "flex-start" }}>
                <Button
                  size="md"
                  variant="solid"
                  fontFamily="body"
                  letterSpacing="0.02em"
                  onClick={() => navigate("/products")}
                >
                  Shop Sale
                </Button>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default SpecialWinterSaleSection;
