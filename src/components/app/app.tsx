import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import store from '../../services/store';
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
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import ProtectedRoute from '../protected-route/protected-route';
import { checkUserAuth } from '../../slices/authSlice';

const App = () => {
  useEffect(() => {
    store.dispatch(checkUserAuth());
  }, []);

  return (
    <Provider store={store}>
      <div className='app'>
        <BrowserRouter>
          <AppHeader />
          <Routes>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route
              path='/feed/:number'
              element={
                <Modal title={'Информация о заказе'} onClose={() => {}}>
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <Modal title={'Детали ингредиента'} onClose={() => {}}>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <Modal title={'Информация о заказе'} onClose={() => {}}>
                    <OrderInfo />
                  </Modal>
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
        </BrowserRouter>
      </div>
    </Provider>
  );
};

export default App;
