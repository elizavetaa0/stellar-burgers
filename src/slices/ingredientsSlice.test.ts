import ingredientsReducer, {
  fetchIngredients,
  initialState
} from "./ingredientsSlice";

const mockIngredient = {
  _id: '',
  name: '',
  type: '',
  proteins: 100,
  fat: 50,
  carbohydrates: 20,
  calories: 200,
  price: 10,
  image: '',
  image_large: '',
  image_mobile: '',
}

describe('ingredientsSlice async actions', () => {
  it('should handle fetchIngredients.pending', () => {
    const state = ingredientsReducer(initialState, fetchIngredients.pending(''));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(initialState, fetchIngredients.fulfilled([mockIngredient], ''));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual([mockIngredient]);
  });

  it('should handle fetchIngredients.rejected', () => {
    const errorMessage = 'Failed to fetch ingredients';
    const state = ingredientsReducer(initialState, fetchIngredients.rejected(new Error(errorMessage), ''));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
})
