import "react-toastify/dist/ReactToastify.css";

import {
  AdminFormShell,
  AdminPage,
  AdminTableShell,
  AdminTableWithPagination,
  useAdminTable,
} from "../../../layout/AdminUI";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
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
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import {
  bulkUploadSizes,
  deleteSize,
  fetchSizes,
  postSize,
  updateSize,
} from "../../../redux/slices/sizesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const PostSizes = () => {
  const dispatch = useDispatch();
  const {
    sizes = [],
    loading,
    error,
  } = useSelector((state) => state.sizes || {});

  const table = useAdminTable(sizes, 5);

  const [tabIndex, setTabIndex] = useState(0);
  const [editingSize, setEditingSize] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    orientation: "",
    width_cm: "",
    height_cm: "",
    package_length_cm: "",
    package_width_cm: "",
    package_height_cm: "",
    package_weight_kg: "",
  });
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [bulkUploadMessage, setBulkUploadMessage] = useState(null);
  const [bulkUploadErrors, setBulkUploadErrors] = useState(null);

  useEffect(() => {
    dispatch(fetchSizes());
  }, [dispatch]);

  /* ---------------- FORM ---------------- */

  const resetForm = () => {
    setEditingSize(null);
    setFormData({
      name: "",
      orientation: "",
      width_cm: "",
      height_cm: "",
      package_length_cm: "",
      package_width_cm: "",
      package_height_cm: "",
      package_weight_kg: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      width_cm: Number(formData.width_cm),
      height_cm: Number(formData.height_cm),
      package_length_cm: Number(formData.package_length_cm),
      package_width_cm: Number(formData.package_width_cm),
      package_height_cm: Number(formData.package_height_cm),
      package_weight_kg: Number(formData.package_weight_kg),
    };

    try {
      if (editingSize) {
        await dispatch(
          updateSize({ id: editingSize.id, data: payload }),
        ).unwrap();
        toast.success("Size updated");
      } else {
        await dispatch(postSize(payload)).unwrap();
        toast.success("Size created");
      }
      dispatch(fetchSizes());
      resetForm();
      setTabIndex(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (size) => {
    setEditingSize(size);
    setFormData({
      name: size.name || "",
      orientation: size.orientation || "",
      width_cm: size.width_cm || "",
      height_cm: size.height_cm || "",
      package_length_cm: size.package_length_cm || "",
      package_width_cm: size.package_width_cm || "",
      package_height_cm: size.package_height_cm || "",
      package_weight_kg: size.package_weight_kg || "",
    });
    setTabIndex(1);
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    await dispatch(deleteSize(id));
    dispatch(fetchSizes());
  };

  const handleBulkDelete = async () => {
    await Promise.all(
      [...table.selected].map((id) => dispatch(deleteSize(id))),
    );
    table.clearAll();
    dispatch(fetchSizes());
    toast.success("Selected sizes deleted");
  };

  const handleBulkUploadChange = (e) => {
    const file = e.target.files?.[0] || null;
    setBulkUploadFile(file);
  };

  const handleBulkUpload = async () => {
    if (!bulkUploadFile) {
      toast.info("Please select a CSV or XLSX file first.");
      return;
    }

    setBulkUploadLoading(true);
    setBulkUploadMessage(null);
    setBulkUploadErrors(null);

    try {
      const response = await dispatch(bulkUploadSizes(bulkUploadFile)).unwrap();
      const errorCount = response.errors?.length || 0;
      const createdCount = response.created_count || 0;
      const message = `Bulk upload completed: ${createdCount} sizes added${errorCount ? `, ${errorCount} row(s) failed` : ""}.`;

      toast.success(message);
      setBulkUploadMessage(message);
      setBulkUploadErrors(response.errors || null);
      setBulkUploadFile(null);
      dispatch(fetchSizes());
    } catch (err) {
      const errorMessage = err?.detail || err?.error || "Bulk upload failed.";
      toast.error(errorMessage);
      setBulkUploadMessage(null);
      setBulkUploadErrors([{ row: null, errors: errorMessage }]);
    } finally {
      setBulkUploadLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <AdminPage
      title="Size Management"
      description="Configure available artwork sizes."
    >
      <Tabs index={tabIndex} onChange={setTabIndex} variant="unstyled" isFitted>
        <TabList mb={4} bg="whiteAlpha.50" borderRadius="full" p="2px">
          <Tab _selected={{ bg: "white", color: "black" }} borderRadius="full">
            Sizes
          </Tab>
          <Tab _selected={{ bg: "white", color: "black" }} borderRadius="full">
            {editingSize ? "Edit Size" : "Add Size"}
          </Tab>
        </TabList>

        <TabPanels>
          {/* ---------------- TABLE ---------------- */}
          <TabPanel px={0}>
            <AdminTableShell title="All Sizes">
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
                            isChecked={
                              table.paginatedData.length > 0 &&
                              table.paginatedData.every((r) =>
                                table.selected.has(r.id),
                              )
                            }
                            onChange={table.selectAllCurrentPage}
                          />
                        </Th>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Orientation</Th>
                        <Th>Dimensions</Th>
                        <Th>Package Size (L X W X H)</Th>
                        <Th>Weight</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {table.paginatedData.map((s) => (
                        <Tr key={s.id} _hover={{ bg: "whiteAlpha.50" }}>
                          <Td>
                            <Checkbox
                              isChecked={table.selected.has(s.id)}
                              onChange={() => table.toggleRow(s.id)}
                            />
                          </Td>
                          <Td>{s.id}</Td>
                          <Td>{s.name}</Td>
                          <Td>{s.orientation}</Td>
                          <Td>
                            {s.width_cm} × {s.height_cm} inches
                          </Td>
                          <Td>
                            {s.package_length_cm} × {s.package_width_cm} ×{" "}
                            {s.package_height_cm} cm
                          </Td>
                          <Td>{s.package_weight_kg} kg</Td>
                          <Td>
                            <Flex gap={2}>
                              <Tooltip label="Edit">
                                <IconButton
                                  size="xs"
                                  icon={<EditIcon />}
                                  onClick={() => handleEdit(s)}
                                />
                              </Tooltip>
                              <Tooltip label="Delete">
                                <IconButton
                                  size="xs"
                                  colorScheme="red"
                                  icon={<DeleteIcon />}
                                  onClick={() => handleDelete(s.id)}
                                />
                              </Tooltip>
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </AdminTableWithPagination>
              )}
            </AdminTableShell>
          </TabPanel>

          {/* ---------------- FORM ---------------- */}
          <TabPanel px={0}>
            <AdminFormShell
              title={editingSize ? "Edit Size" : "Add Size"}
              footer={
                <Box>
                  <Flex gap={3}>
                    <Button type="submit" form="size-form" isLoading={loading}>
                      {editingSize ? "Update Size" : "Create Size"}
                    </Button>
                    {editingSize && (
                      <Button variant="ghost" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                  </Flex>

                  <Box mt={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" mb={2}>
                        Bulk upload sizes
                      </FormLabel>
                      <Flex gap={3} align="flex-end" flexWrap="wrap">
                        <Input
                          type="file"
                          accept=".csv,.xlsx"
                          onChange={handleBulkUploadChange}
                          width="auto"
                        />
                        <Button
                          size="sm"
                          onClick={handleBulkUpload}
                          isLoading={bulkUploadLoading}
                        >
                          Upload file
                        </Button>
                      </Flex>
                      <Text fontSize="xs" color="gray.500" mt={2}>
                        Upload a CSV or XLSX file. Required headers: name,
                        width_cm, height_cm, orientation, package_length_cm,
                        package_width_cm, package_height_cm, package_weight_kg.
                      </Text>
                      <Text fontSize="xs" color="blue.500" mt={2}>
                        <a
                          href="/sample-size-upload.csv"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Download sample CSV
                        </a>
                      </Text>
                      {bulkUploadMessage && (
                        <Box mt={3} p={3} bg="green.50" borderRadius="md">
                          <Text fontSize="sm" color="green.800">
                            {bulkUploadMessage}
                          </Text>
                          {bulkUploadErrors?.length > 0 && (
                            <Box mt={2}>
                              <Text fontSize="xs" color="gray.600" mb={1}>
                                First error:
                              </Text>
                              <Text fontSize="xs" color="red.600">
                                {bulkUploadErrors[0].row
                                  ? `Row ${bulkUploadErrors[0].row}: ${JSON.stringify(
                                      bulkUploadErrors[0].errors,
                                    )}`
                                  : JSON.stringify(bulkUploadErrors[0].errors)}
                              </Text>
                            </Box>
                          )}
                        </Box>
                      )}
                    </FormControl>
                  </Box>
                </Box>
              }
            >
              <form id="size-form" onSubmit={handleSubmit}>
                <SimpleGrid columns={2} spacing={4} w="100%" mt="2%">
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Orientation</FormLabel>
                    <Select
                      name="orientation"
                      value={formData.orientation}
                      onChange={handleChange}
                      placeholder="Select orientation"
                    >
                      <option value="landscape" style={{ color: "#000" }}>
                        Landscape
                      </option>
                      <option value="portrait" style={{ color: "#000" }}>
                        Portrait
                      </option>
                      <option value="square" style={{ color: "#000" }}>
                        Square
                      </option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Width (inch)</FormLabel>
                    <Input
                      type="number"
                      name="width_cm"
                      value={formData.width_cm}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Height (inch)</FormLabel>
                    <Input
                      type="number"
                      name="height_cm"
                      value={formData.height_cm}
                      onChange={handleChange}
                    />
                  </FormControl>

                  {/* Package Dimensions Section */}
                  <FormControl isRequired>
                    <FormLabel>Package Length (cm)</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      name="package_length_cm"
                      value={formData.package_length_cm}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Package Width (cm)</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      name="package_width_cm"
                      value={formData.package_width_cm}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Package Height (cm)</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      name="package_height_cm"
                      value={formData.package_height_cm}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Package Weight (kg)</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      name="package_weight_kg"
                      value={formData.package_weight_kg}
                      onChange={handleChange}
                    />
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

export default PostSizes;
