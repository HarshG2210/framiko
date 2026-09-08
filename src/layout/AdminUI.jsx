// src/components/admin/layout/AdminUI.jsx

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi";
import React, { useMemo, useState } from "react";

import { NavLink } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";

const useAdminColors = () => {
  const bgBody = "#F8FAFC";
  const sidebarBg = "#111827";
  const sidebarBorder = "rgba(255, 255, 255, 0.08)";
  const contentBg = "#F8FAFC";
  const cardBg = "#FFFFFF";
  const cardBorder = "rgba(15, 23, 42, 0.08)";
  const mutedText = "#6B7280";
  const solidText = "#111827";
  const accent = "#EAB308";
  const accentDark = "#B45309";
  const accentBlue = "#2563EB";
  const accentSoft = "rgba(234, 179, 8, 0.12)";
  const hoverSoft = "rgba(15, 23, 42, 0.04)";
  const pillBg = "rgba(234, 179, 8, 0.12)";

  return {
    bgBody,
    sidebarBg,
    sidebarBorder,
    contentBg,
    cardBg,
    cardBorder,
    mutedText,
    solidText,
    accent,
    accentDark,
    accentBlue,
    accentSoft,
    hoverSoft,
    pillBg,
  };
};

export const AdminShell = ({
  navLinks,
  onLogout,
  children,
  title = "Admin",
}) => {
  const {
    bgBody,
    sidebarBg,
    sidebarBorder,
    contentBg,
    mutedText,
    solidText,
    accent,
    accentBlue,
    accentSoft,
    hoverSoft,
  } = useAdminColors();

  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const SIDEBAR_WIDTH = sidebarCollapsed ? "72px" : "260px";

  return (
    <Flex minH="100vh" bg={bgBody} color={solidText} overflow="hidden">
      {/* ================= BACKGROUND EFFECTS ================= */}
      <Box
        position="fixed"
        inset={0}
        pointerEvents="none"
        bgGradient="radial(circle at top left, rgba(234,179,8,0.08), transparent 45%)"
        opacity={0.9}
      />
      <Box
        position="fixed"
        inset={0}
        pointerEvents="none"
        bgImage={`
          linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)
        `}
        backgroundSize="32px 32px"
      />

      {/* ================= SIDEBAR (FIXED) ================= */}
      <Box
        as="aside"
        position="fixed"
        top={0}
        left={0}
        h="100vh"
        w={{ base: "72px", md: SIDEBAR_WIDTH }}
        bg={sidebarBg}
        borderRight="1px solid"
        borderColor={sidebarBorder}
        boxShadow="0 0 40px rgba(15, 23, 42, 0.18)"
        transition="width 0.2s ease-out"
        zIndex={20}
      >
        <Flex
          direction="column"
          h="100%"
          py={4}
          px={sidebarCollapsed ? 3 : 4}
          gap={4}
        >
          {/* Brand */}
          <Flex align="center" justify="space-between">
            <HStack spacing={2}>
              <Box
                boxSize="36px"
                borderRadius="2xl"
                bg="accent.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 10px 20px rgba(234, 179, 8, 0.18)"
              >
                <Text fontWeight="black" color="neutral.900">
                  F
                </Text>
              </Box>

              {!sidebarCollapsed && (
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    letterSpacing="0.18em"
                    textTransform="uppercase"
                    color={mutedText}
                  >
                    Framiko
                  </Text>
                  <Text fontSize="xs" color={mutedText}>
                    Admin Console
                  </Text>
                </Box>
              )}
            </HStack>

            <IconButton
              aria-label="Toggle sidebar"
              icon={sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
              size="sm"
              variant="ghost"
              color={mutedText}
              _hover={{ bg: hoverSoft }}
              onClick={() => setSidebarCollapsed((p) => !p)}
            />
          </Flex>

          <Divider borderColor={sidebarBorder} />

          {/* NAV (Scrollable but scrollbar hidden) */}
          <VStack
            align="stretch"
            spacing={1}
            flex={1}
            overflowY="auto"
            pr={1} // small padding so content never clips
            css={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE / Edge
              "&::-webkit-scrollbar": {
                display: "none", // Chrome / Safari
              },
            }}
          >
            {navLinks.map(({ path, label, icon: IconCmp }) => (
              <NavLink key={path} to={`/owner-account/${path}`} end>
                {({ isActive }) => (
                  <Flex
                    align="center"
                    py={2}
                    px={sidebarCollapsed ? 2 : 3}
                    borderRadius="lg"
                    cursor="pointer"
                    position="relative"
                    bg={isActive ? "rgba(56,107,255,0.12)" : "transparent"}
                    _hover={{ bg: hoverSoft }}
                  >
                    {isActive && (
                      <Box
                        position="absolute"
                        left={0}
                        top="12%"
                        bottom="12%"
                        width="2px"
                        bg={accent}
                        borderRadius="full"
                      />
                    )}

                    <Box
                      as={IconCmp}
                      fontSize="lg"
                      mr={sidebarCollapsed ? 0 : 3}
                      color={isActive ? accentBlue : "#9CA3AF"}
                    />

                    {!sidebarCollapsed && (
                      <Text
                        fontSize="sm"
                        fontWeight={isActive ? "semibold" : "normal"}
                        color={isActive ? accentBlue : "#E5E7EB"}
                      >
                        {label}
                      </Text>
                    )}
                  </Flex>
                )}
              </NavLink>
            ))}
          </VStack>

          {!sidebarCollapsed && (
            <Text fontSize="xs" color={mutedText}>
              © {new Date().getFullYear()} Framiko
            </Text>
          )}
        </Flex>
      </Box>

      {/* ================= MAIN CONTENT ================= */}
      <Flex
        as="main"
        direction="column"
        flex="1"
        ml={{ base: "72px", md: SIDEBAR_WIDTH }}
        transition="margin-left 0.2s ease-out"
        bg={contentBg}
        position="relative"
        zIndex={10}
      >
        {/* TOP BAR */}
        <Flex
          as="header"
          px={6}
          py={3}
          align="center"
          justify="space-between"
          borderBottom="1px solid rgba(15,23,42,0.08)"
          bg="white"
          position="sticky"
          top={0}
          zIndex={30}
          boxShadow="0 10px 30px rgba(15,23,42,0.06)"
        >
          <Box>
            <Text
              fontSize="xs"
              letterSpacing="0.25em"
              color="gray.500"
              textTransform="uppercase"
            >
              {title}
            </Text>
            <Text fontSize="lg" fontWeight="semibold" color={solidText}>
              Owner Panel
            </Text>
          </Box>

          <HStack spacing={4}>
            <Avatar size="sm" name="Admin" bg="accent.100" color={solidText} />
            <Tooltip label="Logout">
              <IconButton
                aria-label="Logout"
                icon={<FiLogOut />}
                variant="outline"
                size="sm"
                borderColor={accent}
                color={solidText}
                _hover={{ bg: accentSoft, color: solidText }}
                onClick={onLogout}
              />
            </Tooltip>
          </HStack>
        </Flex>

        {/* PAGE CONTENT (ONLY THIS SCROLLS) */}
        <Box
          flex="1"
          px={{ base: 4, md: 8 }}
          py={6}
          overflowY="auto"
          minH="calc(100vh - 84px)"
        >
          <Breadcrumbs />
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export const AdminPage = ({ title, description, actions, children }) => {
  const { cardBg, cardBorder, mutedText, solidText } = useAdminColors();

  return (
    <Box>
      <Flex mb={6} align="center" justify="space-between" gap={4}>
        <Box>
          <Heading
            size="md"
            letterSpacing="0.18em"
            textTransform="uppercase"
            fontWeight="medium"
            color={solidText}
          >
            {title}
          </Heading>
          {description && (
            <Text fontSize="sm" mt={1} color={mutedText}>
              {description}
            </Text>
          )}
        </Box>
        {actions && <Box>{actions}</Box>}
      </Flex>
      <Box
        bg={cardBg}
        borderRadius="2xl"
        border="1px solid"
        borderColor={cardBorder}
        boxShadow="0 18px 40px rgba(15,23,42,0.08)"
        p={{ base: 4, md: 6 }}
      >
        {children}
      </Box>
    </Box>
  );
};

export const AdminTableShell = ({ title, toolbar, children }) => {
  const { cardBg, cardBorder, solidText } = useAdminColors();
  return (
    <Box
      bg={cardBg}
      borderRadius="xl"
      border="1px solid"
      borderColor={cardBorder}
      p={4}
    >
      <Flex mb={4} align="center" justify="space-between" gap={4}>
        {title && (
          <Text
            fontSize="sm"
            fontWeight="semibold"
            textTransform="uppercase"
            color={solidText}
          >
            {title}
          </Text>
        )}
        {toolbar && <Box>{toolbar}</Box>}
      </Flex>
      <Box
        borderRadius="lg"
        border="1px solid"
        borderColor="rgba(15,23,42,0.08)"
        overflow="hidden"
        bg="neutral.50"
      >
        {children}
      </Box>
    </Box>
  );
};

export const AdminFormShell = ({ title, description, children, footer }) => {
  const { cardBg, cardBorder, mutedText } = useAdminColors();
  return (
    <Box
      bg={cardBg}
      borderRadius="xl"
      border="1px solid"
      borderColor={cardBorder}
      p={4}
    >
      {(title || description) && (
        <Box mb={4}>
          {title && (
            <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase">
              {title}
            </Text>
          )}
          {description && (
            <Text fontSize="xs" color={mutedText} mt={1}>
              {description}
            </Text>
          )}
        </Box>
      )}
      {children}
      {footer && <Box mt={4}>{footer}</Box>}
    </Box>
  );
};

export const useAdminTable = (data = [], rowsPerPage = 5) => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const toggleRow = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAllCurrentPage = () => {
    const ids = paginatedData.map((r) => r.id);
    setSelected((prev) => new Set([...prev, ...ids]));
  };

  const clearAll = () => setSelected(new Set());

  const selectAll = () => {
    setSelected(new Set(data.map((r) => r.id)));
  };

  return {
    page,
    setPage,
    totalPages,
    paginatedData,
    selected,
    toggleRow,
    selectAll,
    selectAllCurrentPage,
    clearAll,
  };
};

export const AdminTableWithPagination = ({
  children,
  table,
  selectedCount,
  onDeleteSelected,
  page,
  setPage,
  totalPages,
}) => {
  return (
    <Box>
      {/* TOP ACTION BAR */}
      <Flex justify="space-between" mb={3} align="center">
        <Flex gap={2}>
          <Button
            size="sm"
            variant="solid"
            colorScheme="accent"
            onClick={table.selectAllCurrentPage}
          >
            Select Page
          </Button>
          <Button
            size="sm"
            variant="solid"
            colorScheme="accent"
            onClick={table.selectAll}
          >
            Select All
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            leftIcon={<DeleteIcon />}
            isDisabled={selectedCount === 0}
            onClick={onDeleteSelected}
          >
            Delete Selected ({selectedCount})
          </Button>
        </Flex>

        <Text fontSize="sm">
          Page {page} of {totalPages}
        </Text>
      </Flex>

      {/* TABLE */}
      {children}

      {/* PAGINATION */}
      <Flex justify="center" mt={4} gap={2}>
        <IconButton
          icon={<ArrowLeftIcon />}
          onClick={() => setPage(1)}
          isDisabled={page === 1}
        />
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          isDisabled={page === 1}
        />
        <IconButton
          icon={<ChevronRightIcon />}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          isDisabled={page === totalPages}
        />
        <IconButton
          icon={<ArrowRightIcon />}
          onClick={() => setPage(totalPages)}
          isDisabled={page === totalPages}
        />
      </Flex>
    </Box>
  );
};

export const AdminTableInventoryWithPagination = ({
  children,
  page,
  setPage,
  totalPages,
}) => {
  return (
    <Box>
      {/* TABLE */}
      {children}

      {/* PAGINATION */}
      <Flex justify="center" mt={4} gap={2}>
        <IconButton
          icon={<ArrowLeftIcon />}
          onClick={() => setPage(1)}
          isDisabled={page === 1}
        />
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          isDisabled={page === 1}
        />
        <IconButton
          icon={<ChevronRightIcon />}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          isDisabled={page === totalPages}
        />
        <IconButton
          icon={<ArrowRightIcon />}
          onClick={() => setPage(totalPages)}
          isDisabled={page === totalPages}
        />
      </Flex>
    </Box>
  );
};

export const AdminSection = ({ title, description, actions, children }) => {
  const { mutedText } = useAdminColors();

  return (
    <Box mb={8}>
      {(title || description || actions) && (
        <Flex mb={4} justify="space-between" align="center" gap={4}>
          <Box>
            {title && (
              <Text
                fontSize="sm"
                fontWeight="semibold"
                textTransform="uppercase"
                letterSpacing="0.18em"
              >
                {title}
              </Text>
            )}
            {description && (
              <Text fontSize="sm" color={mutedText} mt={1}>
                {description}
              </Text>
            )}
          </Box>
          {actions && <Box>{actions}</Box>}
        </Flex>
      )}

      {children}
    </Box>
  );
};

export const AdminCard = ({
  title,
  value,
  subtitle,
  icon,
  footer,
  children,
  accent = false,
}) => {
  const { cardBg, cardBorder, mutedText, accentSoft, hoverSoft } =
    useAdminColors();

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="2xl"
      p={5}
      position="relative"
      overflow="hidden"
      transition="all 0.2s ease"
      _hover={{ bg: hoverSoft }}
    >
      {/* Accent Glow */}
      {accent && (
        <Box
          position="absolute"
          inset={0}
          bgGradient="radial(circle at top left, rgba(255,255,255,0.18), transparent 60%)"
          pointerEvents="none"
        />
      )}

      <Flex justify="space-between" align="flex-start" mb={3}>
        <Box>
          {title && (
            <Text fontSize="xs" color={mutedText} textTransform="uppercase">
              {title}
            </Text>
          )}
          {value && (
            <Text fontSize="2xl" fontWeight="bold" mt={1}>
              {value}
            </Text>
          )}
          {subtitle && (
            <Text fontSize="sm" color={mutedText} mt={1}>
              {subtitle}
            </Text>
          )}
        </Box>

        {icon && (
          <Box
            boxSize="40px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="lg"
            bg={accentSoft}
          >
            {icon}
          </Box>
        )}
      </Flex>

      {children && <Box mt={3}>{children}</Box>}

      {footer && (
        <>
          <Divider my={3} borderColor="rgba(255,255,255,0.08)" />
          <Box>{footer}</Box>
        </>
      )}
    </Box>
  );
};
