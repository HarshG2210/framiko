import "react-toastify/dist/ReactToastify.css";

import {
  AdminFormShell,
  AdminPage,
  AdminTableInventoryWithPagination,
  AdminTableShell,
  useAdminTable,
} from "../../../layout/AdminUI";
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ToastContainer } from "react-toastify";
import { adminInventoryApi } from "../../../services/api/adminApi";
import { fetchProductCategories } from "../../../redux/slices/productCategoriesSlice";
import { fetchProducts } from "../../../redux/slices/productsSlice";

const ProductInventory = () => {
  const dispatch = useDispatch();
  const { products = [] } = useSelector((state) => state.products || {});
  console.log("products:", products);
  const { categories = [] } = useSelector(
    (state) => state.productCategories || {},
  );

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    category: "",
    product: "",
    quantity: "",
  });

  const table = useAdminTable(inventory, 5);

  const normalizeInventory = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  };

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminInventoryApi.getProductInventory();
      setInventory(normalizeInventory(data));
    } catch (err) {
      setError(err?.message || "Failed to load product inventory.");
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchProducts()).unwrap();
    dispatch(fetchProductCategories()).unwrap();
    loadInventory();
  }, [dispatch, loadInventory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminInventoryApi.addOrUpdateProductInventory({
        category: Number(formData.category),
        product: Number(formData.product),
        quantity: Number(formData.quantity),
      });
      setFormData({ category: "", product: "", quantity: "" });
      await loadInventory();
      setTabIndex(0);
    } catch (err) {
      setError(err?.message || "Failed to save product inventory.");
    }
  };

  const fillFromRow = (row) => {
    setFormData({
      category: row?.category?.toString() ?? row?.category_id?.toString() ?? "",
      product: row?.product?.toString() ?? row?.product_id?.toString() ?? "",
      quantity: row?.quantity?.toString() ?? "",
    });
    setTabIndex(1);
  };

  const getCategoryName = (row) => {
    const categoryName =
      row?.category_name || row?.category?.name || row?.categoryName || "";
    if (categoryName) return categoryName;
    const categoryId = row?.category;
    if (!categoryId) return "—";
    const category = categories.find((item) => item.id === Number(categoryId));
    return category?.name || "—";
  };

  const getProductName = (row) => {
    const productName =
      row?.product_name || row?.product?.name || row?.productName || "";
    if (productName) return productName;
    const productId = row?.product;
    if (!productId) return "—";
    const product = products.find((item) => item.id === Number(productId));
    return product?.name || "—";
  };

  return (
    <AdminPage
      title="Product Inventory"
      description="Track and adjust stock for products in the catalog."
    >
      {!loading && inventory.length > 0 && (
        <Flex gap={4} mb={6} wrap="wrap">
          {[...inventory]
            .filter((item) => Number(item.quantity ?? 0) < 10)
            .slice(0, 3)
            .map((item, index) => (
              <Box
                key={item.id || `${item.category}-${item.product}`}
                flex="1"
                minW={{ base: "100%", md: "30%" }}
                bg="rgba(255,255,255,0.06)"
                border="1px solid rgba(255,255,255,0.12)"
                borderRadius="2xl"
                p={4}
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  inset={0}
                  bgGradient="radial(circle at top left, rgba(255,0,0,0.25), transparent 60%)"
                  pointerEvents="none"
                />

                <Flex justify="space-between" align="center" mb={3}>
                  <Badge
                    colorScheme="red"
                    variant="solid"
                    borderRadius="full"
                    px={3}
                  >
                    LOW STOCK #{index + 1}
                  </Badge>

                  <Badge
                    variant="outline"
                    colorScheme={
                      Number(item.quantity ?? 0) < 5 ? "red" : "orange"
                    }
                  >
                    Stock: {item.quantity ?? 0}
                  </Badge>
                </Flex>

                <Box>
                  <Text fontWeight="bold" fontSize="md">
                    {getProductName(item)}
                  </Text>
                  <Text fontSize="sm" opacity={0.8}>
                    {getCategoryName(item)}
                  </Text>
                </Box>
              </Box>
            ))}
        </Flex>
      )}

      <Tabs index={tabIndex} onChange={setTabIndex} variant="unstyled" isFitted>
        <TabList mb={4} bg="whiteAlpha.50" borderRadius="full" p="2px">
          <Tab _selected={{ bg: "white", color: "black" }}>
            Product Inventory
          </Tab>
          <Tab _selected={{ bg: "white", color: "black" }}>
            Add / Update Product Inventory
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <AdminTableShell title="Product Inventory">
              {loading ? (
                <Flex justify="center" py={8}>
                  <Spinner />
                </Flex>
              ) : error ? (
                <Text color="red.400" p={4}>
                  {error}
                </Text>
              ) : inventory.length === 0 ? (
                <Text p={4}>No product inventory records found.</Text>
              ) : (
                <AdminTableInventoryWithPagination
                  table={table}
                  page={table.page}
                  setPage={table.setPage}
                  totalPages={table.totalPages}
                >
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Category</Th>
                        <Th>Product</Th>
                        <Th>Quantity</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {table.paginatedData.map((row) => (
                        <Tr
                          key={row.id || `${row.category}-${row.product}`}
                          _hover={{ bg: "whiteAlpha.50" }}
                        >
                          <Td fontWeight="bold">{row.id || "—"}</Td>
                          <Td>{getCategoryName(row)}</Td>
                          <Td>{getProductName(row)}</Td>
                          <Td>
                            <Badge px={3} py={1} borderRadius="full">
                              {row.quantity ?? "—"}
                            </Badge>
                          </Td>
                          <Td>
                            <Button
                              size="xs"
                              colorScheme="whiteAlpha"
                              onClick={() => fillFromRow(row)}
                            >
                              Edit / Update
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </AdminTableInventoryWithPagination>
              )}
            </AdminTableShell>
          </TabPanel>

          <TabPanel px={0}>
            <AdminFormShell
              title="Add / Update Product Inventory"
              description="Create or update quantity for a product in a category."
              footer={
                <Flex gap={3}>
                  <Button
                    type="submit"
                    form="product-inventory-form"
                    bg="white"
                    color="black"
                    _hover={{ bg: "whiteAlpha.800" }}
                    isLoading={loading}
                  >
                    Save
                  </Button>
                </Flex>
              }
            >
              <form id="product-inventory-form" onSubmit={handleSubmit}>
                <Flex direction={{ base: "column", md: "row" }} gap={4}>
                  <FormControl isRequired>
                    <FormLabel>Category</FormLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      bg="white"
                      color="black"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Product</FormLabel>
                    <Select
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      bg="white"
                      color="black"
                    >
                      <option value="">Select product</option>
                      {products
                        .filter((product) => {
                          if (!formData.category) return true;
                          const productCategory =
                            product.category?.id ?? product.category;
                          return (
                            String(productCategory) ===
                            String(formData.category)
                          );
                        })
                        .map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Quantity</FormLabel>
                    <Input
                      type="number"
                      min="0"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g., 20"
                      color="#000"
                      background="#fff"
                    />
                  </FormControl>
                </Flex>
              </form>
            </AdminFormShell>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <ToastContainer style={{ top: "70px" }} />
    </AdminPage>
  );
};

export default ProductInventory;
