import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/services/store';
import { TUser } from '@utils-types';
import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

const saveUserAndTokens = (
  user: TUser | null,
  accessToken: string,
  refreshToken: string
) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    setCookie('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  } else {
    localStorage.removeItem('user');
    setCookie('accessToken', '', { expires: -1 });
    localStorage.removeItem('refreshToken');
  }
};

const loadUserFromLocalStorage = (): TUser | null => {
  const userString = localStorage.getItem('user');
  if (userString) {
    return JSON.parse(userString);
  }
  return null;
};

interface AuthState {
  user: TUser | null;
  loading: boolean;
  error: string | null;
  isAuthChecked: boolean;
}

const initialState: AuthState = {
  user: loadUserFromLocalStorage(),
  loading: false,
  error: null,
  isAuthChecked: false
};

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string) => {
    await forgotPasswordApi({ email });
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ password, token }: { password: string; token: string }) => {
    await resetPasswordApi({ password, token });
  }
);

export const checkUserAuth = createAsyncThunk(
  'auth/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(fetchUser()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: TRegisterData) => {
    const response = await registerUserApi(userData);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData: TLoginData) => {
    const response = await loginUserApi(userData);
    const { user, accessToken, refreshToken } = response;
    saveUserAndTokens(user, accessToken, refreshToken);
    return user;
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: Partial<TRegisterData>) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await logoutApi();
  localStorage.clear();
  deleteCookie('accessToken');
});

export const refreshUserToken = createAsyncThunk(
  'auth/refreshUserToken',
  async () => {
    const response = await refreshToken();
    return response;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    userLogout: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user data';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register user';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user';
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to logout';
      })
      .addCase(refreshUserToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshUserToken.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to refresh token';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to send password reset email';
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to reset password';
      });
  }
});

export const { authChecked, setUser, userLogout } = authSlice.actions;

export const setUserAndLocalStorage = (user: TUser) => (dispatch: any) => {
  dispatch(setUser(user));
  saveUserAndTokens(
    user,
    getCookie('accessToken') ?? '',
    localStorage.getItem('refreshToken') ?? ''
  );
};

export const isAuthCheckedSelector = (state: RootState) =>
  state.auth.isAuthChecked;
export const userDataSelector = (state: RootState) => state.auth.user;

export default authSlice.reducer;
