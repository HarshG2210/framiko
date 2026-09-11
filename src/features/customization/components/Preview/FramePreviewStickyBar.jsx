import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { Box, Button, Flex, HStack, IconButton, Text, useColorModeValue } from "@chakra-ui/react";

import React from "react";
import { useSelector } from "react-redux";

const FramePreviewStickyBar = ({
  estimatedTotal,
  quantity,
  selectedSize,
  selectedFrame,
  onDecrease,
  onIncrease,
  onAddToCart,
  isAddingToCart,
}) => {
  const widthValue = Number(selectedSize?.width_cm || 0);
  const heightValue = Number(selectedSize?.height_cm || 0);
  const calculatedPrice =
    Number.isFinite(widthValue) && Number.isFinite(heightValue)
      ? widthValue * heightValue * Number(selectedFrame?.price_addition || 0)
      : Number(estimatedTotal || 0);
  const totalPrice = calculatedPrice * Number(quantity || 1);
  const formattedCalculatedPrice = totalPrice.toFixed(2);

  const priceColor = useColorModeValue("#1A1A1A", "#FFFFFF");

  const { items: frameInventoryItems = [] } = useSelector(
    (s) => s.frameInventory || {},
  );
  const { cartItems: cartItems = [] } = useSelector((s) => s.cart || {});

  const availableForSelection = (() => {
    if (!selectedFrame?.id || !selectedSize?.id) return null;
    const inv = frameInventoryItems.find((it) => {
      return (
        Number(it.frame) === Number(selectedFrame.id) &&
        Number(it.size) === Number(selectedSize.id)
      );
    });
    const available =
      typeof inv?.quantity === "number" ? Number(inv.quantity) : null;

    if (available === null) return null;

    const existingInCart = (cartItems || []).reduce((sum, ci) => {
      try {
        const ciFrame = Number(
          ci.selected_frame ??
            ci.selected_frame_id ??
            ci.selected_frame_details?.id,
        );
        const ciSize = Number(
          ci.selected_size ??
            ci.selected_size_id ??
            ci.selected_size_details?.id,
        );
        if (
          ciFrame === Number(selectedFrame.id) &&
          ciSize === Number(selectedSize.id)
        ) {
          return sum + Number(ci.quantity || 0);
        }
      } catch (e) {
        console.log("Error occurred while processing cart item:", e);
        return sum;
      }
      return sum;
    }, 0);

    const remaining = Math.max(0, available - existingInCart);
    return remaining;
  })();

  return (
    <Box w="100%" zIndex={40} mt={5}>
      <Box
        maxW="1200px"
        mx="auto"
        px={{ base: 4, sm: 5, md: 6, lg: 8 }}
        py={{ base: 3, md: 4 }}
      >
        <Flex
          direction={{ base: "column", sm: "row" }}
          align="center"
          justify="center"
          gap={{ base: 3, sm: 6, md: 8 }}
        >
          {/* Estimated Total */}
          <Box textAlign={{ base: "center", sm: "left" }}>
            <Text
              fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
              fontWeight="700"
              color={priceColor}
              letterSpacing="-0.02em"
              lineHeight="1.2"
            >
              ₹{formattedCalculatedPrice}
            </Text>
          </Box>

          {/* Quantity */}
          <HStack spacing={3} align="center">
            <Text
              fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
              fontWeight="500"
              color={priceColor}
              whiteSpace="nowrap"
            >
              Quantity
            </Text>

            <HStack
              bg="#F5F5F5"
              border="1px solid"
              borderColor="#EBEBEB"
              borderRadius="full"
              h="40px"
              px={1}
              spacing={0}
            >
              <IconButton
                aria-label="Decrease quantity"
                icon={<AiOutlineMinus size={14} />}
                variant="ghost"
                borderRadius="full"
                size="sm"
                color="#666"
                isDisabled={quantity <= 1 || Boolean(isAddingToCart)}
                onClick={onDecrease}
                _hover={{ bg: "#EBEBEB" }}
                minW="32px"
                h="32px"
              />
              <Text
                minW="24px"
                textAlign="center"
                fontWeight="600"
                fontSize="sm"
                color="#000"
              >
                {quantity}
              </Text>
              <IconButton
                aria-label="Increase quantity"
                icon={<AiOutlinePlus size={14} />}
                variant="ghost"
                borderRadius="full"
                size="sm"
                color="#666"
                onClick={onIncrease}
                isDisabled={
                  Boolean(isAddingToCart) ||
                  (availableForSelection !== null
                    ? Number(quantity) >= Number(availableForSelection)
                    : false)
                }
                _hover={{ bg: "#EBEBEB" }}
                minW="32px"
                h="32px"
              />
            </HStack>
          </HStack>

          {/* Add to Cart */}
          <Button
            bg="brand.500"
            color="white"
            borderRadius="full"
            h="44px"
            px={{ base: 6, md: 8 }}
            fontWeight="600"
            fontSize="sm"
            onClick={onAddToCart}
            whiteSpace="nowrap"
            _hover={{ bg: "brand.500" }}
            boxShadow="0 4px 14px rgba(89, 8, 84, 0.25)"
            isLoading={Boolean(isAddingToCart)}
            isDisabled={Boolean(isAddingToCart)}
          >
            Add to Cart
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default FramePreviewStickyBar;
