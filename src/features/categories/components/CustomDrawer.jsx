import { AnimatePresence, motion } from "framer-motion";
import { Box, Flex } from "@chakra-ui/react";

const MotionBox = motion(Box);

const CustomDrawer = ({
  isOpen,
  onClose,
  placement = "right",
  overlayBg = "blackAlpha.700",
  children,
}) => {
  const isRight = placement === "right";
  const isTop = placement === "top";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <MotionBox
            position="fixed"
            inset="0"
            bg={overlayBg}
            zIndex={1400}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <MotionBox
            position="fixed"
            inset="0"
            bg="transparent"
            zIndex={1500}
            fontFamily="body"
            color="neutral.900"
            initial={
              isRight ? { x: "100%" } : isTop ? { y: "-100%" } : { x: "-100%" }
            }
            animate={{ x: 0, y: 0 }}
            exit={
              isRight ? { x: "100%" } : isTop ? { y: "-100%" } : { x: "-100%" }
            }
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
          >
            {/* Scroll Container (scroll works, scrollbar hidden) */}
            <Flex
              w="100%"
              h="100%"
              overflowY="auto"
              fontFamily="body"
              color="neutral.900"
              css={{
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE / Edge
                "&::-webkit-scrollbar": {
                  display: "none", // Chrome / Safari
                },
              }}
            >
              {children}
            </Flex>
          </MotionBox>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomDrawer;
