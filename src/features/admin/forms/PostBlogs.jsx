import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { AdminPage } from "../../../layout/AdminUI";
import { postBlog } from "../../../redux/slices/blogSlice";

const PostBlogs = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { loading, error } = useSelector((state) => state.blog || {});

  const [title, setTitle] = useState("");
  const [paragraphs, setParagraphs] = useState(Array.from({ length: 20 }, () => ""));
  const [videoLink, setVideoLink] = useState("");
  const [images, setImages] = useState(Array.from({ length: 5 }, () => null));

  useEffect(() => {
    if (error) {
      toast({ title: error, status: "error", duration: 4000 });
    }
  }, [error, toast]);

  const handleParagraphChange = (index, value) => {
    setParagraphs((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleImageChange = (index, file) => {
    setImages((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !paragraphs[0]?.trim()) {
      toast({ title: "Please fill in title and first paragraph", status: "warning", duration: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    paragraphs.forEach((paragraph, index) => {
      if (paragraph?.trim()) {
        formData.append(`paragraph${index + 1}`, paragraph.trim());
      }
    });
    if (videoLink) {
      formData.append("video_link", videoLink);
    }

    images.forEach((image, index) => {
      if (image) {
        formData.append(`image${index + 1}`, image);
      }
    });

    try {
      await dispatch(postBlog(formData)).unwrap();
      toast({ title: "Blog post submitted", status: "success", duration: 3000 });
      setTitle("");
      setParagraphs(Array.from({ length: 20 }, () => ""));
      setVideoLink("");
      setImages(Array.from({ length: 5 }, () => null));
      for (let i = 1; i <= 5; i += 1) {
        const input = document.getElementById(`blog-image-${i}`);
        if (input) input.value = "";
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminPage title="Blog Posts" description="Create and publish blog content for your storefront.">
      <Box as="form" onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blog title" />
          </FormControl>

          {paragraphs.map((value, index) => (
            <FormControl key={index} isRequired={index === 0}>
              <FormLabel>{`Paragraph ${index + 1}`}</FormLabel>
              <Textarea
                value={value}
                onChange={(e) => handleParagraphChange(index, e.target.value)}
                placeholder={`Paragraph ${index + 1} content`}
                minH="120px"
              />
            </FormControl>
          ))}

          <FormControl>
            <FormLabel>Video Link</FormLabel>
            <Input
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="https://youtu.be/..."
            />
          </FormControl>

          {images.map((_, index) => (
            <FormControl key={index}>
              <FormLabel>{`Image ${index + 1}`}</FormLabel>
              <Input
                type="file"
                accept="image/*"
                id={`blog-image-${index + 1}`}
                onChange={(e) => handleImageChange(index, e.target.files?.[0] || null)}
              />
            </FormControl>
          ))}

          <Button type="submit" colorScheme="blue" isLoading={loading} loadingText="Publishing...">
            Publish Blog
          </Button>
        </Stack>
      </Box>
    </AdminPage>
  );
};

export default PostBlogs;
