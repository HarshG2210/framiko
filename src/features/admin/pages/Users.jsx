import {
  AdminPage,
  AdminTableShell,
  AdminTableWithPagination,
  useAdminTable,
} from "../../../layout/AdminUI";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
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
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import { FiEye } from "react-icons/fi";
import { normalizeMediaUrl } from "../../../utils/constant";
import { SearchIcon } from "@chakra-ui/icons";
import { fetchUserDetails } from "../../../redux/slices/userDetailsSlice";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const fmtDate = (val) =>
  val
    ? new Date(val).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const fmtTime = (val) =>
  val
    ? new Date(val).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const fmtDateTime = (val) => (val ? `${fmtDate(val)} at ${fmtTime(val)}` : "—");

const resolveAvatar = (path) => normalizeMediaUrl(path);

const roleColor = (role) =>
  ({
    admin: "red",
    staff: "orange",
    user: "blue",
    owner: "purple",
  })[role?.toLowerCase()] ?? "gray";

/* ─── StatusBadge ─────────────────────────────────────────────────────────── */

const StatusBadge = ({ yes, labelYes, labelNo }) => (
  <Badge
    colorScheme={yes ? "green" : "red"}
    fontSize="2xs"
    borderRadius="full"
    px={2}
    py={0.5}
    variant="subtle"
  >
    {yes ? `✓ ${labelYes}` : `✕ ${labelNo}`}
  </Badge>
);

/* ─── Detail Row (used inside drawer) ────────────────────────────────────── */

const DetailRow = ({ label, value }) => (
  <GridItem>
    <Text
      fontSize="xs"
      color="gray.400"
      fontWeight="600"
      mb={0.5}
      textTransform="uppercase"
      letterSpacing="0.06em"
    >
      {label}
    </Text>
    <Text fontSize="sm" color="gray.800" fontWeight="500">
      {value || "—"}
    </Text>
  </GridItem>
);

/* ─── UserDrawer ──────────────────────────────────────────────────────────── */

