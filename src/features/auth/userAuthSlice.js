import {
  clearAuthData,
  loadAuthData,
  saveAuthData,
} from "../../services/authStorage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_BASE } from "../../utils/constant";
import { toast } from "react-toastify";

export const signup = createAsyncThunk(
  "userAuth/signup",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}registration/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();
      console.log("result sign up -- ", result);

      if (!response.ok) {
        toast.error(result.error || "Signup failed", {
          position: "top-right",
          autoClose: 3000,
        });
        return rejectWithValue(result.error || "Signup failed");
      }

      toast.success(result.message, {
        position: "top-right",
        autoClose: 3000,
      });

      return result;
    } catch (err) {
      console.log("signup error", err);
      toast.error("Network error. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      return rejectWithValue("Network error");
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "userAuth/verifyOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}registration/verify-otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          otp: data.otp,
          otp_token: data.otp_token,
        }),
      });

      const result = await response.json();
      console.log("result verify otp -- ", result);

      if (!response.ok) {
        toast.error(result.error || "Invalid OTP", {
          position: "top-right",
          autoClose: 3000,
        });
        return rejectWithValue(result.error || "Invalid OTP");
      }
      toast.success(result.message, {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (err) {
      console.log("signup error", err);
      toast.error("Network error. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      return rejectWithValue("Network error");
    }
  }
);

export const resendOTP = createAsyncThunk(
  "userAuth/resendOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}registration/resend-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          otp_token: data.otp_token,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Invalid Resend OTP", {
          position: "top-right",
          autoClose: 3000,
        });
        return rejectWithValue(result.error || "Invalid Resend OTP");
      }
      toast.success(result.message, {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      console.log("resendOTP error", error);
    }
  }
);

export const login = createAsyncThunk(
  "userAuth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}registration/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();
      console.log("result login -- ", result);

      if (!response.ok) {
        toast.error(result.error || "login failed", {
          position: "top-right",
          autoClose: 3000,
        });
        return rejectWithValue(result.error || "login failed");
      }
      toast.success(result.message, {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      console.log("login error", error);
    }
  }
);

export const completeProfile = createAsyncThunk(
  "userAuth/completeProfile",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { userAuth } = getState();
      const response = await fetch(
        `${API_BASE}registration/profile/complete/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${userAuth.token}` },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Complete Profile failed", {
          position: "top-right",
          autoClose: 3000,
        });
        return rejectWithValue(result.error || "Complete Profile failed");
      }
      toast.success(result.message, {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      console.log("completeProfile error", error);
    }
  }
);

export const viewProfile = createAsyncThunk(
  "userAuth/viewProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { userAuth } = getState();

      if (!userAuth.token) {
        return;
      }

      const response = await fetch(`${API_BASE}registration/profile/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${userAuth.token}` },
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.detail || "View Profile failed", {
          position: "top-right",
          autoClose: 3000,
        });
        return rejectWithValue(result.detail || "View Profile failed");
      } else {
        toast.success(result.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }

      return result;
    } catch (error) {
      console.log("viewProfile error", error);
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

export const forgetPassword = createAsyncThunk(
  "userAuth/forgetPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}registration/forget-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Forget Password failed", {
          position: "top-right",
          autoClose: 3000,
        });
        return rejectWithValue(result.error || "Forget Password failed");
      }
      toast.success(result.message, {
        position: "top-right",
        autoClose: 3000,
      });
      return { success: true, otp_token: result.otp_token || null };
    } catch (error) {
      console.log("forgetPassword error", error);
    }
  }
);

export const verifyForgetPasswordOTP = createAsyncThunk(
  "userAuth/verifyForgetPasswordOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}registration/verify-reset-otp/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            otp: data.otp,
            otp_token: data.otp_token,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Verify Forget Password OTP failed", {
          position: "top-right",
          autoClose: 3000,
        });
        return rejectWithValue(
          result.error || "Verify Forget Password OTP failed"
        );
      }
      toast.success(result.message, {
        position: "top-right",
        autoClose: 3000,
      });
      return { verified_token: result.verified_token };
    } catch (error) {
      console.log("verifyForgetPasswordOTP error", error);
    }
  }
);

