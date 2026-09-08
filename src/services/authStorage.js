// utils/authStorage.js
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

// Separate key for admin token so it doesn't conflict with normal user auth
const ADMIN_TOKEN_KEY = "admin_auth_token";

export const saveAuthData = ({ token, refreshToken }) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const loadAuthData = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  return { token, refreshToken };
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// ------- Admin-specific helpers -------

export const saveAdminToken = (token) => {
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }
};

export const loadAdminToken = () => {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const clearAdminToken = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};
