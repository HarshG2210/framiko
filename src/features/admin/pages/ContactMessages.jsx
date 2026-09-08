import {
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
  Grid,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import { SearchIcon } from "@chakra-ui/icons";
import { fetchAdminContactMessages } from "../../../redux/slices/admin/adminContactSlice";

/* ─── static maps ─────────────────────────────────────────────────────────── */

const SUBJECT_LABELS = {
  product_enquiry: "Product Enquiry",
  bulk_order: "Bulk Order",
  custom_gifting: "Custom Gifting",
  shipping_query: "Shipping Query",
  authentication: "Authentication",
  partnership: "Partnership",
  other: "Other",
};

const SUBJECT_COLORS = {
  product_enquiry: "blue",
  bulk_order: "teal",
  custom_gifting: "purple",
  shipping_query: "orange",
  authentication: "cyan",
  partnership: "green",
  other: "gray",
};

const SUBJECT_ICONS = {
  product_enquiry: "🖼️",
  bulk_order: "📦",
  custom_gifting: "🎁",
  shipping_query: "🚚",
  authentication: "🔐",
  partnership: "🤝",
  other: "💬",
};

// Full ISO country list (same as Contact.jsx)
const COUNTRIES = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AS: "American Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua and Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Belgium",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia and Herzegovina",
  BW: "Botswana",
  BR: "Brazil",
  IO: "British Indian Ocean Territory",
  BN: "Brunei Darussalam",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Cambodia",
  CM: "Cameroon",
  CA: "Canada",
  CV: "Cape Verde",
  KY: "Cayman Islands",
  CF: "Central African Republic",
  TD: "Chad",
  CL: "Chile",
  CN: "China",
  CX: "Christmas Island",
  CC: "Cocos (Keeling) Islands",
  CO: "Colombia",
  KM: "Comoros",
  CG: "Congo",
  CD: "Congo, the Democratic Republic of the",
  CK: "Cook Islands",
  CR: "Costa Rica",
  CI: "Cote d'Ivoire",
  HR: "Croatia",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DK: "Denmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominican Republic",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  GQ: "Equatorial Guinea",
  ER: "Eritrea",
  EE: "Estonia",
  ET: "Ethiopia",
  FK: "Falkland Islands (Malvinas)",
  FO: "Faroe Islands",
  FJ: "Fiji",
  FI: "Finland",
  FR: "France",
  GF: "French Guiana",
  PF: "French Polynesia",
  TF: "French Southern Territories",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Germany",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Greece",
  GL: "Greenland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heard Island and McDonald Islands",
  VA: "Holy See (Vatican City State)",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran, Islamic Republic of",
  IQ: "Iraq",
  IE: "Ireland",
  IL: "Israel",
  IT: "Italy",
  JM: "Jamaica",
  JP: "Japan",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "Korea, Democratic People's Republic of",
  KR: "Korea, Republic of",
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Lao People's Democratic Republic",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libyan Arab Jamahiriya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MO: "Macao",
  MK: "Macedonia, the Former Yugoslav Republic of",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshall Islands",
  MQ: "Martinique",
  MR: "Mauritania",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mexico",
  FM: "Micronesia, Federated States of",
  MD: "Moldova, Republic of",
  MC: "Monaco",
  MN: "Mongolia",
  MS: "Montserrat",
  MA: "Morocco",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Netherlands",
  AN: "Netherlands Antilles",
  NC: "New Caledonia",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Norfolk Island",
  MP: "Northern Mariana Islands",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestinian Territory, Occupied",
  PA: "Panama",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines",
  PN: "Pitcairn",
  PL: "Poland",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Qatar",
  RE: "Reunion",
  RO: "Romania",
  RU: "Russian Federation",
  RW: "Rwanda",
  SH: "Saint Helena",
  KN: "Saint Kitts and Nevis",
  LC: "Saint Lucia",
  PM: "Saint Pierre and Miquelon",
  VC: "Saint Vincent and the Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome and Principe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Solomon Islands",
  SO: "Somalia",
  ZA: "South Africa",
  GS: "South Georgia and the South Sandwich Islands",
  ES: "Spain",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SJ: "Svalbard and Jan Mayen",
  SZ: "Swaziland",
  SE: "Sweden",
  CH: "Switzerland",
  SY: "Syrian Arab Republic",
  TW: "Taiwan, Province of China",
  TJ: "Tajikistan",
  TZ: "Tanzania, United Republic of",
  TH: "Thailand",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad and Tobago",
  TN: "Tunisia",
  TR: "Turkey",
  TM: "Turkmenistan",
  TC: "Turks and Caicos Islands",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "United Arab Emirates",
  GB: "United Kingdom",
  US: "United States",
  UM: "United States Minor Outlying Islands",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Viet Nam",
  VG: "Virgin Islands, British",
  VI: "Virgin Islands, U.S.",
  WF: "Wallis and Futuna",
  EH: "Western Sahara",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
};

