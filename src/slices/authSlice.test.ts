const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
(global as any).localStorage = localStorageMock;

import { refreshToken } from '@api';
import authReducer, {
  forgotPassword,
  resetPassword,
  checkUserAuth,
  fetchUser,
  registerUser,
  loginUser,
  updateUser,
  logoutUser,
  refreshUserToken,
  initialState
} from './authSlice';

const mockData = {
  password: '',
  token: ''
}

const mockUser = {
  email: '',
  name: '',
  token: ''
}

const mockRegister = {
  email: '',
  name: '',
  password: ''
}

const mockRefreshResponse = {
  success: true,
  refreshToken: '',
  accessToken: ''
}

describe('authSlice async actions', () => {
  it('should handle forgotpassword.pending', () => {
    const state = authReducer(initialState, forgotPassword.pending('', ''));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle forgotpassword.fulfilled', () => {
    const state = authReducer(initialState, forgotPassword.fulfilled(undefined, '', ''));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle forgotpassword.rejected', () => {
    const errorMessage = 'Error';
    const state = authReducer(initialState, forgotPassword.rejected(new Error(errorMessage), '', ''));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle resetpassword.pending', () => {
    const state = authReducer(initialState, resetPassword.pending('', mockData));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle resetpassword.fulfilled', () => {
    const state = authReducer(initialState, resetPassword.fulfilled(undefined, '', mockData));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle resetpassword.rejected', () => {
    const errorMessage = 'Error';
    const state = authReducer(initialState, resetPassword.rejected(new Error(errorMessage), '', mockData));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle checkUserAuth.pending', () => {
    const state = authReducer(initialState, checkUserAuth.pending('', undefined));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle checkUserAuth.fulfilled', () => {
    const state = authReducer(initialState, checkUserAuth.fulfilled(undefined, '', undefined));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle checkUserAuth.rejected', () => {
    const errorMessage = 'Error';
    const state = authReducer(initialState, checkUserAuth.rejected(new Error(errorMessage), '', undefined));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle fetchUser.pending', () => {
    const state = authReducer(initialState, fetchUser.pending('', undefined));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchUser.fulfilled', () => {
    const state = authReducer(initialState, fetchUser.fulfilled(mockUser, '', undefined));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle fetchUser.rejected', () => {
    const errorMessage = 'Error';
    const state = authReducer(initialState, fetchUser.rejected(new Error(errorMessage), '', undefined));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle registerUser.pending', () => {
    const state = authReducer(initialState, registerUser.pending('', mockRegister));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle registerUser.fulfilled', () => {
    const state = authReducer(initialState, registerUser.fulfilled(mockUser, '', mockRegister));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle registerUser.rejected', () => {
    const errorMessage = 'Error';
    const state = authReducer(initialState, registerUser.rejected(new Error(errorMessage), '', mockRegister));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle loginUser.pending', () => {
    const state = authReducer(initialState, loginUser.pending('', mockRegister));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle loginUser.fulfilled', () => {
    const state = authReducer(initialState, loginUser.fulfilled(mockUser, '', mockRegister));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle loginUser.rejected', () => {
    const errorMessage = 'Error';
    const state = authReducer(initialState, loginUser.rejected(new Error(errorMessage), '', mockRegister));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle updateUser.pending', () => {
    const state = authReducer(initialState, updateUser.pending('', mockRegister));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle updateUser.fulfilled', () => {
    const state = authReducer(initialState, updateUser.fulfilled(mockUser, '', mockRegister));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle updateUser.rejected', () => {
    const errorMessage = 'Error';
    const state = authReducer(initialState, updateUser.rejected(new Error(errorMessage), '', mockRegister));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle logoutUser.pending', () => {
    const state = authReducer(initialState, logoutUser.pending('', undefined));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle logoutUser.fulfilled', () => {
    const state = authReducer(initialState, logoutUser.fulfilled(undefined, '', undefined));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle logoutUser.rejected', () => {
    const errorMessage = 'Error';
    const state = authReducer(initialState, logoutUser.rejected(new Error(errorMessage), '', undefined));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle refreshUserToken.pending', () => {
    const state = authReducer(initialState, refreshUserToken.pending('', undefined));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle refreshUserToken.fulfilled', () => {
    const state = authReducer(initialState, refreshUserToken.fulfilled(mockRefreshResponse, '', undefined));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle refreshUserToken.rejected', () => {
    const errorMessage = 'Error';
    const state = authReducer(initialState, refreshUserToken.rejected(new Error(errorMessage), '', undefined));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

})

