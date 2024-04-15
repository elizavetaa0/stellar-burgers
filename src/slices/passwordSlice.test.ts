import passwordReducer, {
  forgotPassword,
  resetPassword,
  initialState
} from './passwordSlice';

const mockData = {
  password: '',
  token: ''
}

describe('passwordSlice async actions', () => {
  it('it should handle forgotPassword.pending', () => {
    const state = passwordReducer(initialState, forgotPassword.pending('', ''));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('it should handle forgotPassword.fulfilled', () => {
    const state = passwordReducer(initialState, forgotPassword.fulfilled(true, '', ''));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('it should handle forgotPassword.rejected', () => {
    const errorMessage = 'Error';
    const state = passwordReducer(initialState, forgotPassword.rejected(new Error(errorMessage), '', ''));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('it should handle resetPassword.pending', () => {
    const state = passwordReducer(initialState, resetPassword.pending('', mockData));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('it should handle resetPassword.fulfilled', () => {
    const state = passwordReducer(initialState, resetPassword.fulfilled(true, '', mockData));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('it should handle resetPassword.rejected', () => {
    const errorMessage = 'Error';
    const state = passwordReducer(initialState, resetPassword.rejected(new Error(errorMessage), '', mockData));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
})