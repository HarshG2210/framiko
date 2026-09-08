import {
  Box,
  Divider,
  Heading,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

import { CheckCircleIcon } from "@chakra-ui/icons";

export default function About() {
  return (
    <Box maxW="1100px" mx="auto" py={16} px={{ base: 6, md: 10 }} fontFamily="body">
      <Stack spacing={12}>
        <Box>
          <Heading size="xl" mb={4} letterSpacing="tight" fontFamily="heading">
            About Framiko
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="3xl" lineHeight="tall" fontFamily="body">
            Framiko is built for people who love art, decorating, and modern
            interiors. We combine curated artwork, custom framing, and premium
            finishing so every order arrives ready to hang.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
          <Box bg="gray.50" p={8} borderRadius="2xl" boxShadow="sm">
            <Heading size="md" mb={4} color="blue.700" fontFamily="heading">
              Our Mission
            </Heading>
            <Text color="gray.600" lineHeight="tall" fontFamily="body">
              To make high-quality custom framing intuitive and accessible for
              every home, office, and gifting moment. We remove uncertainty so
              you can choose with confidence.
            </Text>
          </Box>

          <Box bg="gray.50" p={8} borderRadius="2xl" boxShadow="sm">
            <Heading size="md" mb={4} color="blue.700" fontFamily="heading">
              What We Do
            </Heading>
            <Text color="gray.600" lineHeight="tall" fontFamily="body">
              Framiko delivers expert-curated frames, premium materials, and
              smart previews for artwork, prints, and personalized designs.
              Every product is made to look exceptional in your space.
            </Text>
          </Box>
        </SimpleGrid>

        <Box>
          <Heading size="lg" mb={4} letterSpacing="tight" fontFamily="heading">
            Why customers choose Framiko
          </Heading>
          <List spacing={4} color="gray.600" fontFamily="body">
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="blue.500" />
              Personalized guidance at every step, from size to frame finish.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="blue.500" />
              Durable materials and refined craftsmanship for lasting display.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="blue.500" />
              Transparent pricing, no hidden charges, and secure checkout.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="blue.500" />
              Reliable delivery with careful packaging and trusted service.
            </ListItem>
          </List>
        </Box>

        <Box bg="white" p={8} borderRadius="2xl" boxShadow="xl">
          <Heading size="md" mb={4} color="gray.700" fontFamily="heading">
            Our promise to you
          </Heading>
          <Text color="gray.600" lineHeight="tall" fontFamily="body">
            Every Framiko order is assembled with care and attention to detail.
            We stand behind the quality of our frames, finishes, and artwork
            selections so you can enjoy a polished piece as soon as it arrives.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading size="lg" mb={4} letterSpacing="tight" fontFamily="heading">
            Our values
          </Heading>
          <Stack spacing={6}>
            <Box>
              <Heading size="md" mb={2} color="blue.700" fontFamily="heading">
                Thoughtful design
              </Heading>
              <Text color="gray.600" lineHeight="tall" fontFamily="body">
                We prioritize style, proportion, and material harmony for each
                product so your framed piece enhances the room it lives in.
              </Text>
            </Box>
            <Box>
              <Heading size="md" mb={2} color="blue.700" fontFamily="heading">
                Quality craftsmanship
              </Heading>
              <Text color="gray.600" lineHeight="tall" fontFamily="body">
                From frame moulding to print finishing, our production process
                focuses on consistency, reliability, and premium presentation.
              </Text>
            </Box>
            <Box>
              <Heading size="md" mb={2} color="blue.700" fontFamily="heading">
                Customer care
              </Heading>
              <Text color="gray.600" lineHeight="tall" fontFamily="body">
                We support every order with helpful guidance, fast responses, and
                transparent policies so you feel supported from checkout to
                delivery.
              </Text>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
