import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

const faqItems = [
  {
    question: "How does the Framiko customization process work?",
    answer:
      "Choose your artwork, frame style, size, and finish. We build a preview, confirm the details, and then produce your order with premium materials before shipping it securely.",
  },
  {
    question: "Can I preview the framed artwork before I buy?",
    answer:
      "Yes. Our preview experience shows how your chosen artwork, frame, and size come together so you can make an informed decision before ordering.",
  },
  {
    question: "What materials are available for frames and finishes?",
    answer:
      "We offer wood, metal, and contemporary moulding styles with matte, satin, and glossy finishes to match your artwork and room design.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Most orders are produced within 3–5 business days and delivered within 7–12 days across India, depending on your location and the selected shipping option.",
  },
  {
    question: "What is your return policy for custom frames?",
    answer:
      "Custom framing orders are final sale unless the product arrives damaged or defective. If there is an issue, contact us immediately and we will work to repair or replace the item.",
  },
  {
    question: "Can I upload my own artwork?",
    answer:
      "Absolutely. You can upload your own artwork during the customization flow, and we will help you choose the right size and frame for the best final presentation.",
  },
  {
    question: "Can I update my order after it is placed?",
    answer:
      "If your order has not yet entered production, we may be able to make changes. Contact support as soon as possible to discuss your request.",
  },
  {
    question: "How can I get support if I have a question?",
    answer:
      "Our customer support team is available through the website contact form and can help with order questions, product guidance, and delivery updates.",
  },
];

export default function Faq() {
  const navigate = useNavigate();

  return (
    <Box
      maxW="1200px"
      mx="auto"
      w="full"
      bg="white"
      // py={{ base: 14, md: 20 }}
      fontFamily="body"
      // px={{ base: 6, md: 12 }}
    >
      <Stack spacing={6}>
        <Box textAlign="center">
          <Text
            fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
            fontWeight="500"
            color="neutral.300"
            letterSpacing="-0.05em"
            fontFamily="heading"
            mb={4}
            lineHeight="1.05"
          >
            {" "}
            Frequently Asked Questions
          </Text>
          <Text
            fontSize={{ base: "1rem", md: "1.2rem" }}
            color="neutral.600"
            maxW="860px"
            mx="auto"
            lineHeight="1.7"
            fontFamily="body"
          >
            Clear answers for ordering, customization, delivery, and customer
            support so you can shop with confidence.
          </Text>
        </Box>

        <Accordion allowToggle defaultIndex={[0]}>
          {faqItems.map((item) => (
            <AccordionItem
              key={item.question}
              borderTopWidth="1px"
              borderColor="gray.200"
            >
              <h3>
                <AccordionButton
                  _expanded={{ bg: "beige.50", color: "neutral.900" }}
                  py={5}
                  fontFamily="body"
                  color="neutral.900"
                >
                  <Box
                    flex="1"
                    textAlign="left"
                    fontWeight="semibold"
                    fontFamily="body"
                  >
                    {item.question}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel
                pb={5}
                color="neutral.600"
                fontSize="md"
                fontFamily="body"
              >
                {item.answer}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        <Box bg="beige.50" p={6} borderRadius="2xl" boxShadow="sm">
          <Badge
            bg="beige.100"
            color="neutral.900"
            mb={3}
            px={3}
            py={1}
            borderRadius="full"
            fontFamily="body"
          >
            Need a quick answer?
          </Badge>
          <Heading size="md" mb={2} color="neutral.900" fontFamily="heading">
            Our support team is here to help.
          </Heading>
          <Text color="neutral.600" lineHeight="tall" fontFamily="body">
            If your question isn't covered here, contact us through the website
            so we can guide you through frame selection, order details, or
            delivery tracking.
          </Text>
          <Button
            mt={5}
            variant="solid"
            size="md"
            onClick={() => navigate("/contact")}
          >
            Contact support
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
