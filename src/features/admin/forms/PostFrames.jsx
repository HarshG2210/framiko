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
  IconButton,
  Image,
  Input,
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
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import {
  deleteFrame,
  fetchFrames,
  postFrame,
  updateFrame,
} from "../../../redux/slices/framesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { fetchSizes } from "../../../redux/slices/sizesSlice";

const PostFrames = () => {
  const dispatch = useDispatch();
  const {
    frames = [],
    loading,
    error,
  } = useSelector((state) => state.frames || {});
  const { sizes = [] } = useSelector((state) => state.sizes || {});

  const table = useAdminTable(frames, 5);

  const [tabIndex, setTabIndex] = useState(0);
  const [editingFrame, setEditingFrame] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    selector_image: null,
    price_addition: "",
    thickness: "",
    supported_sizes: [],
  });

  useEffect(() => {
    dispatch(fetchFrames());
    dispatch(fetchSizes());
  }, [dispatch]);

  const resetForm = () => {
    setEditingFrame(null);
    setFormData({
      name: "",
      description: "",
      image: null,
      selector_image: null,
      price_addition: "",
      thickness: "",
      supported_sizes: [],
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if ((name === "image" || name === "selector_image") && files && files[0]) {
      setFormData((p) => ({ ...p, [name]: files[0] }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const toggleSize = (id) => {
    setFormData((p) => {
      const exists = p.supported_sizes.includes(id);
      return {
        ...p,
        supported_sizes: exists
          ? p.supported_sizes.filter((x) => x !== id)
          : [...p.supported_sizes, id],
      };
    });
  };

  const toggleAllSizes = () => {
    setFormData((p) => ({
      ...p,
      supported_sizes:
        p.supported_sizes.length === sizes.length ? [] : sizes.map((s) => s.id),
    }));
  };

  const buildFormData = (data) => {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("description", data.description);
    if (data.image instanceof File) fd.append("image", data.image);
    if (data.selector_image instanceof File) {
      fd.append("selector_image", data.selector_image);
    }
    fd.append("price_addition", data.price_addition);
    fd.append("thickness", data.thickness);
    data.supported_sizes.forEach((id) => fd.append("supported_sizes", id));
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price_addition) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      if (editingFrame) {
        await dispatch(
          updateFrame({ id: editingFrame.id, formData, editingFrame })
        ).unwrap();
        toast.success("Frame updated");
      } else {
        await dispatch(postFrame(buildFormData(formData))).unwrap();
        toast.success("Frame added");
      }

      dispatch(fetchFrames());
      resetForm();
      setTabIndex(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (frame) => {
    setEditingFrame(frame);
    setFormData({
      name: frame.name || "",
      description: frame.description || "",
      image: frame.image || null,
      selector_image: null,
      price_addition: frame.price_addition || "",
      thickness: frame.thickness || "",
      supported_sizes: (frame.supported_sizes || []).map(Number),
    });
    setTabIndex(1);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteFrame(id)).unwrap();
    dispatch(fetchFrames());
    toast.success("Frame deleted");
  };

  const handleBulkDelete = async () => {
    await Promise.all(
      [...table.selected].map((id) => dispatch(deleteFrame(id)))
    );
    table.clearAll();
    dispatch(fetchFrames());
    toast.success("Selected frames deleted");
  };

  return (
    <AdminPage
      title="Frame Management"
      description="Create and configure frame styles used across artworks."
    >
      <Tabs index={tabIndex} onChange={setTabIndex} variant="unstyled" isFitted>
        <TabList mb={4} bg="whiteAlpha.50" borderRadius="full" p="2px">
          <Tab _selected={{ bg: "white", color: "black" }}>Frames</Tab>
          <Tab _selected={{ bg: "white", color: "black" }}>
            {editingFrame ? "Edit Frame" : "Add Frame"}
          </Tab>
        </TabList>

        <TabPanels>
          {/* ================= TABLE ================= */}
          <TabPanel px={0}>
            <AdminTableShell title="All Frames">
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
                        <Th>
                          <Checkbox
                            isChecked={table.isAllCurrentPageSelected}
                            onChange={table.selectAllCurrentPage}
                          />
                        </Th>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Description</Th>
                        <Th>Image</Th>
                        <Th>Price Multiplier</Th>
                        <Th>Thickness</Th>
                        <Th>Sizes</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {table.paginatedData.map((f) => (
                        <Tr key={f.id}>
                          <Td>
                            <Checkbox
                              isChecked={table.selected.has(f.id)}
                              onChange={() => table.toggleRow(f.id)}
                            />
                          </Td>
                          <Td>{f.id}</Td>
                          <Td>{f.name}</Td>
                          <Td maxW="220px">
                            <Text noOfLines={2}>{f.description}</Text>
                          </Td>
                          <Td>
                            {f.image && (
                              <Image
                                src={f.image}
                                boxSize="48px"
                                objectFit="cover"
                              />
                            )}
                          </Td>
                          <Td>{f.price_addition}</Td>
                          <Td>{f.thickness}</Td>
                          <Td>
                            <Flex wrap="wrap" gap={1}>
                              {(f.supported_sizes || []).map((sid) => (
                                <Badge key={sid}>{sid}</Badge>
                              ))}
                            </Flex>
                          </Td>
                          <Td>
                            <IconButton
                              size="xs"
                              mr={2}
                              icon={<EditIcon />}
                              onClick={() => handleEdit(f)}
                            />
                            <IconButton
                              size="xs"
                              colorScheme="red"
                              icon={<DeleteIcon />}
                              onClick={() => handleDelete(f.id)}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </AdminTableWithPagination>
              )}
            </AdminTableShell>
          </TabPanel>

          {/* ================= FORM ================= */}
          <TabPanel px={0}>
            <AdminFormShell
              title={editingFrame ? "Edit Frame" : "Add Frame"}
              description="Upload frame styles and map them to supported sizes."
              footer={
                <Flex gap={3}>
                  <Button
                    type="submit"
                    form="frame-form"
                    // bg="white"
                    // color="black"
                    // _hover={{ bg: "whiteAlpha.800" }}
                    isLoading={loading}
                  >
                    {editingFrame ? "Update Frame" : "Create Frame"}
                  </Button>
                  {editingFrame && (
                    <Button variant="ghost" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </Flex>
              }
            >
              <form id="frame-form" onSubmit={handleSubmit}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Price Multiplier</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      name="price_addition"
                      value={formData.price_addition}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Input
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Thickness</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      name="thickness"
                      value={formData.thickness}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Image</FormLabel>
                    <Input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    {formData.image && formData.image instanceof File && (
                      <Box mt={2}>
                        <Image
                          src={URL.createObjectURL(formData.image)}
                          alt="Preview"
                          boxSize="80px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      </Box>
                    )}
                    {!formData.image && editingFrame?.image && (
                      <Box mt={2}>
                        <Text fontSize="xs" color="gray.600" mb={1}>
                          Current image:
                        </Text>
                        <Image
                          src={editingFrame.image}
                          alt={editingFrame.name}
                          boxSize="80px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      </Box>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>Selector Image</FormLabel>
                    <Input
                      type="file"
                      name="selector_image"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    {formData.selector_image &&
                      formData.selector_image instanceof File && (
                        <Box mt={2}>
                          <Image
                            src={URL.createObjectURL(formData.selector_image)}
                            alt="Selector preview"
                            boxSize="80px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                        </Box>
                      )}
                    {!formData.selector_image && editingFrame?.selector_image_url && (
                      <Box mt={2}>
                        <Text fontSize="xs" color="gray.600" mb={1}>
                          Current selector image:
                        </Text>
                        <Image
                          src={editingFrame.selector_image_url}
                          alt={editingFrame.name}
                          boxSize="80px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      </Box>
                    )}
                  </FormControl>
                </SimpleGrid>

                {/*  SUPPORTED SIZES */}
                <SimpleGrid columns={1} spacing={4} w="100%" mt="2%">
                  <FormControl w="100%">
                    <Flex justify="space-between" align="center" mb={3}>
                      <FormLabel mb={0}>Supported Sizes</FormLabel>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={toggleAllSizes}
                        // color="white"
                        // borderColor="whiteAlpha.400"
                        // _hover={{ bg: "whiteAlpha.200" }}
                      >
                        {formData.supported_sizes.length === sizes.length
                          ? "Clear All"
                          : "Select All"}
                      </Button>
                    </Flex>

                    {/* 🔥 3 cards per row */}
                    <SimpleGrid
                      columns={{ base: 1, md: 3 }}
                      spacing={4}
                      w="100%"
                    >
                      {sizes.map((s) => {
                        const selected = formData.supported_sizes.includes(
                          s.id
                        );

                        return (
                          <Box
                            key={s.id}
                            p={4}
                            borderRadius="md"
                            border="2px solid"
                            borderColor={
                              selected ? "accent.500" : "neutral.200"
                            }
                            bg={selected ? "accent.50" : "white"}
                            color="neutral.900"
                            cursor="pointer"
                            transition="all 0.2s ease"
                            _hover={{
                              borderColor: "accent.500",
                              bg: "accent.50",
                            }}
                            onClick={() => toggleSize(s.id)}
                          >
                            <Flex justify="space-between" align="center" mb={1}>
                              <Text fontWeight="bold" fontSize="sm">
                                {s.name}
                              </Text>
                              <Checkbox
                                isChecked={selected}
                                pointerEvents="none"
                                colorScheme="accent"
                              />
                            </Flex>

                            <Text fontSize="xs" color="neutral.700">
                              {s.width_cm} × {s.height_cm} cm • {s.orientation}
                            </Text>
                            <Text fontSize="xs" color="neutral.600">
                              Multiplier: {s.price_multiplier}
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

export default PostFrames;
