import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const StatsBar = () => {
  const stats = [
    { value: 10, suffix: "K+", label: "Happy Customer" },
    { value: 500, suffix: "+", label: "Art Pices" },
    { value: 4.8, decimals: 1, label: "Average Ratings" },
    { value: 100, suffix: "+", label: "Cities" },
  ];

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <Box
      ref={ref}
      w="full"
      /* Dusty rose from the Figma — #D4A49A */
      bg="#590854"
      py={{ base: 10, md: 12 }}
      px={{ base: 6, md: 16 }}
    >
      <SimpleGrid
        columns={{ base: 2, md: 4 }}
        spacing={{ base: 8, md: 0 }}
        maxW="1100px"
        mx="auto"
        textAlign="center"
      >
        {stats.map((item, i) => (
          <Flex
            key={i}
            direction="column"
            align="center"
            justify="center"
            gap={1}
          >
            {/* Large bold number */}
            <Text
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="800"
              color="white"
              lineHeight="1"
              fontFamily="heading"
              letterSpacing="-0.02em"
            >
              {inView ? (
                <CountUp
                  end={item.value}
                  duration={2.5}
                  decimals={item.decimals || 0}
                  suffix={item.suffix || ""}
                  useEasing={true}
                />
              ) : (
                `0${item.suffix || ""}`
              )}
            </Text>

            {/* Label */}
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="400"
              color="white"
              letterSpacing="0.03em"
              fontFamily="heading"
              opacity={0.92}
            >
              {item.label}
            </Text>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default StatsBar;
