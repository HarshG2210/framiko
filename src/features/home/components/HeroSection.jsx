import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import heroImage1 from "../../../assets/images/Hero_Section/1.png";
import heroImage2 from "../../../assets/images/Hero_Section/2.png";
import heroImage3 from "../../../assets/images/Hero_Section/3.png";
import { useNavigate } from "react-router-dom";

const sliderImages = [heroImage1, heroImage2, heroImage3];

const SLIDE_INTERVAL = 2000;

const HeroSection = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sliderImages.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      width="full"
      minH={{ base: "auto", lg: "620px" }}
      bg="#F3F2F0"
      py={{ base: 12, lg: 0 }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      position="relative"
    >
      <Box position="absolute" inset="0" overflow="hidden">
        {sliderImages.map((image, index) => (
          <Box
            key={image}
            position="absolute"
            inset="0"
            bgImage={`url(${image})`}
            bgSize="100% 100%"
            bgPosition="center center"
            bgRepeat="no-repeat"
            backgroundAttachment="scroll"
            opacity={index === activeIndex ? 1 : 0}
            transition="opacity 1.1s ease"
          />
        ))}
      </Box>

      <Flex
        maxW="1440px"
        w="100%"
        mx="auto"
        px={{ base: 6, md: 8, lg: 10 }}
        align="center"
        justify="space-between"
        gap={{ base: 10, lg: 12 }}
        position="relative"
        zIndex={1}
        minH={{ base: "auto", lg: "620px" }}
      >
        <VStack
          flex="1"
          align={{ base: "center", lg: "flex-start" }}
          textAlign={{ base: "center", lg: "left" }}
          spacing={5}
          maxW={{ lg: "620px" }}
          pl={{ lg: 4 }}
        >
          <Box>
            <Text
              fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
              fontWeight="800"
              color="#1e1e1e"
              lineHeight="0.96"
              letterSpacing="-0.05em"
              fontFamily="heading"
            >
              Make your{" "}
              <Text
                as="span"
                fontFamily="heading"
                color="#590854"
                fontWeight="600"
                display="inline-block"
                lineHeight="1"
                letterSpacing="-0.04em"
              >
                Memories
              </Text>
            </Text>

            <Text
              fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
              fontWeight="800"
              color="#1e1e1e"
              lineHeight="0.96"
              letterSpacing="-0.05em"
              fontFamily="heading"
              mt={2}
            >
              Modern and Unique
            </Text>
          </Box>

          <Text
            fontSize={{ base: "sm", lg: "lg" }}
            color="#5F5F5F"
            lineHeight="1.7"
            maxW="500px"
            mt={2}
          >
            Create custom photo frames that fit your style and space. Simple.
            Personal. Modern.
          </Text>

          <Button
            onClick={() => navigate("/customization")}
            h={{ base: "56px", lg: "60px" }}
            px={{ base: 8, lg: 10 }}
            minW={{ base: "220px", lg: "260px" }}
            borderRadius="full"
            bg="#1d1d1d"
            color="white"
            fontSize={{ base: "lg", lg: "xl" }}
            fontWeight="700"
            letterSpacing="-0.02em"
            transition="none"
            _hover={{ bg: "#1d1d1d" }}
            _active={{ bg: "#1d1d1d" }}
            _focus={{ boxShadow: "none" }}
          >
            Customize Now
          </Button>
        </VStack>

        <HStack
          position="absolute"
          left="50%"
          bottom={{ base: "-28px", md: "-32px", lg: "0" }}
          spacing={3}
          transform="translateX(-50%)"
          zIndex={2}
          pb={{ base: "0", md: "0", lg: "20px" }}
        >
          {sliderImages.map((image, index) => (
            <Box
              key={image}
              w="14px"
              h="14px"
              borderRadius="sm"
              bg={index === activeIndex ? "#1f1f1f" : "#d9d3ce"}
              border="1px solid"
              borderColor={index === activeIndex ? "#1f1f1f" : "#c4beb7"}
              transition="all 0.3s ease"
            />
          ))}
        </HStack>
      </Flex>
    </Box>
  );
};

export default HeroSection;
