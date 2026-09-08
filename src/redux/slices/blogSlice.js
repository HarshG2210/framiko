import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import blogApi from "../../services/api/blogApi";
import { toast } from "react-toastify";

export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const data = await blogApi.getBlogs();
      return data;
    } catch (error) {
      const message = error?.message || "Failed to fetch blogs";
      return rejectWithValue(message);
    }
  }
);

export const fetchBlog = createAsyncThunk(
  "blog/fetchBlog",
  async (id, { rejectWithValue }) => {
    try {
      const data = await blogApi.getBlog(id);
      return data;
    } catch (error) {
      const message = error?.message || "Failed to fetch blog";
      return rejectWithValue(message);
    }
  }
);

export const postBlog = createAsyncThunk(
  "blog/postBlog",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await blogApi.postBlog(formData);
      toast.success(data?.message || "Blog created successfully");
      return data;
    } catch (error) {
      const message = error?.message || "Failed to post blog";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const postBlogComment = createAsyncThunk(
  "blog/postBlogComment",
  async ({ blogId, comment }, { rejectWithValue }) => {
    try {
      const data = await blogApi.postComment(blogId, { content: comment });
      toast.success(data?.message || "Comment submitted");
      return data;
    } catch (error) {
      const message = error?.message || "Failed to post comment";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const likeBlog = createAsyncThunk(
  "blog/likeBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      const data = await blogApi.likeBlog(blogId);
      toast.success(data?.message || "Blog liked");
      return data;
    } catch (error) {
      const message = error?.message || "Failed to like blog";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    item: null,
    posts: [],
    loading: false,
    error: null,
    commentSuccess: false,
    likeSuccess: false,
  },
  reducers: {
    clearBlogError: (state) => {
      state.error = null;
      state.commentSuccess = false;
      state.likeSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload?.results ?? action.payload ?? [];
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload?.data ?? action.payload;
      })
      .addCase(fetchBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(postBlogComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.commentSuccess = false;
      })
      .addCase(postBlogComment.fulfilled, (state, action) => {
        state.loading = false;
        state.commentSuccess = true;
        const comment = action.payload?.data ?? action.payload;
        if (comment && state.item?.comments) {
          state.item.comments.push(comment);
        }
      })
      .addCase(postBlogComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(likeBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.likeSuccess = false;
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.likeSuccess = true;
        if (state.item) {
          state.item.likes_count = (state.item.likes_count || 0) + 1;
        }
      })
      .addCase(likeBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBlogError } = blogSlice.actions;
export default blogSlice.reducer;
