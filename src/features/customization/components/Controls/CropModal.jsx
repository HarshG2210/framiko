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
} from "@chakra-ui/react";
import { MdFlip, MdRotateLeft, MdRotateRight } from "react-icons/md";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

  // Use the Vite proxy for API/LAN media URLs so canvas stays same-origin.
  try {
    const urlObj = new URL(url, window.location.origin);
    if (urlObj.pathname.startsWith("/media/")) {
      return `${urlObj.pathname}${urlObj.search}`;
    }
  } catch (error) {
    console.error("Error parsing image URL:", error);
  }

  return url;
}

/* ----------------------------------------
 Convert any remote image URL → Base64
 This removes CORS & canvas taint issues
---------------------------------------- */
async function convertToBase64(url) {
  if (!url) return null;
  if (url.startsWith("data:image")) return url;

  try {
    // Use normalized URL (relative path for proxy)
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
    throw error;
  }
}

/* ----------------------------------------
 Canvas crop helper
---------------------------------------- */
function getRadianAngle(deg) {
  return (deg * Math.PI) / 180;
}

async function getCroppedImg(imageSrc, pixelCrop, rotation, flip) {
  const img = new Image();
  if (!imageSrc.startsWith("data:image")) {
    img.crossOrigin = "anonymous";
  }

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error("Failed to load image for cropping"));
    img.src = imageSrc;
  });

  const imageWidth = img.naturalWidth || img.width;
  const imageHeight = img.naturalHeight || img.height;
  if (!imageWidth || !imageHeight) {
    throw new Error("Image has no usable dimensions");
  }

  // Large source images can exceed the canvas memory limit on mobile browsers.
  const maxCanvasSize = 2048;
  const scale = Math.min(1, maxCanvasSize / Math.max(imageWidth, imageHeight));
  const scaledWidth = Math.max(1, Math.round(imageWidth * scale));
  const scaledHeight = Math.max(1, Math.round(imageHeight * scale));
  const scaledCrop = {
    x: Math.round(pixelCrop.x * scale),
    y: Math.round(pixelCrop.y * scale),
    width: Math.max(1, Math.round(pixelCrop.width * scale)),
    height: Math.max(1, Math.round(pixelCrop.height * scale)),
  };

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available");

  const maxSize = Math.max(scaledWidth, scaledHeight);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = Math.ceil(safeArea);
  canvas.height = Math.ceil(safeArea);

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-scaledWidth / 2, -scaledHeight / 2);
  ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

  canvas.width = scaledCrop.width;
  canvas.height = scaledCrop.height;

  ctx.putImageData(
    data,
    Math.round(-safeArea / 2 + scaledWidth / 2 - scaledCrop.x),
    Math.round(-safeArea / 2 + scaledHeight / 2 - scaledCrop.y)
  );

  return canvas.toDataURL("image/png");
}

/* ----------------------------------------
 Component
---------------------------------------- */

const CropModal = ({ isOpen, onClose, setCroppedDimensions }) => {
  const dispatch = useDispatch();

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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [cropAreaPixels, setCropAreaPixels] = useState(null);
  const [cropZoom, setCropZoom] = useState(zoom.horizontal);
  const [rotation, setRotation] = useState(imageTransform?.rotate || 0);
  const [flipH, setFlipH] = useState(imageTransform?.scaleX === -1);
  const [flipV, setFlipV] = useState(imageTransform?.scaleY === -1);

  /* Convert image to base64 when modal opens */
  useEffect(() => {
    if (!isOpen || !cropOriginalImage) return;

    setIsLoading(true);
    setSafeImage(null);
    convertToBase64(cropOriginalImage)
      .then(setSafeImage)
      .catch((err) => {
        console.error("Failed to load image:", err);
        setCropAreaPixels(null);
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
      })
    );
  }, [rotation, flipH, flipV, dispatch]);

  /* Aspect ratio */
  const aspect = useMemo(() => {
    if (selectedSize) return selectedSize.width_cm / selectedSize.height_cm;
    if (imageOrientation === "square") return 1;
    if (imageOrientation === "landscape") return 4 / 3;
    return 3 / 4;
  }, [selectedSize, imageOrientation]);

  /* Apply crop */
  const applyCrop = useCallback(async () => {
    if (!safeImage || !cropAreaPixels) {
      onClose();
      return;
    }

    try {
      const cropped = await getCroppedImg(safeImage, cropAreaPixels, rotation, {
        horizontal: flipH,
        vertical: flipV,
      });

      dispatch(
        setUploadedImage({
          image: cropped,
          fileName: "",
          source: imageSource,
        })
      );

      setCroppedDimensions?.({
        width: cropAreaPixels.width,
        height: cropAreaPixels.height,
      });
      setCropZoom(zoom.horizontal);
      onClose();
    } catch (error) {
      console.error("Error applying crop:", error);
      alert("Failed to crop image. Please try again.");
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
    zoom.horizontal,
  ]);

  /* Reset transforms */
  const resetTransformations = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setCropZoom(1);
    setCrop({ x: 0, y: 0 });
    dispatch(setZoom({ horizontal: 1, vertical: 1 }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom="1px solid" borderColor="gray.200">
          Crop Image
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6}>
            <Box
              position="relative"
              width="100%"
              height="400px"
              bg="gray.100"
              borderRadius="md"
              overflow="hidden"
            >
              {isLoading ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  <Text>Loading image...</Text>
                </Box>
              ) : safeImage ? (
                <Cropper
                  image={safeImage}
                  crop={crop}
                  zoom={cropZoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onCropComplete={(_, pixels) => setCropAreaPixels(pixels)}
                  onZoomChange={setCropZoom}
                  rotation={rotation}
                  restrictPosition={true}
                />
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  <Text>No image loaded</Text>
                </Box>
              )}
            </Box>

            {/* Controls */}
            <HStack spacing={3} justify="space-between" width="100%">
              <HStack spacing={2}>
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
            </HStack>

            {/* Zoom */}
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
                <SliderThumb boxSize={4} />
              </Slider>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="gray.200">
          <ButtonGroup spacing={4}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={applyCrop}
              isDisabled={!safeImage || isLoading}
            >
              Apply
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CropModal;
