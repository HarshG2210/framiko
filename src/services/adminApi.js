import { API_BASE } from "../utils/constant";
import axios from "axios";
import { loadAdminToken } from "./authStorage";

const adminApi = axios.create({
  baseURL: API_BASE,
});

/* --------------------------------------------------
   Attach Admin Bearer Token Automatically
--------------------------------------------------- */
adminApi.interceptors.request.use(
  (config) => {
    const token = loadAdminToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default adminApi;
