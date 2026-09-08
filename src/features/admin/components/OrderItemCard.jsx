import React from "react";
import {
  Flex,
  HStack,
  Tag,
  Text,
  Box,
  Badge,
  Grid,
  GridItem,
  SimpleGrid,
} from "@chakra-ui/react";
import { Field, SectionCard } from "./OrderUIComponents";
import ImageGallery from "./ImageGallery";
import {
  fmtVal,
  fmtDate,
  fmtCurrency,
  orderColor,
} from "../utils/orderFormatters";

/**
 * Nested component: Artwork details sub-section
 */
const ArtworkDetailsSection = React.memo(({ artwork }) => {
  if (!artwork) return null;

  return (
    <Box mt={3} p={3} bg="gray.50" borderRadius="md">
      <Text fontWeight="semibold" fontSize="sm" mb={1}>
        Artwork Details
      </Text>
      <Field label="ID">{fmtVal(artwork.id)}</Field>
      <Field label="Name">{fmtVal(artwork.name)}</Field>
      <Field label="Type">{fmtVal(artwork.type)}</Field>
      <Field label="Category">{fmtVal(artwork.category)}</Field>
      <Field label="SKU">{fmtVal(artwork.sku)}</Field>
      <Field label="Is Completed">{fmtVal(artwork.is_completed)}</Field>
      <Field label="Image URL">{fmtVal(artwork.image_url)}</Field>
      <Field label="Image1 URL">{fmtVal(artwork.image1_url)}</Field>
      <Field label="Image2 URL">{fmtVal(artwork.image2_url)}</Field>
      <Field label="Image3 URL">{fmtVal(artwork.image3_url)}</Field>
      <Field label="Image4 URL">{fmtVal(artwork.image4_url)}</Field>
      <Field label="Uploaded Image URL">
        {fmtVal(artwork.uploaded_image_url)}
      </Field>

      {artwork.user_uploaded_artwork && (
        <Box
          mt={3}
          p={3}
          bg="white"
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Text fontWeight="semibold" fontSize="sm" mb={1}>
            User Uploaded Artwork
          </Text>
          <Field label="ID">{fmtVal(artwork.user_uploaded_artwork.id)}</Field>
          <Field label="Type">
            {fmtVal(artwork.user_uploaded_artwork.type)}
          </Field>
          <Field label="Name">
            {fmtVal(artwork.user_uploaded_artwork.name)}
          </Field>
          <Field label="Image URL">
            {fmtVal(artwork.user_uploaded_artwork.image_url)}
          </Field>
          <Field label="Image File URL">
            {fmtVal(artwork.user_uploaded_artwork.image_file_url)}
          </Field>
          <Field label="Is User Uploaded">
            {fmtVal(artwork.user_uploaded_artwork.is_user_uploaded)}
          </Field>
        </Box>
      )}
    </Box>
  );
});

ArtworkDetailsSection.displayName = "ArtworkDetailsSection";

/**
 * Nested component: Product details sub-section
 */
const ProductDetailsSection = React.memo(({ item }) => (
  <Box>
    <Field label="Product Name">{fmtVal(item.product_name)}</Field>
    <Field label="Product SKU">{fmtVal(item.product_sku)}</Field>
    <Field label="Artwork Name">{fmtVal(item.artwork_name)}</Field>
    <Field label="Quantity">{fmtVal(item.quantity)}</Field>
    <Field label="Unit Price">{fmtCurrency(item.unit_price)}</Field>
    <Field label="Total Price">{fmtCurrency(item.total_price)}</Field>
    <Field label="Custom Notes">{fmtVal(item.custom_notes)}</Field>
  </Box>
));

ProductDetailsSection.displayName = "ProductDetailsSection";

/**
 * Nested component: Customization details sub-section
 */