const UserDrawer = ({ item, isOpen, onClose }) => {
  if (!item) return null;
  const u = item.user || {};
  const avatarSrc = resolveAvatar(item.profile_picture);
  const fullName =
    [u.first_name, u.last_name].filter(Boolean).join(" ") || "No Name";

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="md">
      <DrawerOverlay backdropFilter="blur(2px)" />
      <DrawerContent borderLeftRadius="2xl" overflow="hidden">
        <DrawerCloseButton mt={2} />

        {/* ── Header band ── */}
        <Box bg="#1A1A1A" px={6} pt={8} pb={6}>
          <HStack spacing={4} align="center">
            <Avatar
              size="lg"
              name={fullName}
              src={avatarSrc || undefined}
              bg="#C9AB7E"
              color="white"
              border="3px solid rgba(255,255,255,0.2)"
            />
            <Box>
              <Text
                color="white"
                fontWeight="700"
                fontSize="lg"
                lineHeight="1.2"
              >
                {fullName}
              </Text>
              <Text color="whiteAlpha.600" fontSize="xs" mt={0.5}>
                @{u.username || "—"}
              </Text>
              <HStack mt={2} spacing={2}>
                <Badge
                  colorScheme={roleColor(item.role)}
                  borderRadius="full"
                  px={2}
                  fontSize="xs"
                  textTransform="capitalize"
                >
                  {item.role || "—"}
                </Badge>
                <Badge
                  colorScheme={item.is_verified ? "green" : "red"}
                  borderRadius="full"
                  px={2}
                  fontSize="xs"
                  variant="subtle"
                >
                  {item.is_verified ? "✓ Verified" : "✕ Unverified"}
                </Badge>
              </HStack>
            </Box>
          </HStack>
        </Box>

        <DrawerHeader
          px={6}
          pt={5}
          pb={0}
          fontSize="sm"
          color="gray.500"
          fontWeight="600"
          letterSpacing="0.08em"
          textTransform="uppercase"
        >
          User Profile
        </DrawerHeader>

        <DrawerBody px={6} py={4}>
          <VStack spacing={5} align="stretch">
            {/* ── Account Info ── */}
            <Box bg="gray.50" borderRadius="xl" p={5}>
              <Text
                fontSize="xs"
                fontWeight="700"
                color="gray.400"
                textTransform="uppercase"
                letterSpacing="0.08em"
                mb={4}
              >
                Account Info
              </Text>
              <Grid templateColumns="1fr 1fr" gap={4}>
                <DetailRow label="User ID" value={`#${u.id}`} />
                <DetailRow label="Role" value={item.role} />
                <DetailRow label="Email" value={u.email} />
                <DetailRow label="Phone" value={item.phone_number} />
                <DetailRow label="Username" value={`@${u.username}`} />
                <DetailRow label="First Name" value={u.first_name} />
                <DetailRow label="Last Name" value={u.last_name} />
              </Grid>
            </Box>

            {/* ── Verification Status ── */}
            <Box bg="gray.50" borderRadius="xl" p={5}>
              <Text
                fontSize="xs"
                fontWeight="700"
                color="gray.400"
                textTransform="uppercase"
                letterSpacing="0.08em"
                mb={4}
              >
                Verification Status
              </Text>
              <Grid templateColumns="1fr 1fr" gap={4}>
                <GridItem>
                  <Text
                    fontSize="xs"
                    color="gray.400"
                    fontWeight="600"
                    mb={1}
                    textTransform="uppercase"
                    letterSpacing="0.06em"
                  >
                    Account Verified
                  </Text>
                  <StatusBadge
                    yes={item.is_verified}
                    labelYes="Verified"
                    labelNo="Not Verified"
                  />
                </GridItem>
                <GridItem>
                  <Text
                    fontSize="xs"
                    color="gray.400"
                    fontWeight="600"
                    mb={1}
                    textTransform="uppercase"
                    letterSpacing="0.06em"
                  >
                    OTP Verified
                  </Text>
                  <StatusBadge
                    yes={item.is_otp_verified}
                    labelYes="OTP Done"
                    labelNo="OTP Pending"
                  />
                </GridItem>
                <GridItem>
                  <Text
                    fontSize="xs"
                    color="gray.400"
                    fontWeight="600"
                    mb={1}
                    textTransform="uppercase"
                    letterSpacing="0.06em"
                  >
                    Profile Status
                  </Text>
                  <StatusBadge
                    yes={item.profile_completed}
                    labelYes="Complete"
                    labelNo="Incomplete"
                  />
                </GridItem>
                <GridItem>
                  <Text
                    fontSize="xs"
                    color="gray.400"
                    fontWeight="600"
                    mb={1}
                    textTransform="uppercase"
                    letterSpacing="0.06em"
                  >
                    OTP Resends
                  </Text>
                  <Text fontSize="sm" fontWeight="600" color="gray.700">
                    {item.resend_count ?? 0}
                  </Text>
                </GridItem>
              </Grid>
            </Box>

            {/* ── Timestamps ── */}
            <Box bg="gray.50" borderRadius="xl" p={5}>
              <Text
                fontSize="xs"
                fontWeight="700"
                color="gray.400"
                textTransform="uppercase"
                letterSpacing="0.08em"
                mb={4}
              >
                Timestamps
              </Text>
              <Grid templateColumns="1fr 1fr" gap={4}>
                <DetailRow
                  label="Joined"
                  value={fmtDateTime(item.created_at)}
                />
                <DetailRow
                  label="Last Updated"
                  value={fmtDateTime(item.updated_at)}
                />
              </Grid>
            </Box>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

/* ─── UserDetails ─────────────────────────────────────────────────────────── */

const UserDetails = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const {
    userDetails = [],
    loading,
    error,
  } = useSelector((state) => state.userDetails || {});

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  // const roles = useMemo(() => {
  //   const set = new Set(
  //     (Array.isArray(userDetails) ? userDetails : [])
  //       .map((i) => i.role)
  //       .filter(Boolean),
  //   );
  //   return [...set];
  // }, [userDetails]);

  const filtered = useMemo(() => {
    const src = Array.isArray(userDetails) ? userDetails : [];
    const q = search.toLowerCase().trim();
    return src.filter((item) => {
      const u = item.user || {};
      const matchRole = roleFilter === "all" || item.role === roleFilter;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "verified" && item.is_verified) ||
        (statusFilter === "unverified" && !item.is_verified) ||
        (statusFilter === "complete" && item.profile_completed) ||
        (statusFilter === "incomplete" && !item.profile_completed);
      const matchSearch =
        !q ||
        (u.first_name || "").toLowerCase().includes(q) ||
        (u.last_name || "").toLowerCase().includes(q) ||
        (u.username || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (item.phone_number || "").toLowerCase().includes(q) ||
        String(u.id || "").includes(q);
      return matchRole && matchStatus && matchSearch;
    });
  }, [userDetails, search, roleFilter, statusFilter]);

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

  const handleDeleteSelected = () => {
    toast({
      title: `${selected.size} user${selected.size !== 1 ? "s" : ""} deleted`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    clearAll();
  };

  const handleView = (item) => {
    setSelectedUser(item);
    onOpen();
  };

  const toolbar = (
    <Flex gap={2} flexWrap="wrap" align="center">
      <InputGroup size="sm" maxW="220px">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search name, email, ID…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          borderRadius="lg"
          bg="white"
        />
      </InputGroup>

      {/* <Select
        size="sm"
        maxW="140px"
        borderRadius="lg"
        bg="white"
        value={roleFilter}
        onChange={(e) => {
          setRoleFilter(e.target.value);
          setPage(1);
        }}
      >
        <option value="all">All Roles</option>
        {roles.map((r) => (
          <option key={r} value={r}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </option>
        ))}
      </Select> */}

      <Select
        size="sm"
        maxW="160px"
        borderRadius="lg"
        bg="white"
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
        }}
      >
        <option value="all">All Statuses</option>
        <option value="verified">Verified</option>
        <option value="unverified">Unverified</option>
        <option value="complete">Profile Complete</option>
        <option value="incomplete">Profile Incomplete</option>
      </Select>

      <Badge colorScheme="blue" borderRadius="full" px={3} py={1} fontSize="xs">
        {filtered.length} user{filtered.length !== 1 ? "s" : ""}
      </Badge>

      {(search || roleFilter !== "all" || statusFilter !== "all") && (
        <Button
          size="sm"
          variant="ghost"
          colorScheme="gray"
          borderRadius="lg"
          onClick={() => {
            setSearch("");
            setRoleFilter("all");
            setStatusFilter("all");
            setPage(1);
          }}
        >
          Clear
        </Button>
      )}
    </Flex>
  );

  return (
    <AdminPage
      title="User Details"
      description="Review and manage all registered users in the system."
    >
      <AdminTableShell title="Users List" toolbar={toolbar}>
        {loading ? (
          <Flex justify="center" py={10}>
            <Spinner size="xl" />
          </Flex>
        ) : error ? (
          <Flex direction="column" align="center" py={12} gap={3}>
            <Text fontSize="3xl">⚠️</Text>
            <Text color="red.500" fontWeight="600">
              {error}
            </Text>
          </Flex>
        ) : filtered.length === 0 ? (
          <Flex direction="column" align="center" py={16} gap={3}>
            <Text fontSize="3xl">
              {search || roleFilter !== "all" || statusFilter !== "all"
                ? "🔍"
                : "👤"}
            </Text>
            <Text fontWeight="600" color="gray.600">
              {search || roleFilter !== "all" || statusFilter !== "all"
                ? "No users match your filters"
                : "No users found"}
            </Text>
            <Text fontSize="sm" color="gray.400">
              {search || roleFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filters."
                : "Registered users will appear here."}
            </Text>
            {(search || roleFilter !== "all" || statusFilter !== "all") && (
              <Button
                size="sm"
                variant="outline"
                colorScheme="blue"
                borderRadius="lg"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("all");
                  setStatusFilter("all");
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
                            paginatedData.every((item) =>
                              selected.has(item.user?.id),
                            )
                          }
                          isIndeterminate={
                            paginatedData.some((item) =>
                              selected.has(item.user?.id),
                            ) &&
                            !paginatedData.every((item) =>
                              selected.has(item.user?.id),
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
                    <Th>User</Th>
                    <Th>Contact</Th>
                    <Th>Role</Th>
                    <Th>Status</Th>
                    <Th>Joined</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {paginatedData.map((item) => {
                    const u = item.user || {};
                    const isSelected = selected.has(u.id);
                    const avatarSrc = resolveAvatar(item.profile_picture);

                    return (
                      <Tr
                        key={u.id}
                        bg={isSelected ? "blue.50" : undefined}
                        _hover={{ bg: isSelected ? "blue.50" : "gray.50" }}
                        transition="background 0.15s"
                      >
                        {/* Checkbox */}
                        <Td>
                          <Checkbox
                            isChecked={isSelected}
                            onChange={() => toggleRow(u.id)}
                          />
                        </Td>

                        {/* ID */}
                        <Td>
                          <Text
                            fontFamily="mono"
                            fontSize="xs"
                            color="gray.500"
                          >
                            #{u.id ?? "—"}
                          </Text>
                        </Td>

                        {/* User */}
                        <Td>
                          <HStack spacing={3}>
                            <Avatar
                              size="sm"
                              name={`${u.first_name || ""} ${u.last_name || ""}`}
                              src={avatarSrc || undefined}
                              bg="blue.100"
                              color="blue.700"
                            />
                            <VStack align="start" spacing={0}>
                              <Text
                                fontWeight="600"
                                fontSize="sm"
                                color="gray.800"
                              >
                                {[u.first_name, u.last_name]
                                  .filter(Boolean)
                                  .join(" ") || "—"}
                              </Text>
                              <Text fontSize="xs" color="gray.400">
                                @{u.username || "—"}
                              </Text>
                            </VStack>
                          </HStack>
                        </Td>

                        {/* Contact */}
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm" color="blue.600">
                              {u.email || "—"}
                            </Text>
                            <Text fontSize="xs" color="gray.400">
                              {item.phone_number || "—"}
                            </Text>
                          </VStack>
                        </Td>

                        {/* Role */}
                        <Td>
                          <Badge
                            colorScheme={roleColor(item.role)}
                            borderRadius="full"
                            px={2}
                            py={0.5}
                            fontSize="xs"
                            textTransform="capitalize"
                          >
                            {item.role || "—"}
                          </Badge>
                        </Td>

                        {/* Status — condensed: just verified + profile */}
                        <Td>
                          <VStack align="start" spacing={1}>
                            <StatusBadge
                              yes={item.is_verified}
                              labelYes="Verified"
                              labelNo="Unverified"
                            />
                            <StatusBadge
                              yes={item.profile_completed}
                              labelYes="Complete"
                              labelNo="Incomplete"
                            />
                          </VStack>
                        </Td>

                        {/* Joined */}
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text
                              fontSize="xs"
                              fontWeight="600"
                              color="gray.700"
                            >
                              {fmtDate(item.created_at)}
                            </Text>
                            <Text fontSize="xs" color="gray.400">
                              {fmtTime(item.created_at)}
                            </Text>
                          </VStack>
                        </Td>

                        {/* Action */}
                        <Td>
                          <Button
                            size="xs"
                            leftIcon={<FiEye />}
                            bg="#1A1A1A"
                            color="white"
                            borderRadius="full"
                            px={3}
                            fontWeight="600"
                            fontSize="xs"
                            _hover={{ bg: "#333", transform: "scale(1.04)" }}
                            transition="all 0.2s ease"
                            onClick={() => handleView(item)}
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
        )}
      </AdminTableShell>

      {/* User Detail Drawer */}
      <UserDrawer item={selectedUser} isOpen={isOpen} onClose={onClose} />
    </AdminPage>
  );
};

export default UserDetails;
