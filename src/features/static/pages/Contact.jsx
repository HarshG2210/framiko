import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useOutsideClick,
  useToast,
} from "@chakra-ui/react";
import {
  clearContactState,
  submitContactMessage,
} from "../../../redux/slices/contactSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

/* ─── Static data ─────────────────────────────────────────────────────────── */

const COUNTRIES = [
  ["AF", "Afghanistan"],
  ["AL", "Albania"],
  ["DZ", "Algeria"],
  ["AS", "American Samoa"],
  ["AD", "Andorra"],
  ["AO", "Angola"],
  ["AI", "Anguilla"],
  ["AQ", "Antarctica"],
  ["AG", "Antigua and Barbuda"],
  ["AR", "Argentina"],
  ["AM", "Armenia"],
  ["AW", "Aruba"],
  ["AU", "Australia"],
  ["AT", "Austria"],
  ["AZ", "Azerbaijan"],
  ["BS", "Bahamas"],
  ["BH", "Bahrain"],
  ["BD", "Bangladesh"],
  ["BB", "Barbados"],
  ["BY", "Belarus"],
  ["BE", "Belgium"],
  ["BZ", "Belize"],
  ["BJ", "Benin"],
  ["BM", "Bermuda"],
  ["BT", "Bhutan"],
  ["BO", "Bolivia"],
  ["BA", "Bosnia and Herzegovina"],
  ["BW", "Botswana"],
  ["BV", "Bouvet Island"],
  ["BR", "Brazil"],
  ["IO", "British Indian Ocean Territory"],
  ["BN", "Brunei Darussalam"],
  ["BG", "Bulgaria"],
  ["BF", "Burkina Faso"],
  ["BI", "Burundi"],
  ["KH", "Cambodia"],
  ["CM", "Cameroon"],
  ["CA", "Canada"],
  ["CV", "Cape Verde"],
  ["KY", "Cayman Islands"],
  ["CF", "Central African Republic"],
  ["TD", "Chad"],
  ["CL", "Chile"],
  ["CN", "China"],
  ["CX", "Christmas Island"],
  ["CC", "Cocos (Keeling) Islands"],
  ["CO", "Colombia"],
  ["KM", "Comoros"],
  ["CG", "Congo"],
  ["CD", "Congo, the Democratic Republic of the"],
  ["CK", "Cook Islands"],
  ["CR", "Costa Rica"],
  ["CI", "Cote d'Ivoire"],
  ["HR", "Croatia"],
  ["CU", "Cuba"],
  ["CY", "Cyprus"],
  ["CZ", "Czech Republic"],
  ["DK", "Denmark"],
  ["DJ", "Djibouti"],
  ["DM", "Dominica"],
  ["DO", "Dominican Republic"],
  ["EC", "Ecuador"],
  ["EG", "Egypt"],
  ["SV", "El Salvador"],
  ["GQ", "Equatorial Guinea"],
  ["ER", "Eritrea"],
  ["EE", "Estonia"],
  ["ET", "Ethiopia"],
  ["FK", "Falkland Islands (Malvinas)"],
  ["FO", "Faroe Islands"],
  ["FJ", "Fiji"],
  ["FI", "Finland"],
  ["FR", "France"],
  ["GF", "French Guiana"],
  ["PF", "French Polynesia"],
  ["TF", "French Southern Territories"],
  ["GA", "Gabon"],
  ["GM", "Gambia"],
  ["GE", "Georgia"],
  ["DE", "Germany"],
  ["GH", "Ghana"],
  ["GI", "Gibraltar"],
  ["GR", "Greece"],
  ["GL", "Greenland"],
  ["GD", "Grenada"],
  ["GP", "Guadeloupe"],
  ["GU", "Guam"],
  ["GT", "Guatemala"],
  ["GN", "Guinea"],
  ["GW", "Guinea-Bissau"],
  ["GY", "Guyana"],
  ["HT", "Haiti"],
  ["HM", "Heard Island and McDonald Islands"],
  ["VA", "Holy See (Vatican City State)"],
  ["HN", "Honduras"],
  ["HK", "Hong Kong"],
  ["HU", "Hungary"],
  ["IS", "Iceland"],
  ["IN", "India"],
  ["ID", "Indonesia"],
  ["IR", "Iran, Islamic Republic of"],
  ["IQ", "Iraq"],
  ["IE", "Ireland"],
  ["IL", "Israel"],
  ["IT", "Italy"],
  ["JM", "Jamaica"],
  ["JP", "Japan"],
  ["JO", "Jordan"],
  ["KZ", "Kazakhstan"],
  ["KE", "Kenya"],
  ["KI", "Kiribati"],
  ["KP", "Korea, Democratic People's Republic of"],
  ["KR", "Korea, Republic of"],
  ["KW", "Kuwait"],
  ["KG", "Kyrgyzstan"],
  ["LA", "Lao People's Democratic Republic"],
  ["LV", "Latvia"],
  ["LB", "Lebanon"],
  ["LS", "Lesotho"],
  ["LR", "Liberia"],
  ["LY", "Libyan Arab Jamahiriya"],
  ["LI", "Liechtenstein"],
  ["LT", "Lithuania"],
  ["LU", "Luxembourg"],
  ["MO", "Macao"],
  ["MK", "Macedonia, the Former Yugoslav Republic of"],
  ["MG", "Madagascar"],
  ["MW", "Malawi"],
  ["MY", "Malaysia"],
  ["MV", "Maldives"],
  ["ML", "Mali"],
  ["MT", "Malta"],
  ["MH", "Marshall Islands"],
  ["MQ", "Martinique"],
  ["MR", "Mauritania"],
  ["MU", "Mauritius"],
  ["YT", "Mayotte"],
  ["MX", "Mexico"],
  ["FM", "Micronesia, Federated States of"],
  ["MD", "Moldova, Republic of"],
  ["MC", "Monaco"],
  ["MN", "Mongolia"],
  ["MS", "Montserrat"],
  ["MA", "Morocco"],
  ["MZ", "Mozambique"],
  ["MM", "Myanmar"],
  ["NA", "Namibia"],
  ["NR", "Nauru"],
  ["NP", "Nepal"],
  ["NL", "Netherlands"],
  ["AN", "Netherlands Antilles"],
  ["NC", "New Caledonia"],
  ["NZ", "New Zealand"],
  ["NI", "Nicaragua"],
  ["NE", "Niger"],
  ["NG", "Nigeria"],
  ["NU", "Niue"],
  ["NF", "Norfolk Island"],
  ["MP", "Northern Mariana Islands"],
  ["NO", "Norway"],
  ["OM", "Oman"],
  ["PK", "Pakistan"],
  ["PW", "Palau"],
  ["PS", "Palestinian Territory, Occupied"],
  ["PA", "Panama"],
  ["PG", "Papua New Guinea"],
  ["PY", "Paraguay"],
  ["PE", "Peru"],
  ["PH", "Philippines"],
  ["PN", "Pitcairn"],
  ["PL", "Poland"],
  ["PT", "Portugal"],
  ["PR", "Puerto Rico"],
  ["QA", "Qatar"],
  ["RE", "Reunion"],
  ["RO", "Romania"],
  ["RU", "Russian Federation"],
  ["RW", "Rwanda"],
  ["SH", "Saint Helena"],
  ["KN", "Saint Kitts and Nevis"],
  ["LC", "Saint Lucia"],
  ["PM", "Saint Pierre and Miquelon"],
  ["VC", "Saint Vincent and the Grenadines"],
  ["WS", "Samoa"],
  ["SM", "San Marino"],
  ["ST", "Sao Tome and Principe"],
  ["SA", "Saudi Arabia"],
  ["SN", "Senegal"],
  ["SC", "Seychelles"],
  ["SL", "Sierra Leone"],
  ["SG", "Singapore"],
  ["SK", "Slovakia"],
  ["SI", "Slovenia"],
  ["SB", "Solomon Islands"],
  ["SO", "Somalia"],
  ["ZA", "South Africa"],
  ["GS", "South Georgia and the South Sandwich Islands"],
  ["ES", "Spain"],
  ["LK", "Sri Lanka"],
  ["SD", "Sudan"],
  ["SR", "Suriname"],
  ["SJ", "Svalbard and Jan Mayen"],
  ["SZ", "Swaziland"],
  ["SE", "Sweden"],
  ["CH", "Switzerland"],
  ["SY", "Syrian Arab Republic"],
  ["TW", "Taiwan, Province of China"],
  ["TJ", "Tajikistan"],
  ["TZ", "Tanzania, United Republic of"],
  ["TH", "Thailand"],
  ["TL", "Timor-Leste"],
  ["TG", "Togo"],
  ["TK", "Tokelau"],
  ["TO", "Tonga"],
  ["TT", "Trinidad and Tobago"],
  ["TN", "Tunisia"],
  ["TR", "Turkey"],
  ["TM", "Turkmenistan"],
  ["TC", "Turks and Caicos Islands"],
  ["TV", "Tuvalu"],
  ["UG", "Uganda"],
  ["UA", "Ukraine"],
  ["AE", "United Arab Emirates"],
  ["GB", "United Kingdom"],
  ["US", "United States"],
  ["UM", "United States Minor Outlying Islands"],
  ["UY", "Uruguay"],
  ["UZ", "Uzbekistan"],
  ["VU", "Vanuatu"],
  ["VE", "Venezuela"],
  ["VN", "Viet Nam"],
  ["VG", "Virgin Islands, British"],
  ["VI", "Virgin Islands, U.S."],
  ["WF", "Wallis and Futuna"],
  ["EH", "Western Sahara"],
  ["YE", "Yemen"],
  ["ZM", "Zambia"],
  ["ZW", "Zimbabwe"],
];

