// src/components/admin/PostArtworkCategoryImages.jsx

import "react-toastify/dist/ReactToastify.css";

import {
  AdminFormShell,
  AdminPage,
  AdminTableShell,
  AdminTableWithPagination,
  useAdminTable,
} from "../../../layout/AdminUI";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Image,
  Input,
  Select,
  SimpleGrid,
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
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import {
  deleteArtworkCategoryImage,
  fetchArtworkCategoryImages,
  postArtworkCategoryImage,
  updateArtworkCategoryImage,
} from "../../../redux/slices/artworkCategoryImagesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { fetchArtworkCategories } from "../../../redux/slices/artworkCategoriesSlice";
import { fetchSizes } from "../../../redux/slices/sizesSlice";

const PostArtworkCategoryImages = () => {
  const dispatch = useDispatch();

  const {
    artworkCategoryImages = [],
    loading,
    error,
  } = useSelector((state) => state.artworkCategoryImages || {});
  const { artworkCategories = [] } = useSelector(
    (state) => state.artworkCategories || {},
  );

  const { sizes = [] } = useSelector((state) => state.sizes || {});

  const table = useAdminTable(artworkCategoryImages, 5);

  const [tabIndex, setTabIndex] = useState(0);
  const [editing, setEditing] = useState(null);

  /* 🔥 FORM DATA */
  const [formData, setFormData] = useState({
    category: "",
    image_file: null,
    description: "",
    supported_sizes: null,
  });

  useEffect(() => {
    dispatch(fetchArtworkCategories());
    dispatch(fetchArtworkCategoryImages());
    dispatch(fetchSizes());
  }, [dispatch]);

  const resetForm = () => {
    setEditing(null);
    setFormData({
      category: "",
      image_file: null,
      description: "",
      supported_sizes: null,
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image_file" && files?.[0]) {
      setFormData((p) => ({ ...p, image_file: files[0] }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error("Please select a category.");
      return;
    }

    // if (!editing && !formData.image_file) {
    //   toast.error("Please upload an image.");
    //   return;
    // }

    try {
      const payload = {
        category: formData.category,
        image_file: formData.image_file,
        image_url: formData.image_url,
        description: formData.description,
        supported_sizes: formData.supported_sizes,
        is_user_uploaded: false,
      };
      console.log("payl,oad", payload);

      if (editing) {
        await dispatch(
          updateArtworkCategoryImage({ id: editing.id, ...payload }),
        ).unwrap();
        toast.success("Category image updated");
      } else {
        await dispatch(postArtworkCategoryImage(payload)).unwrap();
        toast.success("Category image added");
      }

      dispatch(fetchArtworkCategoryImages());
      resetForm();
      setTabIndex(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (img) => {
    setEditing(img);
    setFormData({
      category: img.category?.toString() || "",
      image_file: null,
      description: img.description || "",
      supported_sizes: img.supported_sizes ?? null,
    });
    setTabIndex(1);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteArtworkCategoryImage(id)).unwrap();
    dispatch(fetchArtworkCategoryImages());
    toast.success("Category image deleted");
  };

  const handleBulkDelete = async () => {
    await Promise.all(
      [...table.selected].map((id) => dispatch(deleteArtworkCategoryImage(id))),
    );
    table.clearAll();
    dispatch(fetchArtworkCategoryImages());
    toast.success("Selected categories Images deleted");
  };

  const getCategoryName = (categoryId) => {
    const cat = artworkCategories.find((c) => c.id === categoryId);
    return cat ? cat.name : categoryId;
  };

  return (
    <AdminPage
      title="Artwork Category Images"
      description="Upload artwork images mapped to their respective categories."
    >
      <Tabs index={tabIndex} onChange={setTabIndex} variant="unstyled" isFitted>
        <TabList mb={4} bg="whiteAlpha.50" borderRadius="full" p="2px">
          <Tab _selected={{ bg: "white", color: "black" }}>Category Images</Tab>
          <Tab _selected={{ bg: "white", color: "black" }}>
            {editing ? "Edit Image" : "Add Image"}
          </Tab>
        </TabList>

        <TabPanels>
          {/* ================= TABLE ================= */}
          <TabPanel px={0}>
            <AdminTableShell title="All Category Images">
              {loading ? (
                <Flex justify="center" py={8}>
                  <Spinner />
                </Flex>
              ) : error ? (
                <Text color="red.400">{error}</Text>
              ) : (
                <AdminTableWithPagination
                  table={table}
                  selectedCount={table.selected.size}
                  onDeleteSelected={handleBulkDelete}
                  page={table.page}
                  setPage={table.setPage}
                  totalPages={table.totalPages}
                >
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Category</Th>
                        <Th>Description</Th>
                        <Th>Image</Th>
                        <Th>Image URL</Th>
                        <Th>Supported Size</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {table.paginatedData.map((img) => {
                        const supportedSizeId = Array.isArray(
                          img.supported_sizes,
                        )
                          ? Number(img.supported_sizes[0])
                          : Number(img.supported_sizes);

                        const size = sizes.find(
                          (s) => s.id === supportedSizeId,
                        );

                        return (
                          <Tr key={img.id}>
                            <Td>{img.id}</Td>
                            <Td>{getCategoryName(img.category)}</Td>
                            <Td>{img.description || "—"}</Td>
                            <Td>
                              {img.image_file ? (
                                <Image
                                  src={img.image_file}
                                  boxSize="48px"
                                  objectFit="cover"
                                  borderRadius="md"
                                />
                              ) : (
                                "_"
                              )}
                            </Td>
                            <Td>{img.image_url || "—"}</Td>
                            <Td>
                              {size ? (
                                <Box>
                                  <Badge mb={1}>{size.name}</Badge>
                                  <Text fontSize="xs">
                                    {size.width_cm} × {size.height_cm} in
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {size.orientation}
                                  </Text>
                                </Box>
                              ) : (
                                <Text fontSize="sm" color="gray.400">
                                  —
                                </Text>
                              )}
                            </Td>
                            <Td>
                              <IconButton
                                size="xs"
                                icon={<EditIcon />}
                                mr={2}
                                onClick={() => handleEdit(img)}
                              />
                              <IconButton
                                size="xs"
                                colorScheme="red"
                                icon={<DeleteIcon />}
                                onClick={() => handleDelete(img.id)}
                              />
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </AdminTableWithPagination>
              )}
            </AdminTableShell>
          </TabPanel>

          {/* ================= FORM ================= */}
          <TabPanel px={0}>
            <AdminFormShell
              title={editing ? "Edit Category Image" : "Add Category Image"}
              description="Map an image to a specific category."
              footer={
                <Flex gap={3}>
                  <Button
                    type="submit"
                    form="cat-img-form"
                    // bg="white"
                    // color="black"
                  >
                    {editing ? "Update Image" : "Create Image"}
                  </Button>
                  {editing && (
                    <Button variant="ghost" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </Flex>
              }
            >
              <form id="cat-img-form" onSubmit={handleSubmit}>
                <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
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
                      {artworkCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Input
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Image Url</FormLabel>
                    <Input
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                    />
                    {editing?.image_url && !formData.image_url && (
                      <Text>{editing?.image_url}</Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>Image File</FormLabel>
                    <Input
                      type="file"
                      name="image_file"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    {editing?.image_file && !formData.image_file && (
                      <Image
                        mt={2}
                        src={editing.image_file}
                        boxSize="80px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    )}
                  </FormControl>
                </SimpleGrid>

                {/*  SUPPORTED SIZES */}
                <SimpleGrid columns={1} spacing={4} w="100%" mt="2%">
                  <FormControl>
                    <FormLabel>Supported Size</FormLabel>

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      {sizes.map((s) => {
                        const selected = formData.supported_sizes === s.id;

                        return (
                          <Box
                            key={s.id}
                            cursor="pointer"
                            _hover={{
                              borderColor: "accent.500",
                              bg: "accent.50",
                            }}
                            p={4}
                            borderRadius="md"
                            border="2px solid"
                            borderColor={
                              selected ? "accent.500" : "neutral.200"
                            }
                            bg={selected ? "accent.50" : "white"}
                            color="neutral.900"
                            transition="all 0.2s ease"
                            onClick={() => {
                              setFormData((p) => ({
                                ...p,
                                supported_sizes: selected ? null : s.id,
                              }));
                            }}
                          >
                            <Flex justify="space-between" mb={1}>
                              <Text fontWeight="bold" fontSize="sm">
                                {s.name}
                              </Text>
                              <Checkbox
                                isChecked={selected}
                                pointerEvents="none"
                              />
                            </Flex>
                            <Text fontSize="xs" color="neutral.700">
                              {s.width_cm} × {s.height_cm} cm • {s.orientation}
                            </Text>
                          </Box>
                        );
                      })}
                    </SimpleGrid>
                  </FormControl>
                </SimpleGrid>
              </form>
            </AdminFormShell>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <ToastContainer style={{ top: "70px" }} />
    </AdminPage>
  );
};

export default PostArtworkCategoryImages;
