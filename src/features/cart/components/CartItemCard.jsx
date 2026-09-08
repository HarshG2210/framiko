import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";

import { DeleteIcon } from "@chakra-ui/icons";
import { FiShoppingBag } from "react-icons/fi";
import { normalizeMediaUrl } from "../../../utils/constant";
import { useState } from "react";

const CartItemCard = ({ item, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const toast = useToast();

  const resolveImageUrl = (image) => normalizeMediaUrl(image);

  const getImageUrl = () => {
    const image =
      item?.final_generated_image_url ||
      item?.preview_image_url ||
      item?.item_details?.final_image_url ||
      item?.item_details?.image_url ||
      item?.selected_frame_details?.image ||
      item?.selected_material_details?.image;
    return resolveImageUrl(image) || "https://via.placeholder.com/150";
  };

  const getProductName = () => {
    return (
      item?.item_details?.category ||
      item?.item_details?.name ||
      item?.item_type
    );
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item.id);
      toast({
        title: "Item removed",
        description: `${getProductName()} has been removed from your cart.`,
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("REMOVE ITEM ERROR =>", error);
      toast({
        title: "Failed to remove",
        description: "Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Box
      bg="white"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.200"
      mb={4}
    >
      <Flex p={4} gap={4} direction={{ base: "column", sm: "row" }}>
        <Box
          flexShrink={0}
          w={{ base: "full", sm: "140px" }}
          h={{ base: "200px", sm: "140px" }}
          bg="gray.50"
          overflow="hidden"
          position="relative"
        >
          <Image
            src={getImageUrl()}
            alt={getProductName()}
            w="100%"
            h="100%"
            objectFit="contain"
            fallbackSrc="https://via.placeholder.com/140"
          />
        </Box>

        <Box flex={1} minW={0}>
          <Flex justify="space-between" align="start" gap={2}>
            <Box flex={1}>
              <Text
                fontWeight="700"
                fontSize="md"
                color="gray.800"
                fontFamily="body"
                noOfLines={1}
                mb={1}
              >
                {getProductName()}
              </Text>
            </Box>
            <IconButton
              icon={<DeleteIcon />}
              variant="ghost"
              size="sm"
              aria-label="Remove item"
              onClick={handleRemove}
              isLoading={isRemoving}
              color="gray.400"
              _hover={{ color: "red.500", bg: "red.50" }}
            />
          </Flex>

          <Flex
            align="center"
            justify="space-between"
            flexWrap="wrap"
            gap={3}
            mt={2}
          >
            <Flex align="center" gap={3}>
              <Box>
                <Text fontSize="xs" color="gray.500" fontFamily="body">
                  Unit Price
                </Text>
                <Text fontWeight="700" color="gray.800" fontFamily="body">
                  ₹{item.unit_price}
                </Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" fontFamily="body">
                  Total
                </Text>
                <Text
                  fontWeight="800"
                  color="gold.600"
                  fontSize="lg"
                  fontFamily="body"
                >
                  ₹{item.total_price}
                </Text>
              </Box>
            </Flex>

            <HStack spacing={1}>
              <Text
                minW="32px"
                textAlign="center"
                fontWeight="700"
                fontSize="sm"
                color="gray.700"
                fontFamily="body"
              >
                {item.quantity}
              </Text>
            </HStack>
          </Flex>

          <Flex
            gap={3}
            mt={3}
            pt={3}
            borderTop="1px solid"
            borderColor="gray.100"
            flexWrap="wrap"
          >
            {item?.selected_frame_details?.name && (
              <Text fontSize="xs" color="gray.500" fontFamily="body">
                🖼️ {item.selected_frame_details.name}
              </Text>
            )}
            {item?.item_details?.finish && (
              <Text fontSize="xs" color="gray.500" fontFamily="body">
                🖼️ {item?.item_details?.finish}
              </Text>
            )}
            {item?.selected_material_details?.name && (
              <Text fontSize="xs" color="gray.500" fontFamily="body">
                📦 {item.selected_material_details.name}
              </Text>
            )}
            {item?.item_details?.material && (
              <Text fontSize="xs" color="gray.500" fontFamily="body">
                📦 {item?.item_details?.material}
              </Text>
            )}
            {item?.selected_size_details?.width_cm && (
              <Text fontSize="xs" color="gray.500" fontFamily="body">
                📐 {item.selected_size_details.width_cm}×
                {item.selected_size_details.height_cm}in
              </Text>
            )}
            {item?.item_details?.size && (
              <Text fontSize="xs" color="gray.500" fontFamily="body">
                📐 {item?.item_details?.size}in
              </Text>
            )}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default CartItemCard;
