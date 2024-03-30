import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { RootState } from '../../services/store';
import { ThunkDispatch } from 'redux-thunk';
import { fetchOrderById } from '../../slices/orderSlice';
import { Modal } from '@components';
import { useLocation } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const dispatch: ThunkDispatch<RootState, void, any> = useDispatch();
  const orderData = useSelector((state: RootState) => state.order.currentOrder);
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const orderNumber = location.pathname.split('/').pop();

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  useEffect(() => {
    if (orderNumber) {
      dispatch(fetchOrderById(parseInt(orderNumber)));
    }
  }, [dispatch, orderNumber]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!orderInfo) {
    return <Preloader />;
  }

  return (
    <>
      <OrderInfoUI orderInfo={orderInfo} />
      {isModalOpen && (
        <Modal onClose={closeModal} title={'Подробная информация о заказе'} />
      )}
    </>
  );
};
