import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import { MdFlip, MdRotateLeft, MdRotateRight } from "react-icons/md";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  setImageTransform,
  setUploadedImage,
  setZoom,
} from "../../../../redux/slices/framePreviewSlice";
import { useDispatch, useSelector } from "react-redux";

import Cropper from "react-easy-crop";
import { FaUndo } from "react-icons/fa";

/* ----------------------------------------
 Normalize image URL for proxy
---------------------------------------- */
function normalizeImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("data:image")) return url;
  if (url.startsWith("/media")) return url;

  if (url.includes("gauravbhongade.online")) {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch (e) {
      console.error("Error parsing URL:", e);
      return url;
    }
  }

  return url;
}

/* ----------------------------------------
 Convert any remote image URL → Base64
---------------------------------------- */
async function convertToBase64(url) {
  if (!url) return null;
  if (url.startsWith("data:image")) return url;

  try {
    const fetchUrl = normalizeImageUrl(url);

    const response = await fetch(fetchUrl, {
      mode: "cors",
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read blob"));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return url; // Fallback to original URL if fetch fails
  }
}

/* ----------------------------------------
 Canvas helpers (mobile-safe)
---------------------------------------- */
function getRadianAngle(deg) {
  return (deg * Math.PI) / 180;
}

function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (err) => reject(err));
    if (!String(url).startsWith("data:")) {
      image.crossOrigin = "anonymous";
    }
    image.src = url;
  });
}

async function getCroppedImg(imageSrc, pixelCrop, rotation = 0, flip = {}) {
  if (!imageSrc) throw new Error("No image source");
  if (!pixelCrop?.width || !pixelCrop?.height) {
    throw new Error("Invalid crop area");
  }

  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas not supported");

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation,
  );

  // Limit canvas size to prevent mobile memory issues (e.g., iOS canvas limits)
  // 4096 is a safe maximum for modern mobile devices
  const MAX_CANVAS_SIZE = 4096;
  const scale = Math.min(
    1,
    MAX_CANVAS_SIZE / Math.max(bBoxWidth, bBoxHeight, 1),
  );

  canvas.width = Math.max(1, Math.round(bBoxWidth * scale));
  canvas.height = Math.max(1, Math.round(bBoxHeight * scale));

  // Apply scale to the context so all drawing operations are automatically scaled
  ctx.scale(scale, scale);

  // Center, rotate, flip, and draw the image
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  // pixelCrop coordinates are relative to the ORIGINAL image size.
  // Because the context is already scaled by `scale`, we can use pixelCrop values directly!
  // The context will automatically map them to the correct scaled physical pixels.
  // (Multiplying by `scale` here caused a double-scaling bug on mobile)
  const cropX = Math.max(0, pixelCrop.x);
  const cropY = Math.max(0, pixelCrop.y);
  const cropW = Math.max(1, pixelCrop.width);
  const cropH = Math.max(1, pixelCrop.height);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) throw new Error("Crop canvas not supported");

  // Scale the output canvas dimensions to maintain the reduced memory footprint
  croppedCanvas.width = Math.max(1, Math.round(cropW * scale));
  croppedCanvas.height = Math.max(1, Math.round(cropH * scale));

  // Draw the cropped area from the main canvas onto the output canvas
  croppedCtx.drawImage(
    canvas,
    cropX,
    cropY,
    cropW,
    cropH,
    0,
    0,
    croppedCanvas.width,
    croppedCanvas.height,
  );

  return croppedCanvas.toDataURL("image/jpeg", 0.92);
}

/* ----------------------------------------
 Component
---------------------------------------- */

