import orderReducer, {
  fetchOrders,
  createOrder,
  fetchOrderById,
  initialState,
} from './orderSlice';

describe('orderSlice async actions', () => {
  it('should handle fetchOrders.pending', () => {
    const state = orderReducer(initialState, fetchOrders.pending(''));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchOrders.fulfilled', () => {
    const mockOrders = [{
      _id: '1',
      status: '',
      name: '',
      createdAt: '',
      updatedAt: '',
      number: 1,
      ingredients: []
    },
    {
      _id: '2',
      status: '',
      name: '',
      createdAt: '',
      updatedAt: '',
      number: 2,
      ingredients: []
    }
  ];
    const state = orderReducer(initialState, fetchOrders.fulfilled(mockOrders, ''));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual(mockOrders);
  });

  it('should handle fetchOrders.rejected', () => {
    const errorMessage = 'Failed to fetch orders';
    const state = orderReducer(initialState, fetchOrders.rejected(new Error(errorMessage), ''));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle createOrder.pending', () => {
    const state = orderReducer(initialState, createOrder.pending('', []));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.orderRequest).toBe(true);
  });

  it('should handle createOrder.fulfilled', () => {
    const mockOrder = {
        _id: '1',
        status: '',
        name: '',
        createdAt: '',
        updatedAt: '',
        number: 1,
        ingredients: []
    };
    const state = orderReducer(initialState, createOrder.fulfilled(mockOrder, '', []));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.orderRequest).toBe(false);
  });

  it('should handle createOrder.rejected', () => {
    const errorMessage = 'Failed to create order';
    const state = orderReducer(initialState, createOrder.rejected(new Error(errorMessage), '', []));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.orderRequest).toBe(false);
  });

  it('should handle fetchOrderById.pending', () => {
    const state = orderReducer(initialState, fetchOrderById.pending('', 1));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchOrderById.fulfilled', () => {
    const mockOrder = {
      _id: '1',
      status: '',
      name: '',
      createdAt: '',
      updatedAt: '',
      number: 1,
      ingredients: []
  };
    const state = orderReducer(initialState, fetchOrderById.fulfilled(mockOrder, '', 1));
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.currentOrder).toEqual(mockOrder);
  });

  it('should handle fetchOrderById.rejected', () => {
    const errorMessage = 'Failed to fetch order by ID';
    const state = orderReducer(initialState, fetchOrderById.rejected(new Error(errorMessage), '', 1));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
