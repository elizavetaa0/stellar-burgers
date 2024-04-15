const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
(global as any).localStorage = localStorageMock;

import { rootReducer } from '../reducers/rootReducer';

describe('rootReducer test', () => {
  it('should return the initial state', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      auth: {
        user: null,
        loading: false,
        error: null,
        isAuthChecked: false
      },
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      password: {
        loading: false,
        error: null,
        resetSuccess: false
      },
      order: {
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
      },
      feeds: {
        orders: [],
        total: 0,
        totalToday: 0,
        readyOrders: [],
        pendingOrders: [],
        loading: false,
        error: null
      }
    });
  });
});
