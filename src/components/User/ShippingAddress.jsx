import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  createShippingAddress,
  fetchShippingAddresses,
  setDefaultShippingAddress,
  updateShippingAddress,
} from "../../redux/slices/shippingAddressSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { useMemo } from "react";

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

const ShippingAddress = () => {
  const dispatch = useDispatch();

  const { addresses, loading } = useSelector((state) => state.shippingAddress);

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchShippingAddresses());
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length > 15) {
      newErrors.phone = "Phone number cannot exceed 15 characters";
    }

    if (!formData.address_line_1.trim()) {
      newErrors.address_line_1 = "Flat No./House No. and Floor is Required";
    }

    if (!formData.address_line_2.trim()) {
      newErrors.address_line_2 = "Street name and Building name is required";
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
      newErrors.postal_code = "Postal code is required";
    } else if (formData.postal_code.length > 10) {
      newErrors.postal_code = "Postal code cannot exceed 10 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

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
      } else {
        await dispatch(createShippingAddress(formData)).unwrap();
      }

      dispatch(fetchShippingAddresses());

      setFormData(initialForm);
      setEditingId(null);
      setErrors({});
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setErrors({});
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setErrors({});
    setShowForm(false);
  };

  const handleEdit = (address) => {
    setEditingId(address.id);
    setShowForm(true);

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
      is_default: address.is_default || false,
    });
  };

  const sortedAddresses = useMemo(() => {
    return [...(addresses || [])].sort(
      (a, b) => Number(b.is_default) - Number(a.is_default),
    );
  }, [addresses]);

  const handleSetDefault = async (addressId) => {
    try {
      await dispatch(setDefaultShippingAddress(addressId)).unwrap();

      dispatch(fetchShippingAddresses());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box maxW="1200px" mx="auto" fontFamily="body">
      <Box bg="#fff" overflow="hidden">
        <Box>
          <Flex
            mb={6}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            gap={4}
            direction={{ base: "column", md: "row" }}
          >
            <Box>
              <Heading size="md" color="neutral.900" fontFamily="body">
                Saved Addresses ({addresses?.length || 0})
              </Heading>
              <Text color="neutral.600" fontSize="sm" mt={1} fontFamily="body">
                Manage your delivery locations with ease.
              </Text>
            </Box>

            {!showForm && (
              <Button variant="solid" onClick={handleOpenForm} fontFamily="body">
                Add Address
              </Button>
            )}
          </Flex>

          {showForm ? (
            <Box
              bg="neutral.50"
              border="1px solid"
              borderColor="neutral.200"
              borderRadius="2xl"
              p={{ base: 4, md: 6 }}
            >
              <Flex justify="space-between" align="center" mb={6} gap={3}>
                <Box>
                  <Heading size="md" color="neutral.900" mb={1} fontFamily="body">
                    {editingId ? "Update address" : "Add a new address"}
                  </Heading>
                  <Text color="neutral.600" fontSize="sm" fontFamily="body">
                    Keep your delivery information polished and ready for every
                    order.
                  </Text>
                </Box>
                <Button variant="ghost" onClick={handleCloseForm} fontFamily="body">
                  Cancel
                </Button>
              </Flex>

              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel color="neutral.700" fontFamily="body">Address Type</FormLabel>
                  <SimpleGrid columns={3} spacing={2}>
                    {[
                      { value: "home", label: "Home" },
                      { value: "office", label: "Office" },
                      { value: "other", label: "Other" },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        size="sm"
                        variant={
                          formData.label === option.value ? "solid" : "outline"
                        }
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            label: option.value,
                          }))
                        }
                        fontFamily="body"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </SimpleGrid>
                </FormControl>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel color="neutral.700" fontFamily="body">Full Name</FormLabel>
                    <Input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      bg="white"
                      borderColor="neutral.200"
                      fontFamily="body"
                    />
                  </FormControl>

                  <FormControl isInvalid={errors.phone}>
                    <FormLabel color="neutral.700" fontFamily="body">Phone</FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      maxLength={15}
                      onChange={handleChange}
                      bg="white"
                      borderColor="neutral.200"
                      fontFamily="body"
                    />
                    {errors.phone && (
                      <Text color="red.500" fontSize="sm" mt={1} fontFamily="body">
                        {errors.phone}
                      </Text>
                    )}
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel color="neutral.700" fontFamily="body">
                    Flat No./House No. and Floor
                  </FormLabel>
                  <Input
                    name="address_line_1"
                    value={formData.address_line_1}
                    onChange={handleChange}
                    bg="white"
                    borderColor="neutral.200"
                    fontFamily="body"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="neutral.700" fontFamily="body">
                    House name and locality
                  </FormLabel>
                  <Input
                    name="address_line_2"
                    value={formData.address_line_2}
                    onChange={handleChange}
                    bg="white"
                    borderColor="neutral.200"
                    fontFamily="body"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="neutral.700" fontFamily="body">Landmark</FormLabel>
                  <Input
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    bg="white"
                    borderColor="neutral.200"
                    fontFamily="body"
                  />
                </FormControl>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel color="neutral.700" fontFamily="body">City</FormLabel>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      bg="white"
                      borderColor="neutral.200"
                      fontFamily="body"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color="neutral.700" fontFamily="body">State</FormLabel>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      bg="white"
                      borderColor="neutral.200"
                      fontFamily="body"
                    />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel color="neutral.700" fontFamily="body">Country</FormLabel>
                    <Input
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      bg="white"
                      borderColor="neutral.200"
                      fontFamily="body"
                    />
                  </FormControl>

                  <FormControl isInvalid={errors.postal_code}>
                    <FormLabel color="neutral.700" fontFamily="body">Postal Code</FormLabel>
                    <Input
                      name="postal_code"
                      value={formData.postal_code}
                      maxLength={10}
                      onChange={handleChange}
                      bg="white"
                      borderColor="neutral.200"
                      fontFamily="body"
                    />
                    {errors.postal_code && (
                      <Text color="red.500" fontSize="sm" mt={1} fontFamily="body">
                        {errors.postal_code}
                      </Text>
                    )}
                  </FormControl>
                </SimpleGrid>

                <Button
                  w="full"
                  size="lg"
                  variant="solid"
                  onClick={handleSubmit}
                  fontFamily="body"
                >
                  {editingId ? "Update Address" : "Add Address"}
                </Button>
              </VStack>
            </Box>
          ) : loading ? (
            <Box
              bg="neutral.50"
              border="1px solid"
              borderColor="neutral.200"
              borderRadius="2xl"
              p={8}
              textAlign="center"
            >
              <Spinner color="gold.500" />
            </Box>
          ) : addresses?.length === 0 ? (
            <Box
              p={8}
              border="1px dashed"
              borderColor="neutral.300"
              borderRadius="2xl"
              textAlign="center"
              bg="neutral.50"
            >
              <Text color="neutral.500">No address added yet.</Text>
            </Box>
          ) : (
            <VStack spacing={4} align="stretch">
              {sortedAddresses.map((address) => (
                <Box
                  key={address.id}
                  borderWidth="1px"
                  borderColor={address.is_default ? "gold.400" : "neutral.200"}
                  bg={address.is_default ? "gold.50" : "white"}
                  borderRadius="2xl"
                  p={5}
                  boxShadow="0 8px 24px rgba(15, 23, 42, 0.04)"
                >
                  <Flex
                    justify="space-between"
                    align="flex-start"
                    gap={3}
                    mb={3}
                  >
                    <Text fontSize="lg" fontWeight="700" color="neutral.900" fontFamily="body">
                      {address.full_name}
                    </Text>

                    {address.is_default && (
                      <Badge
                        bg="beige.100"
                        color="neutral.800"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontFamily="body"
                      >
                        Default
                      </Badge>
                    )}
                  </Flex>

                  <Stack spacing={1.5} color="neutral.700" fontSize="sm">
                    <Text fontFamily="body">📞 {address.phone}</Text>
                    <Text fontFamily="body">{address.address_line_1}</Text>
                    {address.address_line_2 && (
                      <Text fontFamily="body">{address.address_line_2}</Text>
                    )}
                    <Text fontFamily="body">
                      {address.city}, {address.state}
                    </Text>
                    <Text fontFamily="body">
                      {address.country} - {address.postal_code}
                    </Text>
                    {address.landmark && (
                      <Text color="neutral.500" fontFamily="body">
                        📍 Landmark: {address.landmark}
                      </Text>
                    )}
                  </Stack>

                  <Text mt={3} fontSize="xs" color="neutral.400" fontFamily="body">
                    Added on {new Date(address.created_at).toLocaleDateString()}
                  </Text>

                  <Flex mt={4} gap={3} wrap="wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(address)}
                      fontFamily="body"
                    >
                      Edit Address
                    </Button>

                    {!address.is_default && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSetDefault(address.id)}
                        fontFamily="body"
                      >
                        Set As Default
                      </Button>
                    )}
                  </Flex>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ShippingAddress;
