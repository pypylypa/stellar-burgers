jest.mock(
  '@api',
  () => ({
    getIngredientsApi: jest.fn(() => Promise.resolve([]))
  }),
  { virtual: true }
);

import ingredientsReducer, {
  initialState,
  getIngredients
} from '../../services/slices/ingredientsSlice';
import type { TIngredient } from '@utils-types';
import ingredientsMock from '../../mocks/ingredients.json';

describe('ingredientsSlice reducer', () => {
  const mockIngredients: TIngredient[] = ingredientsMock.data;

  test('Должен возвращать начальное состояние', () => {
    const result = ingredientsReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  test('Должен устанавливать isLoading = true при pending', () => {
    const action = { type: getIngredients.pending.type };
    const result = ingredientsReducer(initialState, action);

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  test('Должен записывать ингредиенты в store при successful', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };

    const pendingState = { ...initialState, isLoading: true };
    const result = ingredientsReducer(pendingState, action);

    expect(result.isLoading).toBe(false);
    expect(result.ingredients).toEqual(mockIngredients);
    expect(result.ingredients).toHaveLength(mockIngredients.length);
    expect(result.error).toBeNull();
  });

  test('Должен записывать ошибку в store при rejected', () => {
    const errorMessage = 'Ошибка сервера';
    const action = {
      type: getIngredients.rejected.type,
      payload: errorMessage
    };

    const pendingState = { ...initialState, isLoading: true };
    const result = ingredientsReducer(pendingState, action);

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(errorMessage);
    expect(result.ingredients).toEqual([]);
  });
});