const getCountryName = (code) => COUNTRIES[code] || code || "—";

const fmtDate = (val) =>
  val
    ? new Date(val).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const fmtDateTime = (val) =>
  val
    ? new Date(val).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

/* ─── MessageDetailModal ──────────────────────────────────────────────────── */

const MessageDetailModal = ({ message, isOpen, onClose }) => {
  if (!message) return null;

  const subjectKey = message.subject;
  const subjectLabel = SUBJECT_LABELS[subjectKey] || message.subject || "—";
  const subjectColor = SUBJECT_COLORS[subjectKey] || "gray";
  const subjectIcon = SUBJECT_ICONS[subjectKey] || "💬";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" overflow="hidden" mx={4}>
        <ModalCloseButton
          zIndex={10}
          top={4}
          right={4}
          borderRadius="full"
          color="white"
        />

        {/* Gradient header */}
        <Box
          bgGradient="linear(135deg, blue.600, blue.400)"
          px={6}
          pt={6}
          pb={8}
        >
          <Badge
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="700"
            mb={3}
            display="inline-flex"
            alignItems="center"
            gap={1}
            bg={`${subjectColor}.100`}
            color={`${subjectColor}.700`}
          >
            {subjectIcon} {subjectLabel}
          </Badge>
          <Heading size="md" color="white" mb={1}>
            Message from {message.name || "—"}
          </Heading>
          <Text color="blue.100" fontSize="sm">
            {message.email || "—"} · {fmtDateTime(message.created_at)}
          </Text>
        </Box>

        <ModalBody px={6} py={6}>
          <VStack align="stretch" spacing={5}>
            {/* Info grid */}
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {[
                { icon: "👤", label: "Full Name", value: message.name },
                { icon: "📧", label: "Email Address", value: message.email },
                {
                  icon: "🌍",
                  label: "Country",
                  value: `${getCountryName(message.country)} (${message.country || "—"})`,
                },
                {
                  icon: "🏷️",
                  label: "Subject",
                  value: subjectLabel,
                  badge: true,
                  color: subjectColor,
                },
              ].map((field) => (
                <Box
                  key={field.label}
                  p={4}
                  bg="gray.50"
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor="gray.100"
                >
                  <HStack spacing={2} mb={1}>
                    <Text fontSize="sm">{field.icon}</Text>
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.08em"
                      color="gray.400"
                    >
                      {field.label}
                    </Text>
                  </HStack>
                  {field.badge ? (
                    <Badge
                      colorScheme={field.color}
                      fontSize="xs"
                      borderRadius="full"
                      px={2}
                      py={0.5}
                    >
                      {subjectIcon} {field.value}
                    </Badge>
                  ) : (
                    <Text fontSize="sm" fontWeight="600" color="gray.800">
                      {field.value || "—"}
                    </Text>
                  )}
                </Box>
              ))}
            </Grid>

            {/* Message body */}
            <Box>
              <HStack spacing={2} mb={3}>
                <Text fontSize="sm">💬</Text>
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                  color="gray.400"
                >
                  Message
                </Text>
              </HStack>
              <Box
                p={5}
                bg="blue.50"
                borderRadius="xl"
                borderWidth="1px"
                borderColor="blue.100"
                borderLeftWidth="4px"
                borderLeftColor="blue.400"
              >
                <Text
                  fontSize="sm"
                  color="gray.700"
                  lineHeight="1.8"
                  whiteSpace="pre-wrap"
                >
                  {message.message || message.content || "—"}
                </Text>
              </Box>
            </Box>

            <Divider />

            {/* Footer meta */}
            <Flex
              justify="space-between"
              align="center"
              flexWrap="wrap"
              gap={2}
            >
              <HStack spacing={1.5}>
                <Text fontSize="xs" color="gray.400">
                  🕐
                </Text>
                <Text fontSize="xs" color="gray.500" fontWeight="500">
                  Received {fmtDateTime(message.created_at)}
                </Text>
              </HStack>
              <Badge
                colorScheme="gray"
                fontSize="xs"
                fontFamily="mono"
                borderRadius="full"
                px={2}
              >
                ID #{message.id}
              </Badge>
            </Flex>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

/* ─── ContactMessages ─────────────────────────────────────────────────────── */

const ContactMessages = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { messages, loading } = useSelector(
    (state) => state.admin.contact || {},
  );

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    dispatch(fetchAdminContactMessages());
  }, [dispatch]);

  // ── filtering ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const src = Array.isArray(messages) ? messages : [];
    const q = search.toLowerCase().trim();
    return src.filter((m) => {
      const matchSubject =
        subjectFilter === "all" || m.subject === subjectFilter;
      const matchSearch =
        !q ||
        (m.name || "").toLowerCase().includes(q) ||
        (m.email || "").toLowerCase().includes(q) ||
        (m.message || m.content || "").toLowerCase().includes(q) ||
        String(m.id).includes(q);
      return matchSubject && matchSearch;
    });
  }, [messages, search, subjectFilter]);

  // ── pagination via AdminUI hook ────────────────────────────────────────────
  const table = useAdminTable(filtered, 5);
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

  // ── actions ────────────────────────────────────────────────────────────────
  const handleView = (message) => {
    setSelectedMessage(message);
    onOpen();
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setSelectedMessage(null), 300);
  };

  const handleDeleteSelected = () => {
    // Wire to your delete thunk here; for now show a toast placeholder
    toast({
      title: `${selected.size} message${selected.size !== 1 ? "s" : ""} deleted`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    clearAll();
  };

  // ── toolbar ────────────────────────────────────────────────────────────────
  const toolbar = (
    <Flex gap={2} flexWrap="wrap" align="center">
      {/* Search */}
      <InputGroup size="sm" maxW="220px">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search name, email…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          borderRadius="lg"
          bg="white"
        />
      </InputGroup>

      {/* Subject filter */}
      <Select
        size="sm"
        maxW="180px"
        borderRadius="lg"
        bg="white"
        value={subjectFilter}
        onChange={(e) => {
          setSubjectFilter(e.target.value);
          setPage(1);
        }}
      >
        <option value="all">All Subjects</option>
        {Object.entries(SUBJECT_LABELS).map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </Select>

      {/* Result count pill */}
      <Badge colorScheme="blue" borderRadius="full" px={3} py={1} fontSize="xs">
        {filtered.length} message{filtered.length !== 1 ? "s" : ""}
      </Badge>

      {/* Clear filters */}
      {(search || subjectFilter !== "all") && (
        <Button
          size="sm"
          variant="ghost"
          colorScheme="gray"
          borderRadius="lg"
          onClick={() => {
            setSearch("");
            setSubjectFilter("all");
            setPage(1);
          }}
        >
          Clear
        </Button>
      )}
    </Flex>
  );

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <AdminPage
      title="Contact Messages"
      description="Review and manage messages submitted through the contact form."
    >
      <AdminTableShell title="Contact Us Inbox" toolbar={toolbar}>
        {loading ? (
          <Flex justify="center" py={10}>
            <Spinner size="xl" />
          </Flex>
        ) : filtered.length ? (
          <AdminTableWithPagination
            table={table}
            selectedCount={selected.size}
            onDeleteSelected={handleDeleteSelected}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          >
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    {/* Select-all checkbox */}
                    <Th w="36px">
                      <Tooltip label="Select all on page">
                        <Checkbox
                          isChecked={
                            paginatedData.length > 0 &&
                            paginatedData.every((m) => selected.has(m.id))
                          }
                          isIndeterminate={
                            paginatedData.some((m) => selected.has(m.id)) &&
                            !paginatedData.every((m) => selected.has(m.id))
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
                    <Th>Email</Th>
                    <Th>Country</Th>
                    <Th>Subject</Th>
                    <Th>Message</Th>
                    <Th>Date</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {paginatedData.map((message) => {
                    const subjectKey = message.subject;
                    const isSelected = selected.has(message.id);
                    return (
                      <Tr
                        key={message.id || message.email}
                        bg={isSelected ? "blue.50" : undefined}
                        _hover={{ bg: isSelected ? "blue.50" : "gray.50" }}
                        transition="background 0.15s"
                      >
                        {/* Checkbox */}
                        <Td>
                          <Checkbox
                            isChecked={isSelected}
                            onChange={() => toggleRow(message.id)}
                          />
                        </Td>

                        {/* ID */}
                        <Td>
                          <Text
                            fontFamily="mono"
                            fontSize="xs"
                            color="gray.500"
                          >
                            #{message.id || "—"}
                          </Text>
                        </Td>

                        {/* Name */}
                        <Td>
                          <Text fontWeight="600" fontSize="sm">
                            {message.name || "—"}
                          </Text>
                        </Td>

                        {/* Email */}
                        <Td>
                          <Text fontSize="sm" color="blue.600">
                            {message.email || "—"}
                          </Text>
                        </Td>

                        {/* Country */}
                        <Td>
                          <HStack spacing={1}>
                            <Text fontSize="xs">🌍</Text>
                            <Text fontSize="sm">
                              {getCountryName(message.country)}
                            </Text>
                            <Text
                              fontSize="xs"
                              color="gray.400"
                              fontFamily="mono"
                            >
                              ({message.country || "—"})
                            </Text>
                          </HStack>
                        </Td>

                        {/* Subject */}
                        <Td>
                          <Badge
                            colorScheme={SUBJECT_COLORS[subjectKey] || "gray"}
                            borderRadius="full"
                            px={2}
                            py={0.5}
                            fontSize="xs"
                          >
                            {SUBJECT_ICONS[subjectKey] || "💬"}{" "}
                            {SUBJECT_LABELS[subjectKey] ||
                              message.subject ||
                              "—"}
                          </Badge>
                        </Td>

                        {/* Message preview */}
                        <Td maxW="260px">
                          <Text noOfLines={2} fontSize="sm" color="gray.600">
                            {message.message || message.content || "—"}
                          </Text>
                        </Td>

                        {/* Date */}
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text
                              fontSize="xs"
                              fontWeight="600"
                              color="gray.700"
                            >
                              {fmtDate(message.created_at)}
                            </Text>
                            <Text fontSize="xs" color="gray.400">
                              {new Date(message.created_at).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </Text>
                          </VStack>
                        </Td>

                        {/* Action */}
                        <Td>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            variant="outline"
                            borderRadius="lg"
                            fontWeight="600"
                            onClick={() => handleView(message)}
                            _hover={{ bg: "blue.50" }}
                          >
                            View
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </AdminTableWithPagination>
        ) : (
          <Flex direction="column" align="center" py={16} gap={3}>
            <Text fontSize="3xl">
              {search || subjectFilter !== "all" ? "🔍" : "📭"}
            </Text>
            <Text fontWeight="600" color="gray.600">
              {search || subjectFilter !== "all"
                ? "No messages match your filters"
                : "No messages yet"}
            </Text>
            <Text fontSize="sm" color="gray.400">
              {search || subjectFilter !== "all"
                ? "Try adjusting your search or filter."
                : "Messages submitted via the contact form will appear here."}
            </Text>
            {(search || subjectFilter !== "all") && (
              <Button
                size="sm"
                variant="outline"
                colorScheme="blue"
                borderRadius="lg"
                onClick={() => {
                  setSearch("");
                  setSubjectFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </Flex>
        )}
      </AdminTableShell>

      {/* Detail modal */}
      <MessageDetailModal
        message={selectedMessage}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </AdminPage>
  );
};

export default ContactMessages;
