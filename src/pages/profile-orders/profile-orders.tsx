import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { fetchOrders } from '../../slices/orderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/services/store';
import { ThunkDispatch } from 'redux-thunk';

export const ProfileOrders: FC = () => {
  const dispatch: ThunkDispatch<RootState, void, any> = useDispatch();
  const orders: TOrder[] = useSelector(
    (state: RootState) => state.order.orders
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