const SUBJECTS = [
  ["product_enquiry", "Product Enquiry"],
  ["bulk_order", "Bulk Order"],
  ["custom_gifting", "Custom Gifting"],
  ["shipping_query", "Shipping Query"],
  ["authentication", "Authentication"],
  ["partnership", "Partnership"],
  ["other", "Other"],
];

/* ─── SearchableCountrySelect ─────────────────────────────────────────────── */

const SearchableCountrySelect = ({ value, onChange }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // Selected label for display
  const selectedLabel = COUNTRIES.find(([code]) => code === value)?.[1] || "";

  // Filtered list
  const filtered = query.trim()
    ? COUNTRIES.filter(
        ([code, name]) =>
          name.toLowerCase().includes(query.toLowerCase()) ||
          code.toLowerCase().includes(query.toLowerCase()),
      )
    : COUNTRIES;

  // Close on outside click
  useOutsideClick({ ref: containerRef, handler: () => setIsOpen(false) });

  const selectCountry = (code) => {
    onChange(code);
    setQuery("");
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setHighlighted(0);
    setIsOpen(true);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") setIsOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlighted]) {
        selectCountry(...filtered[highlighted]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current) {
      const item = listRef.current.children[highlighted];
      if (item) item.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted]);

  const displayValue = isOpen ? query : selectedLabel;

  return (
    <Box ref={containerRef} position="relative">
      <InputGroup>
        <InputLeftElement pointerEvents="none" color="gray.400" fontSize="sm">
          🌍
        </InputLeftElement>
        <Input
          ref={inputRef}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search and select country…"
          autoComplete="off"
          borderRadius="xl"
          borderColor={isOpen ? "blue.400" : "gray.200"}
          boxShadow={isOpen ? "0 0 0 1px #63B3ED" : "none"}
          _hover={{ borderColor: "gray.300" }}
          _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #63B3ED" }}
          bg="white"
          cursor={isOpen ? "text" : "pointer"}
          readOnly={!isOpen}
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.select(), 0);
          }}
        />
        <Box
          position="absolute"
          right={3}
          top="50%"
          transform={`translateY(-50%) rotate(${isOpen ? "180deg" : "0deg"})`}
          transition="transform 0.2s"
          pointerEvents="none"
          color="gray.400"
          fontSize="xs"
        >
          ▼
        </Box>
      </InputGroup>

      {/* Dropdown */}
      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 6px)"
          left={0}
          right={0}
          bg="white"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="0 8px 30px rgba(0,0,0,0.12)"
          zIndex={1000}
          overflow="hidden"
        >
          {/* Search hint */}
          {query && (
            <Box
              px={4}
              py={2}
              borderBottomWidth="1px"
              borderColor="gray.100"
              bg="blue.50"
            >
              <Text fontSize="xs" color="blue.600">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "
                {query}"
              </Text>
            </Box>
          )}

          <List
            ref={listRef}
            maxH="240px"
            overflowY="auto"
            py={1}
            css={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                background: "#CBD5E0",
                borderRadius: "4px",
              },
            }}
          >
            {filtered.length === 0 ? (
              <ListItem px={4} py={3}>
                <Text fontSize="sm" color="gray.400">
                  No countries found
                </Text>
              </ListItem>
            ) : (
              filtered.map(([code, name], i) => {
                const isActive = value === code;
                const isHigh = i === highlighted;
                return (
                  <ListItem
                    key={code}
                    px={4}
                    py={2.5}
                    cursor="pointer"
                    bg={isHigh ? "blue.50" : isActive ? "blue.50" : "white"}
                    color={isActive ? "blue.700" : "gray.700"}
                    fontWeight={isActive ? "600" : "400"}
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => selectCountry(code, name)}
                    _hover={{ bg: "blue.50" }}
                    transition="background 0.1s"
                  >
                    <Text>{name}</Text>
                    <Text fontSize="xs" color="gray.400" fontFamily="mono">
                      {code}
                      {isActive && (
                        <Text as="span" ml={2} color="blue.500">
                          ✓
                        </Text>
                      )}
                    </Text>
                  </ListItem>
                );
              })
            )}
          </List>
        </Box>
      )}
    </Box>
  );
};

