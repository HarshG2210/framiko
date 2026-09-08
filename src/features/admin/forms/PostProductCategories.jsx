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
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import {
  bulkUploadProductCategories,
  deleteProductCategory,
  fetchProductCategories,
  postProductCategory,
  updateProductCategory,
} from "../../../redux/slices/productCategoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const fmtDate = (val) =>
  val
    ? new Date(val).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const extractBulkUploadMessage = (payload) => {
  if (typeof payload === "string") return payload;
  if (Array.isArray(payload)) return payload.join(", ");
  if (payload && typeof payload === "object") {
    if (typeof payload.detail === "string") return payload.detail;
    if (typeof payload.message === "string") return payload.message;
    if (typeof payload.error === "string") return payload.error;
    if (typeof payload.errors === "string") return payload.errors;
    if (Array.isArray(payload.errors)) {
      return payload.errors
        .map((item) =>
          typeof item === "string"
            ? item
            : item?.message || item?.detail || JSON.stringify(item),
        )
        .join(", ");
    }
    if (payload.response?.data) {
      return extractBulkUploadMessage(payload.response.data);
    }
  }
  return "Bulk upload failed.";
};

const buildBulkUploadSuccessMessage = (payload) => {
  const createdCount = Number(
    payload?.created_count ??
      (Array.isArray(payload?.created_ids) ? payload.created_ids.length : 0),
  );
  const createdIds = Array.isArray(payload?.created_ids) ? payload.created_ids : [];
  const errorCount = Array.isArray(payload?.errors)
    ? payload.errors.length
    : Number(payload?.error_count || 0);

  if (createdCount > 0) {
    const idText = createdIds.length
      ? ` IDs: ${createdIds.join(", ")}`
      : "";
    const errorText = errorCount ? `, ${errorCount} row(s) failed` : "";
    return `Bulk upload completed successfully. ${createdCount} categor${createdCount === 1 ? "y" : "ies"} created${idText}${errorText}.`;
  }

  return "Bulk upload completed successfully with no new categories created.";
};

/* ─── DeleteConfirmModal ──────────────────────────────────────────────────── */

