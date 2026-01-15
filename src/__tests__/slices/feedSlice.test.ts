jest.mock(
  '@api',
  () => ({
    getFeedsApi: jest.fn()
  }),
  { virtual: true }
);

import feedReducer, { initialState } from '../../services/slices/feedSlice';
import feedMock from '../../mocks/feed.json';

describe('feedSlice', () => {
  const mockFeedData = feedMock;

  test('Должен возвращать начальное состояние', () => {
    expect(initialState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    });
  });

  test('Должен устанавливать isLoading = true при pending', () => {
    const state = feedReducer(initialState, {
      type: 'feed/fetchFeeds/pending'
    });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Должен записывать в store при successful', () => {
    const pendingState = { ...initialState, isLoading: true };
    const state = feedReducer(pendingState, {
      type: 'feed/fetchFeeds/fulfilled',
      payload: mockFeedData
    });

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockFeedData.orders);
    expect(state.total).toBe(mockFeedData.total);
    expect(state.totalToday).toBe(mockFeedData.totalToday);
    expect(state.error).toBeNull();
  });

  test('Должен записывать ошибку в store при rejected', () => {
    const pendingState = { ...initialState, isLoading: true };
    const state = feedReducer(pendingState, {
      type: 'feed/fetchFeeds/rejected',
      error: { message: 'Ошибка загрузки' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
    expect(state.orders).toEqual([]);
  });
});
