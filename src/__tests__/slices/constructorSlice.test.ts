import {
  burgerReducer,
  initialState,
  constructorSlice
} from '../../services/slices/constructorSlice';
import { TConstructorIngredient } from '@utils-types';
import ingredientsMock from '../../mocks/ingredients.json';

describe('constructorSlice reducer', () => {
  const mockIngredients = ingredientsMock.data;

  const mockBun: TConstructorIngredient = {
    ...mockIngredients[0],
    id: `${mockIngredients[0]._id}-${Date.now()}`
  };

  const mockMainIngredient: TConstructorIngredient = {
    ...mockIngredients[2],
    id: `${mockIngredients[2]._id}-${Date.now()}`
  };

  const mockSecondIngredient: TConstructorIngredient = {
    ...mockIngredients[3],
    id: `${mockIngredients[3]._id}-${Date.now()}`
  };

  test('Правильная инициализация', () => {
    const result = burgerReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('Обработка добавления булки', () => {
    test('Необходимо добавить булку в конструктор', () => {
      const action = {
        type: 'constructor/addBun',
        payload: mockBun
      };

      const result = burgerReducer(initialState, action);

      expect(result.bun).toEqual(mockBun);
      expect(result.bun?.type).toBe('bun');
      expect(result.ingredients).toEqual([]);
    });

    test('Замена булки, которая была добавлена ранее', () => {
      const stateWithBun = {
        ...initialState,
        bun: mockBun
      };

      const newBun: TConstructorIngredient = {
        ...mockIngredients[1],
        id: `${mockIngredients[1]._id}-${Date.now()}`
      };

      const action = {
        type: 'constructor/addBun',
        payload: newBun
      };

      const result = burgerReducer(stateWithBun, action);

      expect(result.bun).toEqual(newBun);
      expect(result.bun?._id).toBe(mockIngredients[1]._id);
    });
  });

  describe('Обработка добавления ингредиента', () => {
    test('Необходимо  добавить ингредиент в конструктор', () => {
      const action = {
        type: 'constructor/addIngredient',
        payload: mockMainIngredient
      };

      const result = burgerReducer(initialState, action);

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toEqual(mockMainIngredient);
      expect(result.ingredients[0].type).toBe('main');
      expect(result.bun).toBeNull();
    });

    test('Необходимо добавить несколько ингредиентов', () => {
      let state = initialState;

      state = burgerReducer(state, {
        type: 'constructor/addIngredient',
        payload: mockMainIngredient
      });

      state = burgerReducer(state, {
        type: 'constructor/addIngredient',
        payload: mockSecondIngredient
      });

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]._id).toBe(mockIngredients[2]._id);
      expect(state.ingredients[1]._id).toBe(mockIngredients[3]._id);
    });
  });

  describe('Обработка удаления ингредиента', () => {
    test('Необходимо удалить ингредиент по идентификатору', () => {
      const stateWithIngredients = {
        bun: mockBun,
        ingredients: [mockMainIngredient, mockSecondIngredient]
      };

      const action = constructorSlice.actions.removeIngredient(mockMainIngredient.id);
      
      const result = burgerReducer(stateWithIngredients, action);

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toEqual(mockSecondIngredient);
      expect(result.bun).toEqual(mockBun);
    });
  });

  describe('Перемещение ингредиентов', () => {
    const mockThirdIngredient: TConstructorIngredient = {
      ...mockIngredients[4],
      id: `${mockIngredients[4]._id}-${Date.now()}`
    };

    test('Опустить ингредиент вниз по списку', () => {
      const startIngredients = {
        bun: mockBun,
        ingredients: [
          mockMainIngredient,
          mockSecondIngredient,
          mockThirdIngredient
        ]
      };

      const action = {
        type: 'constructor/moveIngredient',
        payload: { fromIndex: 0, toIndex: 1 }
      };

      const result = burgerReducer(startIngredients, action);

      expect(result.ingredients[0]).toBe(mockSecondIngredient);
      expect(result.ingredients[1]).toBe(mockMainIngredient);
      expect(result.ingredients[2]).toBe(mockThirdIngredient);
    });

    test('Подняли ингредиент вверх в списке', () => {
      const startIngredients = {
        bun: mockBun,
        ingredients: [
          mockMainIngredient,
          mockSecondIngredient,
          mockThirdIngredient
        ]
      };

      const action = {
        type: 'constructor/moveIngredient',
        payload: { fromIndex: 2, toIndex: 1 }
      };

      const result = burgerReducer(startIngredients, action);

      expect(result.ingredients[0]).toBe(mockMainIngredient);
      expect(result.ingredients[1]).toBe(mockThirdIngredient);
      expect(result.ingredients[2]).toBe(mockSecondIngredient);
    });
  });
});
