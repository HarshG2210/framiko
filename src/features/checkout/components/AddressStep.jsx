import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiGlobe,
  FiHome,
  FiMail,
  FiMap,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiTrash2,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import {
  createShippingAddress,
  fetchShippingAddresses,
  setDefaultShippingAddress,
  updateShippingAddress,
} from "../../../redux/slices/shippingAddressSlice";
import {
  nextStep,
  setSelectedAddress,
  setSelectedBillingAddress,
} from "../../../redux/slices/checkoutSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

const initialForm = {
  full_name: "",
  phone: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
  landmark: "",
  label: "home",
  is_default: true,
};

/* ─── Address Card Component ────────────────────────────────────────────── */
const AddressCard = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onSetDefault,
  isDefault,
  badgeLabel,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  console.log(isHovered);

  return (
    <Box
      p={5}
      borderWidth="2px"
      borderColor={
        isSelected ? "gold.500" : isDefault ? "green.400" : "gray.200"
      }
      borderRadius="xl"
      bg={isSelected ? "gold.50" : "white"}
      cursor="pointer"
      onClick={() => onSelect(address)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      position="relative"
      overflow="hidden"
    >
      {/* Default Badge */}
      {isDefault && (
        <Box position="absolute" top={0} right={0}>
          <Box
            bg="green.500"
            color="white"
            px={3}
            py={1}
            fontSize="xs"
            fontWeight="700"
            borderBottomLeftRadius="xl"
          >
            <Icon as={FiCheckCircle} mr={1} />
            Default
          </Box>
        </Box>
      )}

      {/* Address Type Icon */}
      <Flex align="center" gap={3} mb={2}>
        <Icon
          as={isDefault ? AiFillHome : AiOutlineHome}
          color={isDefault ? "green.500" : "gray.400"}
          fontSize="20px"
        />
        <Text fontWeight="700" fontSize="md" color="gray.800" fontFamily="body">
          {address.full_name}
        </Text>
        {badgeLabel && (
          <Badge
            colorScheme="purple"
            ml={2}
            fontSize="0.7rem"
            px={2}
            py={1}
            borderRadius="full"
          >
            {badgeLabel}
          </Badge>
        )}
      </Flex>

      <Divider my={2} />

      <VStack align="stretch" spacing={1.5}>
        <Flex align="center" gap={2}>
          <Icon as={FiUser} fontSize="12px" color="gray.400" />
          <Text fontSize="sm" color="gray.600" fontFamily="body">
            {address.full_name}
          </Text>
        </Flex>
        <Flex align="center" gap={2}>
          <Icon as={FiPhone} fontSize="12px" color="gray.400" />
          <Text fontSize="sm" color="gray.600" fontFamily="body">
            {address.phone}
          </Text>
        </Flex>
        <Flex align="center" gap={2}>
          <Icon as={FiMapPin} fontSize="12px" color="gray.400" />
          <Text fontSize="sm" color="gray.600" fontFamily="body">
            {address.address_line_1}
            {address.address_line_2 && `, ${address.address_line_2}`}
          </Text>
        </Flex>
        <Flex align="center" gap={2}>
          <Icon as={FiMap} fontSize="12px" color="gray.400" />
          <Text fontSize="sm" color="gray.600" fontFamily="body">
            {address.city}, {address.state}
          </Text>
        </Flex>
        <Flex align="center" gap={2}>
          <Icon as={FiGlobe} fontSize="12px" color="gray.400" />
          <Text fontSize="sm" color="gray.600" fontFamily="body">
            {address.country} - {address.postal_code}
          </Text>
        </Flex>
        {address.landmark && (
          <Flex align="center" gap={2}>
            <Icon as={FiMapPin} fontSize="12px" color="gray.400" />
            <Text fontSize="sm" color="gray.500" fontFamily="body">
              Landmark: {address.landmark}
            </Text>
          </Flex>
        )}
      </VStack>

      <Divider my={3} />

      <Flex gap={2} justify="space-between" align="center">
        <HStack spacing={2}>
          {isSelected && (
            <Tag bg="gold.500" color="white" size="sm" borderRadius="full">
              <TagLeftIcon as={FiCheckCircle} />
              <TagLabel>Selected</TagLabel>
            </Tag>
          )}
          {address.phone && (
            <Tag size="sm" bg="gray.100" color="gray.600" borderRadius="full">
              <TagLeftIcon as={FiTruck} />
              <TagLabel>Deliverable</TagLabel>
            </Tag>
          )}
        </HStack>

        <HStack spacing={1}>
          <IconButton
            icon={<FiEdit2 />}
            size="sm"
            variant="ghost"
            aria-label="Edit address"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
            color="gray.500"
            _hover={{ color: "gold.500", bg: "gold.50" }}
          />
          {!isDefault && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onSetDefault(address.id);
              }}
              color="gray.500"
              _hover={{ color: "gold.500", bg: "gold.50" }}
            >
              Set Default
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Selection Indicator */}
      {isSelected && (
        <Box
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          w="4px"
          bg="gold.500"
          borderTopLeftRadius="xl"
          borderBottomLeftRadius="xl"
        />
      )}
    </Box>
  );
};

