import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  clearError,
  updateProfile,
  viewProfile,
} from "../../../redux/slices/userAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const EmbeddedEditProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((s) => s.userAuth);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user?.user?.first_name || "");
      setLastName(user?.user?.last_name || "");
      setMobileNumber(user?.phone_number || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) return;
    const profileData = new FormData();
    profileData.append("first_name", firstName.trim());
    profileData.append("last_name", lastName.trim());
    profileData.append("phone_number", mobileNumber.trim());
    dispatch(clearError());
    try {
      await dispatch(updateProfile(profileData)).unwrap();
      // updateProfile's own reducer may not carry the full nested user
      // shape (user.user.first_name / last_name) used across the app, so
      // re-fetch the profile from the backend to make sure Redux — and
      // every component reading from it, like ViewProfile — reflects the
      // change immediately instead of only after a page reload.
      await dispatch(viewProfile()).unwrap();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box maxW="480px" w="100%" fontFamily="body">
      <Stack spacing={5}>
        <FormControl>
          <FormLabel fontSize="sm" color="neutral.600" fontFamily="body">
            First Name
          </FormLabel>
          <Input
            bg="neutral.50"
            borderColor="neutral.200"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fontFamily="body"
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" color="neutral.600" fontFamily="body">
            Last Name
          </FormLabel>
          <Input
            bg="neutral.50"
            borderColor="neutral.200"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fontFamily="body"
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" color="neutral.600" fontFamily="body">
            Mobile Number
          </FormLabel>
          <Input
            bg="neutral.100"
            borderColor="neutral.200"
            value={mobileNumber}
            isDisabled
            cursor="not-allowed"
            onChange={(e) =>
              setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            fontFamily="body"
          />
        </FormControl>

        <Box>
          <Button
            variant="solid"
            isLoading={loading}
            onClick={handleSave}
            w={{ base: "100%", sm: "auto" }}
            fontFamily="body"
          >
            Save changes
          </Button>
        </Box>

        {error && (
          <Text color="red.500" fontSize="sm" fontFamily="body">
            {error}
          </Text>
        )}
      </Stack>
    </Box>
  );
};

export default EmbeddedEditProfile;
