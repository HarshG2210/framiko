import { Box, Flex } from "@chakra-ui/react";

import { BackgroundSelectorGrid } from "./Selector/BackgroundSelector";
import FramePreviewStickyBar from "./Preview/FramePreviewStickyBar";
import FrameSelector from "./Selector/FrameSelector";
import PreviewDisplay from "./Preview/PreviewDisplay";
import SizeAndOrientationSelector from "./Controls/SizeAndOrientationSelector";
import { useSelector } from "react-redux";

const Configurator = ({
  estimatedTotal,
  quantity,
  selectedSize,
  selectedFrame,
  onDecrease,
  onIncrease,
  onAddToCart,
}) => {
  const { uploadedImage, imageSource } = useSelector(
    (state) => state.framePreview,
  );
  const hasActiveImage = Boolean(
    uploadedImage &&
    (imageSource === "user-upload" || imageSource === "artwork-category"),
  );
  return (
    <>
      <SizeAndOrientationSelector />

      <Flex
        mt={8}
        direction={{ base: "column", md: "column", lg: "row" }}
        gap={{ base: 4, md: 4, lg: 0 }}
      >
        <Box
          w={{ base: "100%", md: "100%", lg: "200px" }}
          order={{ base: 1, md: 1, lg: 1 }}
          mb={{ base: 4, md: 4, lg: 0 }}
        >
          <BackgroundSelectorGrid />
        </Box>

        <Box
          flex="1"
          order={{ base: 2, md: 2, lg: 2 }}
          px={{ base: 0, md: 4 }}
          borderRadius="lg"
        >
          <PreviewDisplay
            estimatedTotal={estimatedTotal}
            quantity={quantity}
            selectedSize={selectedSize}
            selectedFrame={selectedFrame}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            onAddToCart={onAddToCart}
          />
        </Box>

        <Box
          w={{ base: "100%", md: "100%", lg: "200px" }}
          order={{ base: 3, md: 3, lg: 3 }}
          mt={{ base: 4, md: 4, lg: 0 }}
          display={{ base: "block", md: "block", lg: "block" }}
        >
          <FrameSelector />
        </Box>
      </Flex>

      {estimatedTotal !== undefined && hasActiveImage && (
        <FramePreviewStickyBar
          estimatedTotal={estimatedTotal}
          quantity={quantity}
          onIncrease={onIncrease}
          selectedSize={selectedSize}
          selectedFrame={selectedFrame}
          onDecrease={onDecrease}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
};

export default Configurator;
