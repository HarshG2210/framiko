import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
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
  const [paragraph1, setParagraph1] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (error) {
      toast({ title: error, status: "error", duration: 4000 });
    }
  }, [error, toast]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !paragraph1.trim() || !image) {
      toast({
        title: "Please fill in the title, paragraph, and image",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("paragraph1", paragraph1.trim());
    formData.append("image", image);

    try {
      await dispatch(postBlog(formData)).unwrap();
      toast({
        title: "Blog post submitted",
        status: "success",
        duration: 3000,
      });
      setTitle("");
      setParagraph1("");
      setImage(null);
      const input = document.getElementById("blog-image");
      if (input) input.value = "";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminPage
      title="Blog Posts"
      description="Create and publish blog content for your storefront."
    >
      <Box as="form" onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog title"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Paragraph</FormLabel>
            <Textarea
              value={paragraph1}
              onChange={(e) => setParagraph1(e.target.value)}
              placeholder={`Your introduction goes here.

**1. First section heading**
Section content goes here.

**2. Second section heading**
More content goes here.`}
              minH="360px"
            />
            <FormHelperText>
              Keep blank lines between paragraphs. Wrap bold text in double
              asterisks, for example: **1. Create a Statement Wall**.
            </FormHelperText>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Image</FormLabel>
            <Input
              type="file"
              accept="image/*"
              id="blog-image"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText="Publishing..."
          >
            Publish Blog
          </Button>
        </Stack>
      </Box>
    </AdminPage>
  );
};

export default PostBlogs;
