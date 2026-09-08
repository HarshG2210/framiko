import {
  Box,
  Button,
  Divider,
  Heading,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
} from "@chakra-ui/react";

import { ChevronRightIcon } from "@chakra-ui/icons";

export default function Terms() {
  return (
    <Box
      maxW="1100px"
      mx="auto"
      py={16}
      px={{ base: 6, md: 10 }}
      fontFamily="body"
    >
      <Stack spacing={10}>
        <Box>
          <Heading size="xl" mb={4} letterSpacing="tight" fontFamily="heading">
            Terms & Conditions
          </Heading>
          <Text fontSize="lg" color="neutral.600" maxW="3xl" lineHeight="tall">
            These terms explain how Framiko sells custom-framed artwork, prints,
            and related services. Please review them before placing an order.
          </Text>
        </Box>

        <Stack spacing={8}>
          <Box>
            <Heading size="md" mb={3} color="brand.700" fontFamily="heading">
              1. Agreement
            </Heading>
            <Text color="neutral.600" lineHeight="tall">
              By using this website and placing an order, you agree to our terms
              and policies. Framiko may revise these terms at any time, and the
              latest version will always apply to future purchases.
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} color="brand.700" fontFamily="heading">
              2. Orders and payment
            </Heading>
            <Text color="neutral.600" lineHeight="tall">
              Orders are confirmed after payment authorization and stock
              verification. Prices are shown in Indian Rupees and include the
              products and customization selected at checkout.
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} color="brand.700" fontFamily="heading">
              3. Product information
            </Heading>
            <Text color="neutral.600" lineHeight="tall">
              We aim to display accurate product details, but colors, finishes,
              and dimensions may vary slightly due to screen settings and
              production tolerances.
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} color="brand.700" fontFamily="heading">
              4. Shipping and delivery
            </Heading>
            <Text color="neutral.600" lineHeight="tall">
              Shipping times are estimates and may change based on location,
              courier schedules, and production availability. We will notify you
              of any delays and do our best to keep your order on track.
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} color="brand.700" fontFamily="heading">
              5. Returns and cancellations
            </Heading>
            <Text color="neutral.600" lineHeight="tall">
              Personalized and custom-framed items are final sale unless they
              arrive damaged, defective, or incorrect. If you receive a faulty
              product, contact support promptly for repair, replacement, or
              refund options.
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} color="brand.700" fontFamily="heading">
              6. Intellectual property
            </Heading>
            <Text color="neutral.600" lineHeight="tall">
              Website content, logos, and images are protected by copyright and
              trademark law. You may not reproduce or reuse our materials
              without written permission from Framiko.
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} color="brand.700" fontFamily="heading">
              7. Liability
            </Heading>
            <Text color="neutral.600" lineHeight="tall">
              Framiko is not responsible for indirect or consequential damages
              arising from your use of the website. Our maximum liability for any
              claim is limited to the order value paid for the product.
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} color="brand.700" fontFamily="heading">
              8. Privacy and data
            </Heading>
            <Text color="neutral.600" lineHeight="tall">
              Personal data is processed in accordance with our privacy policy.
              We use data to manage your order, provide support, and improve our
              services.
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} color="brand.700" fontFamily="heading">
              9. Contact us
            </Heading>
            <Text color="neutral.600" lineHeight="tall">
              Questions about these terms can be directed to our customer
              support team through the website.
            </Text>
          </Box>
        </Stack>

        <Divider />

        <Box>
          <Heading size="lg" mb={4} letterSpacing="tight" fontFamily="heading">
            Quick summary
          </Heading>
          <List spacing={3}>
            <ListItem>
              <ListIcon as={ChevronRightIcon} color="brand.500" />
              Orders are confirmed only after payment and availability checks.
            </ListItem>
            <ListItem>
              <ListIcon as={ChevronRightIcon} color="brand.500" />
              Custom framing orders are final sale unless they are damaged or
              incorrect.
            </ListItem>
            <ListItem>
              <ListIcon as={ChevronRightIcon} color="brand.500" />
              Delivery timelines depend on production and courier availability.
            </ListItem>
          </List>
          <Button variant="brand" size="md" mt={6}>
            Contact support
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
