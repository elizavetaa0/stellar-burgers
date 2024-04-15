import orderReducer, { addIngredientToConstructor, removeIngredients, initialState } from "./orderSlice";

describe('constructor test', () => {
  it('should check action for adding ingredients', () => {
    const ingredient = {
      _id: '1',
      name: 'cosmic fish',
      type: 'main',
      price: 150
    };

    const newState = orderReducer(initialState, addIngredientToConstructor(ingredient));

    expect(newState.constructorItems.ingredients).toHaveLength(1);
    expect(newState.constructorItems.ingredients[0]).toEqual({
      ...ingredient,
      uniqueId: expect.any(String)
    });
    expect(newState.constructorItems.counter).toEqual(1);
  });

  it('should check action for removing ingredients', () => {
    const ingredient1 = {
      _id: '1',
      name: 'cosmic fish',
      type: 'main',
      proteins: 100,
      fat: 10,
      carbohydrates: 20,
      calories: 200,
      price: 150,
      image: '',
      image_large: '',
      image_mobile: '',
      id: '123',
      uniqueId: '1111'
    };

    const ingredient2 = {
      _id: '2',
      name: 'cosmic lettuce',
      type: 'main',
      proteins: 4,
      fat: 3,
      carbohydrates: 0,
      calories: 70,
      price: 50,
      image: '',
      image_large: '',
      image_mobile: '',
      id: '456',
      uniqueId: '2222'
    };

    const state = {
      ...initialState,
      constructorItems: {
        bun: {
          _id: '11',
          name: 'bun-bun',
          type: 'bun',
          proteins: 56,
          fat: 80,
          carbohydrates: 120,
          calories: 250,
          price: 1050,
          image: '',
          image_large: '',
          image_mobile: '',
          id: '789',
          uniqueId: '3333'
        },
        ingredients: [ingredient1, ingredient2],
        counter: 3
      }
    };

    const newState = orderReducer(state, removeIngredients(ingredient1));

    expect(newState.constructorItems.ingredients).toHaveLength(1);
    expect(newState.constructorItems.ingredients[0]).toEqual(ingredient2);
    expect(newState.constructorItems.counter).toEqual(2);
  });
});