// src/components/admin/inventory/ArtworkImageInventory.jsx

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
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Spinner,
  Stack,
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
import {
  addOrUpdateArtworkImageInventory,
  fetchArtworkImageInventory,
} from "../../../redux/slices/artworkImageInventorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { ToastContainer } from "react-toastify";
import { fetchArtworkCategories } from "../../../redux/slices/artworkCategoriesSlice";
import { fetchArtworkCategoryImages } from "../../../redux/slices/artworkCategoryImagesSlice";

const ArtworkImageInventory = () => {
  const dispatch = useDispatch();

  const {
    items: inventory = [],
    loading,
    error,
  } = useSelector((state) => state.artworkImageInventory || {});

  const { artworkCategories = [] } = useSelector(
    (state) => state.artworkCategories || {}
  );

  const { artworkCategoryImages = [] } = useSelector(
    (state) => state.artworkCategoryImages || {}
  );

  const table = useAdminTable(inventory, 5);

  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    category: "",
    image: "",
    quantity: "",
  });

  useEffect(() => {
    dispatch(fetchArtworkImageInventory());
    dispatch(fetchArtworkCategories());
    dispatch(fetchArtworkCategoryImages());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(
      addOrUpdateArtworkImageInventory({
        category: Number(formData.category),
        image: Number(formData.image),
        quantity: Number(formData.quantity),
      })
    ).unwrap();

    setFormData({ category: "", image: "", quantity: "" });
    setTabIndex(0);
  };

  const fillFromRow = (row) => {
    setFormData({
      category: row.category?.toString() ?? "",
      image: row.image?.toString() ?? "",
      quantity: row.quantity?.toString() ?? "",
    });
    setTabIndex(1);
  };

  return (
    <AdminPage
      title="Artwork Image Inventory"
      description="Track printed artwork stock per category & image."
    >
      <Tabs index={tabIndex} onChange={setTabIndex} variant="unstyled" isFitted>
        <TabList mb={4} bg="whiteAlpha.50" borderRadius="full" p="2px">
          <Tab _selected={{ bg: "white", color: "black" }}>Inventory</Tab>
          <Tab _selected={{ bg: "white", color: "black" }}>Add / Update</Tab>
        </TabList>

        <TabPanels>
          {/* ================= TABLE ================= */}
          <TabPanel px={0}>
            <AdminTableShell title="Artwork Image Inventory">
              {loading ? (
                <Flex justify="center" py={8}>
                  <Spinner />
                </Flex>
              ) : error ? (
                <Text color="red.400">{error}</Text>
              ) : inventory.length === 0 ? (
                <Text p={4}>No inventory records found.</Text>
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
                        <Th>Artwork Image</Th>
                        <Th>Supported Sizes</Th>
                        <Th>Quantity</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {inventory.map((row) => (
                        <Tr key={row.id} _hover={{ bg: "whiteAlpha.50" }}>
                          {/* Inventory ID */}
                          <Td fontWeight="bold">{row.id}</Td>

                          {/* Category */}
                          <Td>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold">
                                {row.category_name}
                              </Text>
                              <Text fontSize="xs" opacity={0.7}>
                                ID: {row.category}
                              </Text>
                            </Box>
                          </Td>

                          {/* Image */}
                          <Td>
                            <Flex align="center" gap={3}>
                              <Image
                                src={row.image_file}
                                boxSize="48px"
                                borderRadius="md"
                                objectFit="cover"
                              />
                              <Box>
                                <Text fontSize="sm">Image #{row.image_id}</Text>
                                <Text fontSize="xs" opacity={0.7}>
                                  Inventory Image ID: {row.image}
                                </Text>
                              </Box>
                            </Flex>
                          </Td>

                          {/* Supported Sizes */}
                          <Td>
                            {row.supported_sizes?.length > 0 ? (
                              <Stack spacing={2}>
                                {row.supported_sizes.map((s) => (
                                  <Box
                                    key={s.id}
                                    p={2}
                                    border="1px solid"
                                    borderColor="whiteAlpha.300"
                                    borderRadius="md"
                                  >
                                    <Text fontSize="sm" fontWeight="bold">
                                      {s.name}
                                    </Text>
                                    <Text fontSize="xs">
                                      {s.width_cm} × {s.height_cm} cm
                                    </Text>
                                    <Badge mt={1} variant="subtle">
                                      {s.orientation}
                                    </Badge>
                                  </Box>
                                ))}
                              </Stack>
                            ) : (
                              <Text fontSize="sm" opacity={0.6}>
                                No sizes mapped
                              </Text>
                            )}
                          </Td>

                          {/* Quantity */}
                          <Td>
                            <Badge
                              px={3}
                              py={1}
                              borderRadius="full"
                              fontSize="sm"
                            >
                              {row.quantity}
                            </Badge>
                          </Td>

                          {/* Action */}
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

          {/* ================= FORM (UNCHANGED) ================= */}
          <TabPanel px={0}>
            <AdminFormShell
              title="Add / Update Artwork Image Inventory"
              description="Select category and image to assign a stock quantity."
              footer={
                <Button
                  type="submit"
                  form="artwork-img-inventory-form"
                  // bg="white"
                  // color="black"
                  // _hover={{ bg: "whiteAlpha.800" }}
                  isLoading={loading}
                >
                  Save
                </Button>
              }
            >
              <form id="artwork-img-inventory-form" onSubmit={handleSubmit}>
                <Flex direction={{ base: "column", md: "row" }} gap={4}>
                  {/* Category Dropdown */}
                  <FormControl isRequired>
                    <FormLabel>Select Category</FormLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Choose Category"
                      color="#000"
                      background="#fff"
                    >
                      {artworkCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Image Dropdown */}
                  <FormControl isRequired>
                    <FormLabel>Select Image</FormLabel>

                    <Menu>
                      <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        bg="white"
                        color="black"
                        border="1px solid #ccc"
                        textAlign="left"
                        w="100%"
                      >
                        {formData.image
                          ? (() => {
                              const img = artworkCategoryImages.find(
                                (i) => i.id === Number(formData.image)
                              );
                              return img ? (
                                <Flex align="center" gap={3}>
                                  <Image
                                    src={img.image_file}
                                    boxSize="32px"
                                    objectFit="cover"
                                    borderRadius="md"
                                  />
                                  <Text>{`Image ${img.id}`}</Text>
                                </Flex>
                              ) : (
                                "Choose Image"
                              );
                            })()
                          : "Choose Image"}
                      </MenuButton>

                      <MenuList bg="gray.900" borderColor="gray.700">
                        {artworkCategoryImages.map((img) => (
                          <MenuItem
                            key={img.id}
                            bg="gray.900"
                            _hover={{ bg: "gray.700" }}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                image: img.id.toString(),
                              }))
                            }
                          >
                            <Flex align="center" gap={3}>
                              <Image
                                src={img.image_file}
                                boxSize="40px"
                                objectFit="cover"
                                borderRadius="md"
                              />
                              <Box>
                                <Text fontSize="sm" color="white">
                                  Image {img.id}
                                </Text>
                                <Text fontSize="xs" color="gray.400">
                                  {img.description || "No description"}
                                </Text>
                              </Box>
                            </Flex>
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </FormControl>

                  {/* Quantity */}
                  <FormControl isRequired>
                    <FormLabel>Quantity</FormLabel>
                    <Input
                      type="number"
                      min="0"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g., 15"
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

export default ArtworkImageInventory;
