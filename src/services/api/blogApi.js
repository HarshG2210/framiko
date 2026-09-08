import { adminApi, publicApi, userApi } from "./axiosInstance";

const resolvePayload = (payload) => {
  if (payload && typeof payload === "object" && payload.data !== undefined) {
    return payload.data;
  }
  return payload;
};

export const blogApi = {
  getBlogs: () => publicApi.get("/blogs/").then(resolvePayload),
  getBlog: (id) => publicApi.get(`/blogs/${id}/`).then(resolvePayload),
  postBlog: (formData) =>
    adminApi
      .post("/blogs/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(resolvePayload),
  postComment: (blogId, data) =>
    userApi.post(`/blogs/${blogId}/comments/`, data).then(resolvePayload),
  likeBlog: (blogId) => userApi.post(`/blogs/${blogId}/like/`, {}).then(resolvePayload),
};

export default blogApi;
