import {
  Accordion,
  Box,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Text,
  VStack,
} from "@chakra-ui/react";

import FilterSection from "./FilterSection";
import React from "react";

const SidebarFilters = ({
  orientation,
  setOrientation,
  material,
  setMaterial,
  finish,
  setFinish,
  priceRange,
  setPriceRange,
  maxPrice,
  uniqueOrientations,
  uniqueMaterials,
  uniqueFinishes,
  hasActiveFilters,
  clearFilters,
}) => (
  <Box fontFamily="body">
    {/* Header */}
    <Flex justify="space-between" align="center" mb={4}>
      <Text
        fontSize="md"
        fontWeight="700"
        color="neutral.900"
        fontFamily="heading"
        letterSpacing="0.04em"
      >
        Filters
      </Text>
      {hasActiveFilters && (
        <Box
          as="button"
          onClick={clearFilters}
          fontSize="xs"
          fontWeight="600"
          color="brand.500"
          fontFamily="body"
          _hover={{ textDecoration: "underline" }}
        >
          Clear All
        </Box>
      )}
    </Flex>

    <Divider borderColor="neutral.200" mb={2} />

    <Accordion allowMultiple defaultIndex={[0, 1, 2, 3, 4]}>
      {/* Price Range */}
      {maxPrice > 0 && (
        <>
          <FilterSection title="Price Range">
            <Box px={1}>
              <Flex justify="space-between" mb={3}>
                <Text fontSize="xs" color="neutral.500" fontFamily="body">
                  ₹{priceRange[0].toLocaleString("en-IN")}
                </Text>
                <Text fontSize="xs" color="neutral.500" fontFamily="body">
                  ₹{priceRange[1].toLocaleString("en-IN")}
                </Text>
              </Flex>
              <RangeSlider
                min={0}
                max={maxPrice}
                step={50}
                value={priceRange}
                onChange={(val) => setPriceRange(val)}
                colorScheme="purple"
              >
                <RangeSliderTrack bg="neutral.200">
                  <RangeSliderFilledTrack bg="brand.500" />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} boxSize={4} borderColor="brand.500" />
                <RangeSliderThumb index={1} boxSize={4} borderColor="brand.500" />
              </RangeSlider>
            </Box>
          </FilterSection>
          <Divider borderColor="neutral.100" />
        </>
      )}

      {/* Orientation */}
      {uniqueOrientations.length > 0 && (
        <>
          <FilterSection title="Orientation">
            <CheckboxGroup
              value={orientation ? [orientation] : []}
              onChange={(v) => setOrientation(v[v.length - 1] || "")}
            >
              <VStack align="stretch" spacing={2}>
                {uniqueOrientations.map((o) => (
                  <Checkbox
                    key={o}
                    value={o}
                    colorScheme="purple"
                    fontSize="sm"
                    fontFamily="body"
                  >
                    <Text
                      fontSize="sm"
                      fontFamily="body"
                      color="neutral.700"
                      textTransform="capitalize"
                    >
                      {o}
                    </Text>
                  </Checkbox>
                ))}
              </VStack>
            </CheckboxGroup>
          </FilterSection>
          <Divider borderColor="neutral.100" />
        </>
      )}

      {/* Material */}
      {uniqueMaterials.length > 0 && (
        <>
          <FilterSection title="Material">
            <CheckboxGroup
              value={material ? [material] : []}
              onChange={(v) => setMaterial(v[v.length - 1] || "")}
            >
              <VStack align="stretch" spacing={2}>
                {uniqueMaterials.map((m) => (
                  <Checkbox key={m} value={m} colorScheme="purple">
                    <Text
                      fontSize="sm"
                      fontFamily="body"
                      color="neutral.700"
                      textTransform="capitalize"
                    >
                      {m}
                    </Text>
                  </Checkbox>
                ))}
              </VStack>
            </CheckboxGroup>
          </FilterSection>
          <Divider borderColor="neutral.100" />
        </>
      )}

      {/* Finish */}
      {uniqueFinishes.length > 0 && (
        <FilterSection title="Finish">
          <CheckboxGroup
            value={finish ? [finish] : []}
            onChange={(v) => setFinish(v[v.length - 1] || "")}
          >
            <VStack align="stretch" spacing={2}>
              {uniqueFinishes.map((f) => (
                <Checkbox key={f} value={f} colorScheme="purple">
                  <Text
                    fontSize="sm"
                    fontFamily="body"
                    color="neutral.700"
                    textTransform="capitalize"
                  >
                    {f}
                  </Text>
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        </FilterSection>
      )}
    </Accordion>
  </Box>
);

export default SidebarFilters;
