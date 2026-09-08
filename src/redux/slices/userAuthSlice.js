import {
  clearAuthData,
  loadAuthData,
  saveAuthData,
} from "../../services/authStorage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_BASE } from "../../utils/constant";
import { authApi } from "../../services/api/authApi";
import { toast } from "react-toastify";

export const signup = createAsyncThunk(
  "userAuth/signup",
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await authApi.signup(credentials);
      toast.success(result.message || "Signup successful", {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (err) {
      console.log("signup error", err);
      const msg = err?.data?.error || err?.message || "Signup failed";
      toast.error(msg, { position: "top-right", autoClose: 3000 });
      return rejectWithValue(msg);
    }
  },
);

export const verifyOTP = createAsyncThunk(
  "userAuth/verifyOTP",
  async (data, { rejectWithValue }) => {
    try {
      const payload = {
        email: data.email,
        otp: data.otp,
        otp_token: data.otp_token,
      };
      const result = await authApi.verifyOTP(payload);
      toast.success(result.message || "OTP verified", {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (err) {
      console.log("verifyOTP error", err);
      const msg = err?.message || err?.data || "Invalid OTP";
      toast.error(msg, { position: "top-right", autoClose: 3000 });
      return rejectWithValue(msg);
    }
  },
);

export const resendOTP = createAsyncThunk(
  "userAuth/resendOTP",
  async (data, { rejectWithValue }) => {
    try {
      const payload = { email: data.email, otp_token: data.otp_token };
      const result = await authApi.resendOTP(payload);
      toast.success(result.message || "OTP resent", {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      console.log("resendOTP error", error);
      const msg = error?.message || error?.data || "Resend OTP failed";
      toast.error(msg, { position: "top-right", autoClose: 3000 });
      return rejectWithValue(msg);
    }
  },
);

export const login = createAsyncThunk(
  "userAuth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await authApi.login(credentials);
      toast.success(result.message || "Login successful", {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      console.log("login error", error);
      const msg = error?.message || error?.data || "Login failed";
      toast.error(msg, { position: "top-right", autoClose: 3000 });
      return rejectWithValue(msg);
    }
  },
);

export const completeProfile = createAsyncThunk(
  "userAuth/completeProfile",
  async (formData, { rejectWithValue }) => {
    try {
      // authApi.completeProfile uses userApi which attaches token
      const result = await authApi.completeProfile(formData);
      toast.success(result.message || "Profile completed", {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      console.log("completeProfile error", error);
      const msg = error?.message || error?.data || "Complete Profile failed";
      toast.error(msg, { position: "top-right", autoClose: 3000 });
      return rejectWithValue(msg);
    }
  },
);

export const viewProfile = createAsyncThunk(
  "userAuth/viewProfile",
  async (_, { rejectWithValue }) => {
    try {
      // authApi.getUserProfile uses userApi and will include token via interceptor
      const result = await authApi.getUserProfile();
      return result;
    } catch (error) {
      console.log("viewProfile error", error);
      return rejectWithValue(error.message || "An error occurred");
    }
  },
);

export const forgetPassword = createAsyncThunk(
  "userAuth/forgetPassword",
  async (email, { rejectWithValue }) => {
    try {
      const result = await authApi.forgotPassword({ email });
      toast.success(result.message || "OTP sent", {
        position: "top-right",
        autoClose: 3000,
      });
      return { success: true, otp_token: result.otp_token || null };
    } catch (error) {
      console.log("forgetPassword error", error);
      const msg = error?.message || error?.data || "Forget Password failed";
      toast.error(msg, { position: "top-right", autoClose: 3000 });
      return rejectWithValue(msg);
    }
  },
);

export const verifyForgetPasswordOTP = createAsyncThunk(
  "userAuth/verifyForgetPasswordOTP",
  async (data, { rejectWithValue }) => {
    try {
      const payload = {
        email: data.email,
        otp: data.otp,
        otp_token: data.otp_token,
      };
      const result = await authApi.verifyResetOTP(payload);
      toast.success(result.message || "Verified", {
        position: "top-right",
        autoClose: 3000,
      });
      return { verified_token: result.verified_token };
    } catch (error) {
      console.log("verifyForgetPasswordOTP error", error);
      const msg =  error?.data?.error || error?.message || "Verify OTP failed";
      toast.error(msg, { position: "top-right", autoClose: 3000 });
      return rejectWithValue(msg);
    }
  },
);

export const resendForgetPasswordOTP = createAsyncThunk(
  "userAuth/resendForgetPasswordOTP",
  async (data, { rejectWithValue }) => {
    try {
      const payload = { email: data.email, otp_token: data.otp_token };
      const result = await authApi.resendOTP(payload);
      toast.success(result.message || "OTP resent", {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      console.log("resendForgetPasswordOTP error", error);
      const msg = error?.message || error?.data || "Resend OTP failed";
      toast.error(msg, { position: "top-right", autoClose: 3000 });
      return rejectWithValue(msg);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "userAuth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const payload = {
        email: data.email,
        new_password: data.new_password,
        verified_token: data.verified_token,
      };
      const result = await authApi.resetPassword(payload);
      toast.success(result.message || "Password reset", {
        position: "top-right",
        autoClose: 3000,
      });
      return result;
    } catch (error) {
      console.log("resetPassword error", error);
      const msg = error?.message || error?.data || "Reset Password failed";
      toast.error(msg, { position: "top-right", autoClose: 3000 });
      return rejectWithValue(msg);
    }
  },
);

export const refreshToken = createAsyncThunk(
  "userAuth/refreshToken",
  async (refreshToken, { rejectWithValue }) => {
    try {
      // token refresh may be part of authApi or a direct endpoint - call via publicApi
      const result = await authApi.login({ refresh: refreshToken });
      // if backend returns { access, refresh } adapt accordingly
      return result;
    } catch (error) {
      console.log("refreshToken error", error);
      const msg = error?.message || error?.data || "Refresh Token failed";
      return rejectWithValue(msg);
    }
  },
);

export const logout = createAsyncThunk(
  "userAuth/logout",
  async (_, { rejectWithValue }) => {
    try {
      try {
        const result = await authApi.logout();
        toast.success(result.message || "Logged out", {
          position: "top-right",
          autoClose: 3000,
        });
        clearAuthData();
        return result;
      } catch (err) {
        const msg = err?.message || err?.data || "Logout failed";
        toast.error(msg, { position: "top-right", autoClose: 3000 });
        return rejectWithValue(msg);
      }
    } catch (error) {
      console.log("logout error", error);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "userAuth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      try {
        const result = await authApi.updateProfile(profileData);
        toast.success(result.message || "Profile updated", {
          position: "top-right",
          autoClose: 3000,
        });
        return result;
      } catch (err) {
        const msg = err?.message || err?.data || "Update Profile failed";
        toast.error(msg, { position: "top-right", autoClose: 3000 });
        return rejectWithValue(msg);
      }
    } catch (error) {
      console.log("updateProfile error", error);
    }
  },
);

export const updateProfilePicture = createAsyncThunk(
  "userAuth/updateProfilePicture",
  async (formData, { rejectWithValue }) => {
    try {
      try {
        const result = await authApi.uploadProfilePicture(formData);
        toast.success(result.message || "Profile picture updated", {
          position: "top-right",
          autoClose: 3000,
        });
        return result;
      } catch (err) {
        const msg =
          err?.message || err?.data || "Update Profile Picture failed";
        toast.error(msg, { position: "top-right", autoClose: 3000 });
        return rejectWithValue(msg);
      }
    } catch (error) {
      console.log("updateProfilePicture error", error);
    }
  },
);

export const deleteProfile = createAsyncThunk(
  "userAuth/deleteProfile",
  async (_, { rejectWithValue }) => {
    try {
      try {
        const result = await authApi.deleteAccount({});
        toast.success(result.message || "Account deleted", {
          position: "top-right",
          autoClose: 3000,
        });
        clearAuthData();
        return result;
      } catch (err) {
        const msg = err?.message || err?.data || "Delete Profile failed";
        toast.error(msg, { position: "top-right", autoClose: 3000 });
        return rejectWithValue(msg);
      }
    } catch (error) {
      console.log("deleteProfile error", error);
    }
  },
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
