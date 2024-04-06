import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { v4 as uuidv4 } from 'uuid';

interface OrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null;
  orders: TOrder[];
  loading: boolean;
  error: string | null;
  number: number;
  constructorItems: {
    bun: {
      _id: string;
      price: number;
    } | null;
    ingredients: TConstructorIngredient[];
    counter: number;
  };
}

const initialState: OrderState = {
  currentOrder: null,
  orders: [],
  loading: false,
  error: null,
  orderRequest: false,
  orderModalData: null,
  number: 0,
  constructorItems: {
    bun: null,
    ingredients: [],
    counter: 0
  }
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await getOrdersApi();
  return response;
});

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId: number) => {
    const response = await getOrderByNumberApi(orderId);
    return response.orders.length > 0 ? response.orders[0] : null;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addIngredientToConstructor: (state, action) => {
      const newIngredient = {
        ...action.payload,
        uniqueId: uuidv4()
      };
      if (newIngredient.type === 'bun') {
        state.constructorItems.bun = newIngredient;
      } else {
        state.constructorItems.ingredients.push(newIngredient);
      }
      state.constructorItems.counter++;
    },
    clearConstructor: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: [],
        counter: 0
      };
    },
    removeIngredients: (state, action) => {
      const ingredientToRemove = action.payload;
      if (ingredientToRemove.type !== 'bun') {
        const indexToRemove = state.constructorItems.ingredients.findIndex(
          (ingredient) => ingredient._id === ingredientToRemove._id
        );
        if (indexToRemove !== -1) {
          state.constructorItems.ingredients.splice(indexToRemove, 1);
          state.constructorItems.counter--;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.error = null;
        state.orderModalData = action.payload;
        state.orderRequest = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create order';
        state.orderRequest = false;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch order by ID';
      });
  }
});

export const {
  addIngredientToConstructor,
  clearConstructor,
  removeIngredients
} = orderSlice.actions;

export default orderSlice.reducer;
