import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Skeleton,
  SkeletonText,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  FiChevronRight,
  FiClock,
  FiShoppingBag,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";
import {
  clearCart,
  fetchCartItems,
  removeCartItem,
} from "../../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

import CartItemCard from "./CartItemCard";
import EmptyCart from "./EmptyCart";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const cartItems = useSelector((s) => s.cart.cartItems || []);
  const cartLoading = useSelector((s) => s.cart.loading);

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.total_price || 0),
    0,
  );

  const deliveryEstimate = "4-6 business days";
  const freeDeliveryThreshold = 499;
  const isFreeDelivery = total >= freeDeliveryThreshold;
  const remainingForFree = freeDeliveryThreshold - total;

  const handleRemove = async (cartItemId) => {
    await dispatch(removeCartItem(cartItemId)).unwrap();
    await dispatch(fetchCartItems()).unwrap();
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      await dispatch(fetchCartItems()).unwrap();
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("CLEAR CART ERROR =>", error);
      toast({
        title: "Failed to clear cart",
        description: "Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size={{ base: "full", md: "md" }}
    >
      <DrawerOverlay backdropFilter="blur(4px)" />
      <DrawerContent>
        <DrawerCloseButton mt={2} />

        <DrawerHeader borderBottom="1px solid" borderColor="gray.200" py={4}>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={3}>
              <Icon as={FiShoppingBag} fontSize="24px" color="gold.500" />
              <Text fontWeight="800" fontSize="xl" color="gray.800" fontFamily="body">
                Your Cart
              </Text>
            </Flex>
          </Flex>
        </DrawerHeader>

        <DrawerBody bg="gray.50" p={0} overflowY="auto">
          {cartLoading ? (
            <Box p={6}>
              <VStack spacing={4} align="stretch">
                {[1, 2, 3].map((i) => (
                  <Box
                    key={i}
                    bg="white"
                    p={4}
                    borderRadius="xl"
                    boxShadow="sm"
                  >
                    <Flex gap={4}>
                      <Skeleton w="100px" h="100px" borderRadius="lg" />
                      <Box flex={1}>
                        <SkeletonText noOfLines={3} spacing={3} />
                        <Skeleton h="30px" w="60%" mt={2} />
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Box>
          ) : cartItems.length === 0 ? (
            <EmptyCart onClose={onClose} />
          ) : (
            <Box p={4}>
              {!isFreeDelivery && (
                <Box
                  bg="white"
                  p={4}
                  borderRadius="xl"
                  mb={4}
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Flex align="center" gap={3}>
                    <Icon as={FiTruck} color="gold.500" fontSize="20px" />
                    <Box flex={1}>
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        color="gray.700"
                        fontFamily="body"
                      >
                        Add ₹{remainingForFree.toFixed(0)} more for FREE
                        Delivery!
                      </Text>
                      <Box
                        h="4px"
                        bg="gray.200"
                        borderRadius="full"
                        mt={1}
                        overflow="hidden"
                      >
                        <Box
                          h="100%"
                          bg="gold.500"
                          w={`${Math.min((total / freeDeliveryThreshold) * 100, 100)}%`}
                          transition="width 0.5s ease"
                        />
                      </Box>
                    </Box>
                  </Flex>
                </Box>
              )}

              {cartItems.map((item) => (
                <CartItemCard key={item.id} item={item} onRemove={handleRemove} />
              ))}
            </Box>
          )}
        </DrawerBody>

        {!cartLoading && cartItems.length > 0 && (
          <DrawerFooter
            borderTop="1px solid"
            borderColor="gray.200"
            bg="white"
            p={4}
            flexDirection="column"
            gap={4}
          >
            <Flex align="center" justify="space-between" w="full" gap={4}>
              <Flex align="center" gap={2}>
                <Icon as={FiClock} color="gray.500" />
                <Text fontSize="sm" color="gray.600">
                  Delivery in {deliveryEstimate}
                </Text>
              </Flex>
              {isFreeDelivery && (
                <Badge
                  bg="green.500"
                  color="white"
                  px={2}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                >
                  <Icon as={FiTruck} mr={1} />
                  FREE Delivery
                </Badge>
              )}
            </Flex>

            <Divider />

            <Flex justify="space-between" w="full">
              <Box>
                {!cartLoading && cartItems.length > 0 && (
                  <Badge
                    bg="gold.500"
                    color="white"
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="600"
                  >
                    {cartItems.length}{" "}
                    {cartItems.length === 1 ? "Item" : "Items"}
                  </Badge>
                )}
              </Box>
              <Box textAlign="right">
                <Text color="gray.500" fontSize="sm">
                  Total Amount
                </Text>
                <Text fontWeight="800" fontSize="2xl" color="gold.600">
                  ₹{total.toFixed(2)}
                </Text>
              </Box>
            </Flex>

            <VStack spacing={3} w="full">
              <Button
                w="full"
                size="lg"
                variant="solid"
                fontFamily="body"
                rightIcon={<FiChevronRight />}
                onClick={handleCheckout}
                isDisabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
              <Button
                w="full"
                variant="outline"
                size="md"
                fontFamily="body"
                leftIcon={<FiTrash2 />}
                onClick={handleClearCart}
                isDisabled={cartItems.length === 0}
              >
                Clear Cart
              </Button>
            </VStack>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
