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
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Image,
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
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import {
  deleteProduct,
  fetchProducts,
  postProduct,
  updateProduct,
} from "../../../redux/slices/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import { fetchProductCategories } from "../../../redux/slices/productCategoriesSlice";

/* ─── Django choices ──────────────────────────────────────────────────────── */

const ORIENTATIONS = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
  { value: "square", label: "Square" },
];

const FINISHES = [
  { value: "matte", label: "Matte" },
  { value: "glossy", label: "Glossy" },
  { value: "laminated", label: "Laminated" },
  { value: "wood_texture", label: "Wood Texture" },
];

const MATERIALS = [
  { value: "wood", label: "Wood" },
  { value: "metal", label: "Metal" },
  { value: "acrylic", label: "Acrylic" },
  { value: "fiber", label: "Fiber" },
  { value: "resin", label: "Resin" },
  { value: "plastic", label: "Plastic" },
];

const GLASS_TYPES = [
  { value: "normal", label: "Normal Glass" },
  { value: "non_reflective", label: "Non-Reflective Glass" },
  { value: "acrylic", label: "Acrylic Glass" },
  { value: "none", label: "No Glass" },
];

const IMAGE_KEYS = ["image", "image1", "image2", "image3", "image4"];

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const fmtDate = (val) =>
  val
    ? new Date(val).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const fmtCurrency = (val) =>
  val !== "" && val !== null && val !== undefined
    ? `₹${Number(val).toLocaleString("en-IN")}`
    : "—";

const initialForm = {
  name: "",
  sku: "",
  description: "",
  categories: "",
  price: "",
  discount_price: "",
  material: "",
  finish: "",
  color: "",
  size: "",
  orientation: "",
  glass_type: "",
  weight: "",
  package_length_cm: "",
  package_width_cm: "",
  package_height_cm: "",
  package_weight_kg: "",
  quantity: "",
  low_stock_threshold: "",
  is_low_stock: false,
  wall_mountable: false,
  table_top: false,
  is_active: true,
  image: null,
  image1: null,
  image2: null,
  image3: null,
  image4: null,
};

/* ─── FormField helpers ───────────────────────────────────────────────────── */

const FL = ({ label, required, error, helper, children }) => (
  <FormControl isRequired={required} isInvalid={!!error}>
    <FormLabel fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
      {label}
    </FormLabel>
    {children}
    {error && (
      <Text fontSize="xs" color="red.500" mt={1}>
        {error}
      </Text>
    )}
    {helper && (
      <FormHelperText fontSize="xs" color="gray.400">
        {helper}
      </FormHelperText>
    )}
  </FormControl>
);

const fieldStyle = {
  borderRadius: "xl",
  borderColor: "gray.200",
  _focus: { borderColor: "blue.400", boxShadow: "0 0 0 1px #63B3ED" },
  _hover: { borderColor: "gray.300" },
  bg: "white",
};

/* ─── ImageUploadBox ──────────────────────────────────────────────────────── */

const ImageUploadBox = ({
  label,
  name,
  value,
  existingUrl,
  required,
  onChange,
}) => {
  const previewSrc =
    value instanceof File ? URL.createObjectURL(value) : existingUrl || null;

  return (
    <Box>
      <Text
        fontSize="xs"
        fontWeight="700"
        textTransform="uppercase"
        letterSpacing="0.08em"
        color="gray.400"
        mb={2}
      >
        {label}{" "}
        {required && (
          <Text as="span" color="red.400">
            *
          </Text>
        )}
      </Text>
      <Box
        borderRadius="xl"
        borderWidth="2px"
        borderStyle="dashed"
        borderColor={previewSrc ? "blue.300" : "gray.200"}
        bg={previewSrc ? "blue.50" : "gray.50"}
        p={3}
        transition="all 0.2s"
        _hover={{ borderColor: "blue.300", bg: "blue.50" }}
      >
        {previewSrc ? (
          <VStack spacing={2}>
            <Image
              src={previewSrc}
              alt={label}
              h="100px"
              w="100%"
              objectFit="cover"
              borderRadius="lg"
            />
            <Text fontSize="2xs" color="blue.500" fontWeight="600">
              {value instanceof File ? value.name : "Current image"}
            </Text>
          </VStack>
        ) : (
          <Flex direction="column" align="center" py={4} gap={1}>
            <Text fontSize="xl">🖼️</Text>
            <Text fontSize="xs" color="gray.400">
              No image
            </Text>
          </Flex>
        )}
        <Input
          type="file"
          name={name}
          accept="image/*"
          onChange={onChange}
          mt={2}
          size="sm"
          borderRadius="lg"
          sx={{ "::file-selector-button": { display: "none" } }}
          cursor="pointer"
        />
      </Box>
    </Box>
  );
};

