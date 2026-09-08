import {
  Box,
  HStack,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  VStack,
} from "@chakra-ui/react";

import React from "react";

/**
 * Product Card Skeleton Loader
 */
export const ProductCardSkeleton = ({ isLoaded = false }) => (
  <Box borderRadius="md" overflow="hidden" boxShadow="sm">
    <Skeleton height="250px" isLoaded={isLoaded} />
    <VStack p={4} spacing={3} align="start" w="100%">
      <Skeleton height="20px" width="80%" isLoaded={isLoaded} />
      <Skeleton height="16px" width="60%" isLoaded={isLoaded} />
      <HStack w="100%" spacing={2}>
        <Skeleton height="20px" width="40%" isLoaded={isLoaded} />
        <Skeleton height="20px" width="30%" isLoaded={isLoaded} />
      </HStack>
      <Skeleton
        height="40px"
        width="100%"
        isLoaded={isLoaded}
        borderRadius="md"
      />
    </VStack>
  </Box>
);

/**
 * Product List Grid Skeleton Loader
 */
export const ProductListSkeleton = ({ count = 8, isLoaded = false }) => (
  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
    {Array.from({ length: count }).map((_, idx) => (
      <ProductCardSkeleton key={idx} isLoaded={isLoaded} />
    ))}
  </SimpleGrid>
);

/**
 * Product Details Skeleton Loader
 */
export const ProductDetailsSkeleton = ({ isLoaded = false }) => (
  <Box>
    <HStack spacing={8} align="start">
      {/* Image skeleton */}
      <Box flex={1}>
        <Skeleton height="500px" borderRadius="md" isLoaded={isLoaded} />
      </Box>

      {/* Details skeleton */}
      <VStack flex={1} spacing={4} align="start">
        <Skeleton height="32px" width="80%" isLoaded={isLoaded} />
        <Skeleton height="24px" width="60%" isLoaded={isLoaded} />

        {/* Price and rating */}
        <HStack spacing={4}>
          <Skeleton height="24px" width="100px" isLoaded={isLoaded} />
          <Skeleton height="24px" width="150px" isLoaded={isLoaded} />
        </HStack>

        {/* Description */}
        <SkeletonText noOfLines={4} spacing={2} isLoaded={isLoaded} />

        {/* Buttons */}
        <VStack w="100%" spacing={2}>
          <Skeleton
            height="45px"
            width="100%"
            isLoaded={isLoaded}
            borderRadius="md"
          />
          <Skeleton
            height="45px"
            width="100%"
            isLoaded={isLoaded}
            borderRadius="md"
          />
        </VStack>
      </VStack>
    </HStack>
  </Box>
);

/**
 * Cart Item Skeleton Loader
 */
export const CartItemSkeleton = ({ isLoaded = false }) => (
  <HStack spacing={4} p={4} borderRadius="md" borderWidth="1px" w="100%">
    <Skeleton
      height="100px"
      width="100px"
      borderRadius="md"
      isLoaded={isLoaded}
    />
    <VStack flex={1} align="start" spacing={2}>
      <Skeleton height="20px" width="70%" isLoaded={isLoaded} />
      <Skeleton height="16px" width="50%" isLoaded={isLoaded} />
      <Skeleton height="16px" width="40%" isLoaded={isLoaded} />
    </VStack>
    <VStack align="end" spacing={2}>
      <Skeleton height="20px" width="80px" isLoaded={isLoaded} />
      <Skeleton
        height="30px"
        width="100px"
        isLoaded={isLoaded}
        borderRadius="md"
      />
    </VStack>
  </HStack>
);

/**
 * Cart Skeleton Loader
 */
export const CartSkeleton = ({ count = 3, isLoaded = false }) => (
  <VStack spacing={4}>
    {Array.from({ length: count }).map((_, idx) => (
      <CartItemSkeleton key={idx} isLoaded={isLoaded} />
    ))}
    <Box w="100%" borderTopWidth="1px" pt={4}>
      <VStack align="end" spacing={3}>
        <Skeleton height="20px" width="200px" isLoaded={isLoaded} />
        <Skeleton
          height="45px"
          width="150px"
          isLoaded={isLoaded}
          borderRadius="md"
        />
      </VStack>
    </Box>
  </VStack>
);

/**
 * Checkout Form Skeleton Loader
 */
