import { useDispatch, useSelector } from "react-redux";

import AddressStep from "../components/AddressStep";
import { Box } from "@chakra-ui/react";
import ConfirmationStep from "../components/ConfirmationStep";
import ReviewStep from "../components/ReviewStep";
import { resetCheckout } from "../../../redux/slices/checkoutSlice";
import { useEffect } from "react";

const Checkout = () => {
  const dispatch = useDispatch();

  const { step } = useSelector((state) => state.checkout);

  useEffect(() => {
    return () => {
      dispatch(resetCheckout());
    };
  }, [dispatch]);

  return (
    <Box maxW="1200px" mx="auto" p={8}>
      {step === 1 && <AddressStep />}
      {step === 2 && <ReviewStep />}
      {step === 3 && <ConfirmationStep />}
    </Box>
  );
};

export default Checkout;