/* ─── Address Form Component ────────────────────────────────────────────── */
const AddressForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  editingId,
  isLoading,
  errors,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 15);
    }

    if (name === "postal_code") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      p={6}
      boxShadow="sm"
    >
      <Flex justify="space-between" align="center" mb={5}>
        <Heading size="md" color="gray.800" fontFamily="body">
          {editingId ? "Edit Address" : "Add New Address"}
        </Heading>
        {editingId && (
          <Button variant="ghost" size="sm" onClick={onCancel} fontFamily="body">
            Cancel
          </Button>
        )}
      </Flex>

      <VStack spacing={4}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600">
              <Icon as={FiUser} mr={1} /> Full Name
            </FormLabel>
            <Input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              size="lg"
              borderRadius="lg"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600">
              <Icon as={FiPhone} mr={1} /> Phone Number
            </FormLabel>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              size="lg"
              borderRadius="lg"
            />
            {errors.phone && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.phone}
              </Text>
            )}
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel fontSize="sm" fontWeight="600">
            <Icon as={FiMapPin} mr={1} /> Flat/House No. and Floor
          </FormLabel>
          <Input
            name="address_line_1"
            value={formData.address_line_1}
            onChange={handleChange}
            placeholder="e.g., 123, Building A, 3rd Floor"
            size="lg"
            borderRadius="lg"
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" fontWeight="600">
            <Icon as={FiMapPin} mr={1} /> Street Name and Locality
          </FormLabel>
          <Input
            name="address_line_2"
            value={formData.address_line_2}
            onChange={handleChange}
            placeholder="e.g., MG Road, Indiranagar"
            size="lg"
            borderRadius="lg"
          />
        </FormControl>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600">
              <Icon as={FiMap} mr={1} /> Landmark
            </FormLabel>
            <Input
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="Near metro station"
              size="lg"
              borderRadius="lg"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600">
              <Icon as={FiMap} mr={1} /> City
            </FormLabel>
            <Input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              size="lg"
              borderRadius="lg"
            />
          </FormControl>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600">
              State
            </FormLabel>
            <Input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              size="lg"
              borderRadius="lg"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600">
              Country
            </FormLabel>
            <Input
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              size="lg"
              borderRadius="lg"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600">
              Postal Code
            </FormLabel>
            <Input
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              placeholder="PIN code"
              size="lg"
              borderRadius="lg"
            />
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel fontSize="sm" fontWeight="600">
            Address Type
          </FormLabel>
          <SimpleGrid columns={3} spacing={2} w="full">
            {[
              { value: "home", label: "Home" },
              { value: "office", label: "Office" },
              { value: "other", label: "Other" },
            ].map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={formData.label === option.value ? "solid" : "outline"}
                colorScheme={formData.label === option.value ? "gold" : "gray"}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    label: option.value,
                  }))
                }
              >
                {option.label}
              </Button>
            ))}
          </SimpleGrid>
        </FormControl>

        <Checkbox
          isChecked={formData.is_default}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              is_default: e.target.checked,
            }))
          }
          colorScheme="gold"
          size="lg"
          mt={2}
        >
          Set as default address
        </Checkbox>

        <Button
          w="full"
          size="lg"
          variant="solid"
          fontFamily="body"
          onClick={onSubmit}
          isLoading={isLoading}
          loadingText={editingId ? "Updating..." : "Adding..."}
          leftIcon={editingId ? <FiEdit2 /> : <FiPlus />}
          mt={2}
        >
          {editingId ? "Update Address" : "Add Address"}
        </Button>
      </VStack>
    </Box>
  );
};

