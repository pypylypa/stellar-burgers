jest.mock(
  '@api',
  () => ({
    getUserApi: jest.fn(),
    updateUserApi: jest.fn(),
    logoutApi: jest.fn(),
    loginUserApi: jest.fn(),
    registerUserApi: jest.fn()
  }),
  { virtual: true }
);

jest.mock(
  '../../utils/cookie',
  () => ({
    setCookie: jest.fn(),
    deleteCookie: jest.fn(),
    getCookie: jest.fn(() => null)
  }),
  { virtual: true }
);

import userReducer, {
  initialState,
  checkUserAuth
} from '../../services/slices/userSlice';
import userMock from '../../mocks/user.json';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock as any;

describe('userSlice reducer - все экшены', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Должен возвращать начальное состояние', () => {
    const result = userReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('checkUserAuth', () => {
    test('pending устанавливает isLoading = true', () => {
      const action = { type: checkUserAuth.pending.type };
      const result = userReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    test('fulfilled устанавливает пользователя и isAuthChecked = true', () => {
      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: userMock.user
      };
      const pendingState = { ...initialState, isLoading: true };
      const result = userReducer(pendingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.user).toEqual(userMock.user);
      expect(result.isAuthChecked).toBe(true);
    });

    test('rejected сбрасывает пользователя и устанавливает isAuthChecked = true', () => {
      const action = { type: checkUserAuth.rejected.type };
      const pendingState = {
        user: userMock.user,
        isAuthChecked: false,
        isLoading: true,
        error: null
      };
      const result = userReducer(pendingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.user).toBeNull();
      expect(result.isAuthChecked).toBe(true);
    });
  });

  describe('userLogin', () => {
    test('pending устанавливает isLoading = true', () => {
      const action = { type: 'user/login/pending' };
      const result = userReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    test('fulfilled устанавливает пользователя при success = true', () => {
      const action = {
        type: 'user/login/fulfilled',
        payload: userMock.loginResponse
      };
      const pendingState = { ...initialState, isLoading: true };
      const result = userReducer(pendingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.user).toEqual(userMock.user);
    });

    test('rejected устанавливает ошибку', () => {
      const action = {
        type: 'user/login/rejected',
        error: { message: 'Ошибка входа' }
      };
      const pendingState = { ...initialState, isLoading: true };
      const result = userReducer(pendingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Ошибка входа');
    });
  });

  describe('userRegister', () => {
    test('pending устанавливает isLoading = true', () => {
      const action = { type: 'user/register/pending' };
      const result = userReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    test('fulfilled устанавливает пользователя при success = true', () => {
      const action = {
        type: 'user/register/fulfilled',
        payload: userMock.registerResponse
      };
      const pendingState = { ...initialState, isLoading: true };
      const result = userReducer(pendingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.user?.email).toBe('new@example.com');
    });

    test('rejected устанавливает ошибку', () => {
      const action = {
        type: 'user/register/rejected',
        error: { message: 'Ошибка регистрации' }
      };
      const pendingState = { ...initialState, isLoading: true };
      const result = userReducer(pendingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Ошибка регистрации');
    });
  });

  describe('userUpdate', () => {
    test('pending устанавливает isLoading = true', () => {
      const action = { type: 'user/update/pending' };
      const stateWithUser = { ...initialState, user: userMock.user };
      const result = userReducer(stateWithUser, action);
      expect(result.isLoading).toBe(true);
    });

    test('fulfilled обновляет пользователя', () => {
      const updatedUser = { ...userMock.user, name: 'Обновленный' };
      const action = {
        type: 'user/update/fulfilled',
        payload: { success: true, user: updatedUser }
      };
      const pendingState = {
        user: userMock.user,
        isAuthChecked: true,
        isLoading: true,
        error: null
      };
      const result = userReducer(pendingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.user?.name).toBe('Обновленный');
    });

    test('rejected устанавливает ошибку', () => {
      const action = {
        type: 'user/update/rejected',
        error: { message: 'Ошибка обновления' }
      };
      const pendingState = {
        ...initialState,
        isLoading: true,
        user: userMock.user
      };
      const result = userReducer(pendingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Ошибка обновления');
    });
  });

  describe('getUser', () => {
    test('pending устанавливает isLoading = true', () => {
      const action = { type: 'user/get/pending' };
      const result = userReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    test('fulfilled устанавливает пользователя при success = true', () => {
      const action = {
        type: 'user/get/fulfilled',
        payload: { success: true, user: userMock.user }
      };
      const pendingState = { ...initialState, isLoading: true };
      const result = userReducer(pendingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.user).toEqual(userMock.user);
    });

    test('rejected устанавливает ошибку', () => {
      const action = {
        type: 'user/get/rejected',
        error: { message: 'Ошибка получения' }
      };
      const pendingState = { ...initialState, isLoading: true };
      const result = userReducer(pendingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Ошибка получения');
    });
  });

  describe('userLogout', () => {
    test('pending устанавливает isLoading = true', () => {
      const action = { type: 'user/logout/pending' };
      const stateWithUser = { ...initialState, user: userMock.user };
      const result = userReducer(stateWithUser, action);
      expect(result.isLoading).toBe(true);
    });

    test('fulfilled сбрасывает пользователя', () => {
      const action = { type: 'user/logout/fulfilled' };
      const stateWithUser = {
        user: userMock.user,
        isAuthChecked: true,
        isLoading: true,
        error: null
      };
      const result = userReducer(stateWithUser, action);

      expect(result.isLoading).toBe(false);
      expect(result.user).toBeNull();
      expect(result.isAuthChecked).toBe(true);
    });

    test('rejected устанавливает ошибку', () => {
      const action = {
        type: 'user/logout/rejected',
        error: { message: 'Ошибка выхода' }
      };
      const pendingState = {
        ...initialState,
        isLoading: true,
        user: userMock.user
      };
      const result = userReducer(pendingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Ошибка выхода');
    });
  });

  describe('reducers', () => {
    test('setAuthChecked устанавливает isAuthChecked', () => {
      const action = { type: 'user/setAuthChecked', payload: true };
      const result = userReducer(initialState, action);
      expect(result.isAuthChecked).toBe(true);
    });

    test('setUser устанавливает пользователя', () => {
      const action = { type: 'user/setUser', payload: userMock.user };
      const result = userReducer(initialState, action);
      expect(result.user).toEqual(userMock.user);
    });

    test('clearError очищает ошибку', () => {
      const stateWithError = { ...initialState, error: 'Ошибка' };
      const action = { type: 'user/clearError' };
      const result = userReducer(stateWithError, action);
      expect(result.error).toBeNull();
    });
  });
});
