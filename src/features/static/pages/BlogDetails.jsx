import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FaHeart, FaRegComment } from "react-icons/fa";
import {
  fetchBlog,
  fetchBlogs,
  likeBlog,
  postBlogComment,
} from "../../../redux/slices/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const getYouTubeEmbed = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/\s"]+)/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const fmtDate = (val) =>
  val
    ? new Date(val).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

const fmtDateTime = (val) =>
  val
    ? new Date(val).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

/* Category badge color map */
const categoryColor = (cat = "") => {
  const c = cat.toLowerCase();
  if (c.includes("travel")) return { bg: "blue.50", color: "blue.600" };
  if (c.includes("dev") || c.includes("tech"))
    return { bg: "teal.50", color: "teal.600" };
  if (c.includes("sport")) return { bg: "red.50", color: "red.500" };
  if (c.includes("food")) return { bg: "orange.50", color: "orange.600" };
  return { bg: "beige.50", color: "beige.500" };
};

/* ─── ImageLightbox ───────────────────────────────────────────────────────── */

const ImageLightbox = ({ images, initialIdx = 0, isOpen, onClose }) => {
  const [idx, setIdx] = useState(initialIdx);

  useEffect(() => {
    setIdx(initialIdx);
  }, [initialIdx]);

  if (!images.length) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered>
      <ModalOverlay bg="blackAlpha.900" />
      <ModalContent bg="transparent" boxShadow="none">
        <ModalCloseButton color="white" zIndex={10} />
        <ModalBody p={0}>
          <Flex direction="column" align="center" gap={4} py={8}>
            <Box
              maxH="72vh"
              maxW="100%"
              overflow="hidden"
              borderRadius="xl"
              bg="blackAlpha.500"
            >
              <Image
                src={images[idx]}
                alt={`Image ${idx + 1}`}
                maxH="72vh"
                maxW="90vw"
                objectFit="contain"
              />
            </Box>
            <Text color="whiteAlpha.700" fontSize="sm">
              {idx + 1} / {images.length}
            </Text>
            {images.length > 1 && (
              <Flex gap={2} align="center">
                <Button
                  size="sm"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  onClick={() =>
                    setIdx((i) => (i - 1 + images.length) % images.length)
                  }
                >
                  ←
                </Button>
                {images.map((src, i) => (
                  <Box
                    key={i}
                    as="button"
                    onClick={() => setIdx(i)}
                    w="52px"
                    h="52px"
                    borderRadius="md"
                    overflow="hidden"
                    borderWidth="2px"
                    borderColor={i === idx ? "#C9AB7E" : "transparent"}
                    opacity={i === idx ? 1 : 0.55}
                    transition="all 0.15s"
                    _hover={{ opacity: 1 }}
                  >
                    <Image
                      src={src}
                      alt={`thumb ${i + 1}`}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  </Box>
                ))}
                <Button
                  size="sm"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  onClick={() => setIdx((i) => (i + 1) % images.length)}
                >
                  →
                </Button>
              </Flex>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

/* ─── ImageGrid ───────────────────────────────────────────────────────────── */

const ImageGrid = ({ images }) => {
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openAt = (i) => {
    setLightboxIdx(i);
    onOpen();
  };

  if (!images.length) return null;

  const [first, ...rest] = images;

  return (
    <>
      <Box>
        {images.length === 1 ? (
          <Box
            borderRadius="2xl"
            overflow="hidden"
            cursor="zoom-in"
            onClick={() => openAt(0)}
          >
            <Image
              src={first}
              alt="Blog image"
              w="100%"
              maxH="520px"
              objectFit="cover"
              transition="transform 0.3s"
              _hover={{ transform: "scale(1.01)" }}
            />
          </Box>
        ) : (
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
            <Box
              gridColumn={{ md: images.length >= 3 ? "1" : "span 1" }}
              gridRow={{ md: images.length >= 3 ? "span 2" : "1" }}
              borderRadius="2xl"
              overflow="hidden"
              cursor="zoom-in"
              onClick={() => openAt(0)}
              h={{ base: "260px", md: images.length >= 3 ? "420px" : "280px" }}
            >
              <Image
                src={first}
                alt="Blog image 1"
                w="100%"
                h="100%"
                objectFit="cover"
                transition="transform 0.3s"
                _hover={{ transform: "scale(1.02)" }}
              />
            </Box>
            {rest.map((src, i) => (
              <Box
                key={i}
                borderRadius="2xl"
                overflow="hidden"
                cursor="zoom-in"
                onClick={() => openAt(i + 1)}
                position="relative"
                h={{ base: "200px", md: "200px" }}
              >
                <Image
                  src={src}
                  alt={`Blog image ${i + 2}`}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  transition="transform 0.3s"
                  _hover={{ transform: "scale(1.02)" }}
                />
                {i === 3 && images.length > 5 && (
                  <Flex
                    position="absolute"
                    inset={0}
                    bg="blackAlpha.600"
                    align="center"
                    justify="center"
                    borderRadius="2xl"
                  >
                    <Text color="white" fontWeight="700" fontSize="xl">
                      +{images.length - 4} more
                    </Text>
                  </Flex>
                )}
              </Box>
            ))}
          </Grid>
        )}
      </Box>
      <ImageLightbox
        images={images}
        initialIdx={lightboxIdx}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

/* ─── CommentCard ─────────────────────────────────────────────────────────── */

const CommentCard = ({ comment }) => {
  const author =
    comment.user?.username ||
    comment.author?.username ||
    comment.username ||
    "Guest";
  const body =
    comment.content || comment.body || comment.comment || "No comment text.";
  const date = fmtDateTime(comment.created_at);

  return (
    <Flex gap={4} align="flex-start">
      <Avatar
        size="sm"
        name={author}
        bg="brand.500"
        color="white"
        fontWeight="700"
        flexShrink={0}
      />
      <Box flex={1}>
        <Flex align="baseline" gap={2} mb={1} flexWrap="wrap">
          <Text fontWeight="600" fontSize="sm" color="neutral.900">
            {author}
          </Text>
          {date && <Text fontSize="xs" color="gray.400">{date}</Text>}
        </Flex>
        <Box bg="beige.50" borderRadius="xl" px={4} py={3}>
          <Text fontSize="sm" color="gray.700" lineHeight="1.7">
            {body}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

/* ─── PopularPostCard ──────────────────────────────────────────────────────── */

const PopularPostCard = ({ post }) => {
  const cover =
    Array.isArray(post.images) && post.images[0]
      ? post.images[0]
      : post.image1 || null;
  const date = fmtDate(post.created_at);
  const category = post.category || post.tags?.[0] || "";
  const catStyle = categoryColor(category);
  const excerpt =
    post.excerpt ||
    (Array.isArray(post.paragraphs) ? post.paragraphs[0] : null) ||
    post.paragraph1 ||
    "";
  const short = excerpt.length > 100 ? excerpt.slice(0, 100) + "…" : excerpt;

  return (
    <Link to={`/blog/${post.id}`} style={{ display: "block" }}>
      <Box
        bg="white"
        transition="all 0.25s ease"
        _hover={{ transform: "translateY(-3px)" }}
      >
        {/* Image */}
        <Box h="180px" borderRadius="lg" overflow="hidden" bg="neutral.100" mb={3}>
          {cover ? (
            <Image
              src={cover}
              alt={post.title}
              w="100%"
              h="100%"
              objectFit="cover"
              transition="transform 0.4s ease"
              _hover={{ transform: "scale(1.04)" }}
            />
          ) : (
            <Flex h="100%" align="center" justify="center" bg="beige.50">
              <Text fontSize="2xl">🖼️</Text>
            </Flex>
          )}
        </Box>

        {/* Category + date */}
        <Flex align="center" gap={2} mb={2} flexWrap="wrap">
          {category && (
            <Box
              px={2}
              py={0.5}
              borderRadius="md"
              bg={catStyle.bg}
              fontSize="9px"
              fontWeight="700"
              color={catStyle.color}
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              {category}
            </Box>
          )}
          {date && <Text fontSize="10px" color="gray.400">{date}</Text>}
        </Flex>

        {/* Title */}
        <Text
          fontSize="sm"
          fontWeight="700"
          color="neutral.900"
          lineHeight="1.4"
          mb={1.5}
          noOfLines={2}
          fontFamily="heading"
        >
          {post.title}
        </Text>

        {/* Excerpt */}
        {short && (
          <Text
            fontSize="xs"
            color="gray.500"
            lineHeight="1.7"
            fontFamily="'Inter', sans-serif"
            noOfLines={3}
            mb={2}
          >
            {short}
          </Text>
        )}

        {/* Read more */}
        <Text fontSize="xs" fontWeight="600" color="brand.500">
          Read More...
        </Text>
      </Box>
    </Link>
  );
};

/* ─── BlogDetails ─────────────────────────────────────────────────────────── */

export default function BlogDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { item, posts, loading, error } = useSelector(
    (state) => state.blog || {},
  );
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchBlog(id));
    dispatch(fetchBlogs());
  }, [dispatch, id]);

  const paragraphs = useMemo(() => {
    if (!item) return [];
    if (Array.isArray(item.paragraphs) && item.paragraphs.length > 0)
      return item.paragraphs.filter(Boolean);
    return Array.from(
      { length: 20 },
      (_, i) => item[`paragraph${i + 1}`],
    ).filter(Boolean);
  }, [item]);

  const images = useMemo(() => {
    if (!item) return [];
    if (Array.isArray(item.images) && item.images.length > 0)
      return item.images.filter(Boolean);
    return Array.from({ length: 5 }, (_, i) => item[`image${i + 1}`]).filter(
      Boolean,
    );
  }, [item]);

  /* Cover = first image */
  const coverImage = images[0] || null;
  const bodyImages = images.slice(1);

  const embedUrl = getYouTubeEmbed(item?.video_link);
  const date = fmtDate(item?.created_at);
  const updatedDate = fmtDate(item?.updated_at);
  const author = item?.author?.username || item?.author?.name || "Admin";
  const category = item?.category || item?.tags?.[0] || "";
  const catStyle = categoryColor(category);

  /* Popular posts = other posts excluding current */
  const popularPosts = useMemo(() => {
    const safe = Array.isArray(posts) ? posts : [];
    return safe.filter((p) => String(p.id) !== String(id)).slice(0, 3);
  }, [posts, id]);

  const handleLike = async () => {
    try {
      await dispatch(likeBlog(id)).unwrap();
      dispatch(fetchBlog(id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async () => {
    const trimmed = commentInput?.trim();
    if (!trimmed) return;
    try {
      await dispatch(
        postBlogComment({ blogId: id, comment: trimmed }),
      ).unwrap();
      setCommentInput("");
      dispatch(fetchBlog(id));
    } catch (err) {
      console.error(err);
    }
  };

  /* ── loading / error / empty ── */
  if (loading) {
    return (
      <Flex justify="center" align="center" py={24}>
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box maxW="600px" mx="auto" py={20} px={6} textAlign="center">
        <Text fontSize="3xl" mb={4}>
          😕
        </Text>
        <Text fontWeight="700" fontSize="xl" mb={2} color="neutral.900">
          Something went wrong
        </Text>
        <Text color="red.500" mb={6}>
          {error}
        </Text>
        <Button as={Link} to="/blog" variant="solid" borderRadius="full">
          ← Back to Blog
        </Button>
      </Box>
    );
  }

  if (!item) {
    return (
      <Box maxW="600px" mx="auto" py={20} px={6} textAlign="center">
        <Text fontSize="3xl" mb={4}>
          📄
        </Text>
        <Text fontWeight="700" fontSize="xl" color="gray.500" mb={4}>
          No blog post found
        </Text>
        <Button as={Link} to="/blog" variant="solid" borderRadius="full">
          ← Back to Blog
        </Button>
      </Box>
    );
  }

  return (
    <Box bg="white" w="full">
      <Box
        maxW="860px"
        mx="auto"
        py={{ base: 8, md: 14 }}
        px={{ base: 4, md: 8 }}
      >
        {/* ── BACK NAV ── */}
        <Box mb={6}>
          <Button
            as={Link}
            to="/blog"
            variant="ghost"
            size="sm"
            color="gray.400"
            pl={0}
            _hover={{ color: "brand.500", bg: "transparent" }}
          >
            ← Back to Blog
          </Button>
        </Box>

        {/* ── ARTICLE HEADER ── */}
        <Box mb={7}>
          {/* Category + date eyebrow */}
          <Flex align="center" gap={3} mb={4} flexWrap="wrap">
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
                letterSpacing="0.06em"
              >
                {category}
              </Box>
            )}
            {date && <Text fontSize="xs" color="gray.400">{date}</Text>}
            {updatedDate && updatedDate !== date && (
              <Text fontSize="xs" color="gray.400">
                · Updated {updatedDate}
              </Text>
            )}
          </Flex>

          {/* Title */}
          <Text
            as="h1"
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="800"
            lineHeight="1.15"
            color="neutral.900"
            mb={item.subtitle ? 3 : 0}
            fontFamily="heading"
            letterSpacing="-0.01em"
          >
            {item.title || "Blog Post"}
          </Text>

          {/* Subtitle */}
          {item.subtitle && (
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="gray.500"
              fontStyle="italic"
              lineHeight="1.6"
            >
              {item.subtitle}
            </Text>
          )}
        </Box>

        {/* ── HERO IMAGE ── */}
        {coverImage && (
          <Box mb={8} borderRadius="2xl" overflow="hidden">
            <Image
              src={coverImage}
              alt={item.title}
              w="100%"
              maxH="460px"
              objectFit="cover"
            />
          </Box>
        )}

        {/* ── STATS ROW (subtle) ── */}
        <Flex gap={5} mb={8} flexWrap="wrap">
          <Flex align="center" gap={1.5}>
            <FaHeart color="#FC8181" size={13} />
            <Text fontSize="sm" color="gray.400">
              {item.likes_count ?? 0} like{item.likes_count !== 1 ? "s" : ""}
            </Text>
          </Flex>
          <Flex align="center" gap={1.5}>
            <FaRegComment color="#A0AEC0" size={13} />
            <Text fontSize="sm" color="gray.400">
              {item.comments?.length ?? 0} comment
              {item.comments?.length !== 1 ? "s" : ""}
            </Text>
          </Flex>
          {paragraphs.length > 0 && (
            <Text fontSize="sm" color="gray.400">
              {paragraphs.length} section{paragraphs.length !== 1 ? "s" : ""}
            </Text>
          )}
        </Flex>

        {/* ── BODY PARAGRAPHS ── */}
        {paragraphs.length > 0 && (
          <VStack align="stretch" spacing={5} mb={10}>
            {paragraphs.map((para, i) => {
              /* Detect blockquote — paragraph starting with " or ' */
              const isQuote = /^["'"'']/.test(para.trim());
              if (isQuote) {
                /* Split off attribution if last line starts with — or - */
                const lines = para.split("\n");
                const lastLine = lines[lines.length - 1]?.trim();
                const isAttrib = /^[—–-]/.test(lastLine);
                const quoteText = isAttrib
                  ? lines.slice(0, -1).join("\n")
                  : para;
                const attrib = isAttrib ? lastLine : null;

                return (
                  <Box
                    key={i}
                    borderLeft="4px solid #C9AB7E"
                    pl={6}
                    py={2}
                    my={2}
                  >
                    <Text
                      fontSize={{ base: "md", md: "lg" }}
                      lineHeight="1.85"
                      color="neutral.900"
                      fontStyle="italic"
                      fontWeight="500"
                    >
                      {quoteText}
                    </Text>
                    {attrib && (
                      <Text fontSize="sm" color="gray.400" mt={2}>
                        {attrib}
                      </Text>
                    )}
                  </Box>
                );
              }

              return (
                <Text
                  key={i}
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.85"
                  color="gray.700"
                >
                  {para}
                </Text>
              );
            })}
          </VStack>
        )}

        {/* ── ADDITIONAL IMAGES (after paragraphs) ── */}
        {bodyImages.length > 0 && (
          <Box mb={10}>
            <ImageGrid images={bodyImages} />
          </Box>
        )}

        {/* ── YOUTUBE VIDEO ── */}
        {embedUrl && (
          <Box mb={10}>
            <Text
              fontSize="xs"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.12em"
              color="red.500"
              mb={4}
            >
              ▶ Video
            </Text>
            <Box
              borderRadius="2xl"
              overflow="hidden"
              h={{ base: "220px", sm: "300px", md: "420px" }}
              bg="black"
            >
              <iframe
                title="Blog video"
                width="100%"
                height="100%"
                src={embedUrl}
                allowFullScreen
                frameBorder="0"
              />
            </Box>
            {item.video_link && (
              <Text fontSize="xs" color="gray.400" mt={2} textAlign="right">
                Source:{" "}
                <a
                  href={item.video_link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  {item.video_link}
                </a>
              </Text>
            )}
          </Box>
        )}

        {/* ── METADATA FOOTER ── */}
        <Box p={6} bg="#F7F5F1" borderRadius="2xl" mb={10}>
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={5}>
            {[
              {
                label: "Author",
                value:
                  author +
                  (item.author?.email ? ` · ${item.author.email}` : ""),
              },
              { label: "Published", value: date || "—" },
              updatedDate
                ? { label: "Last Updated", value: updatedDate }
                : null,
              { label: "Post ID", value: `#${item.id}` },
            ]
              .filter(Boolean)
              .map(({ label, value }) => (
                <Box key={label}>
                  <Text
                    fontSize="xs"
                    color="gray.400"
                    mb={0.5}
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.08em"
                  >
                    {label}
                  </Text>
                  <Text fontSize="sm" fontWeight="500" color="neutral.900">
                    {value}
                  </Text>
                </Box>
              ))}
          </Grid>
        </Box>

        {/* ── ENGAGEMENT BAR ── */}
        <Flex
          align="center"
          gap={3}
          mb={10}
          p={5}
          bg="#F7F5F1"
          borderRadius="2xl"
        >
          <Button
            leftIcon={<FaHeart />}
            variant="solid"
            borderRadius="full"
            onClick={handleLike}
          >
            {item.likes_count ?? 0} Like{item.likes_count !== 1 ? "s" : ""}
          </Button>
          <Button
            leftIcon={<FaRegComment />}
            variant="outline"
            borderRadius="full"
            onClick={() =>
              document.getElementById("blog-comment-input")?.focus()
            }
          >
            {item.comments?.length ?? 0} Comment
            {item.comments?.length !== 1 ? "s" : ""}
          </Button>
        </Flex>

        <Divider borderColor="#E0DEDA" mb={10} />

        {/* ── LEAVE A COMMENT ── */}
        <Box mb={10}>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="700"
            color="neutral.900"
            letterSpacing="0.04em"
            mb={1}
            fontFamily="heading"
          >
            Leave a comment
          </Text>
          <Text fontSize="sm" color="gray.400" mb={5}>
            Your thoughts on this article…
          </Text>
          <FormControl>
            <Textarea
              id="blog-comment-input"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write your comment here…"
              minH="130px"
              borderRadius="xl"
              fontSize="sm"
              bg="beige.50"
              border="1.5px solid"
              borderColor="neutral.200"
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px rgba(89,8,84,0.2)",
                bg: "white",
              }}
              _placeholder={{ color: "gray.400" }}
            />
          </FormControl>
          <Button
            mt={4}
            variant="solid"
            borderRadius="full"
            px={8}
            onClick={handleComment}
            isLoading={loading}
            isDisabled={!commentInput.trim()}
          >
            Post Comment
          </Button>
        </Box>

        {/* ── COMMENTS LIST ── */}
        {(item.comments?.length ?? 0) > 0 && (
          <Box mb={14}>
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="700"
              color="neutral.900"
              letterSpacing="0.04em"
              mb={6}
              fontFamily="heading"
            >
              {item.comments.length} Comment
              {item.comments.length !== 1 ? "s" : ""}
            </Text>
            <Stack spacing={5}>
              {item.comments.map((comment, i) => (
                <CommentCard key={comment.id ?? i} comment={comment} />
              ))}
            </Stack>
          </Box>
        )}

        {/* ── POPULAR POSTS ── */}
        {popularPosts.length > 0 && (
          <Box>
            <Divider borderColor="#E0DEDA" mb={10} />

            <Flex align="center" justify="space-between" mb={8}>
              <Text
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="700"
                color="neutral.900"
                letterSpacing="0.04em"
                fontFamily="heading"
              >
                Popular Post
              </Text>
              <Button as={Link} to="/blog" size="sm" variant="brand" borderRadius="full" fontSize="xs" px={5}>
                View All
              </Button>
            </Flex>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
            >
              {popularPosts.map((post) => (
                <GridItem key={post.id}>
                  <PopularPostCard post={post} />
                </GridItem>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
}