const CustomizationSection = React.memo(({ customization }) => {
  if (!customization || Object.keys(customization).length === 0) return null;

  return (
    <Box mt={3} p={3} bg="gray.50" borderRadius="md">
      <Text fontWeight="semibold" fontSize="sm" mb={1}>
        Customization Data
      </Text>
      <Text
        fontSize="xs"
        fontFamily="mono"
        whiteSpace="pre-wrap"
        color="gray.700"
      >
        {JSON.stringify(customization, null, 2)}
      </Text>
    </Box>
  );
});

CustomizationSection.displayName = "CustomizationSection";

/**
 * Main order item card - displays product info, images, and details
 * Memoized to prevent unnecessary re-renders
 */
const OrderItemCard = React.memo(({ item, index }) => {
  const images = [
    {
      src: item.final_generated_image_url || item.final_generated_image,
      label: "Final",
    },
    {
      src: item.artwork_details?.image_url,
      label: "Artwork",
    },
    {
      src: item.artwork_details?.image1_url,
      label: "Artwork Alt 1",
    },
    {
      src: item.artwork_details?.image2_url,
      label: "Artwork Alt 2",
    },
    {
      src: item.artwork_details?.image3_url,
      label: "Artwork Alt 3",
    },
    {
      src: item.artwork_details?.image4_url,
      label: "Artwork Alt 4",
    },
    {
      src: item.artwork_details?.uploaded_image_url,
      label: "Uploaded Image",
    },
    {
      src: item.selected_artwork_category_image_details?.image_file,
      label: "Category",
    },
    {
      src: item.selected_frame_details?.image,
      label: "Frame",
    },
    {
      src: item.selected_material_details?.image,
      label: "Material",
    },
  ].filter((img) => img.src);

  return (
    <SectionCard p={0} overflow="hidden">
      {/* Item header */}
      <Flex
        justify="space-between"
        align="center"
        px={5}
        py={3}
        bg="gray.50"
        borderBottomWidth="1px"
        borderColor="gray.200"
      >
        <HStack>
          <Tag colorScheme="blue" fontWeight="600">
            Item #{index + 1}
          </Tag>
          <Text fontWeight="600">
            {item.product_name || item.artwork_name || "—"}
          </Text>
        </HStack>
        <Badge colorScheme={orderColor(item.item_status)}>
          {fmtVal(item.item_status)}
        </Badge>
      </Flex>

      {/* Item details */}
      <Box p={5}>
        <Grid templateColumns={{ base: "1fr", lg: "360px 1fr" }} gap={6}>
          {/* Images column */}
          <GridItem>
            <Text fontSize="xs" fontWeight="600" color="gray.500" mb={2}>
              IMAGES
            </Text>
            <ImageGallery images={images} />
          </GridItem>

          {/* Details column */}
          <GridItem>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacingX={8}>
              <ProductDetailsSection item={item} />
              <Box>
                <Field label="Created At">{fmtDate(item.created_at)}</Field>
                <Field label="Updated At">{fmtDate(item.updated_at)}</Field>
                <Field label="Material">{fmtVal(item.selected_material)}</Field>
                <Field label="Finish">{fmtVal(item.selected_finish)}</Field>
                <Field label="Glass Type">
                  {fmtVal(item.selected_glass_type)}
                </Field>
                <Field label="Orientation">
                  {fmtVal(item.selected_orientation)}
                </Field>
                <Field label="Background Image">
                  {fmtVal(item.selected_background_image)}
                </Field>
              </Box>
            </SimpleGrid>

            {/* Nested sections */}
            <ArtworkDetailsSection artwork={item.artwork_details} />

            {item.selected_artwork_category_image_details && (
              <Box mt={3} p={3} bg="gray.50" borderRadius="md">
                <Text fontWeight="semibold" fontSize="sm" mb={1}>
                  Selected Category Image
                </Text>
                <Field label="ID">
                  {fmtVal(item.selected_artwork_category_image_details.id)}
                </Field>
                <Field label="Description">
                  {fmtVal(
                    item.selected_artwork_category_image_details.description,
                  )}
                </Field>
                <Field label="Image File">
                  {fmtVal(
                    item.selected_artwork_category_image_details.image_file,
                  )}
                </Field>
                <Field label="Image URL">
                  {fmtVal(
                    item.selected_artwork_category_image_details.image_url,
                  )}
                </Field>
                <Field label="Is User Uploaded">
                  {fmtVal(
                    item.selected_artwork_category_image_details
                      .is_user_uploaded,
                  )}
                </Field>
                <Field label="Category ID">
                  {fmtVal(
                    item.selected_artwork_category_image_details.category,
                  )}
                </Field>
                <Field label="Supported Sizes">
                  {Array.isArray(
                    item.selected_artwork_category_image_details
                      .supported_sizes,
                  )
                    ? item.selected_artwork_category_image_details.supported_sizes.join(
                        ", ",
                      ) || "—"
                    : fmtVal(
                        item.selected_artwork_category_image_details
                          .supported_sizes,
                      )}
                </Field>
                <Field label="Created At">
                  {fmtDate(
                    item.selected_artwork_category_image_details.created_at,
                  )}
                </Field>
                <Field label="Updated At">
                  {fmtDate(
                    item.selected_artwork_category_image_details.updated_at,
                  )}
                </Field>
              </Box>
            )}

            {(item.selected_size || item.selected_size_details) && (
              <Box mt={3} p={3} bg="gray.50" borderRadius="md">
                <Text fontWeight="semibold" fontSize="sm" mb={1}>
                  Selected Size
                </Text>
                <Field label="Name">{fmtVal(item.selected_size)}</Field>
                <Field label="ID">{fmtVal(item.selected_size_id)}</Field>
                <Field label="Width">
                  {item.selected_size_details?.width_cm
                    ? `${item.selected_size_details.width_cm} cm`
                    : "—"}
                </Field>
                <Field label="Height">
                  {item.selected_size_details?.height_cm
                    ? `${item.selected_size_details.height_cm} cm`
                    : "—"}
                </Field>
                <Field label="Orientation">
                  {fmtVal(item.selected_size_details?.orientation)}
                </Field>
                <Field label="Price Multiplier">
                  {fmtVal(item.selected_size_details?.price_multiplier)}
                </Field>
              </Box>
            )}

            {(item.selected_frame || item.selected_frame_details) && (
              <Box mt={3} p={3} bg="gray.50" borderRadius="md">
                <Text fontWeight="semibold" fontSize="sm" mb={1}>
                  Selected Frame
                </Text>
                <Field label="Name">{fmtVal(item.selected_frame)}</Field>
                <Field label="ID">{fmtVal(item.selected_frame_id)}</Field>
                <Field label="Description">
                  {fmtVal(item.selected_frame_details?.description)}
                </Field>
                <Field label="Price Addition">
                  {fmtCurrency(item.selected_frame_details?.price_addition)}
                </Field>
                <Field label="Thickness">
                  {fmtVal(item.selected_frame_details?.thickness)}
                </Field>
                <Field label="Supported Sizes">
                  {Array.isArray(item.selected_frame_details?.supported_sizes)
                    ? item.selected_frame_details.supported_sizes.join(", ") ||
                      "—"
                    : fmtVal(item.selected_frame_details?.supported_sizes)}
                </Field>
              </Box>
            )}

            {item.selected_material_details && (
              <Box mt={3} p={3} bg="gray.50" borderRadius="md">
                <Text fontWeight="semibold" fontSize="sm" mb={1}>
                  Selected Material Details
                </Text>
                <Field label="ID">
                  {fmtVal(item.selected_material_details?.id)}
                </Field>
                <Field label="Name">
                  {fmtVal(item.selected_material_details?.name)}
                </Field>
                <Field label="Description">
                  {fmtVal(item.selected_material_details?.description)}
                </Field>
              </Box>
            )}

            <CustomizationSection customization={item.customization_data} />
          </GridItem>
        </Grid>
      </Box>
    </SectionCard>
  );
});

OrderItemCard.displayName = "OrderItemCard";

export default OrderItemCard;
