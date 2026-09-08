import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FiFilter, FiGrid, FiList } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import FilterPill from "../components/FilterPill";
import ProductCard from "../components/ProductCard";
import ReactSelect from "react-select";
import SidebarFilters from "../components/SidebarFilters";
import { fetchProductCategories } from "../../../redux/slices/productCategoriesSlice";
import { fetchProducts } from "../../../redux/slices/productsSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products = [], loading } = useSelector((s) => s.products);
  const { categories = [] } = useSelector((s) => s.productCategories);
  const { isOpen, onOpen, onClose } = useDisclosure(); // mobile filter drawer

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [orientation, setOrientation] = useState("");
  const [material, setMaterial] = useState("");
  const [finish, setFinish] = useState("");
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [viewMode, setViewMode] = useState("grid"); // grid | list

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductCategories());
  }, [dispatch]);

  // Set max price once products load
  const maxPrice = useMemo(() => {
    const prices = products.map((p) =>
      Number(p.price || p.discount_price || 0),
    );
    return prices.length ? Math.ceil(Math.max(...prices) / 100) * 100 : 0;
  }, [products]);

  useEffect(() => {
    if (maxPrice > 0 && priceRange[1] === 0) setPriceRange([0, maxPrice]);
  }, [maxPrice, priceRange]);

  const uniqueOrientations = [
    ...new Set(products.map((p) => p.orientation).filter(Boolean)),
  ];
  const uniqueMaterials = [
    ...new Set(products.map((p) => p.material).filter(Boolean)),
  ];
  const uniqueFinishes = [
    ...new Set(products.map((p) => p.finish).filter(Boolean)),
  ];

  const filteredProducts = useMemo(() => {
    let data = [...products];
    if (selectedCategory !== "all")
      data = data.filter(
        (p) => String(p.categories) === String(selectedCategory),
      );
    if (orientation) data = data.filter((p) => p.orientation === orientation);
    if (material) data = data.filter((p) => p.material === material);
    if (finish) data = data.filter((p) => p.finish === finish);
    if (searchTerm) {
      const q = searchTerm.trim().toLowerCase();
      if (q.length > 0) {
        data = data.filter((p) => {
          const label = (
            (p.title || p.name || p.product_name || "") +
            " " +
            (p.description || "")
          )
            .toLowerCase()
            .trim();
          return label.includes(q);
        });
      }
    }
    if (priceRange[1] > 0)
      data = data.filter((p) => {
        const price = Number(p.discount_price || p.price || 0);
        return price >= priceRange[0] && price <= priceRange[1];
      });
    if (sortBy === "price_low")
      data.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === "price_high")
      data.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy === "discount")
      data.sort((a, b) => {
        const da = a.discount_price
          ? (a.price - a.discount_price) / a.price
          : 0;
        const db = b.discount_price
          ? (b.price - b.discount_price) / b.price
          : 0;
        return db - da;
      });
    return data;
  }, [
    products,
    selectedCategory,
    orientation,
    material,
    finish,
    priceRange,
    sortBy,
    searchTerm,
  ]);

  const hasActiveFilters =
    selectedCategory !== "all" ||
    sortBy ||
    orientation ||
    material ||
    finish ||
    (priceRange[1] > 0 && priceRange[1] < maxPrice) ||
    priceRange[0] > 0;

  const clearFilters = () => {
    setSelectedCategory("all");
    setSortBy("");
    setOrientation("");
    setMaterial("");
    setFinish("");
    setPriceRange([0, maxPrice]);
  };

  // Build active filter pills
  const activePills = [];
  if (selectedCategory !== "all") {
    const cat = categories.find((c) => String(c.id) === selectedCategory);
    if (cat)
      activePills.push({
        key: "cat",
        label: cat.name,
        clear: () => setSelectedCategory("all"),
      });
  }
  if (orientation)
    activePills.push({
      key: "or",
      label: `Orientation: ${orientation}`,
      clear: () => setOrientation(""),
    });
  if (material)
    activePills.push({
      key: "mat",
      label: `Material: ${material}`,
      clear: () => setMaterial(""),
    });
  if (finish)
    activePills.push({
      key: "fin",
      label: `Finish: ${finish}`,
      clear: () => setFinish(""),
    });

  const filterProps = {
    categories,
    selectedCategory,
    setSelectedCategory,
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
  };

  // react-select options
  const categoryOptions = [{ value: "all", label: "All Categories" }].concat(
    categories.map((c) => ({ value: String(c.id), label: c.name })),
  );

  if (loading) {
    return (
      <Flex justify="center" align="center" py={24}>
        <Spinner size="xl" color="brand.500" thickness="3px" />
      </Flex>
    );
  }

  return (
    <Box bg="white" minH="100vh" fontFamily="body">
      {/* ── PAGE HEADER ── */}
      <Box
        bg="white"
        borderBottom="1px solid #E0DEDA"
        py={6}
        px={{ base: 4, md: 10 }}
      >
        <Box maxW="1400px" mx="auto">
          <Text
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="700"
            color="neutral.300"
            letterSpacing="0.08em"
            fontFamily="heading"
            lineHeight="1.15"
          >
            Our Products
          </Text>
          <Text
            fontSize="sm"
            color="neutral.500"
            fontFamily="body"
            mt={1}
          >
            Browse our complete range of frames and wall art
          </Text>
        </Box>
      </Box>

      <Box
        maxW="1400px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 6 }}
      >
        <Flex
          gap={{ base: 4, lg: 6 }}
          align="flex-start"
          direction={{ base: "column", lg: "row" }}
        >
          {/* ── LEFT SIDEBAR (desktop) ── */}
          <Box
            display={{ base: "none", lg: "block" }}
            w="240px"
            flexShrink={0}
            bg="white"
            borderRadius="2xl"
            p={5}
            border="1px solid #E0DEDA"
            position="sticky"
            top="80px"
          >
            <SidebarFilters {...filterProps} />
          </Box>

          {/* ── MOBILE FILTER DRAWER ── */}
          <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="xs">
            <DrawerOverlay backdropFilter="blur(2px)" />
            <DrawerContent borderRightRadius="2xl">
              <DrawerCloseButton />
              <DrawerHeader
                fontFamily="'Courier New', monospace"
                fontSize="md"
                fontWeight="700"
                color="#1A1A1A"
                borderBottom="1px solid #E0DEDA"
              >
                Filters
              </DrawerHeader>
              <DrawerBody p={5}>
                <SidebarFilters {...filterProps} />
              </DrawerBody>
            </DrawerContent>
          </Drawer>

          {/* ── RIGHT: TOOLBAR + GRID ── */}
          <Box flex="1" minW={0} w="100%">
            {/* Toolbar */}
            <Box
              bg="white"
              borderRadius="2xl"
              border="1px solid #E0DEDA"
              px={{ base: 3, md: 4 }}
              py={{ base: 3, md: 3 }}
              mb={4}
            >
              <Flex
                justify="space-between"
                align={{ base: "stretch", md: "center" }}
                flexWrap="wrap"
                gap={3}
                direction={{ base: "column", md: "row" }}
              >
                <Flex
                  align={{ base: "stretch", md: "center" }}
                  gap={3}
                  flexWrap="wrap"
                  w={{ base: "100%", md: "auto" }}
                >
                  {/* Category select (react-select) */}
                  <Box w={{ base: "100%", sm: "220px" }}>
                    <ReactSelect
                      options={categoryOptions}
                      value={categoryOptions.find(
                        (o) => o.value === String(selectedCategory),
                      )}
                      onChange={(opt) =>
                        setSelectedCategory(opt ? opt.value : "all")
                      }
                      isSearchable
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: 36,
                          borderRadius: 9999,
                          border: "1.5px solid #E0DEDA",
                          boxShadow: "none",
                        }),
                        menu: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                  </Box>

                  {/* Quick search */}
                  <Input
                    placeholder="Search products..."
                    size="sm"
                    w={{ base: "100%", sm: "220px" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    border="1.5px solid"
                    borderColor="neutral.200"
                    borderRadius="full"
                    fontFamily="body"
                    _focus={{ borderColor: "brand.500", boxShadow: "none" }}
                  />

                  {/* Mobile filter button */}
                  <Button
                    display={{ base: "flex", lg: "none" }}
                    onClick={onOpen}
                    size="sm"
                    variant="outline"
                    leftIcon={<FiFilter />}
                    w={{ base: "100%", sm: "auto" }}
                  >
                    Filters
                    {hasActiveFilters && (
                      <Badge
                        ml={2}
                        bg="#C9AB7E"
                        color="white"
                        borderRadius="full"
                        fontSize="9px"
                        px={1.5}
                      >
                        {activePills.length}
                      </Badge>
                    )}
                  </Button>

                  <Text
                    fontSize="sm"
                    color="neutral.500"
                    fontFamily="body"
                    w={{ base: "100%", md: "auto" }}
                  >
                    <Text as="span" fontWeight="700" color="neutral.900">
                      {filteredProducts.length}
                    </Text>{" "}
                    product{filteredProducts.length !== 1 ? "s" : ""} found
                  </Text>
                </Flex>

                <Flex
                  align={{ base: "stretch", md: "center" }}
                  gap={3}
                  flexWrap="wrap"
                  w={{ base: "100%", md: "auto" }}
                >
                  {/* Sort */}
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    size="sm"
                    w={{ base: "100%", sm: "180px" }}
                    bg="white"
                    border="1.5px solid"
                    borderColor="neutral.200"
                    borderRadius="full"
                    fontFamily="body"
                    fontSize="sm"
                    color="neutral.900"
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px brand.500",
                    }}
                  >
                    <option value="">Sort: Relevance</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="discount">Biggest Discount</option>
                  </Select>

                  {/* View toggle */}
                  <HStack spacing={1} display={{ base: "none", md: "flex" }}>
                    {[
                      { id: "grid", icon: FiGrid },
                      { id: "list", icon: FiList },
                    ].map(({ id, icon }) => (
                      <Box
                        key={id}
                        as="button"
                        w="32px"
                        h="32px"
                        borderRadius="lg"
                        bg={viewMode === id ? "#1A1A1A" : "transparent"}
                        color={viewMode === id ? "white" : "gray.400"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        transition="all 0.15s ease"
                        _hover={{ bg: viewMode === id ? "#1A1A1A" : "#F7F5F1" }}
                        onClick={() => setViewMode(id)}
                      >
                        <Icon as={icon} fontSize="14px" />
                      </Box>
                    ))}
                  </HStack>
                </Flex>
              </Flex>
            </Box>

            {/* Active filter pills */}
            {activePills.length > 0 && (
              <Flex flexWrap="wrap" gap={2} mb={4}>
                {activePills.map((pill) => (
                  <FilterPill
                    key={pill.key}
                    label={pill.label}
                    onRemove={pill.clear}
                  />
                ))}
                <Box
                  as="button"
                  onClick={clearFilters}
                  fontSize="xs"
                  fontWeight="600"
                  color="brand.500"
                  fontFamily="body"
                  px={2}
                  _hover={{ textDecoration: "underline" }}
                  alignSelf="center"
                >
                  Clear all
                </Box>
              </Flex>
            )}

            {/* Product grid — flat list, no category grouping (e-com style) */}
            {filteredProducts.length === 0 ? (
              <Flex
                direction="column"
                align="center"
                py={20}
                gap={3}
                bg="white"
                borderRadius="2xl"
                border="1px solid #E0DEDA"
              >
                <Text fontSize="3xl">🔍</Text>
                <Text
                  fontWeight="700"
                  color="neutral.600"
                  fontFamily="body"
                >
                  No products match your filters
                </Text>
                <Text
                  fontSize="sm"
                  color="neutral.400"
                  fontFamily="body"
                >
                  Try adjusting or clearing your filters.
                </Text>
                <Button
                  size="sm"
                  variant="solid"
                  onClick={clearFilters}
                  mt={1}
                >
                  Clear Filters
                </Button>
              </Flex>
            ) : viewMode === "grid" ? (
              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
                spacing={{ base: 3, md: 4 }}
              >
                {filteredProducts.map((p) => (
                  <Box key={p.id} bg="white" overflow="hidden">
                    <ProductCard product={p} />
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              /* List view */
              <VStack spacing={3} align="stretch">
                {filteredProducts.map((p) => (
                  <Box key={p.id} bg="white" overflow="hidden">
                    <ProductCard product={p} />
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default ProductList;
