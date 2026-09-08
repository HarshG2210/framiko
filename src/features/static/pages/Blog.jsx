import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { fetchBlogs } from "../../../redux/slices/blogSlice";
import { useEffect } from "react";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const fmtDate = (val) =>
  val
    ? new Date(val).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

const getExcerpt = (post) => {
  const raw =
    post.excerpt ||
    (Array.isArray(post.paragraphs) ? post.paragraphs[0] : null) ||
    post.paragraph1 ||
    "";
  return raw.length > 160 ? raw.slice(0, 160) + "…" : raw;
};

const getCover = (post) => {
  if (Array.isArray(post.images) && post.images[0]) return post.images[0];
  return post.image1 || null;
};

/* Category badge color map — matches the coloured labels in the screenshot */
const categoryColor = (cat = "") => {
  const c = cat.toLowerCase();
  if (c.includes("travel")) return { bg: "blue.50", color: "blue.600" };
  if (c.includes("dev") || c.includes("tech"))
    return { bg: "teal.50", color: "teal.600" };
  if (c.includes("sport")) return { bg: "red.50", color: "red.500" };
  if (c.includes("food")) return { bg: "orange.50", color: "orange.600" };
  if (c.includes("design") || c.includes("art"))
    return { bg: "purple.50", color: "purple.600" };
  return { bg: "beige.50", color: "beige.500" };
};

/* ─── BlogCard ─────────────────────────────────────────────────────────────── */

const BlogCard = ({ post }) => {
  const cover = getCover(post);
  const excerpt = getExcerpt(post);
  const date = fmtDate(post.created_at);
  // const author = post.author?.username || post.author?.name || "Admin";
  const category = post.category || post.tags?.[0] || "";
  const catStyle = categoryColor(category);

  return (
    <Link to={`/blog/${post.id}`} style={{ display: "block", height: "100%" }}>
      <Box
        bg="white"
        borderRadius="lg"
        overflow="hidden"
        border="1px solid"
        borderColor="neutral.200"
        h="100%"
        display="flex"
        flexDirection="column"
        transition="all 0.25s ease"
        fontFamily="body"
        _hover={{
          transform: "translateY(-4px)",
        }}
      >
        {/* Cover image */}
        <Box h="200px" bg="neutral.100" overflow="hidden" flexShrink={0}>
          {cover ? (
            <Image
              src={cover}
              alt={post.title}
              w="100%"
              h="100%"
              objectFit="cover"
              transition="transform 0.4s ease"
              _groupHover={{ transform: "scale(1.04)" }}
            />
          ) : (
            <Flex h="100%" align="center" justify="center" bg="beige.50">
              <Text fontSize="3xl">🖼️</Text>
            </Flex>
          )}
        </Box>

        {/* Content */}
        <Box p={5} flex={1} display="flex" flexDirection="column">
          {/* Category + Date */}
          <Flex align="center" gap={2} mb={3} flexWrap="wrap">
            {category && (
              <Box
                px={2.5}
                py={0.5}
                borderRadius="md"
                bg={catStyle.bg}
                fontSize="10px"
                fontWeight="700"
                color={catStyle.color}
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                {category}
              </Box>
            )}
            {date && <Text fontSize="xs" color="gray.400">{date}</Text>}
          </Flex>

          {/* Title */}
          <Text
            fontSize="md"
            fontWeight="700"
            color="neutral.900"
            lineHeight="1.4"
            mb={2}
            noOfLines={2}
            fontFamily="heading"
          >
            {post.title}
          </Text>

          {/* Excerpt */}
          {excerpt && (
            <Text
              fontSize="sm"
              color="gray.500"
              lineHeight="1.7"
              noOfLines={3}
              flex={1}
            >
              {excerpt}
            </Text>
          )}

          {/* Read More */}
          <Button
            as={Link}
            to={`/blog/${post.id}`}
            mt={4}
            size="sm"
            variant="ghost"
            alignSelf="flex-start"
            _hover={{ bg: "transparent", color: "brand.600" }}
          >
            Read More...
          </Button>
        </Box>
      </Box>
    </Link>
  );
};

/* ─── Blog Listing ─────────────────────────────────────────────────────────── */

export default function Blog() {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.blog || {});

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const safePosts = Array.isArray(posts) ? posts : [];

  if (loading) {
    return (
      <Flex justify="center" align="center" py={24}>
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  return (
    <Box bg="white" w="full" py={{ base: 12, md: 16 }}>
      <Box maxW="1200px" mx="auto" px={{ base: 6, md: 8 }}>
        {/* ── PAGE HEADER ── */}
        <Box textAlign="center" mb={12} fontFamily="body">
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.18em"
            textTransform="uppercase"
            color="brand.500"
            mb={3}
          >
            OUR BLOGS
          </Text>

          <Text
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="700"
            color="neutral.900"
            lineHeight="1.15"
            fontFamily="heading"
            letterSpacing="-0.01em"
            mb={4}
          >
            Find our all blogs from here
          </Text>

          <Text color="gray.500" fontSize="sm" maxW="520px" mx="auto" lineHeight="1.8">
            our blogs are written from well research research and well known
            writers editors so that we can provide you the best blogs and
            articles articles for you to read them all enjoy.
          </Text>
        </Box>

        {/* ── ERROR ── */}
        {error && (
          <Box
            mb={8}
            p={4}
            bg="red.50"
            borderRadius="xl"
            borderWidth="1px"
            borderColor="red.200"
          >
            <Text color="red.600" fontWeight="500">
              {error}
            </Text>
          </Box>
        )}

        {/* ── EMPTY STATE ── */}
        {safePosts.length === 0 && !loading ? (
          <Box p={16} bg="beige.50" borderRadius="2xl" textAlign="center">
            <Text fontSize="3xl" mb={3}>
              ✍️
            </Text>
            <Text fontWeight="600" color="gray.500" mb={1}>
              No posts yet
            </Text>
            <Text color="gray.400" fontSize="sm">
              Check back soon for new articles and stories.
            </Text>
          </Box>
        ) : (
          /* ── 3-COLUMN GRID — all posts equal, matching the screenshot ── */
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {safePosts.map((post) => (
              <GridItem key={post.id}>
                <BlogCard post={post} />
              </GridItem>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
