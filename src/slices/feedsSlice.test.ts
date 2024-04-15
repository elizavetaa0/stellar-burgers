import feedsReducer, {
  fetchFeeds,
  initialState
} from './feedsSlice';

const mockResponse = {
  orders: [],
  total: 1,
  totalToday: 1,
  success: true
}

describe('feedsSlice async actions', () => {
  it('should handle fetchFeeds.pending', () => {
    const state = feedsReducer(initialState, fetchFeeds.pending(''));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchFeeds.fulfilled', () => {
    const state = feedsReducer(initialState, fetchFeeds.fulfilled(mockResponse, ''));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle fetchFeeds.rejected', () => {
    const errorMessage = 'Failed to fetch feed';
    const state = feedsReducer(initialState, fetchFeeds.rejected(new Error(errorMessage), ''));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
})
