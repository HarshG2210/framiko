import { publicApi } from "./axiosInstance";

export const newsletterApi = {
  subscribe: (data) => publicApi.post("/api/newsletter/subscribe/", data),
};
