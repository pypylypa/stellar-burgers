jest.mock(
  '../../utils/burger-api',
  () => ({
    orderBurgerApi: jest.fn(),
    getOrderByNumberApi: jest.fn()
  }),
  { virtual: true }
);

import orderReducer, { initialState } from '../../services/slices/orderSlice';
import createOrderMock from '../../mocks/create-order.json';
import getOrderMock from '../../mocks/get-order.json';

describe('orderSlice', () => {
  test('Должен возвращать начальное состояние', () => {
    expect(initialState).toEqual({
      currentOrder: null,
      orderNumber: null,
      isLoading: false,
      error: null
    });
  });

  test('createOrder. Должен устанавливать isLoading = true при pending', () => {
    const state = orderReducer(initialState, {
      type: 'order/createOrder/pending'
    });
    expect(state.isLoading).toBe(true);
  });

  test('createOrder. Должен записывать в store при successful', () => {
    const pendingState = { ...initialState, isLoading: true };

    const state = orderReducer(pendingState, {
      type: 'order/createOrder/fulfilled',
      payload: createOrderMock
    });

    expect(state.isLoading).toBe(false);
    expect(state.currentOrder).toEqual(createOrderMock.order);
    expect(state.orderNumber).toBe(createOrderMock.order.number);
  });

  test('createOrder. Должен записывать ошибку в store при rejected', () => {
    const pendingState = { ...initialState, isLoading: true };

    const state = orderReducer(pendingState, {
      type: 'order/createOrder/rejected',
      error: { message: 'Ошибка создания' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка создания');
  });

  test('getOrderByNumber. Должен устанавливать isLoading = true при pending', () => {
    const state = orderReducer(initialState, {
      type: 'order/getOrderByNumber/pending'
    });
    expect(state.isLoading).toBe(true);
  });

  test('getOrderByNumber. Должен записывать в store при successful', () => {
    const pendingState = { ...initialState, isLoading: true };

    const state = orderReducer(pendingState, {
      type: 'order/getOrderByNumber/fulfilled',
      payload: getOrderMock.orders[0]
    });

    expect(state.isLoading).toBe(false);
    expect(state.currentOrder).toEqual(getOrderMock.orders[0]);
  });

  test('getOrderByNumber. Должен записывать ошибку в store при rejected', () => {
    const pendingState = { ...initialState, isLoading: true };

    const state = orderReducer(pendingState, {
      type: 'order/getOrderByNumber/rejected',
      error: { message: 'Заказ не найден' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Заказ не найден');
  });

  test('clearOrder очищает заказ', () => {
    const stateWithOrder = {
      currentOrder: createOrderMock.order,
      orderNumber: createOrderMock.order.number,
      isLoading: false,
      error: null
    };

    const state = orderReducer(stateWithOrder, {
      type: 'order/clearOrder'
    });

    expect(state.currentOrder).toBeNull();
    expect(state.orderNumber).toBeNull();
  });
});