export const CheckoutFormSkeleton = ({ isLoaded = false }) => (
  <VStack spacing={6}>
    {/* Section 1 */}
    <Box w="100%" p={4} borderWidth="1px" borderRadius="md">
      <Skeleton height="24px" width="200px" mb={4} isLoaded={isLoaded} />
      <VStack spacing={3}>
        <Skeleton
          height="45px"
          width="100%"
          isLoaded={isLoaded}
          borderRadius="md"
        />
        <Skeleton
          height="45px"
          width="100%"
          isLoaded={isLoaded}
          borderRadius="md"
        />
        <Skeleton
          height="45px"
          width="100%"
          isLoaded={isLoaded}
          borderRadius="md"
        />
      </VStack>
    </Box>

    {/* Section 2 */}
    <Box w="100%" p={4} borderWidth="1px" borderRadius="md">
      <Skeleton height="24px" width="200px" mb={4} isLoaded={isLoaded} />
      <VStack spacing={3}>
        <Skeleton
          height="45px"
          width="100%"
          isLoaded={isLoaded}
          borderRadius="md"
        />
        <Skeleton
          height="45px"
          width="100%"
          isLoaded={isLoaded}
          borderRadius="md"
        />
      </VStack>
    </Box>
  </VStack>
);

/**
 * Order Skeleton Loader
 */
export const OrderSkeleton = ({ isLoaded = false }) => (
  <Box p={6} borderWidth="1px" borderRadius="md">
    {/* Header */}
    <HStack mb={6} pb={4} borderBottomWidth="1px">
      <VStack align="start" flex={1} spacing={2}>
        <Skeleton height="20px" width="150px" isLoaded={isLoaded} />
        <Skeleton height="16px" width="120px" isLoaded={isLoaded} />
      </VStack>
      <Skeleton
        height="30px"
        width="100px"
        isLoaded={isLoaded}
        borderRadius="full"
      />
    </HStack>

    {/* Items */}
    <VStack spacing={4} mb={6}>
      {Array.from({ length: 2 }).map((_, idx) => (
        <HStack key={idx} w="100%" spacing={4}>
          <Skeleton
            height="80px"
            width="80px"
            borderRadius="md"
            isLoaded={isLoaded}
          />
          <VStack flex={1} align="start" spacing={2}>
            <Skeleton height="16px" width="70%" isLoaded={isLoaded} />
            <Skeleton height="14px" width="50%" isLoaded={isLoaded} />
          </VStack>
          <Skeleton height="16px" width="60px" isLoaded={isLoaded} />
        </HStack>
      ))}
    </VStack>

    {/* Summary */}
    <Box borderTopWidth="1px" pt={4}>
      <VStack align="end" spacing={2}>
        <Skeleton height="16px" width="150px" isLoaded={isLoaded} />
        <Skeleton height="16px" width="150px" isLoaded={isLoaded} />
        <Skeleton height="20px" width="150px" isLoaded={isLoaded} />
      </VStack>
    </Box>
  </Box>
);

/**
 * Order List Table Skeleton Loader
 */
export const OrderListSkeleton = ({ count = 5, isLoaded = false }) => (
  <VStack spacing={3}>
    {/* Header */}
    <HStack w="100%" p={4} bg="gray.50" borderRadius="md" spacing={4}>
      <Skeleton height="16px" width="15%" isLoaded={isLoaded} />
      <Skeleton height="16px" width="20%" isLoaded={isLoaded} />
      <Skeleton height="16px" width="15%" isLoaded={isLoaded} />
      <Skeleton height="16px" width="15%" isLoaded={isLoaded} />
      <Skeleton height="16px" width="20%" isLoaded={isLoaded} />
      <Skeleton height="16px" width="15%" isLoaded={isLoaded} />
    </HStack>

    {/* Rows */}
    {Array.from({ length: count }).map((_, idx) => (
      <HStack
        key={idx}
        w="100%"
        p={4}
        borderWidth="1px"
        borderRadius="md"
        spacing={4}
      >
        <Skeleton height="16px" width="15%" isLoaded={isLoaded} />
        <Skeleton height="16px" width="20%" isLoaded={isLoaded} />
        <Skeleton height="16px" width="15%" isLoaded={isLoaded} />
        <Skeleton height="16px" width="15%" isLoaded={isLoaded} />
        <Skeleton
          height="20px"
          width="80px"
          isLoaded={isLoaded}
          borderRadius="full"
        />
        <Skeleton
          height="30px"
          width="70px"
          isLoaded={isLoaded}
          borderRadius="md"
        />
      </HStack>
    ))}
  </VStack>
);

/**
 * Profile Card Skeleton Loader
 */
export const ProfileCardSkeleton = ({ isLoaded = false }) => (
  <Box p={6} borderWidth="1px" borderRadius="md">
    <HStack spacing={4} mb={6}>
      <Skeleton
        height="100px"
        width="100px"
        borderRadius="full"
        isLoaded={isLoaded}
      />
      <VStack align="start" flex={1} spacing={3}>
        <Skeleton height="24px" width="200px" isLoaded={isLoaded} />
        <Skeleton height="16px" width="200px" isLoaded={isLoaded} />
        <Skeleton height="16px" width="150px" isLoaded={isLoaded} />
      </VStack>
    </HStack>

    <VStack align="start" spacing={4}>
      {Array.from({ length: 4 }).map((_, idx) => (
        <HStack key={idx} w="100%" spacing={4}>
          <Skeleton height="16px" width="100px" isLoaded={isLoaded} />
          <Skeleton height="16px" width="200px" isLoaded={isLoaded} flex={1} />
        </HStack>
      ))}
    </VStack>
  </Box>
);