/* ─── DeleteConfirmModal ──────────────────────────────────────────────────── */

const DeleteConfirmModal = ({
  product,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
    <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
    <ModalContent borderRadius="2xl" mx={4}>
      <ModalHeader>
        <HStack spacing={3}>
          <Text fontSize="2xl">🗑️</Text>
          <Text fontSize="lg" fontWeight="700">
            Delete Product
          </Text>
        </HStack>
      </ModalHeader>
      <ModalCloseButton borderRadius="full" />
      <ModalBody pb={2}>
        <Text fontSize="sm" color="gray.600">
          Are you sure you want to delete{" "}
          <Text as="span" fontWeight="700" color="gray.800">
            "{product?.name}"
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

/* ─── ProductViewModal ────────────────────────────────────────────────────── */

const ProductViewModal = ({ product, isOpen, onClose, categories, onEdit }) => {
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (isOpen) setActiveImg(0);
  }, [isOpen, product]);

  if (!product) return null;

  const catName =
    categories.find((c) => String(c.id) === String(product.categories))?.name ||
    String(product.categories || "—");

  const images = IMAGE_KEYS.map((k) => product[k]).filter(Boolean);

  const DetailRow = ({ label, value, badge, badgeScheme }) => (
    <Flex justify="space-between" align="center" py={2}>
      <Text
        fontSize="xs"
        fontWeight="600"
        color="gray.500"
        textTransform="uppercase"
        letterSpacing="0.06em"
      >
        {label}
      </Text>
      {badge ? (
        <Badge
          colorScheme={badgeScheme || "gray"}
          borderRadius="full"
          px={2}
          fontSize="xs"
        >
          {value}
        </Badge>
      ) : (
        <Text
          fontSize="sm"
          fontWeight="500"
          color="gray.800"
          textAlign="right"
          maxW="60%"
        >
          {value || "—"}
        </Text>
      )}
    </Flex>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" mx={4} maxH="90vh">
        <ModalHeader pb={2}>
          <HStack spacing={3}>
            <Text fontSize="2xl">📦</Text>
            <Box>
              <Text fontSize="lg" fontWeight="700" color="gray.800">
                {product.name}
              </Text>
              {product.sku && (
                <Text fontSize="xs" color="gray.400" fontFamily="mono">
                  SKU: {product.sku}
                </Text>
              )}
            </Box>
            <Badge
              colorScheme={product.is_active ? "green" : "red"}
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
              ml="auto"
            >
              {product.is_active ? "✓ Active" : "✕ Inactive"}
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton borderRadius="full" />

        <ModalBody pt={0}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            {/* ── Left: Images ── */}
            <GridItem>
              {images.length > 0 ? (
                <Box>
                  <Image
                    src={images[activeImg]}
                    alt={product.name}
                    w="100%"
                    h="260px"
                    objectFit="cover"
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="gray.200"
                    mb={3}
                  />
                  {images.length > 1 && (
                    <HStack spacing={2} flexWrap="wrap">
                      {images.map((src, i) => (
                        <Image
                          key={i}
                          src={src}
                          alt={`Image ${i + 1}`}
                          boxSize="52px"
                          objectFit="cover"
                          borderRadius="lg"
                          cursor="pointer"
                          borderWidth="2px"
                          borderColor={
                            activeImg === i ? "blue.400" : "gray.200"
                          }
                          onClick={() => setActiveImg(i)}
                          opacity={activeImg === i ? 1 : 0.65}
                          transition="all 0.15s"
                          _hover={{ opacity: 1, borderColor: "blue.300" }}
                        />
                      ))}
                    </HStack>
                  )}
                </Box>
              ) : (
                <Flex
                  h="260px"
                  bg="gray.100"
                  borderRadius="xl"
                  align="center"
                  justify="center"
                  direction="column"
                  gap={2}
                >
                  <Text fontSize="3xl">🖼️</Text>
                  <Text fontSize="sm" color="gray.400">
                    No images uploaded
                  </Text>
                </Flex>
              )}

              {/* Description under image */}
              <Box mt={4} p={4} bg="gray.50" borderRadius="xl">
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                  color="gray.400"
                  mb={2}
                >
                  Description
                </Text>
                <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                  {product.description || "—"}
                </Text>
              </Box>
            </GridItem>

            {/* ── Right: Details ── */}
            <GridItem>
              <VStack align="stretch" spacing={4}>
                {/* Pricing */}
                <Box
                  p={4}
                  bg="green.50"
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor="green.100"
                >
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.1em"
                    color="green.600"
                    mb={3}
                  >
                    Pricing
                  </Text>
                  <HStack spacing={6}>
                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Price
                      </Text>
                      <Text fontSize="xl" fontWeight="700" color="gray.800">
                        {fmtCurrency(product.price)}
                      </Text>
                    </Box>
                    {product.discount_price && (
                      <Box>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Sale Price
                        </Text>
                        <Text fontSize="xl" fontWeight="700" color="green.600">
                          {fmtCurrency(product.discount_price)}
                        </Text>
                      </Box>
                    )}
                  </HStack>
                </Box>

                {/* Basic info */}
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.1em"
                    color="blue.500"
                    mb={2}
                  >
                    Details
                  </Text>
                  <Box
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="gray.100"
                    overflow="hidden"
                    bg="white"
                  >
                    <Box px={4} divideY="1px">
                      <DetailRow label="ID" value={`#${product.id}`} />
                      <DetailRow
                        label="Category"
                        value={catName}
                        badge
                        badgeScheme="purple"
                      />
                      <DetailRow label="Material" value={product.material} />
                      <DetailRow label="Finish" value={product.finish} />
                      <DetailRow
                        label="Quantity"
                        value={product.quantity ?? "—"}
                      />
                      <DetailRow
                        label="Low Stock Threshold"
                        value={product.low_stock_threshold ?? "—"}
                      />
                      <DetailRow
                        label="Stock Status"
                        value={product.is_low_stock ? "Low Stock" : "In Stock"}
                        badge
                        badgeScheme={product.is_low_stock ? "red" : "green"}
                      />
                      <DetailRow
                        label="Orientation"
                        value={product.orientation}
                      />
                      <DetailRow
                        label="Glass Type"
                        value={product.glass_type}
                      />
                      <DetailRow label="Color" value={product.color} />
                      <DetailRow label="Size" value={product.size} />
                      <DetailRow
                        label="Weight"
                        value={product.weight ? `${product.weight} kg` : null}
                      />
                      <DetailRow
                        label="Package (L × W × H )"
                        value={
                          product.package_length_cm ||
                          product.package_width_cm ||
                          product.package_height_cm
                            ? `${product.package_length_cm ?? "—"} × ${product.package_width_cm ?? "—"} × ${product.package_height_cm ?? "—"} cm`
                            : "—"
                        }
                      />
                      <DetailRow
                        label="Package Weight"
                        value={
                          product.package_weight_kg
                            ? `${product.package_weight_kg ?? "—"} kg`
                            : "—"
                        }
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Options */}
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.1em"
                    color="orange.500"
                    mb={2}
                  >
                    Options
                  </Text>
                  <HStack spacing={3}>
                    <Badge
                      colorScheme={product.wall_mountable ? "teal" : "gray"}
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      {product.wall_mountable
                        ? "✓ Wall Mountable"
                        : "✕ Not Wall Mountable"}
                    </Badge>
                    <Badge
                      colorScheme={product.table_top ? "teal" : "gray"}
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      {product.table_top ? "✓ Table Top" : "✕ Not Table Top"}
                    </Badge>
                  </HStack>
                </Box>

                {/* Dates */}
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.1em"
                    color="gray.400"
                    mb={2}
                  >
                    Timestamps
                  </Text>
                  <Box
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="gray.100"
                    overflow="hidden"
                    bg="white"
                  >
                    <Box px={4} divideY="1px">
                      <DetailRow
                        label="Created"
                        value={fmtDate(product.created_at)}
                      />
                      <DetailRow
                        label="Updated"
                        value={fmtDate(product.updated_at)}
                      />
                    </Box>
                  </Box>
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </ModalBody>

        <ModalFooter gap={3} borderTopWidth="1px" borderColor="gray.100">
          <Button
            colorScheme="blue"
            borderRadius="xl"
            leftIcon={<EditIcon />}
            onClick={() => {
              onClose();
              onEdit(product);
            }}
          >
            Edit Product
          </Button>
          <Button variant="ghost" borderRadius="xl" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

/* ─── PostProducts ────────────────────────────────────────────────────────── */

const PostProducts = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { products = [], loading } = useSelector((s) => s.products);
  const { categories = [] } = useSelector((s) => s.productCategories);

  /* ── tabs / form ── */
  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* ── delete ── */
  const [deletingId, setDeletingId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: openDelete,
    onClose: closeDelete,
  } = useDisclosure();

  /* ── view ── */
  const [viewProduct, setViewProduct] = useState(null);
  const {
    isOpen: isViewOpen,
    onOpen: openView,
    onClose: closeView,
  } = useDisclosure();

  /* ── search / filters ── */
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductCategories());
  }, [dispatch]);

  /* ── filtered list ── */
  const filtered = useMemo(() => {
    const src = Array.isArray(products) ? products : [];
    const q = search.toLowerCase().trim();
    return src.filter((p) => {
      const matchCat =
        catFilter === "all" ||
        String(p.categories) === catFilter ||
        (Array.isArray(p.categories) &&
          p.categories.some((c) => String(c) === catFilter));
      const matchActive =
        activeFilter === "all" ||
        (activeFilter === "active" && p.is_active) ||
        (activeFilter === "inactive" && !p.is_active);
      const matchSearch =
        !q ||
        (p.name || "").toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q) ||
        String(p.id).includes(q);
      return matchCat && matchActive && matchSearch;
    });
  }, [products, search, catFilter, activeFilter]);

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

  /* ── form change ── */
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (type === "checkbox" || type === "switch") {
      setForm((p) => ({ ...p, [name]: checked }));
    } else if (files) {
      setForm((p) => ({ ...p, [name]: files[0] }));
    } else {
      setForm((p) => {
        const next = { ...p, [name]: value };
        if (name === "quantity" || name === "low_stock_threshold") {
          const quantity = Number(
            name === "quantity" ? value : (p.quantity ?? 0),
          );
          const threshold = Number(
            name === "low_stock_threshold"
              ? value
              : (p.low_stock_threshold ?? 0),
          );
          next.is_low_stock = threshold > 0 && quantity < threshold;
        }
        return next;
      });
    }

    if (errors[name])
      setErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
  };

  /* ── validation ── */
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.categories) errs.categories = "Category is required";
    if (!form.price) errs.price = "Price is required";
    if (!editing && !form.image) errs.image = "Main image is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── build FormData ── */
  const buildFormData = () => {
    const fd = new FormData();
    const numericKeys = [
      "quantity",
      "low_stock_threshold",
      "package_length_cm",
      "package_width_cm",
      "package_height_cm",
      "package_weight_kg",
    ];

    Object.entries(form).forEach(([key, val]) => {
      if (key === "is_low_stock") return;
      if (val === "" || val === null || val === undefined) return;

      if (numericKeys.includes(key)) {
        fd.append(key, String(Number(val)));
      } else {
        fd.append(key, val);
      }
    });
    return fd;
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const fd = buildFormData();
    try {
      if (editing) {
        await dispatch(
          updateProduct({ id: editing.id, data: Object.fromEntries(fd) }),
        ).unwrap();
        toast({
          title: "Product updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await dispatch(postProduct(fd)).unwrap();
        toast({
          title: "Product added",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      resetForm();
      setTab(0);
      dispatch(fetchProducts());
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

  /* ── edit ── */
  const handleEdit = (p) => {
    setEditing(p);
    setErrors({});
    setForm({
      ...initialForm,
      ...p,
      categories: String(p.categories || ""),
      quantity: p.quantity ?? "",
      low_stock_threshold: p.low_stock_threshold ?? "",
      package_length_cm: p.package_length_cm ?? "",
      package_width_cm: p.package_width_cm ?? "",
      package_height_cm: p.package_height_cm ?? "",
      package_weight_kg: p.package_weight_kg ?? "",
      is_low_stock: Boolean(p.is_low_stock),
      image: p.image || null,
      image1: p.image1 || null,
      image2: p.image2 || null,
      image3: p.image3 || null,
      image4: p.image4 || null,
    });
    setTab(1);
  };

  /* ── reset ── */
  const resetForm = () => {
    setEditing(null);
    setForm(initialForm);
    setErrors({});
  };

  /* ── view ── */
  const handleView = (p) => {
    setViewProduct(p);
    openView();
  };

  /* ── delete single ── */
  const confirmDelete = (p) => {
    setToDelete(p);
    openDelete();
  };
  const executeDelete = async () => {
    if (!toDelete) return;
    setDeletingId(toDelete.id);
    try {
      await dispatch(deleteProduct(toDelete.id)).unwrap();
      dispatch(fetchProducts());
      toast({
        title: "Product deleted",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      clearAll();
      closeDelete();
    } catch (err) {
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
        await dispatch(deleteProduct(id)).unwrap();
      } catch (err) {
        console.log(err);
      }
    }
    dispatch(fetchProducts());
    toast({
      title: `${ids.length} product${ids.length !== 1 ? "s" : ""} deleted`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    clearAll();
  };

  /* ── toolbar ── */
  const toolbar = (
    <Flex gap={2} flexWrap="wrap" align="center">
      <InputGroup size="sm" maxW="200px">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search name, SKU, ID…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          borderRadius="lg"
          bg="white"
        />
      </InputGroup>

      <Select
        size="sm"
        maxW="160px"
        borderRadius="lg"
        bg="white"
        value={catFilter}
        onChange={(e) => {
          setCatFilter(e.target.value);
          setPage(1);
        }}
      >
        <option value="all">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={String(c.id)}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select
        size="sm"
        maxW="130px"
        borderRadius="lg"
        bg="white"
        value={activeFilter}
        onChange={(e) => {
          setActiveFilter(e.target.value);
          setPage(1);
        }}
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </Select>

      <Badge colorScheme="blue" borderRadius="full" px={3} py={1} fontSize="xs">
        {filtered.length} product{filtered.length !== 1 ? "s" : ""}
      </Badge>

      {(search || catFilter !== "all" || activeFilter !== "all") && (
        <Button
          size="sm"
          variant="ghost"
          colorScheme="gray"
          borderRadius="lg"
          onClick={() => {
            setSearch("");
            setCatFilter("all");
            setActiveFilter("all");
            setPage(1);
          }}
        >
          Clear
        </Button>
      )}
    </Flex>
  );

  /* ═══════════════════════════════ Render ═══════════════════════════════ */

  return (
    <AdminPage
      title="Product Management"
      description="Create, edit, and manage your product catalogue."
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
          + Add Product
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
            📦 Products ({products.length})
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
            {editing ? "✏️ Edit Product" : "➕ Add Product"}
          </Tab>
        </TabList>

        <TabPanels>
          {/* ═══════════════ TABLE TAB ═══════════════ */}
          <TabPanel px={0} pb={0}>
            <AdminTableShell title="All Products" toolbar={toolbar}>
              {loading ? (
                <Flex justify="center" py={10}>
                  <Spinner size="xl" />
                </Flex>
              ) : filtered.length === 0 ? (
                <Flex direction="column" align="center" py={16} gap={3}>
                  <Text fontSize="3xl">
                    {search || catFilter !== "all" || activeFilter !== "all"
                      ? "🔍"
                      : "📦"}
                  </Text>
                  <Text fontWeight="600" color="gray.600">
                    {search || catFilter !== "all" || activeFilter !== "all"
                      ? "No products match your filters"
                      : "No products yet"}
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    {search || catFilter !== "all" || activeFilter !== "all"
                      ? "Try adjusting your search or filters."
                      : "Click Add Product to create your first one."}
                  </Text>
                  {(search ||
                    catFilter !== "all" ||
                    activeFilter !== "all") && (
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="blue"
                      borderRadius="lg"
                      onClick={() => {
                        setSearch("");
                        setCatFilter("all");
                        setActiveFilter("all");
                      }}
                    >
                      Clear Filters
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
                          <Th w="36px">
                            <Tooltip label="Select all on page">
                              <Checkbox
                                isChecked={
                                  paginatedData.length > 0 &&
                                  paginatedData.every((p) => selected.has(p.id))
                                }
                                isIndeterminate={
                                  paginatedData.some((p) =>
                                    selected.has(p.id),
                                  ) &&
                                  !paginatedData.every((p) =>
                                    selected.has(p.id),
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
                          <Th>Image</Th>
                          <Th>Name / SKU</Th>
                          <Th>Category</Th>
                          <Th>Price</Th>
                          <Th>Status</Th>
                          <Th>Created</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>

                      <Tbody>
                        {paginatedData.map((p) => {
                          const isSelected = selected.has(p.id);
                          const catName =
                            categories.find(
                              (c) => String(c.id) === String(p.categories),
                            )?.name || String(p.categories || "—");

                          return (
                            <Tr
                              key={p.id}
                              bg={isSelected ? "blue.50" : undefined}
                              _hover={{
                                bg: isSelected ? "blue.50" : "gray.50",
                              }}
                              transition="background 0.15s"
                            >
                              <Td>
                                <Checkbox
                                  isChecked={isSelected}
                                  onChange={() => toggleRow(p.id)}
                                />
                              </Td>

                              <Td>
                                <Text
                                  fontFamily="mono"
                                  fontSize="xs"
                                  color="gray.500"
                                >
                                  #{p.id}
                                </Text>
                              </Td>

                              {/* Image */}
                              <Td>
                                {p.image ? (
                                  <Image
                                    src={p.image}
                                    alt={p.name}
                                    boxSize="44px"
                                    objectFit="cover"
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="gray.200"
                                  />
                                ) : (
                                  <Flex
                                    w="44px"
                                    h="44px"
                                    bg="gray.100"
                                    borderRadius="lg"
                                    align="center"
                                    justify="center"
                                  >
                                    <Text fontSize="xs" color="gray.400">
                                      —
                                    </Text>
                                  </Flex>
                                )}
                              </Td>

                              {/* Name / SKU */}
                              <Td>
                                <VStack align="start" spacing={0}>
                                  <Text
                                    fontWeight="600"
                                    fontSize="sm"
                                    color="gray.800"
                                  >
                                    {p.name}
                                  </Text>
                                  {p.sku && (
                                    <Text
                                      fontSize="xs"
                                      color="gray.400"
                                      fontFamily="mono"
                                    >
                                      {p.sku}
                                    </Text>
                                  )}
                                </VStack>
                              </Td>

                              <Td>
                                <Badge
                                  colorScheme="purple"
                                  fontSize="xs"
                                  borderRadius="full"
                                  px={2}
                                >
                                  {catName}
                                </Badge>
                              </Td>

                              <Td>
                                <VStack align="start" spacing={0}>
                                  <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="gray.800"
                                  >
                                    {fmtCurrency(p.price)}
                                  </Text>
                                  {p.discount_price && (
                                    <Text
                                      fontSize="xs"
                                      color="green.600"
                                      fontWeight="500"
                                    >
                                      {fmtCurrency(p.discount_price)}
                                    </Text>
                                  )}
                                </VStack>
                              </Td>

                              {/* Active */}
                              <Td>
                                <Badge
                                  colorScheme={p.is_active ? "green" : "red"}
                                  fontSize="xs"
                                  borderRadius="full"
                                  px={2}
                                >
                                  {p.is_active ? "✓ Active" : "✕ Inactive"}
                                </Badge>
                              </Td>

                              <Td>
                                <Text fontSize="xs" color="gray.500">
                                  {fmtDate(p.created_at)}
                                </Text>
                              </Td>

                              {/* Actions */}
                              <Td>
                                <HStack spacing={1}>
                                  <Tooltip label="View">
                                    <IconButton
                                      size="sm"
                                      icon={<ViewIcon />}
                                      variant="ghost"
                                      colorScheme="teal"
                                      borderRadius="lg"
                                      aria-label="View product"
                                      onClick={() => handleView(p)}
                                    />
                                  </Tooltip>
                                  <Tooltip label="Edit">
                                    <IconButton
                                      size="sm"
                                      icon={<EditIcon />}
                                      variant="ghost"
                                      colorScheme="blue"
                                      borderRadius="lg"
                                      aria-label="Edit product"
                                      onClick={() => handleEdit(p)}
                                    />
                                  </Tooltip>
                                  <Tooltip label="Delete">
                                    <IconButton
                                      size="sm"
                                      icon={
                                        deletingId === p.id ? (
                                          <Spinner size="xs" />
                                        ) : (
                                          <DeleteIcon />
                                        )
                                      }
                                      variant="ghost"
                                      colorScheme="red"
                                      borderRadius="lg"
                                      aria-label="Delete product"
                                      isDisabled={deletingId === p.id}
                                      onClick={() => confirmDelete(p)}
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
              title={editing ? "Edit Product" : "Add New Product"}
              description={
                editing
                  ? `Updating: "${editing.name}" (ID #${editing.id})`
                  : "Fill in the details below to add a new product to your catalogue."
              }
            >
              <Box as="form" onSubmit={handleSubmit}>
                <Stack spacing={6}>
                  {/* ── Section: Basic Info ── */}
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      color="blue.500"
                      mb={3}
                    >
                      Basic Information
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FL label="Product Name" required error={errors.name}>
                        <Input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="e.g. Wooden Wall Frame"
                          {...fieldStyle}
                        />
                      </FL>

                      <FL label="SKU" helper="Leave blank to auto-generate">
                        <Input
                          name="sku"
                          value={form.sku}
                          onChange={handleChange}
                          placeholder="e.g. FRAME-001"
                          {...fieldStyle}
                        />
                      </FL>

                      <Box gridColumn={{ md: "span 2" }}>
                        <FL
                          label="Description"
                          required
                          error={errors.description}
                        >
                          <Textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the product…"
                            minH="100px"
                            resize="vertical"
                            {...fieldStyle}
                          />
                        </FL>
                      </Box>

                      <FL label="Category" required error={errors.categories}>
                        <Select
                          name="categories"
                          value={form.categories}
                          onChange={handleChange}
                          {...fieldStyle}
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={String(c.id)}>
                              {c.name}
                            </option>
                          ))}
                        </Select>
                      </FL>
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  {/* ── Section: Pricing ── */}
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      color="green.500"
                      mb={3}
                    >
                      Pricing
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FL label="Price (₹)" required error={errors.price}>
                        <Input
                          type="number"
                          name="price"
                          value={form.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          {...fieldStyle}
                        />
                      </FL>

                      <FL
                        label="Discount Price (₹)"
                        helper="Optional sale price"
                      >
                        <Input
                          type="number"
                          name="discount_price"
                          value={form.discount_price}
                          onChange={handleChange}
                          placeholder="0.00"
                          {...fieldStyle}
                        />
                      </FL>
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  {/* ── Section: Stock & Availability ── */}
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      color="red.500"
                      mb={3}
                    >
                      Stock & Availability
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FL label="Quantity">
                        <Input
                          type="number"
                          min="0"
                          name="quantity"
                          value={form.quantity}
                          onChange={handleChange}
                          placeholder="e.g. 20"
                          {...fieldStyle}
                        />
                      </FL>

                      <FL label="Low Stock Threshold">
                        <Input
                          type="number"
                          min="0"
                          name="low_stock_threshold"
                          value={form.low_stock_threshold}
                          onChange={handleChange}
                          placeholder="e.g. 5"
                          {...fieldStyle}
                        />
                      </FL>
                    </SimpleGrid>

                    <Box
                      mt={4}
                      p={4}
                      bg={form.is_low_stock ? "red.50" : "green.50"}
                      borderRadius="xl"
                      borderWidth="1px"
                      borderColor={form.is_low_stock ? "red.100" : "green.100"}
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        color={form.is_low_stock ? "red.600" : "green.600"}
                      >
                        {form.is_low_stock
                          ? "Low stock alert will be shown"
                          : "Stock level is healthy"}
                      </Text>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        This status updates automatically when quantity falls
                        below the threshold.
                      </Text>
                    </Box>
                  </Box>

                  <Divider />

                  {/* ── Section: Physical Specs ── */}
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      color="purple.500"
                      mb={3}
                    >
                      Physical Specifications
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                      <FL label="Material">
                        <Select
                          name="material"
                          value={form.material}
                          onChange={handleChange}
                          {...fieldStyle}
                        >
                          <option value="">— None —</option>
                          {MATERIALS.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </Select>
                      </FL>

                      <FL label="Finish">
                        <Select
                          name="finish"
                          value={form.finish}
                          onChange={handleChange}
                          {...fieldStyle}
                        >
                          <option value="">— None —</option>
                          {FINISHES.map((f) => (
                            <option key={f.value} value={f.value}>
                              {f.label}
                            </option>
                          ))}
                        </Select>
                      </FL>

                      <FL label="Orientation">
                        <Select
                          name="orientation"
                          value={form.orientation}
                          onChange={handleChange}
                          {...fieldStyle}
                        >
                          <option value="">— None —</option>
                          {ORIENTATIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </Select>
                      </FL>

                      <FL label="Glass Type">
                        <Select
                          name="glass_type"
                          value={form.glass_type}
                          onChange={handleChange}
                          {...fieldStyle}
                        >
                          <option value="">— None —</option>
                          {GLASS_TYPES.map((g) => (
                            <option key={g.value} value={g.value}>
                              {g.label}
                            </option>
                          ))}
                        </Select>
                      </FL>

                      <FL label="Color">
                        <Input
                          name="color"
                          value={form.color}
                          onChange={handleChange}
                          placeholder="e.g. Walnut Brown"
                          {...fieldStyle}
                        />
                      </FL>

                      <FL label="Size">
                        <Input
                          name="size"
                          value={form.size}
                          onChange={handleChange}
                          placeholder="e.g. 24×36 cm"
                          {...fieldStyle}
                        />
                      </FL>

                      <FL label="Weight (kg)">
                        <Input
                          type="number"
                          name="weight"
                          value={form.weight}
                          onChange={handleChange}
                          placeholder="0.0"
                          {...fieldStyle}
                        />
                      </FL>

                      <FL label="Package Length (cm)">
                        <Input
                          type="number"
                          step="0.01"
                          name="package_length_cm"
                          value={form.package_length_cm}
                          onChange={handleChange}
                          placeholder="13"
                          {...fieldStyle}
                        />
                      </FL>

                      <FL label="Package Width (cm)">
                        <Input
                          type="number"
                          step="0.01"
                          name="package_width_cm"
                          value={form.package_width_cm}
                          onChange={handleChange}
                          placeholder="18"
                          {...fieldStyle}
                        />
                      </FL>

                      <FL label="Package Height (cm)">
                        <Input
                          type="number"
                          step="0.01"
                          name="package_height_cm"
                          value={form.package_height_cm}
                          onChange={handleChange}
                          placeholder="5"
                          {...fieldStyle}
                        />
                      </FL>

                      <FL label="Package Weight (kg)">
                        <Input
                          type="number"
                          step="0.01"
                          name="package_weight_kg"
                          value={form.package_weight_kg}
                          onChange={handleChange}
                          placeholder="0.3"
                          {...fieldStyle}
                        />
                      </FL>
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  {/* ── Section: Options & Status ── */}
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      color="orange.500"
                      mb={3}
                    >
                      Options & Status
                    </Text>
                    <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
                      {[
                        {
                          name: "wall_mountable",
                          label: "Wall Mountable",
                          desc: "Can be hung on walls",
                        },
                        {
                          name: "table_top",
                          label: "Table Top",
                          desc: "Suitable for surfaces",
                        },
                        {
                          name: "is_active",
                          label: "Active / Visible",
                          desc: "Show in storefront",
                        },
                      ].map((opt) => (
                        <Flex
                          key={opt.name}
                          align="center"
                          justify="space-between"
                          p={4}
                          bg="gray.50"
                          borderRadius="xl"
                          borderWidth="1px"
                          borderColor="gray.100"
                        >
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="600"
                              color="gray.700"
                            >
                              {opt.label}
                            </Text>
                            <Text fontSize="xs" color="gray.400">
                              {opt.desc}
                            </Text>
                          </Box>
                          <Switch
                            name={opt.name}
                            isChecked={form[opt.name]}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                [opt.name]: e.target.checked,
                              }))
                            }
                            colorScheme="blue"
                          />
                        </Flex>
                      ))}
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  {/* ── Section: Images ── */}
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      color="teal.500"
                      mb={3}
                    >
                      Product Images
                    </Text>
                    {errors.image && (
                      <Text fontSize="xs" color="red.500" mb={2}>
                        {errors.image}
                      </Text>
                    )}
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
                      {IMAGE_KEYS.map((key) => (
                        <ImageUploadBox
                          key={key}
                          label={
                            key === "image"
                              ? "Main Image"
                              : `Image ${key.replace("image", "")}`
                          }
                          name={key}
                          value={form[key] instanceof File ? form[key] : null}
                          existingUrl={
                            !(form[key] instanceof File)
                              ? editing?.[key] || null
                              : null
                          }
                          required={key === "image" && !editing}
                          onChange={handleChange}
                        />
                      ))}
                    </SimpleGrid>
                  </Box>

                  {/* Editing info banner */}
                  {editing && (
                    <Box
                      p={4}
                      bg="orange.50"
                      borderRadius="xl"
                      borderWidth="1px"
                      borderColor="orange.100"
                    >
                      <Text fontSize="xs" color="orange.600" fontWeight="600">
                        ✏️ Editing "{editing.name}" (ID #{editing.id}) — leave
                        image fields empty to keep existing images.
                      </Text>
                    </Box>
                  )}

                  {/* Submit buttons */}
                  <HStack spacing={3}>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      borderRadius="xl"
                      isLoading={submitting}
                      loadingText={editing ? "Updating…" : "Creating…"}
                    >
                      {editing ? "Update Product" : "Create Product"}
                    </Button>
                    <Button
                      variant="ghost"
                      borderRadius="xl"
                      isDisabled={submitting}
                      onClick={() => {
                        resetForm();
                        setTab(0);
                      }}
                    >
                      Cancel
                    </Button>
                  </HStack>
                </Stack>
              </Box>
            </AdminFormShell>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <DeleteConfirmModal
        product={toDelete}
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={executeDelete}
        isDeleting={!!deletingId}
      />

      <ProductViewModal
        product={viewProduct}
        isOpen={isViewOpen}
        onClose={closeView}
        categories={categories}
        onEdit={handleEdit}
      />
    </AdminPage>
  );
};

export default PostProducts;
