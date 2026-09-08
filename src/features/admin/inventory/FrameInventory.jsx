// src/components/admin/inventory/FrameInventory.jsx

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
import { ToastContainer, toast } from "react-toastify";
import {
  addOrUpdateFrameInventory,
  bulkUploadFrameInventory,
  fetchFrameInventory,
} from "../../../redux/slices/frameInventorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { fetchFrames } from "../../../redux/slices/framesSlice";
import { fetchSizes } from "../../../redux/slices/sizesSlice";

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
    const idText = createdIds.length ? ` IDs: ${createdIds.join(", ")}` : "";
    const errorText = errorCount ? `, ${errorCount} row(s) failed` : "";
    return `Bulk upload completed successfully. ${createdCount} inventory row${createdCount === 1 ? "" : "s"} created${idText}${errorText}.`;
  }

  return "Bulk upload completed successfully with no new inventory rows created.";
};

const FrameInventory = () => {
  const dispatch = useDispatch();
  const { frames = [] } = useSelector((state) => state.frames || {});
  const { sizes = [] } = useSelector((state) => state.sizes || {});
  const {
    items: inventory = [],
    loading,
    error,
  } = useSelector((state) => state.frameInventory || {});
  const table = useAdminTable(inventory, 5);

  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    frame: "",
    size: "",
    quantity: "",
  });
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [bulkUploadMessage, setBulkUploadMessage] = useState(null);
  const [bulkUploadErrors, setBulkUploadErrors] = useState(null);

  useEffect(() => {
    dispatch(fetchFrames()).unwrap();
    dispatch(fetchSizes()).unwrap();
    dispatch(fetchFrameInventory()).unwrap();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        addOrUpdateFrameInventory({
          frame: formData.frame,
          size: formData.size,
          quantity: formData.quantity,
        }),
      ).unwrap();
      setFormData({ frame: "", size: "", quantity: "" });
      setTabIndex(0);
    } catch (err) {
      console.error(err);
    }
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
        bulkUploadFrameInventory(bulkUploadFile),
      ).unwrap();
      const payload = response?.data ?? response;
      const message = buildBulkUploadSuccessMessage(payload);

      toast.success(message);
      setBulkUploadMessage(message);
      setBulkUploadErrors(payload?.errors || null);
      setBulkUploadFile(null);
      dispatch(fetchFrameInventory());
    } catch (err) {
      const errorMessage = err?.detail || err?.error || "Bulk upload failed.";
      toast.error(errorMessage);
      setBulkUploadMessage(null);
      setBulkUploadErrors([{ row: null, errors: errorMessage }]);
    } finally {
      setBulkUploadLoading(false);
    }
  };

  const fillFromRow = (row) => {
    setFormData({
      frame: row.frame?.toString() ?? "",
      size: row.size?.toString() ?? "",
      quantity: row.quantity?.toString() ?? "",
    });
    setTabIndex(1);
  };

  return (
    <>
      <AdminPage
        title="Frames Inventory"
        description="Track and adjust physical frame inventory per size."
      >
        {/* ===================== FAST SELLING FRAMES ===================== */}
        {!loading && inventory.length > 0 && (
          <Flex gap={4} mb={6} wrap="wrap">
            {[...inventory]
              .sort((a, b) => a.quantity - b.quantity)
              .slice(0, 3)
              .map((item, index) => (
                <Box
                  key={item.id}
                  flex="1"
                  minW={{ base: "100%", md: "30%" }}
                  bg="rgba(255,255,255,0.06)"
                  border="1px solid rgba(255,255,255,0.12)"
                  borderRadius="2xl"
                  p={4}
                  position="relative"
                  overflow="hidden"
                >
                  {/* Glow */}
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
                      FAST SELLING #{index + 1}
                    </Badge>

                    <Badge
                      variant="outline"
                      colorScheme={item.quantity < 20 ? "red" : "orange"}
                    >
                      Stock: {item.quantity}
                    </Badge>
                  </Flex>

                  <Flex align="center" gap={4}>
                    <Image
                      src={item.frame_image}
                      boxSize="64px"
                      borderRadius="lg"
                      objectFit="cover"
                    />

                    <Box>
                      <Text fontWeight="bold" fontSize="md">
                        {item.frame_name}
                      </Text>

                      <Text fontSize="sm" opacity={0.8}>
                        {item.size_name} • {item.orientation}
                      </Text>

                      <Text fontSize="xs" opacity={0.6}>
                        {item.width_cm} × {item.height_cm} cm
                      </Text>
                    </Box>
                  </Flex>

                  <Box mt={3}>
                    <Badge
                      px={3}
                      py={1}
                      borderRadius="full"
                      colorScheme={item.quantity < 10 ? "red" : "orange"}
                    >
                      ⚠ Low Stock Alert
                    </Badge>
                  </Box>
                </Box>
              ))}
          </Flex>
        )}
        <Tabs
          index={tabIndex}
          onChange={setTabIndex}
          variant="unstyled"
          isFitted
        >
          <TabList mb={4} bg="whiteAlpha.50" borderRadius="full" p="2px">
            <Tab _selected={{ bg: "white", color: "black" }}>
              Frames Inventory
            </Tab>
            <Tab _selected={{ bg: "white", color: "black" }}>
              Add / Update Frames
            </Tab>
          </TabList>

          <TabPanels>
            {/* ===================== TABLE ===================== */}
            <TabPanel px={0}>
              <AdminTableShell title="Frame Inventory">
                {loading ? (
                  <Flex justify="center" py={8}>
                    <Spinner />
                  </Flex>
                ) : error ? (
                  <Text color="red.400" p={4}>
                    {error}
                  </Text>
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
                          <Th>Frame</Th>
                          <Th>Size Details</Th>
                          <Th>Quantity</Th>
                          <Th>Frame ID</Th>
                          <Th>Size ID</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>

                      <Tbody>
                        {table.paginatedData.map((row) => (
                          <Tr key={row.id} _hover={{ bg: "whiteAlpha.50" }}>
                            <Td fontWeight="bold">{row.id}</Td>

                            <Td>
                              <Flex align="center" gap={3}>
                                <Image
                                  src={row.frame_image}
                                  boxSize="42px"
                                  borderRadius="md"
                                  objectFit="cover"
                                />
                                <Box>
                                  <Text fontSize="sm" fontWeight="bold">
                                    {row.frame_name}
                                  </Text>
                                  <Text fontSize="xs" opacity={0.7}>
                                    ID: {row.frame}
                                  </Text>
                                </Box>
                              </Flex>
                            </Td>

                            <Td>
                              <Box>
                                <Text fontSize="sm" fontWeight="bold">
                                  {row.size_name}
                                </Text>
                                <Text fontSize="xs" opacity={0.8}>
                                  {row.width_cm} × {row.height_cm} cm
                                </Text>
                                <Badge mt={1} variant="subtle">
                                  {row.orientation}
                                </Badge>
                              </Box>
                            </Td>

                            <Td>
                              <Badge
                                px={3}
                                py={1}
                                fontSize="sm"
                                borderRadius="full"
                              >
                                {row.quantity}
                              </Badge>
                            </Td>

                            <Td>{row.frame}</Td>
                            <Td>{row.size}</Td>

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

            {/* ===================== FORM (UNCHANGED) ===================== */}
            <TabPanel px={0}>
              <AdminFormShell
                title="Add / Update Frame Inventory"
                description="Update quantity for frame and size combinations."
                footer={
                  <Box>
                    <Flex gap={3}>
                      <Button
                        type="submit"
                        form="frame-inventory-form"
                        bg="white"
                        color="black"
                        _hover={{ bg: "whiteAlpha.800" }}
                        isLoading={loading}
                      >
                        Save
                      </Button>
                    </Flex>

                    <Box mt={4}>
                      <FormControl>
                        <FormLabel fontSize="sm" mb={2}>
                          Bulk upload frame inventory
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
                          Upload a CSV or XLSX file with headers: frame, size,
                          quantity.
                        </Text>
                        <Text fontSize="xs" color="blue.500" mt={2}>
                          <a
                            href="/sample-frame-inventory-upload.csv"
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
                                    : JSON.stringify(
                                        bulkUploadErrors[0].errors,
                                      )}
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
                <form id="frame-inventory-form" onSubmit={handleSubmit}>
                  <Flex direction={{ base: "column", md: "row" }} gap={4}>
                    <FormControl isRequired>
                      <FormLabel>Frame</FormLabel>

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
                          {formData.frame
                            ? (() => {
                                const f = frames.find(
                                  (item) => item.id === Number(formData.frame),
                                );
                                return f ? (
                                  <Flex align="center" gap={3}>
                                    <Image
                                      src={f.image}
                                      boxSize="32px"
                                      borderRadius="md"
                                      objectFit="cover"
                                    />
                                    <Text>{f.name}</Text>
                                  </Flex>
                                ) : (
                                  "Select frame"
                                );
                              })()
                            : "Select frame"}
                        </MenuButton>

                        <MenuList bg="gray.900" borderColor="gray.700">
                          {frames.map((f) => (
                            <MenuItem
                              key={f.id}
                              bg="gray.900"
                              _hover={{ bg: "gray.700" }}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  frame: f.id.toString(),
                                }))
                              }
                            >
                              <Flex align="center" gap={3}>
                                <Image
                                  src={f.image}
                                  boxSize="40px"
                                  borderRadius="md"
                                  objectFit="cover"
                                />
                                <Box>
                                  <Text fontSize="sm" color="white">
                                    {f.name}
                                  </Text>
                                  <Text fontSize="xs" color="gray.400">
                                    ID: {f.id}
                                  </Text>
                                </Box>
                              </Flex>
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Size</FormLabel>

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
                          {formData.size
                            ? (() => {
                                const s = sizes.find(
                                  (item) => item.id === Number(formData.size),
                                );
                                return s ? (
                                  <Flex direction="column" align="flex-start">
                                    <Text fontSize="sm" fontWeight="bold">
                                      {s.name} (ID: {s.id})
                                    </Text>
                                    <Text fontSize="xs" color="gray.600">
                                      {s.width_cm} × {s.height_cm} cm —{" "}
                                      {s.orientation}
                                    </Text>
                                  </Flex>
                                ) : (
                                  "Select size"
                                );
                              })()
                            : "Select size"}
                        </MenuButton>

                        <MenuList bg="gray.900" borderColor="gray.700">
                          {sizes.map((s) => (
                            <MenuItem
                              key={s.id}
                              bg="gray.900"
                              _hover={{ bg: "gray.700" }}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  size: s.id.toString(),
                                }))
                              }
                            >
                              <Flex direction="column" align="flex-start">
                                <Text
                                  fontSize="sm"
                                  color="white"
                                  fontWeight="bold"
                                >
                                  {s.name} (ID: {s.id})
                                </Text>

                                <Text fontSize="xs" color="gray.400">
                                  {s.width_cm} × {s.height_cm} cm —{" "}
                                  {s.orientation}
                                </Text>

                                <Text fontSize="xs" color="gray.500">
                                  Multiplier: {s.price_multiplier}
                                </Text>
                              </Flex>
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                    </FormControl>

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
    </>
  );
};

export default FrameInventory;
