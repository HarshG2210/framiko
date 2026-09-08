import React from "react";
import { Flex, Image as ChakraImage, Text, Spinner } from "@chakra-ui/react";
import { resolveMediaUrl } from "../utils/orderFormatters";

/**
 * Image thumbnail with graceful fallback if missing/broken
 * Memoized to prevent unnecessary re-renders
 */
const MediaThumb = React.memo(({ src, alt, size = "120px" }) => {
  const resolved = resolveMediaUrl(src);

  if (!resolved) {
    return (
      <Flex
        w={size}
        h={size}
        bg="gray.100"
        borderRadius="md"
        align="center"
        justify="center"
        borderWidth="1px"
        borderStyle="dashed"
        borderColor="gray.300"
        flexShrink={0}
      >
        <Text fontSize="xs" color="gray.400" textAlign="center" px={1}>
          No image
        </Text>
      </Flex>
    );
  }

  return (
    <ChakraImage
      src={resolved}
      alt={alt || "image"}
      w={size}
      h={size}
      objectFit="cover"
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.200"
      flexShrink={0}
      fallback={
        <Flex
          w={size}
          h={size}
          bg="gray.100"
          borderRadius="md"
          align="center"
          justify="center"
        >
          <Spinner size="sm" />
        </Flex>
      }
    />
  );
});

MediaThumb.displayName = "MediaThumb";

export default MediaThumb;
