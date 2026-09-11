import { Box, Button, Heading, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { addToCart, fetchCartItems } from "../../../redux/slices/cartSlice";
import {
  setCropOriginalImage,
  setImageDimensions,
  setImageOrientation,
  setSelectedFrame,
  setUploadedImage,
} from "../../../redux/slices/framePreviewSlice";
import { useDispatch, useSelector } from "react-redux";

import Configurator from "../../customization/components/Configurator";
import ImageUploader from "../../customization/components/Controls/ImageUploader";
import PreviewControls from "../../customization/components/Preview/PreviewControls";
import { fetchArtworks } from "../../../redux/slices/artworksSlice";
import { fetchPublicFrameInventory } from "../../../redux/slices/frameInventorySlice";
import { loadAuthData } from "../../../services/authStorage";
import { submitCustomizedFinalImage } from "../../../redux/slices/customizedFinalImageSlice";
import { useFrameFiltering } from "../../customization/hooks/useFrameFiltering";
import { useLocation } from "react-router-dom";
import { useSizeFiltering } from "../../customization/hooks/useSizeFiltering";

// Public inventory fetch intentionally not used here to avoid blocking add-to-cart






const FramePreview = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const location = useLocation();
  const { token } = loadAuthData();

  const { uploadedImageUrl, uploadedImageId } = useSelector(
    (s) => s.imageUpload,
  );
  const {
    uploadedImage,
    selectedSize,
    selectedFrame,
    selectedMaterial,
    cropOriginalImage,
  } = useSelector((s) => s.framePreview);
  const { artworkCategoryImages = [] } = useSelector(
    (s) => s.artworkCategoryImages,
  );
  const { frames = [] } = useSelector((s) => s.frames);
  const { items: frameInventoryItems = [] } = useSelector(
    (s) => s.frameInventory || {},
  );
  const { cartItems: currentCartItems = [] } = useSelector((s) => s.cart || {});

  useSizeFiltering();
  useFrameFiltering();

  const [quantity, setQuantity] = useState(1);

  const selectedArtwork = useMemo(() => {
    const imageUrl =
      typeof uploadedImage === "string" ? uploadedImage : uploadedImage?.image;

    if (!imageUrl) return null;

    const getBaseName = (url) => {
      if (!url) return null;
      try {
        const noQuery = url.split("?")[0];
        return noQuery.substring(noQuery.lastIndexOf("/") + 1).toLowerCase();
      } catch {
        return url.split("?")[0].toLowerCase();
      }
    };

    const candidates = [
      imageUrl,
      typeof cropOriginalImage === "string"
        ? cropOriginalImage
        : cropOriginalImage?.image,
      uploadedImageUrl,
    ].filter(Boolean);

    const candidateNames = candidates.map((c) => getBaseName(c));

    return artworkCategoryImages.find((item) => {
      const fileName = getBaseName(item.image_file) || "";
      const urlName = getBaseName(item.image_url) || "";
      const urlValueName = getBaseName(item.image_url_value) || "";

      const itemNames = [fileName, urlName, urlValueName]
        .filter(Boolean)
        .map((n) => n.toLowerCase());

      // Match by basename or by full path (without query)
      const pathMatches = candidates.some((c) => {
        const cNoQuery = c.split("?")[0];
        return (
          (item.image_file && item.image_file.split("?")[0] === cNoQuery) ||
          (item.image_url && item.image_url.split("?")[0] === cNoQuery) ||
          (item.image_url_value &&
            item.image_url_value.split("?")[0] === cNoQuery)
        );
      });

      const nameMatches = candidateNames.some((cn) => itemNames.includes(cn));

      return pathMatches || nameMatches;
    });
  }, [artworkCategoryImages, uploadedImage]);

  const widthValue = Number(selectedSize?.width_cm || 0);
  const heightValue = Number(selectedSize?.height_cm || 0);
  const calculatedPrice =
    Number.isFinite(widthValue) && Number.isFinite(heightValue)
      ? widthValue * heightValue * Number(selectedFrame?.price_addition || 0)
      : 0;
  const estimatedTotal = calculatedPrice;

  const handleArtworkAddToCart = async () => {
    if (!token) {
      toast({
        title: "Please login to use Add to Cart",
        status: "warning",
      });
      return;
    }

    if (!selectedSize?.id) {
      return toast({
        title: "Please select size",
        status: "error",
      });
    }

    if (!selectedFrame?.id) {
      return toast({
        title: "Please select frame",
        status: "error",
      });
    }

    if (!selectedMaterial?.id) {
      return toast({
        title: "Please select material",
        status: "error",
      });
    }

    if (quantity < 1) {
      setQuantity(1);
      return toast({
        title: "Quantity must be at least 1",
        status: "error",
      });
    }

    // Refresh inventory and cart from server to avoid stale-state races
    let freshInventory = frameInventoryItems;
    let freshCart = currentCartItems || [];

    // Avoid fetching public inventory synchronously here — use the store's
    // `frameInventoryItems` which may be kept up-to-date elsewhere. This
    // prevents protected backend inventory endpoints from causing 401 errors
    // to interrupt the Add to Cart flow in deployed frontends.
    try {
      // Dispatch the public inventory fetch but do not use unwrap() so a
      // 401 from the public endpoint won't throw — instead we read the
      // action payload and fall back to existing state.
      const invAction = await dispatch(fetchPublicFrameInventory());
      const invPayload = invAction?.payload ?? [];
      freshInventory = Array.isArray(invPayload)
        ? invPayload
        : invPayload?.results || invPayload?.data || freshInventory;
    } catch (e) {
      console.log("Error fetching frame inventory:", e);
      // ignore and continue with whatever is in the store
    }

    try {
      const cartPayload = await dispatch(fetchCartItems()).unwrap();
      freshCart =
        cartPayload?.items ||
        cartPayload?.cart_items ||
        cartPayload ||
        freshCart;
    } catch (e) {
      console.log("Error fetching cart items:", e);
      // ignore fetch error and fall back to local state
    }

    if (selectedFrame?.id && selectedSize?.id) {
      const inv = (freshInventory || []).find((it) => {
        return (
          Number(it.frame) === Number(selectedFrame.id) &&
          Number(it.size) === Number(selectedSize.id)
        );
      });

      const available =
        typeof inv?.quantity === "number" ? Number(inv.quantity) : null;

      if (available !== null && !isNaN(available)) {
        const existingInCart = (freshCart || []).reduce((sum, ci) => {
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

        if (existingInCart + Number(quantity) > available) {
          return toast({
            title: `Only ${Math.max(0, available - existingInCart)} frame(s) left for this size (already ${existingInCart} in cart)`,
            status: "error",
          });
        }
      }
    }

    try {
      const canvas = document.querySelector("#export-stage canvas");

      if (!canvas) {
        toast({
          title: "Preview not ready",
          status: "error",
        });
        return;
      }

      const dataUrl = canvas.toDataURL("image/png", 1.0);
      console.log("Data URL:", dataUrl);

      const customizedArtworkResponse = await dispatch(
        submitCustomizedFinalImage({
          final_image: dataUrl,
          is_completed: true,
        }),
      ).unwrap();

      let payload = null;

      if (selectedArtwork?.id) {
        payload = {
          content_type: "artwork_category_image",
          artwork_category_image_id: selectedArtwork.id,
          ...(customizedArtworkResponse?.id
            ? {
                customized_artwork_id: customizedArtworkResponse.id,
              }
            : {}),
          quantity,
          selected_size_id: selectedSize.id,
          selected_frame_id: selectedFrame.id,
          selected_material_id: selectedMaterial.id,
        };
      } else if (uploadedImageUrl) {
        const artworks = await dispatch(fetchArtworks()).unwrap();

        if (!Array.isArray(artworks) || artworks.length === 0) {
          toast({
            title: "No artworks found",
            status: "error",
          });
          return;
        }

        let uploadedArtwork = null;

        if (uploadedImageId) {
          uploadedArtwork = artworks.find((art) => art.id === uploadedImageId);
        }

        if (!uploadedArtwork) {
          uploadedArtwork = artworks.find(
            (art) =>
              art.image_file?.split("?")[0] ===
                uploadedImageUrl?.split("?")[0] ||
              art.image_url?.split("?")[0] === uploadedImageUrl?.split("?")[0],
          );
        }

        if (!uploadedArtwork) {
          uploadedArtwork = [...artworks].sort((a, b) => b.id - a.id)[0];
        }

        if (!uploadedArtwork?.id) {
          toast({
            title: "Uploaded artwork not found",
            status: "error",
          });
          return;
        }

        payload = {
          content_type: "customized_artwork",
          ...(customizedArtworkResponse?.id
            ? {
                customized_artwork_id: customizedArtworkResponse.id,
              }
            : {
                artwork_id: uploadedArtwork.id,
              }),
          quantity,
          selected_size_id: selectedSize.id,
          selected_frame_id: selectedFrame.id,
          selected_material_id: selectedMaterial.id,
          uploaded_image_id: uploadedImageId || uploadedArtwork.id,
          uploaded_image_url:
            uploadedImageUrl ||
            uploadedArtwork?.image_file ||
            uploadedArtwork?.image_url ||
            null,
        };
      } else {
        toast({
          title: "Please select artwork",
          status: "error",
        });
        return;
      }

      console.log("ADD TO CART PAYLOAD =>", payload);

      await dispatch(addToCart(payload)).unwrap();
      await dispatch(fetchCartItems()).unwrap();

      toast({
        title: "Artwork added to cart successfully",
        status: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to save preview or add to cart",
        status: "error",
      });
    }
  };

  useEffect(() => {
    if (!uploadedImageUrl) return;

    dispatch(
      setUploadedImage({
        image: uploadedImageUrl,
        fileName: "Uploaded Image",
        source: "user-upload",
      }),
    );

    const img = new Image();
    img.onload = () => {
      const orientation =
        img.width > img.height
          ? "landscape"
          : img.height > img.width
            ? "portrait"
            : "square";

      dispatch(setImageDimensions({ width: img.width, height: img.height }));
      dispatch(setImageOrientation(orientation));
    };
    img.src = uploadedImageUrl;
  }, [uploadedImageUrl, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const artworkId = params.get("artworkId");
    const frameId = params.get("frameId");

    if (artworkId || frameId) {
      if (artworkId) {
        const artwork = artworkCategoryImages.find(
          (a) => Number(a.id) === Number(artworkId),
        );
        if (artwork) {
          dispatch(
            setUploadedImage({
              image: artwork.image_file,
              fileName: artwork.name || "Selected Artwork",
              source: "artwork-category",
            }),
          );
          dispatch(
            setCropOriginalImage({
              image: artwork.image_file,
            }),
          );

          const img = new Image();
          img.onload = () => {
            const orientation =
              img.width > img.height
                ? "landscape"
                : img.height > img.width
                  ? "portrait"
                  : "square";
            dispatch(
              setImageDimensions({ width: img.width, height: img.height }),
            );
            dispatch(setImageOrientation(orientation));
          };
          img.src = artwork.image_file;
        }
      }

      if (frameId) {
        const frame = frames.find((f) => Number(f.id) === Number(frameId));
        if (frame) {
          dispatch(setSelectedFrame(frame));
        }
      }
    }
  }, [location.search, artworkCategoryImages, frames, dispatch]);

  const handleIncreaseQuantity = () => {
    // If frame & size selected, check inventory
    if (selectedFrame?.id && selectedSize?.id) {
      const inv = frameInventoryItems.find((it) => {
        return (
          Number(it.frame) === Number(selectedFrame.id) &&
          Number(it.size) === Number(selectedSize.id)
        );
      });

      const available =
        typeof inv?.quantity === "number" ? Number(inv.quantity) : null;

      if (available !== null && !isNaN(available)) {
        // compute existing in cart for this selection
        const existingInCart = (currentCartItems || []).reduce((sum, ci) => {
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

        if (existingInCart + (quantity + 1) > available) {
          toast({
            title: `Only ${Math.max(0, available - existingInCart)} frame(s) available for this size`,
            status: "error",
          });
          return;
        }
      }
    }

    setQuantity((prev) => prev + 1);
  };

  return (
    <Box width="full" bg="#fff">
      <ImageUploader />

      {uploadedImage && (
        <Configurator
          estimatedTotal={estimatedTotal}
          quantity={quantity}
          selectedSize={selectedSize}
          selectedFrame={selectedFrame}
          onDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
          onIncrease={handleIncreaseQuantity}
          onAddToCart={handleArtworkAddToCart}
        />
      )}
    </Box>
  );
};

export default FramePreview;