export const resendForgetPasswordOTP = createAsyncThunk(
  "userAuth/resendForgetPasswordOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}registration/resend-reset-otp/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            otp_token: data.otp_token,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Resend Forget Password OTP failed", {
          position: "top-right",
          autoClose: 3000,
        });
        return rejectWithValue(
          result.error || "Resend Forget Password OTP failed"
        );
      }
      toast.success(result.message, {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      console.log("resendForgetPasswordOTP error", error);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "userAuth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}registration/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          new_password: data.new_password,
          verified_token: data.verified_token,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Reset Password failed", {
          position: "top-right",
          autoClose: 3000,
        });
        return rejectWithValue(result.error || "Reset Password failed");
      }
      toast.success(result.message, {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      console.log("resetPassword error", error);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "userAuth/refreshToken",
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}registration/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Refresh Token failed", {
          position: "top-right",
          autoClose: 3000,
        });
        return rejectWithValue(result.error || "Refresh Token failed");
      }
      toast.success(result.message, {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      console.log("refreshToken error", error);
    }
  }
);

export const logout = createAsyncThunk(
  "userAuth/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { userAuth } = getState();
      const response = await fetch(`${API_BASE}registration/logout/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${userAuth.token}` },
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.detail || "logout failed", {
          position: "top-right",
          autoClose: 3000,
        });
        return rejectWithValue(result.detail || "logout failed");
      }
      toast.success(result.message, {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      console.log("logout error", error);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "userAuth/updateProfile",
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { userAuth } = getState();
      const response = await fetch(`${API_BASE}registration/edit-profile/`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${userAuth.token}` },
        body: profileData,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Update Profile failed", {
          position: "top-right",
          autoClose: 3000,
        });
        return rejectWithValue(result.error || "Update Profile failed");
      }
      toast.success(result.message, {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      console.log("updateProfile error", error);
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  "userAuth/updateProfilePicture",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { userAuth } = getState();
      const response = await fetch(
        `${API_BASE}registration/upload-profile-pic/`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${userAuth.token}` },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Update Profile Picture failed", {
          position: "top-right",
          autoClose: 3000,
        });
        return rejectWithValue(result.error || "Update Profile Picture failed");
      }
      toast.success(result.message, {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      console.log("updateProfilePicture error", error);
    }
  }
);

export const deleteProfile = createAsyncThunk(
  "userAuth/deleteProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { userAuth } = getState();
      const response = await fetch(`${API_BASE}/registration/delete-account/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userAuth.token}` },
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Delete Profile failed", {
          position: "top-right",
          autoClose: 3000,
        });
        return rejectWithValue(result.error || "Delete Profile failed");
      }
      toast.success(result.message, {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      console.log("deleteProfile error", error);
    }
  }
);

const { token: storedToken, refreshToken: storedRefreshToken } = loadAuthData();

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: {
    token: storedToken || null,
    refreshToken: storedRefreshToken || null,
    user: null,
    loading: false,
    error: null,
    otpToken: null,
    verifiedToken: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setOtpToken: (state, action) => {
      state.otpToken = action.payload;
    },
    setVerifiedToken: (state, action) => {
      state.verifiedToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { email: action.meta.arg.email };
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.tokens.access;
        state.refreshToken = action.payload.tokens.refresh;
        state.user = { email: action.meta.arg.email };
        saveAuthData({
          token: state.token,
          refreshToken: state.refreshToken,
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(completeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(completeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(viewProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(viewProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.otpToken = action.payload.otp_token;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyForgetPasswordOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyForgetPasswordOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.verifiedToken = action.payload.verified_token;
      })
      .addCase(verifyForgetPasswordOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resendForgetPasswordOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendForgetPasswordOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendForgetPasswordOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.verifiedToken = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        saveAuthData({
          token: state.token,
          refreshToken: state.refreshToken,
        });
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access;
        state.refreshToken = action.payload.refresh;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        clearAuthData();
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfilePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
          profile_picture: action.payload.profile_picture,
        };
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        clearAuthData();
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setOtpToken, setVerifiedToken } =
  userAuthSlice.actions;

export default userAuthSlice.reducer;