const DeleteConfirmModal = ({
  category,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
    <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
    <ModalContent borderRadius="2xl" mx={4}>
      <ModalHeader>
        <Flex align="center" gap={3}>
          <Text fontSize="2xl">🗑️</Text>
          <Text fontSize="lg" fontWeight="700">
            Delete Category
          </Text>
        </Flex>
      </ModalHeader>
      <ModalCloseButton borderRadius="full" />
      <ModalBody pb={2}>
        <Text fontSize="sm" color="gray.600">
          Are you sure you want to delete{" "}
          <Text as="span" fontWeight="700" color="gray.800">
            "{category?.name}"
          </Text>
          ? This action cannot be undone.
        </Text>
      </ModalBody>
      <ModalFooter gap={3}>
        <Button
          variant="ghost"
          borderRadius="xl"
          onClick={onClose}
          isDisabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          colorScheme="red"
          borderRadius="xl"
          isLoading={isDeleting}
          loadingText="Deleting…"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

/* ─── PostProductCategories ───────────────────────────────────────────────── */

const PostProductCategories = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { categories = [], loading } = useSelector((s) => s.productCategories);

  /* ── tabs ── */
  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(null); // null = add mode

  /* ── form state ── */
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");

  /* ── delete state ── */
  const [deletingId, setDeletingId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: openDelete,
    onClose: closeDelete,
  } = useDisclosure();

  /* ── search ── */
  const [search, setSearch] = useState("");

  /* ── bulk upload state ── */
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [bulkUploadMessage, setBulkUploadMessage] = useState(null);
  const [bulkUploadErrors, setBulkUploadErrors] = useState(null);

  useEffect(() => {
    dispatch(fetchProductCategories());
  }, [dispatch]);

  /* ── filtered list ── */
  const filtered = useMemo(() => {
    const src = Array.isArray(categories) ? categories : [];
    const q = search.toLowerCase().trim();
    if (!q) return src;
    return src.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) || String(c.id).includes(q),
    );
  }, [categories, search]);

  /* ── AdminUI table hook ── */
  const table = useAdminTable(filtered, 10);
  const {
    page,
    setPage,
    totalPages,
    paginatedData,
    selected,
    toggleRow,
    selectAllCurrentPage,
    clearAll,
  } = table;

  /* ── validation ── */
  const validate = () => {
    if (!name.trim()) {
      setNameError("Category name is required.");
      return false;
    }
    const isDuplicate = categories.some(
      (c) =>
        c.name.toLowerCase() === name.trim().toLowerCase() &&
        c.id !== editing?.id,
    );
    if (isDuplicate) {
      setNameError("A category with this name already exists.");
      return false;
    }
    setNameError("");
    return true;
  };

  /* ── submit (add / edit) ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (editing) {
        await dispatch(
          updateProductCategory({ id: editing.id, name: name.trim() }),
        ).unwrap();
        toast({
          title: "Category updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await dispatch(postProductCategory({ name: name.trim() })).unwrap();
        toast({
          title: "Category added",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      resetForm();
      setTab(0);
      dispatch(fetchProductCategories());
    } catch (err) {
      console.error(err);
      toast({
        title: "Operation failed",
        description: String(err),
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── start edit ── */
  const startEdit = (cat) => {
    setEditing(cat);
    setName(cat.name);
    setNameError("");
    setTab(1);
  };

  /* ── reset form ── */
  const resetForm = () => {
    setEditing(null);
    setName("");
    setNameError("");
  };

  /* ── open delete confirm ── */
  const confirmDelete = (cat) => {
    setToDelete(cat);
    openDelete();
  };

  /* ── execute delete ── */
  const executeDelete = async () => {
    if (!toDelete) return;
    setDeletingId(toDelete.id);
    try {
      await dispatch(deleteProductCategory(toDelete.id)).unwrap();
      dispatch(fetchProductCategories());
      toast({
        title: "Category deleted",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      clearAll();
      closeDelete();
    } catch (err) {
      console.error(err);
      toast({
        title: "Delete failed",
        description: String(err),
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setDeletingId(null);
      setToDelete(null);
    }
  };

  /* ── bulk delete ── */
  const handleDeleteSelected = async () => {
    const ids = [...selected];
    for (const id of ids) {
      try {
        await dispatch(deleteProductCategory(id)).unwrap();
      } catch (err) {
        console.error(err);
      }
    }
    dispatch(fetchProductCategories());
    toast({
      title: `${ids.length} categor${ids.length !== 1 ? "ies" : "y"} deleted`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    clearAll();
  };

  const handleBulkUploadChange = (e) => {
    const file = e.target.files?.[0] || null;
    setBulkUploadFile(file);
  };

  const handleBulkUpload = async () => {
    if (!bulkUploadFile) {
      toast({
        title: "Please select a CSV or XLSX file first.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setBulkUploadLoading(true);
    setBulkUploadMessage(null);
    setBulkUploadErrors(null);

    try {
      const response = await dispatch(
        bulkUploadProductCategories(bulkUploadFile)
      ).unwrap();
      const payload = response?.data ?? response;
      const message = buildBulkUploadSuccessMessage(payload);

      toast({
        title: message,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setBulkUploadMessage(message);
      setBulkUploadErrors(payload?.errors || null);
      setBulkUploadFile(null);
      dispatch(fetchProductCategories());
    } catch (err) {
      const errorMessage = extractBulkUploadMessage(err);
      toast({
        title: errorMessage,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setBulkUploadMessage(null);
      setBulkUploadErrors([{ row: null, errors: errorMessage }]);
    } finally {
      setBulkUploadLoading(false);
    }
  };

  /* ── toolbar ── */
  const toolbar = (
    <Flex gap={2} align="center" flexWrap="wrap">
      <InputGroup size="sm" maxW="200px">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search categories…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          borderRadius="lg"
          bg="white"
        />
      </InputGroup>

      <Badge colorScheme="blue" borderRadius="full" px={3} py={1} fontSize="xs">
        {filtered.length} {filtered.length === 1 ? "category" : "categories"}
      </Badge>

      {search && (
        <Button
          size="sm"
          variant="ghost"
          colorScheme="gray"
          borderRadius="lg"
          onClick={() => {
            setSearch("");
            setPage(1);
          }}
        >
          Clear
        </Button>
      )}
    </Flex>
  );

  /* ── render ── */
  return (
    <AdminPage
      title="Product Categories"
      description="Manage categories used to organise your products."
      actions={
        <Button
          colorScheme="blue"
          borderRadius="xl"
          size="sm"
          onClick={() => {
            resetForm();
            setTab(1);
          }}
        >
          + Add Category
        </Button>
      }
    >
      <Tabs
        index={tab}
        onChange={setTab}
        isFitted
        variant="enclosed"
        borderRadius="xl"
      >
        <TabList mb={4}>
          <Tab
            fontWeight="600"
            fontSize="sm"
            _selected={{
              color: "blue.600",
              borderBottomColor: "blue.500",
              bg: "blue.50",
            }}
          >
            📋 Categories ({categories.length})
          </Tab>
          <Tab
            fontWeight="600"
            fontSize="sm"
            _selected={{
              color: "blue.600",
              borderBottomColor: "blue.500",
              bg: "blue.50",
            }}
            onClick={resetForm}
          >
            {editing ? "✏️ Edit Category" : "➕ Add Category"}
          </Tab>
        </TabList>

        <TabPanels>
          {/* ═══════════════ TABLE TAB ═══════════════ */}
          <TabPanel px={0} pb={0}>
            <AdminTableShell title="All Categories" toolbar={toolbar}>
              {loading ? (
                <Flex justify="center" py={10}>
                  <Spinner size="xl" />
                </Flex>
              ) : filtered.length === 0 ? (
                <Flex direction="column" align="center" py={16} gap={3}>
                  <Text fontSize="3xl">{search ? "🔍" : "📂"}</Text>
                  <Text fontWeight="600" color="gray.600">
                    {search
                      ? "No categories match your search"
                      : "No categories yet"}
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    {search
                      ? "Try a different keyword."
                      : "Click Add Category to create your first one."}
                  </Text>
                  {search && (
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="blue"
                      borderRadius="lg"
                      onClick={() => setSearch("")}
                    >
                      Clear Search
                    </Button>
                  )}
                </Flex>
              ) : (
                <AdminTableWithPagination
                  table={table}
                  selectedCount={selected.size}
                  onDeleteSelected={handleDeleteSelected}
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                >
                  <Box overflowX="auto">
                    <Table size="sm" variant="simple">
                      <Thead>
                        <Tr>
                          {/* Select-all */}
                          <Th w="36px">
                            <Tooltip label="Select all on page">
                              <Checkbox
                                isChecked={
                                  paginatedData.length > 0 &&
                                  paginatedData.every((c) => selected.has(c.id))
                                }
                                isIndeterminate={
                                  paginatedData.some((c) =>
                                    selected.has(c.id),
                                  ) &&
                                  !paginatedData.every((c) =>
                                    selected.has(c.id),
                                  )
                                }
                                onChange={(e) =>
                                  e.target.checked
                                    ? selectAllCurrentPage()
                                    : clearAll()
                                }
                              />
                            </Tooltip>
                          </Th>
                          <Th>ID</Th>
                          <Th>Name</Th>
                          <Th>Created</Th>
                          <Th>Updated</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>

                      <Tbody>
                        {paginatedData.map((c) => {
                          const isSelected = selected.has(c.id);
                          return (
                            <Tr
                              key={c.id}
                              bg={isSelected ? "blue.50" : undefined}
                              _hover={{
                                bg: isSelected ? "blue.50" : "gray.50",
                              }}
                              transition="background 0.15s"
                            >
                              {/* Checkbox */}
                              <Td>
                                <Checkbox
                                  isChecked={isSelected}
                                  onChange={() => toggleRow(c.id)}
                                />
                              </Td>

                              {/* ID */}
                              <Td>
                                <Text
                                  fontFamily="mono"
                                  fontSize="xs"
                                  color="gray.500"
                                >
                                  #{c.id}
                                </Text>
                              </Td>

                              {/* Name */}
                              <Td>
                                <HStack spacing={2}>
                                  <Box
                                    w="8px"
                                    h="8px"
                                    borderRadius="full"
                                    bg="blue.400"
                                    flexShrink={0}
                                  />
                                  <Text
                                    fontWeight="600"
                                    fontSize="sm"
                                    color="gray.800"
                                  >
                                    {c.name}
                                  </Text>
                                </HStack>
                              </Td>

                              {/* Created */}
                              <Td>
                                <Text fontSize="xs" color="gray.500">
                                  {fmtDate(c.created_at)}
                                </Text>
                              </Td>

                              {/* Updated */}
                              <Td>
                                <Text fontSize="xs" color="gray.500">
                                  {fmtDate(c.updated_at)}
                                </Text>
                              </Td>

                              {/* Actions */}
                              <Td>
                                <HStack spacing={2}>
                                  <Tooltip label="Edit">
                                    <IconButton
                                      size="sm"
                                      icon={<EditIcon />}
                                      variant="ghost"
                                      colorScheme="blue"
                                      borderRadius="lg"
                                      aria-label="Edit category"
                                      onClick={() => startEdit(c)}
                                    />
                                  </Tooltip>
                                  <Tooltip label="Delete">
                                    <IconButton
                                      size="sm"
                                      icon={
                                        deletingId === c.id ? (
                                          <Spinner size="xs" />
                                        ) : (
                                          <DeleteIcon />
                                        )
                                      }
                                      variant="ghost"
                                      colorScheme="red"
                                      borderRadius="lg"
                                      aria-label="Delete category"
                                      isDisabled={deletingId === c.id}
                                      onClick={() => confirmDelete(c)}
                                    />
                                  </Tooltip>
                                </HStack>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </Box>
                </AdminTableWithPagination>
              )}
            </AdminTableShell>
          </TabPanel>

          {/* ═══════════════ FORM TAB ═══════════════ */}
          <TabPanel px={0} pb={0}>
            <AdminFormShell
              title={editing ? "Edit Category" : "Add New Category"}
              description={
                editing
                  ? `Updating category: "${editing.name}"`
                  : "Create a new product category to organise your catalogue."
              }
            >
              <Box as="form" onSubmit={handleSubmit}>
                <VStack align="stretch" spacing={5}>
                  {/* Name field */}
                  <FormControl isRequired isInvalid={!!nameError}>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.600">
                      Category Name
                    </FormLabel>
                    <Input
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError("");
                      }}
                      placeholder="e.g. Wall Art, Canvas Prints…"
                      borderRadius="xl"
                      borderColor={nameError ? "red.300" : "gray.200"}
                      _focus={{
                        borderColor: nameError ? "red.400" : "blue.400",
                        boxShadow: nameError
                          ? "0 0 0 1px #FC8181"
                          : "0 0 0 1px #63B3ED",
                      }}
                    />
                    {nameError && (
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {nameError}
                      </Text>
                    )}
                  </FormControl>

                  {/* Preview */}
                  {name.trim() && (
                    <Box
                      p={4}
                      bg="blue.50"
                      borderRadius="xl"
                      borderWidth="1px"
                      borderColor="blue.100"
                    >
                      <Text
                        fontSize="xs"
                        fontWeight="700"
                        textTransform="uppercase"
                        letterSpacing="0.08em"
                        color="blue.400"
                        mb={1}
                      >
                        Preview
                      </Text>
                      <HStack spacing={2}>
                        <Box
                          w="8px"
                          h="8px"
                          borderRadius="full"
                          bg="blue.400"
                        />
                        <Text fontWeight="600" fontSize="sm" color="blue.700">
                          {name.trim()}
                        </Text>
                      </HStack>
                    </Box>
                  )}

                  {/* Editing info */}
                  {editing && (
                    <Box
                      p={4}
                      bg="orange.50"
                      borderRadius="xl"
                      borderWidth="1px"
                      borderColor="orange.100"
                    >
                      <Text fontSize="xs" color="orange.600" fontWeight="600">
                        ✏️ Editing category ID #{editing.id} — "{editing.name}"
                      </Text>
                    </Box>
                  )}

                  {/* Buttons */}
                  <HStack spacing={3}>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      borderRadius="xl"
                      isLoading={submitting}
                      loadingText={editing ? "Updating…" : "Creating…"}
                      isDisabled={!name.trim()}
                    >
                      {editing ? "Update Category" : "Create Category"}
                    </Button>
                    <Button
                      variant="ghost"
                      borderRadius="xl"
                      onClick={() => {
                        resetForm();
                        setTab(0);
                      }}
                      isDisabled={submitting}
                    >
                      Cancel
                    </Button>
                  </HStack>

                  <Box pt={2}>
                    <FormControl>
                      <FormLabel fontSize="sm" mb={2}>
                        Bulk upload product categories
                      </FormLabel>
                      <Flex gap={3} align="flex-end" flexWrap="wrap">
                        <Input
                          type="file"
                          accept=".csv,.xlsx"
                          onChange={handleBulkUploadChange}
                          width="auto"
                        />
                        <Button
                          type="button"
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
                          href="/sample-product-category-upload.csv"
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
                </VStack>
              </Box>
            </AdminFormShell>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Delete confirm modal */}
      <DeleteConfirmModal
        category={toDelete}
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={executeDelete}
        isDeleting={!!deletingId}
      />
    </AdminPage>
  );
};

export default PostProductCategories;