/* ─── Main AddressStep Component ────────────────────────────────────────── */
const AddressStep = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { addresses, loading } = useSelector((state) => state.shippingAddress);
  const { selectedAddress, selectedBillingAddress } = useSelector(
    (state) => state.checkout,
  );
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [useSeparateBilling, setUseSeparateBilling] = useState(false);
  const [showForm, setShowForm] = useState(false);
  console.log(showForm);

  useEffect(() => {
    dispatch(fetchShippingAddresses());
  }, [dispatch]);

  const sortedAddresses = useMemo(() => {
    return [...(addresses || [])].sort(
      (a, b) => Number(b.is_default) - Number(a.is_default),
    );
  }, [addresses]);

  useEffect(() => {
    const defaultAddress = sortedAddresses.find(
      (address) => address.is_default,
    );

    if (defaultAddress && selectedAddress?.id !== defaultAddress.id) {
      dispatch(setSelectedAddress(defaultAddress));
    }
    if (defaultAddress && !selectedBillingAddress) {
      dispatch(setSelectedBillingAddress(defaultAddress));
    }
  }, [sortedAddresses, selectedAddress, selectedBillingAddress, dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (formData.phone.length < 10 || formData.phone.length > 15) {
      newErrors.phone = "Phone number must be between 10 and 15 digits";
    }

    if (!formData.address_line_1.trim()) {
      newErrors.address_line_1 = "Flat/House No. is required";
    }

    if (!formData.address_line_2.trim()) {
      newErrors.address_line_2 = "Street name is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!formData.postal_code.trim()) {
      newErrors.postal_code = "Postal Code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingId) {
        await dispatch(
          updateShippingAddress({
            id: editingId,
            payload: formData,
          }),
        ).unwrap();
        toast({
          title: "Address updated!",
          description: "Your address has been updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        await dispatch(createShippingAddress(formData)).unwrap();
        toast({
          title: "Address added!",
          description: "Your new address has been saved.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }

      await dispatch(fetchShippingAddresses()).unwrap();
      setEditingId(null);
      setFormData(initialForm);
      setErrors({});
      setShowForm(false);
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        title: "Failed to save address",
        description: "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleEdit = (address) => {
    setEditingId(address.id);
    setFormData({
      full_name: address.full_name || "",
      phone: address.phone || "",
      address_line_1: address.address_line_1 || "",
      address_line_2: address.address_line_2 || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "",
      postal_code: address.postal_code || "",
      landmark: address.landmark || "",
      label: address.label || "home",
      is_default: address.is_default || false,
    });
    setShowForm(true);
    onOpen();
  };

  const handleSetDefault = async (id) => {
    try {
      await dispatch(setDefaultShippingAddress(id)).unwrap();
      const updatedAddresses = await dispatch(
        fetchShippingAddresses(),
      ).unwrap();
      const defaultAddress = updatedAddresses.find(
        (address) => address.is_default,
      );
      if (defaultAddress) {
        dispatch(setSelectedAddress(defaultAddress));
      }
      toast({
        title: "Default address updated",
        description: "Your default address has been changed.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error setting default address:", error);
      toast({
        title: "Failed to update default address",
        description: "Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleSelectAddress = (address) => {
    dispatch(setSelectedAddress(address));
    if (!selectedBillingAddress || !useSeparateBilling) {
      dispatch(setSelectedBillingAddress(address));
    }
  };

  const handleSelectBillingAddress = (address) => {
    dispatch(setSelectedBillingAddress(address));
  };

  const handleContinue = () => {
    if (!selectedAddress) {
      toast({
        title: "Please select an address",
        description: "Choose a delivery address to continue.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    if (useSeparateBilling && !selectedBillingAddress) {
      toast({
        title: "Please select a billing address",
        description:
          "Choose a separate billing address or use the shipping address.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    dispatch(nextStep());
  };

  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        flexWrap="wrap"
        gap={4}
      >
        <Box>
          <Heading size="lg" color="gray.800">
            <Icon as={FiMapPin} mr={3} color="gold.500" />
            Delivery Address
          </Heading>
          <Text color="gray.500" mt={1}>
            Select or add a delivery address for your order. You can also use a
            separate billing address on the next step.
          </Text>
        </Box>
        <Button
          leftIcon={<FiPlus />}
          size="lg"
          variant="solid"
          fontFamily="body"
          onClick={() => {
            setEditingId(null);
            setFormData(initialForm);
            setErrors({});
            setShowForm(true);
            onOpen();
          }}
        >
          Add New Address
        </Button>
      </Flex>

      {/* ─── Address List ─────────────────────────────────────────────────── */}
      {loading ? (
        <Flex justify="center" py={12}>
          <Spinner size="xl" color="gold.500" thickness="3px" />
        </Flex>
      ) : sortedAddresses.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={8}>
          {sortedAddresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isSelected={selectedAddress?.id === address.id}
              badgeLabel={address.label?.toUpperCase()}
              isDefault={address.is_default}
              onSelect={handleSelectAddress}
              onEdit={handleEdit}
              onSetDefault={handleSetDefault}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Box
          p={10}
          textAlign="center"
          bg="white"
          borderRadius="xl"
          border="2px dashed"
          borderColor="gray.200"
          mb={8}
        >
          <Icon as={FiMapPin} fontSize="48px" color="gray.300" mb={3} />
          <Text fontSize="lg" fontWeight="600" color="gray.600">
            No addresses added yet
          </Text>
          <Text color="gray.400" mt={1}>
            Add your first delivery address to continue
          </Text>
          <Button
            mt={4}
            leftIcon={<FiPlus />}
            variant="solid"
            fontFamily="body"
            onClick={() => {
              setEditingId(null);
              setFormData(initialForm);
              setErrors({});
              setShowForm(true);
              onOpen();
            }}
          >
            Add Address
          </Button>
        </Box>
      )}

      {/* ─── Continue Button ──────────────────────────────────────────────── */}
      <Box
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        p={6}
        mb={8}
      >
        <Box mb={6}>
          <Text fontWeight="700" mb={2} fontFamily="body">
            Billing Address
          </Text>
          <RadioGroup
            value={useSeparateBilling ? "separate" : "same"}
            onChange={(value) => {
              const separate = value === "separate";
              setUseSeparateBilling(separate);
              if (!separate && selectedAddress) {
                dispatch(setSelectedBillingAddress(selectedAddress));
              }
            }}
          >
            <Stack direction={{ base: "column", md: "row" }} spacing={3}>
              <Box
                as="label"
                display="block"
                w="full"
                border="1px solid"
                borderColor={!useSeparateBilling ? "gold.400" : "gray.200"}
                bg={!useSeparateBilling ? "gold.50" : "white"}
                borderRadius="xl"
                p={4}
                transition="all 0.2s ease"
                _hover={{ borderColor: "gold.400", boxShadow: "sm" }}
              >
                <Radio
                  value="same"
                  colorScheme="gold"
                  size="lg"
                  display="flex"
                  alignItems="flex-start"
                >
                  <Box ml={2}>
                    <Text fontWeight="700" color="gray.800" fontFamily="body">
                      Use shipping address as billing address
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt={1} fontFamily="body">
                      Same address for delivery and billing.
                    </Text>
                  </Box>
                </Radio>
              </Box>

              <Box
                as="label"
                display="block"
                w="full"
                border="1px solid"
                borderColor={useSeparateBilling ? "gold.400" : "gray.200"}
                bg={useSeparateBilling ? "gold.50" : "white"}
                borderRadius="xl"
                p={4}
                transition="all 0.2s ease"
                _hover={{ borderColor: "gold.400", boxShadow: "sm" }}
              >
                <Radio
                  value="separate"
                  colorScheme="gold"
                  size="lg"
                  display="flex"
                  alignItems="flex-start"
                >
                  <Box ml={2}>
                    <Text fontWeight="700" color="gray.800" fontFamily="body">
                      Use a different billing address
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt={1} fontFamily="body">
                      Choose another saved address for billing.
                    </Text>
                  </Box>
                </Radio>
              </Box>
            </Stack>
          </RadioGroup>
          {useSeparateBilling && (
            <Box mt={4}>
              <Text fontSize="sm" color="gray.600" mb={3} fontFamily="body">
                Select a saved address to use as billing.
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {sortedAddresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    isSelected={selectedBillingAddress?.id === address.id}
                    badgeLabel={address.label?.toUpperCase()}
                    isDefault={address.is_default}
                    onSelect={handleSelectBillingAddress}
                    onEdit={handleEdit}
                    onSetDefault={handleSetDefault}
                  />
                ))}
              </SimpleGrid>
            </Box>
          )}
        </Box>
      </Box>
      <Box
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        p={6}
        position="sticky"
        bottom={0}
        zIndex={10}
        boxShadow="lg"
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          gap={4}
        >
          <Box>
            <Text fontSize="sm" color="gray.500" fontFamily="body">
              {selectedAddress
                ? "✓ Address selected"
                : "Please select a delivery address"}
            </Text>
            {selectedAddress && (
              <Text fontSize="sm" fontWeight="600" color="gray.700" fontFamily="body">
                {selectedAddress.full_name} • {selectedAddress.city},{" "}
                {selectedAddress.state}
              </Text>
            )}
          </Box>
          <Button
            size="lg"
            variant="solid"
            fontFamily="body"
            rightIcon={<FiTruck />}
            onClick={handleContinue}
            isDisabled={!selectedAddress}
            px={8}
          >
            Continue to Review Order
          </Button>
        </Flex>
      </Box>

      {/* ─── Address Form Modal ───────────────────────────────────────────── */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        closeOnOverlayClick={false}
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl" maxH="90vh" overflow="auto">
          <ModalHeader borderBottom="1px solid" borderColor="gray.200">
            <Flex align="center" gap={3}>
              <Box bg="gold.50" p={2} borderRadius="full">
                <Icon
                  as={editingId ? FiEdit2 : FiPlus}
                  color="gold.500"
                  fontSize="20px"
                />
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="700">
                  {editingId ? "Edit Address" : "Add New Address"}
                </Text>
                <Text fontSize="sm" color="gray.500" fontWeight="400">
                  {editingId
                    ? "Update your address details"
                    : "Add a new delivery address"}
                </Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton mt={2} />

          <ModalBody py={6}>
            <AddressForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => {
                setEditingId(null);
                setFormData(initialForm);
                setErrors({});
                onClose();
              }}
              editingId={editingId}
              isLoading={loading}
              errors={errors}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AddressStep;
