import {
  Box,
  Divider,
  Heading,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
} from "@chakra-ui/react";

import { CheckCircleIcon } from "@chakra-ui/icons";

export default function Cookies() {
  return (
    <Box maxW="1000px" mx="auto" py={16} px={{ base: 6, md: 10 }} fontFamily="body">
      <Stack spacing={10}>
        <Box>
          <Heading size="xl" mb={4} letterSpacing="tight" fontFamily="heading">
            Cookie Policy
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="3xl" lineHeight="tall">
            Framiko uses cookies and similar tracking technologies to deliver a
            better shopping experience, remember your preferences, and improve
            our services. This page explains what cookies are, why we use them,
            and how you can manage your preferences.
          </Text>
        </Box>

        <Stack spacing={8}>
          <Box>
            <Heading size="md" mb={3} color="brand.700" fontFamily="heading">
              What are cookies?
            </Heading>
            <Text color="gray.600" lineHeight="tall">
              Cookies are small text files stored on your device when you visit a
              website. They help the website remember your preferences, sign-in
              choices, and page visits so your next visit feels faster and more
              personalized.
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} color="brand.700" fontFamily="heading">
              Types of cookies we use
            </Heading>
            <List spacing={3} color="gray.600">
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="brand.500" />
                <Text as="span" fontWeight="600">
                  Essential cookies:
                </Text>{" "}
                required for secure checkout, account access, and site
                navigation.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="brand.500" />
                <Text as="span" fontWeight="600">
                  Performance cookies:
                </Text>{" "}
                help us understand how customers use the site and improve
                speed, design, and reliability.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="brand.500" />
                <Text as="span" fontWeight="600">
                  Functional cookies:
                </Text>{" "}
                remember your preferences, language selection, and shopping
                session.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="brand.500" />
                <Text as="span" fontWeight="600">
                  Marketing cookies:
                </Text>{" "}
                support personalized offers, ads, and promotions across your
                devices.
              </ListItem>
            </List>
          </Box>

          <Box>
            <Heading size="md" mb={3} color="brand.700" fontFamily="heading">
              Why we use cookies
            </Heading>
            <Text color="gray.600" lineHeight="tall">
              We use cookies to keep your account secure, provide a tailored
              shopping experience, and optimize our site performance. Cookies
              also help us analyze traffic, understand popular products, and
              improve checkout flow.
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} color="brand.700" fontFamily="heading">
              Managing your cookie preferences
            </Heading>
            <Text color="gray.600" lineHeight="tall" mb={3}>
              You can change your cookie preferences at any time by clicking the
              Cookie settings link in the banner or by clearing cookies in your
              browser settings.
            </Text>
            <Text color="gray.600" lineHeight="tall">
              Essential cookies are necessary for the website to function. If
              you opt out of performance or marketing cookies, some features may
              be less personalized.
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} color="brand.700" fontFamily="heading">
              Third-party cookies
            </Heading>
            <Text color="gray.600" lineHeight="tall">
              We may work with trusted partners for analytics, advertising, and
              content delivery. These third parties may set their own cookies on
              your device, which are governed by their privacy policies.
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} color="brand.700" fontFamily="heading">
              Contact us
            </Heading>
            <Text color="gray.600" lineHeight="tall">
              If you have questions about cookies or how we use your data,
              please contact customer support through the website.
            </Text>
          </Box>
        </Stack>

        <Divider />

        <Box>
          <Heading size="lg" mb={4} letterSpacing="tight" fontFamily="heading">
            Summary
          </Heading>
          <List spacing={3} color="gray.600">
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="brand.500" />
              Framiko uses cookies to ensure secure checkout, faster browsing,
              and relevant product recommendations.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="brand.500" />
              You can review cookie preferences from the cookie banner or browser
              settings.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="brand.500" />
              Essential cookies cannot be disabled without affecting core site
              functionality.
            </ListItem>
          </List>
        </Box>
      </Stack>
    </Box>
  );
}
