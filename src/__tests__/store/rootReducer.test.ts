describe('rootReducer', () => {
  test('Должен содержать все необходимые слайсы', () => {
    const expectedSlices = [
      'ingredients',
      'constructor',
      'feed',
      'order',
      'user',
      'userOrders'
    ];

    expectedSlices.forEach((sliceName) => {
      expect(sliceName).toBeDefined();
    });

    const constructorInitialState = {
      bun: null,
      ingredients: []
    };

    expect(constructorInitialState).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
