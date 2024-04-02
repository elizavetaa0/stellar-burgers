import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { fetchOrderById } from '../../slices/orderSlice';
import { useLocation } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const orderData = useSelector((state) => state.order.currentOrder);
  const ingredients = useSelector((state) => state.ingredients.ingredients);

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

  if (!orderInfo) {
    return <Preloader />;
  }

  return (
    <>
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};

export default OrderInfo;
