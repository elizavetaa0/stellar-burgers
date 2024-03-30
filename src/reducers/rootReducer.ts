import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import passwordReducer from '../slices/passwordSlice';
import orderReducer from '../slices/orderSlice';
import feedsReducer from '../slices/feedsSlice';
import ingredientsReducer from '../slices/ingredientsSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  password: passwordReducer,
  order: orderReducer,
  feeds: feedsReducer,
  ingredients: ingredientsReducer
});

export default rootReducer;
