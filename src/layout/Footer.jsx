import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  Input,
  Link,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  FiArrowUpRight,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";
import React, { useState } from "react";

import { Link as RouterLink } from "react-router-dom";
import logo from "../assets/images/Framiko_Logo/New_Framiko_Logo_White.svg";
import { newsletterApi } from "../services/api";

const Footer = () => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email?.trim()) {
      toast({
        title: "Email required",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      await newsletterApi.subscribe({ email: email.trim() });
      toast({
        title: "Subscribed successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: error?.message || "Something went wrong.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { label: "New Arrivals", to: "#" },
    { label: "Collections", to: "#" },
    { label: "Custom Frames", to: "#" },
    { label: "Sale", to: "#" },
  ];

  const supportLinks = [
    { label: "FAQs", to: "/faq" },
    { label: "Shipping Info", to: "/shipping-info" },
    { label: "Returns", to: "/return-policy" },
    { label: "Size Guide", to: "#" },
    { label: "Contact Us", to: "/contact" },
    { label: "About Us", to: "/about" },
  ];

  const LinkItem = ({ label, to, color = "whiteAlpha.700" }) => (
    <Link
      as={to.startsWith("mailto:") ? "a" : RouterLink}
      {...(to.startsWith("mailto:") ? { href: to } : { to })}
      fontSize="sm"
      color={color}
      _hover={{ color: "white" }}
      display="block"
      py={1}
      transition="color 0.2s"
    >
      {label}
    </Link>
  );

  return (
    <Box bg="brand.700" color="white">
      {/* ════════════ DESKTOP ════════════ */}
      <Box display={{ base: "none", md: "block" }}>
        <Box maxW="1200px" mx="auto" px={{ md: 8, lg: 10 }} pt={16} pb={10}>
          <SimpleGrid columns={{ md: 2, lg: 4 }} spacing={{ md: 10, lg: 12 }}>
            {/* Brand + Social */}
            <VStack align="flex-start" spacing={5}>
              <Image
                src={logo}
                alt="Framiko logo"
                maxW="160px"
                objectFit="contain"
              />
              <Text
                fontSize="sm"
                color="whiteAlpha.600"
                lineHeight="1.7"
                maxW="260px"
              >
                Create personalized photo frames and wall art designed to turn
                your favorite moments into beautiful pieces for your space.
              </Text>
              <HStack spacing={3} pt={1}>
                {[
                  { icon: FiFacebook, href: "#" },
                  { icon: FiTwitter, href: "#" },
                  { icon: FiLinkedin, href: "#" },
                  { icon: FiYoutube, href: "#" },
                ].map(({ icon, href }, i) => (
                  <Box
                    key={i}
                    as="a"
                    href={href}
                    w="36px"
                    h="36px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="whiteAlpha.700"
                  >
                    <Icon as={icon} boxSize={4} />
                  </Box>
                ))}
              </HStack>
            </VStack>

            {/* Company / Quick Links */}
            <VStack align="flex-start" spacing={0}>
              <Text fontWeight="600" fontSize="lg" color="white" mb={1}>
                Quick Links
              </Text>
              {quickLinks.map((l) => (
                <LinkItem key={l.label} {...l} />
              ))}
            </VStack>

            {/* Services / Support */}
            <VStack align="flex-start" spacing={0}>
              <Text fontWeight="600" fontSize="lg" color="white" mb={1}>
                Services
              </Text>
              {supportLinks.map((l) => (
                <LinkItem key={l.label} {...l} />
              ))}
            </VStack>

            {/* Stay Updated */}
            <VStack align="flex-start" spacing={3}>
              <Text fontWeight="600" fontSize="lg" color="white">
                Stay Updated
              </Text>
              <Text fontSize="sm" color="whiteAlpha.600" lineHeight="1.6">
                Get insights on exclusive offers, new collections, and creative
                inspiration.
              </Text>
              <Flex
                w="100%"
                bg="whiteAlpha.100"
                borderRadius="full"
                border="1px solid"
                borderColor="whiteAlpha.200"
                overflow="hidden"
                align="center"
              >
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="transparent"
                  border="none"
                  color="white"
                  h="44px"
                  pl={4}
                  fontSize="sm"
                  _placeholder={{ color: "whiteAlpha.500" }}
                  _focus={{ boxShadow: "none" }}
                />
                <Button
                  onClick={handleSubscribe}
                  isLoading={loading}
                  variant="solid"
                  color="#fff"
                  borderRadius="full"
                  h="36px"
                  w="36px"
                  minW="36px"
                  p={0}
                  mr={1}
                >
                  <Icon as={FiArrowUpRight} boxSize={4} />
                </Button>
              </Flex>
            </VStack>
          </SimpleGrid>
        </Box>

        {/* Desktop bottom bar */}
        <Box borderTop="1px solid" borderColor="whiteAlpha.200">
          <Flex
            maxW="1200px"
            mx="auto"
            px={{ md: 8, lg: 10 }}
            py={5}
            justify="space-between"
            align="center"
            fontSize="xs"
            color="whiteAlpha.500"
          >
            <Text>© 2026 Framiko. All rights reserved.</Text>
            <HStack spacing={6}>
              <Link as={RouterLink} to="/privacy" _hover={{ color: "white" }}>
                Privacy Policy
              </Link>
              <Link as={RouterLink} to="/terms" _hover={{ color: "white" }}>
                Terms of Service
              </Link>
            </HStack>
          </Flex>
        </Box>
      </Box>

      {/* ════════════ MOBILE (unchanged) ════════════ */}
      <Box display={{ base: "block", md: "none" }} bg="brand.700" color="white">
        <Box maxW="1200px" mx="auto" px={5} pt={10} pb={8}>
          {/* Brand */}
          <VStack align="center" spacing={3} mb={8}>
            <Image
              src={logo}
              alt="Framiko logo"
              maxW="170px"
              w="100%"
              objectFit="contain"
            />
            <Text
              fontSize="sm"
              color="gray.500"
              maxW="380px"
              lineHeight="1.6"
              textAlign="center"
            >
              Create personalized photo frames and wall art designed to turn
              your favorite moments into beautiful pieces for your space.
            </Text>
          </VStack>

          {/* Accordion */}
          <Box mb={8}>
            <Accordion allowToggle>
              <AccordionItem borderColor="gray.200">
                <AccordionButton py={4} _hover={{ bg: "transparent" }}>
                  <Box flex="1" textAlign="left" fontWeight="600" fontSize="sm">
                    Quick Links
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack align="stretch" spacing={1}>
                    {quickLinks.map((l) => (
                      <Link
                        key={l.label}
                        as={RouterLink}
                        to={l.to}
                        fontSize="sm"
                        color="whiteAlpha.700"
                        _hover={{ color: "brand.500" }}
                        py={1}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem borderColor="gray.200">
                <AccordionButton py={4} _hover={{ bg: "transparent" }}>
                  <Box flex="1" textAlign="left" fontWeight="600" fontSize="sm">
                    Customer Support
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack align="stretch" spacing={1}>
                    {supportLinks.map((l) => (
                      <Link
                        key={l.label}
                        as={RouterLink}
                        to={l.to}
                        fontSize="sm"
                        color="whiteAlpha.700"
                        _hover={{ color: "brand.500" }}
                        py={1}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem borderColor="gray.200">
                <AccordionButton py={4} _hover={{ bg: "transparent" }}>
                  <Box flex="1" textAlign="left" fontWeight="600" fontSize="sm">
                    Contact Us
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack align="stretch" spacing={1}>
                    <Link
                      as={RouterLink}
                      to="/contact"
                      fontSize="sm"
                      color="whiteAlpha.700"
                      _hover={{ color: "brand.500" }}
                      py={1}
                    >
                      Contact Us
                    </Link>
                    <Link
                      as={RouterLink}
                      to="/about"
                      fontSize="sm"
                      color="whiteAlpha.700"
                      _hover={{ color: "brand.500" }}
                      py={1}
                    >
                      About Us
                    </Link>
                    <Link
                      href="mailto:hello@framiko.com"
                      fontSize="sm"
                      color="whiteAlpha.700"
                      _hover={{ color: "brand.500" }}
                      py={1}
                    >
                      Email Us
                    </Link>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>

          {/* Newsletter Card */}
          <Box
            bg="#F7F4F0"
            borderRadius="2xl"
            px={5}
            py={6}
            mb={10}
            textAlign="center"
          >
            <Text fontSize="md" fontWeight="600" mb={2}>
              Get{" "}
              <Text as="span" color="#C9A89A">
                30% Off
              </Text>{" "}
              on your first order!
            </Text>
            <Text fontSize="sm" color="gray.500" mb={5}>
              Subscribe to receive exclusive offers, new collection updates, and
              creative inspiration.
            </Text>

            <Box position="relative" w="full" mb={3}>
              <Input
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="#ffffff"
                color="#1A1A1A"
                border="1px solid"
                borderColor="rgba(0,0,0,0.06)"
                borderRadius="full"
                h="48px"
                pl={6}
                pr="140px"
                fontSize="md"
                _placeholder={{ color: "#B0B0B0" }}
                _focus={{ boxShadow: "none" }}
              />
              <Button
                onClick={handleSubscribe}
                isLoading={loading}
                position="absolute"
                right={0}
                top={0}
                borderRadius="full"
                h="48px"
                px={5}
                fontSize="sm"
                fontWeight="600"
                zIndex={2}
              >
                Subscribe Now
              </Button>
            </Box>

            <Text fontSize="xs" color="gray.400">
              By subscribing, you agree to receive updates and promotional
              emails from Framiko.
            </Text>
          </Box>

          {/* Social */}
          <VStack spacing={4} mb={8}>
            <Text fontWeight="600" fontSize="sm">
              Follow us
            </Text>
            <HStack spacing={5}>
              {[FiInstagram, FiFacebook, FiYoutube].map((icon, i) => (
                <Box
                  key={i}
                  as="a"
                  href="#"
                  color="whiteAlpha.700"
                  _hover={{ color: "brand.500" }}
                >
                  <Icon as={icon} boxSize={5} />
                </Box>
              ))}
            </HStack>
          </VStack>

          {/* Bottom */}
          <Box borderTop="1px solid" borderColor="gray.200" pt={6}>
            <VStack spacing={2} textAlign="center">
              <Text fontSize="xs" color="gray.500">
                © 2026 Framiko. All Rights Reserved.
              </Text>
              <Text fontSize="sm" fontWeight="500">
                Made with ♥ to frame your memories.
              </Text>
              <HStack
                spacing={1}
                fontSize="xs"
                color="gray.500"
                justify="center"
              >
                <Link
                  as={RouterLink}
                  to="/privacy"
                  _hover={{ color: "brand.500" }}
                >
                  Privacy Policy
                </Link>
                <Text>|</Text>
                <Link
                  as={RouterLink}
                  to="/terms"
                  _hover={{ color: "brand.500" }}
                >
                  Terms & Conditions
                </Link>
                <Text>|</Text>
                <Link
                  as={RouterLink}
                  to="/cookies"
                  _hover={{ color: "brand.500" }}
                >
                  Cookie Policy
                </Link>
              </HStack>
            </VStack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
