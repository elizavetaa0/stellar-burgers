import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { AppHeader, OrderInfo, IngredientDetails } from '@components';
import ProtectedRoute from '../protected-route/protected-route';
import { checkUserAuth } from '../../slices/authSlice';
import { fetchIngredients } from '../../slices/ingredientsSlice';
import styles from './app.module.css';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(fetchIngredients());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/login' element={<Login />} />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path='/register' element={<Register />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
