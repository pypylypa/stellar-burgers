jest.mock(
  '@api',
  () => ({
    getOrdersApi: jest.fn()
  }),
  { virtual: true }
);

import userOrdersReducer, {
  initialState,
  fetchUserOrders,
  userOrdersSlice
} from '../../services/slices/userOrdersSlice';
import userOrdersMock from '../../mocks/user-orders.json';

describe('userOrdersSlice reducer', () => {
  test('Должен возвращать начальное состояние', () => {
    const result = userOrdersReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  test('fetchUserOrders. Должен устанавливать isLoading = true при pending', () => {
    const action = { type: fetchUserOrders.pending.type };
    const result = userOrdersReducer(initialState, action);

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
    expect(result.orders).toEqual([]);
  });

  test('fetchUserOrders. Должен записывать в store при successful', () => {
    const action = {
      type: fetchUserOrders.fulfilled.type,
      payload: userOrdersMock
    };

    const pendingState = { ...initialState, isLoading: true };
    const result = userOrdersReducer(pendingState, action);

    expect(result.isLoading).toBe(false);
    expect(result.orders).toEqual(userOrdersMock);
    expect(result.orders).toHaveLength(userOrdersMock.length);
    expect(result.error).toBeNull();
  });

  test('fetchUserOrders. Должен записывать ошибку в store при rejected', () => {
    const errorMessage = 'Ошибка загрузки заказов';
    const action = {
      type: fetchUserOrders.rejected.type,
      payload: errorMessage
    };

    const pendingState = { ...initialState, isLoading: true };
    const result = userOrdersReducer(pendingState, action);

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(errorMessage);
    expect(result.orders).toEqual([]);
  });

  test('clearUserOrdersError должен очищать ошибку', () => {
    const stateWithError = {
      orders: userOrdersMock,
      isLoading: false,
      error: 'Произошла ошибка'
    };

    const action = userOrdersSlice.actions.clearUserOrdersError();
    const result = userOrdersReducer(stateWithError, action);

    expect(result.error).toBeNull();
    expect(result.orders).toEqual(userOrdersMock);
    expect(result.isLoading).toBe(false);
  });
});