/**
 * Admin Table Skeleton Loader
 */
export const AdminTableSkeleton = ({
  columns = 6,
  rows = 8,
  isLoaded = false,
}) => (
  <Box overflowX="auto">
    <VStack spacing={0} w="100%">
      {/* Header */}
      <HStack w="100%" p={4} bg="gray.100" borderBottomWidth="1px" spacing={4}>
        {Array.from({ length: columns }).map((_, idx) => (
          <Skeleton key={idx} height="16px" width="100%" isLoaded={isLoaded} />
        ))}
      </HStack>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <HStack key={rowIdx} w="100%" p={4} borderBottomWidth="1px" spacing={4}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              height="16px"
              width="100%"
              isLoaded={isLoaded}
            />
          ))}
        </HStack>
      ))}
    </VStack>
  </Box>
);

/**
 * Dashboard Card Skeleton Loader
 */
export const DashboardCardSkeleton = ({ isLoaded = false }) => (
  <Box p={4} borderWidth="1px" borderRadius="md">
    <Skeleton height="16px" width="70%" mb={3} isLoaded={isLoaded} />
    <Skeleton height="28px" width="50%" mb={2} isLoaded={isLoaded} />
    <Skeleton height="14px" width="80%" isLoaded={isLoaded} />
  </Box>
);

/**
 * Dashboard Grid Skeleton Loader
 */
export const DashboardGridSkeleton = ({ count = 4, isLoaded = false }) => (
  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
    {Array.from({ length: count }).map((_, idx) => (
      <DashboardCardSkeleton key={idx} isLoaded={isLoaded} />
    ))}
  </SimpleGrid>
);

/**
 * Customization Preview Skeleton Loader
 */
export const CustomizationSkeleton = ({ isLoaded = false }) => (
  <Box>
    <HStack spacing={6} align="start">
      {/* Canvas area */}
      <Box flex={2}>
        <Skeleton height="500px" borderRadius="md" isLoaded={isLoaded} />
      </Box>

      {/* Controls sidebar */}
      <Box flex={1}>
        <VStack spacing={4}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Box key={idx} w="100%" p={3} borderWidth="1px" borderRadius="md">
              <Skeleton height="20px" width="70%" mb={3} isLoaded={isLoaded} />
              <Skeleton
                height="40px"
                width="100%"
                isLoaded={isLoaded}
                borderRadius="md"
              />
            </Box>
          ))}
        </VStack>
      </Box>
    </HStack>
  </Box>
);

/**
 * Wishlist Skeleton Loader
 */
export const WishlistSkeleton = ({ count = 6, isLoaded = false }) => (
  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
    {Array.from({ length: count }).map((_, idx) => (
      <ProductCardSkeleton key={idx} isLoaded={isLoaded} />
    ))}
  </SimpleGrid>
);

/**
 * Review Skeleton Loader
 */
export const ReviewSkeleton = ({ isLoaded = false }) => (
  <Box p={4} borderWidth="1px" borderRadius="md" mb={4}>
    <HStack mb={3}>
      <Skeleton
        height="40px"
        width="40px"
        borderRadius="full"
        isLoaded={isLoaded}
      />
      <VStack align="start" flex={1} spacing={1}>
        <Skeleton height="16px" width="150px" isLoaded={isLoaded} />
        <Skeleton height="12px" width="100px" isLoaded={isLoaded} />
      </VStack>
    </HStack>
    <SkeletonText noOfLines={3} spacing={2} isLoaded={isLoaded} />
  </Box>
);

/**
 * Reviews List Skeleton Loader
 */
export const ReviewsListSkeleton = ({ count = 3, isLoaded = false }) => (
  <VStack spacing={4}>
    {Array.from({ length: count }).map((_, idx) => (
      <ReviewSkeleton key={idx} isLoaded={isLoaded} />
    ))}
  </VStack>
);

/**
 * Navbar Skeleton Loader
 */
export const NavbarSkeleton = ({ isLoaded = false }) => (
  <HStack w="100%" p={4} borderBottomWidth="1px" spacing={6}>
    <Skeleton
      height="30px"
      width="150px"
      isLoaded={isLoaded}
      borderRadius="md"
    />
    <HStack flex={1} spacing={4}>
      {Array.from({ length: 4 }).map((_, idx) => (
        <Skeleton key={idx} height="20px" width="80px" isLoaded={isLoaded} />
      ))}
    </HStack>
    <HStack spacing={2}>
      <Skeleton
        height="40px"
        width="40px"
        borderRadius="full"
        isLoaded={isLoaded}
      />
      <Skeleton
        height="40px"
        width="40px"
        borderRadius="full"
        isLoaded={isLoaded}
      />
    </HStack>
  </HStack>
);
