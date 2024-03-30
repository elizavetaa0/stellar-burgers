import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { forgotPasswordApi, resetPasswordApi } from '@api';

interface PasswordState {
  loading: boolean;
  error: string | null;
  resetSuccess: boolean;
}

const initialState: PasswordState = {
  loading: false,
  error: null,
  resetSuccess: false
};

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string) => {
    const response = await forgotPasswordApi({ email });
    return response.success;
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ password, token }: { password: string; token: string }) => {
    const response = await resetPasswordApi({ password, token });
    return response.success;
  }
);

const passwordSlice = createSlice({
  name: 'authPassword',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.resetSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Forgot password failed';
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Reset password failed';
      });
  }
});

export const { resetStatus } = passwordSlice.actions;

export default passwordSlice.reducer;