const CropModal = ({ isOpen, onClose, setCroppedDimensions }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const {
    cropOriginalImage,
    selectedSize,
    imageOrientation,
    zoom,
    imageTransform,
    imageSource,
  } = useSelector((state) => state.framePreview);

  const [safeImage, setSafeImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [cropAreaPixels, setCropAreaPixels] = useState(null);
  const [cropZoom, setCropZoom] = useState(zoom?.horizontal || 1);
  const [rotation, setRotation] = useState(imageTransform?.rotate || 0);
  const [flipH, setFlipH] = useState(imageTransform?.scaleX === -1);
  const [flipV, setFlipV] = useState(imageTransform?.scaleY === -1);

  const cropAreaRef = useRef(null);

  const cropAreaHeight = useBreakpointValue({
    base: "280px",
    sm: "320px",
    md: "400px",
    lg: "420px",
  });

  const modalSize = useBreakpointValue({
    base: "full",
    md: "4xl",
  });

  /* Convert image to base64 when modal opens */
  useEffect(() => {
    if (!isOpen || !cropOriginalImage) return;

    setIsLoading(true);
    setCropAreaPixels(null);
    cropAreaRef.current = null;
    setCrop({ x: 0, y: 0 });

    convertToBase64(cropOriginalImage)
      .then((img) => setSafeImage(img))
      .catch((err) => {
        console.error("Failed to load image:", err);
        setSafeImage(cropOriginalImage);
      })
      .finally(() => setIsLoading(false));
  }, [isOpen, cropOriginalImage]);

  /* Sync transform into Redux */
  useEffect(() => {
    dispatch(
      setImageTransform({
        rotate: rotation,
        scaleX: flipH ? -1 : 1,
        scaleY: flipV ? -1 : 1,
      }),
    );
  }, [rotation, flipH, flipV, dispatch]);

  /* Aspect ratio */
  const aspect = useMemo(() => {
    if (selectedSize?.width_cm && selectedSize?.height_cm) {
      return selectedSize.width_cm / selectedSize.height_cm;
    }
    if (imageOrientation === "square") return 1;
    if (imageOrientation === "landscape") return 4 / 3;
    return 3 / 4;
  }, [selectedSize, imageOrientation]);

  const onCropComplete = useCallback((_, pixels) => {
    if (pixels && pixels.width > 0 && pixels.height > 0) {
      cropAreaRef.current = pixels;
      setCropAreaPixels(pixels);
    }
  }, []);

  /* Apply crop */
  const applyCrop = useCallback(async () => {
    const pixels = cropAreaPixels || cropAreaRef.current;

    if (!safeImage) {
      onClose();
      return;
    }

    if (!pixels || !pixels.width || !pixels.height) {
      toast({
        title: "Adjust the crop area",
        description: "Please move or zoom the image once, then tap Apply.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setIsApplying(true);

    try {
      const cropped = await getCroppedImg(safeImage, pixels, rotation, {
        horizontal: flipH,
        vertical: flipV,
      });

      dispatch(
        setUploadedImage({
          image: cropped,
          fileName: "",
          source: imageSource,
        }),
      );

      setCroppedDimensions?.({
        width: pixels.width,
        height: pixels.height,
      });

      setCropZoom(1);
      onClose();
    } catch (error) {
      console.error("Error applying crop:", error?.message || error);
      toast({
        title: "Crop failed",
        description: error?.message || "Couldn't crop the image. Try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsApplying(false);
    }
  }, [
    safeImage,
    cropAreaPixels,
    rotation,
    flipH,
    flipV,
    dispatch,
    onClose,
    setCroppedDimensions,
    imageSource,
    toast,
  ]);

  const resetTransformations = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setCropZoom(1);
    setCrop({ x: 0, y: 0 });
    dispatch(setZoom({ horizontal: 1, vertical: 1 }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={modalSize}
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent
        mx={{ base: 2, md: 4 }}
        my={{ base: 2, md: 4 }}
        maxH={{ base: "95vh", md: "90vh" }}
      >
        <ModalHeader
          borderBottom="1px solid"
          borderColor="gray.200"
          fontSize={{ base: "md", md: "lg" }}
        >
          Crop Image
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={{ base: 3, md: 4 }}>
          <VStack spacing={{ base: 4, md: 6 }}>
            <Box
              position="relative"
              width="100%"
              height={cropAreaHeight}
              bg="gray.100"
              borderRadius="md"
              overflow="hidden"
              touchAction="none" /* Prevents page scroll while panning on mobile */
            >
              {isLoading ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  <Text fontSize="sm">Loading image...</Text>
                </Box>
              ) : safeImage ? (
                <Cropper
                  image={safeImage}
                  crop={crop}
                  zoom={cropZoom}
                  minZoom={1}
                  maxZoom={3}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setCropZoom}
                  rotation={rotation}
                  restrictPosition={true}
                  showGrid={true}
                  objectFit="contain"
                  style={{
                    containerStyle: {
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#1a1a1a",
                    },
                    mediaStyle: {
                      maxWidth: "100%",
                      maxHeight: "100%",
                    },
                  }}
                />
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  <Text fontSize="sm">No image loaded</Text>
                </Box>
              )}
            </Box>

            <HStack spacing={2} justify="center" width="100%" flexWrap="wrap">
              <ButtonGroup isAttached variant="outline" size="sm">
                <IconButton
                  icon={<MdRotateLeft />}
                  aria-label="Rotate left"
                  onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                />
                <IconButton
                  icon={<MdRotateRight />}
                  aria-label="Rotate right"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                />
              </ButtonGroup>

              <ButtonGroup isAttached variant="outline" size="sm">
                <IconButton
                  icon={<MdFlip />}
                  aria-label="Flip horizontal"
                  onClick={() => setFlipH((v) => !v)}
                />
                <IconButton
                  icon={<MdFlip style={{ transform: "rotate(90deg)" }} />}
                  aria-label="Flip vertical"
                  onClick={() => setFlipV((v) => !v)}
                />
              </ButtonGroup>

              <Button
                leftIcon={<FaUndo />}
                onClick={resetTransformations}
                size="sm"
                variant="outline"
              >
                Reset
              </Button>
            </HStack>

            <Box w="100%" px={2}>
              <Text fontSize="sm" mb={2} textAlign="center">
                Zoom: {(cropZoom * 100).toFixed(0)}%
              </Text>
              <Slider
                min={1}
                max={3}
                step={0.01}
                value={cropZoom}
                onChange={setCropZoom}
              >
                <SliderTrack bg="gray.200">
                  <SliderFilledTrack bg="blue.500" />
                </SliderTrack>
                <SliderThumb boxSize={5} />
              </Slider>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="gray.200" gap={3}>
          <Button
            variant="outline"
            onClick={onClose}
            size={{ base: "sm", md: "md" }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={applyCrop}
            isDisabled={!safeImage || isLoading}
            isLoading={isApplying}
            loadingText="Applying..."
            size={{ base: "sm", md: "md" }}
          >
            Apply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CropModal;