/* ─── Contact ─────────────────────────────────────────────────────────────── */

export default function Contact() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { loading, success, error } = useSelector(
    (state) => state.contact || {},
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("IN");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (success) {
      toast({
        title: "Message sent!",
        description: "We'll get back to you shortly.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setName("");
      setEmail("");
      setCountry("IN");
      setSubject("");
      setMessage("");
      dispatch(clearContactState());
    }
  }, [success, toast, dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: error,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      dispatch(clearContactState());
    }
  }, [error, toast, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !country || !subject || !message) {
      toast({
        title: "All fields are required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    await dispatch(
      submitContactMessage({ name, email, country, subject, message }),
    ).unwrap();
  };

  const selectedSubjectLabel =
    SUBJECTS.find(([val]) => val === subject)?.[1] || "";

  return (
    <Box
      maxW="1100px"
      mx="auto"
      py={{ base: 10, md: 16 }}
      px={{ base: 4, md: 8 }}
      fontFamily="body"
    >
      {/* ── Page header ── */}
      <Box mb={12} maxW="600px">
        <Text
          fontSize="xs"
          fontWeight="700"
          letterSpacing="0.15em"
          textTransform="uppercase"
          color="brand.500"
          mb={2}
        >
          Get in Touch
        </Text>
        <Heading
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="800"
          color="neutral.900"
          lineHeight="1.1"
          mb={4}
          fontFamily="heading"
        >
          We'd love to hear from you
        </Heading>
        <Text color="gray.500" fontSize="lg" lineHeight="1.7">
          Have a question about an order, a custom piece, or want to explore a
          partnership? Send us a message and our team will respond promptly.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={10} alignItems="flex-start">
        {/* ── Left: office map + info cards ── */}
        <Stack spacing={5}>
          <Box
            p={5}
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="gray.100"
            boxShadow="sm"
          >
            <Text fontSize="xs" fontWeight="700" color="brand.500" mb={3}>
              OUR OFFICE
            </Text>
            <Box borderRadius="xl" overflow="hidden" h="220px" mb={4}>
              <iframe
                title="Nikhil Framing Office Location"
                src="https://www.google.com/maps?q=Nikhil%20framing%20Main%20road%20near%20canra%20bank%20hinganghat%20maharastra%20442301&z=14&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
            <Text fontWeight="700" fontSize="sm" color="gray.800" mb={1}>
              Nikhil Framing
            </Text>
            <Text fontSize="sm" color="gray.600" lineHeight="1.7">
              Main road, near Canra Bank
              <br />
              Hinganghat, Maharashtra
              <br />
              Pin No. 442301
            </Text>
          </Box>

          {[
            {
              icon: "📦",
              title: "Orders & Shipping",
              desc: "Track your order, report issues, or ask about delivery timelines.",
              subject: "shipping_query",
            },
            {
              icon: "🖼️",
              title: "Custom Artwork",
              desc: "Interested in a bespoke framed piece or bulk gifting? Let's talk.",
              subject: "custom_gifting",
            },
            {
              icon: "🤝",
              title: "Partnerships",
              desc: "Wholesale, collaborations, or brand partnerships — we're open to ideas.",
              subject: "partnership",
            },
          ].map((card) => (
            <Box
              key={card.title}
              p={5}
              bg="white"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="gray.100"
              boxShadow="sm"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                borderColor: "brand.200",
                boxShadow: "0 4px 16px rgba(89,8,84,0.12)",
              }}
              onClick={() => setSubject(card.subject)}
            >
              <Text fontSize="2xl" mb={2}>
                {card.icon}
              </Text>
              <Text fontWeight="700" fontSize="sm" color="gray.800" mb={1}>
                {card.title}
              </Text>
              <Text fontSize="xs" color="gray.500" lineHeight="1.6">
                {card.desc}
              </Text>
            </Box>
          ))}
        </Stack>

        {/* ── Right: form (spans 2 cols) ── */}
        <Box
          gridColumn={{ lg: "span 2" }}
          bg="white"
          borderRadius="2xl"
          borderWidth="1px"
          borderColor="gray.100"
          boxShadow="sm"
          p={{ base: 6, md: 8 }}
        >
          <Heading size="md" mb={1} color="gray.800" fontFamily="heading">
            Send a message
          </Heading>
          <Text fontSize="sm" color="gray.400" mb={7}>
            All fields are required.
          </Text>

          <Box as="form" onSubmit={handleSubmit}>
            <Stack spacing={5}>
              {/* Name + Email */}
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.600">
                    Your Name
                  </FormLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    borderRadius="xl"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px rgba(89,8,84,0.2)",
                    }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.600">
                    Email Address
                  </FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    borderRadius="xl"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px rgba(89,8,84,0.2)",
                    }}
                  />
                </FormControl>
              </SimpleGrid>

              {/* Country */}
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.600">
                  Country
                </FormLabel>
                <SearchableCountrySelect
                  value={country}
                  onChange={setCountry}
                  isRequired
                />
              </FormControl>

              {/* Subject */}
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.600">
                  Subject
                </FormLabel>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} gap={2}>
                  {SUBJECTS.map(([val, label]) => {
                    const isSelected = subject === val;
                    return (
                      <Button
                        key={val}
                        type="button"
                        onClick={() => setSubject(val)}
                        variant={isSelected ? "solid" : "outline"}
                        size="sm"
                        borderRadius="xl"
                        fontWeight={isSelected ? "700" : "500"}
                        fontSize="xs"
                        px={3}
                        py={2.5}
                        h="auto"
                        minH="42px"
                      >
                        {label}
                      </Button>
                    );
                  })}
                </SimpleGrid>
                {/* Hidden indicator for required validation */}
                {!subject && (
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    Select a subject above
                  </Text>
                )}
              </FormControl>

              {/* Message */}
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.600">
                  Message
                </FormLabel>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can help…"
                  minH="150px"
                  borderRadius="xl"
                  borderColor="gray.200"
                  fontSize="sm"
                  resize="vertical"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{
                    borderColor: "brand.500",
                    boxShadow: "0 0 0 1px rgba(89,8,84,0.2)",
                  }}
                />
                <Text fontSize="xs" color="gray.400" mt={1} textAlign="right">
                  {message.length} characters
                </Text>
              </FormControl>

              {/* Summary strip */}
              {(name || email || country || subject) && (
                <Box
                  p={4}
                  bg="gray.50"
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor="gray.200"
                  fontSize="xs"
                  color="gray.500"
                >
                  <Text fontWeight="600" color="gray.600" mb={1}>
                    Your submission:
                  </Text>
                  <Text>
                    {name || "—"} · {email || "—"} ·{" "}
                    {COUNTRIES.find(([c]) => c === country)?.[1] || country} ·{" "}
                    {selectedSubjectLabel || "No subject selected"}
                  </Text>
                </Box>
              )}

              {/* Submit */}
              <Button
                type="submit"
                variant="solid"
                size="lg"
                borderRadius="xl"
                isLoading={loading}
                loadingText="Sending…"
                isDisabled={!name || !email || !country || !subject || !message}
                fontWeight="700"
                letterSpacing="0.02em"
              >
                Send Message →
              </Button>
            </Stack>
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
