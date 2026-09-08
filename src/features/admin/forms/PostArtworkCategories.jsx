// src/components/admin/PostArtworkCategories.jsx

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
  bulkUploadArtworkCategories,
  deleteArtworkCategory,
  fetchArtworkCategories,
  postArtworkCategory,
  updateArtworkCategory,
} from "../../../redux/slices/artworkCategoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const PostArtworkCategories = () => {
  const dispatch = useDispatch();
  const {
    artworkCategories = [],
    loading,
    error,
  } = useSelector((state) => state.artworkCategories || {});

  /* 🔥 pagination + selection */
  const table = useAdminTable(artworkCategories, 5);

  const [tabIndex, setTabIndex] = useState(0);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [bulkUploadMessage, setBulkUploadMessage] = useState(null);
  const [bulkUploadErrors, setBulkUploadErrors] = useState(null);

  useEffect(() => {
    dispatch(fetchArtworkCategories());
  }, [dispatch]);

  const resetForm = () => {
    setEditing(null);
    setFormData({ name: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Name is required.");
      return;
    }

    try {
      if (editing) {
        await dispatch(
          updateArtworkCategory({ id: editing.id, name: formData.name })
        ).unwrap();
        toast.success("Category updated");
      } else {
        await dispatch(postArtworkCategory({ name: formData.name })).unwrap();
        toast.success("Category added");
      }

      dispatch(fetchArtworkCategories());
      resetForm();
      setTabIndex(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setFormData({ name: cat.name || "" });
    setTabIndex(1);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteArtworkCategory(id)).unwrap();
    dispatch(fetchArtworkCategories());
    toast.success("Category deleted");
  };

  const handleBulkDelete = async () => {
    await Promise.all(
      [...table.selected].map((id) => dispatch(deleteArtworkCategory(id)))
    );
    table.clearAll();
    dispatch(fetchArtworkCategories());
    toast.success("Selected categories deleted");
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
      const response = await dispatch(
        bulkUploadArtworkCategories(bulkUploadFile)
      ).unwrap();
      const errorCount = response.errors?.length || 0;
      const createdCount = response.created_count || 0;
      const message = `Bulk upload completed: ${createdCount} categories added${errorCount ? `, ${errorCount} row(s) failed` : ''}.`;

      toast.success(message);
      setBulkUploadMessage(message);
      setBulkUploadErrors(response.errors || null);
      setBulkUploadFile(null);
      dispatch(fetchArtworkCategories());
    } catch (err) {
      const errorMessage = err?.detail || err?.error || "Bulk upload failed.";
      toast.error(errorMessage);
      setBulkUploadMessage(null);
      setBulkUploadErrors([{ row: null, errors: errorMessage }]);
    } finally {
      setBulkUploadLoading(false);
    }
  };

  return (
    <AdminPage
      title="Artwork Categories"
      description="Define high-level categories like 'Buddha', 'Abstract', 'Landscape'."
    >
      <Tabs index={tabIndex} onChange={setTabIndex} variant="unstyled" isFitted>
        <TabList mb={4} bg="whiteAlpha.50" borderRadius="full" p="2px">
          <Tab _selected={{ bg: "white", color: "black" }}>Categories</Tab>
          <Tab _selected={{ bg: "white", color: "black" }}>
            {editing ? "Edit Category" : "Add Category"}
          </Tab>
        </TabList>

        <TabPanels>
          {/* ================= TABLE ================= */}
          <TabPanel px={0}>
            <AdminTableShell title="All Categories">
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
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {table.paginatedData.map((c) => (
                        <Tr key={c.id}>
                          <Td>
                            <Checkbox
                              isChecked={table.selected.has(c.id)}
                              onChange={() => table.toggleRow(c.id)}
                            />
                          </Td>
                          <Td>{c.id}</Td>
                          <Td>{c.name}</Td>
                          <Td>
                            <IconButton
                              size="xs"
                              icon={<EditIcon />}
                              mr={2}
                              onClick={() => handleEdit(c)}
                            />
                            <IconButton
                              size="xs"
                              colorScheme="red"
                              icon={<DeleteIcon />}
                              onClick={() => handleDelete(c.id)}
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
              title={editing ? "Edit Category" : "Add Category"}
              description="Categories group related artworks and make browsing easier."
              footer={
                <Box>
                  <Flex gap={3}>
                    <Button
                      type="submit"
                      form="category-form"
                      isLoading={loading}
                    >
                      {editing ? "Update Category" : "Create Category"}
                    </Button>
                    {editing && (
                      <Button variant="ghost" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                  </Flex>

                  <Box mt={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" mb={2}>
                        Bulk upload categories
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
                        Upload a CSV or XLSX file with a single header named
                        <strong> name</strong>.
                      </Text>
                      <Text fontSize="xs" color="blue.500" mt={2}>
                        <a
                          href="/sample-artwork-category-upload.csv"
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
              <form id="category-form" onSubmit={handleSubmit}>
                <Flex direction={{ base: "column", md: "row" }} gap={4}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Buddha"
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

export default PostArtworkCategories;
