import React, { FC, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { fetchOrderById } from '../../slices/orderSlice';
import { useLocation } from 'react-router-dom';

interface OrderInfoProps {
  orderNumber?: number;
}

export const OrderInfo: FC<OrderInfoProps> = ({ orderNumber }) => {
  const dispatch = useDispatch();
  const orderData = useSelector((state) => state.order.currentOrder);
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const location = useLocation();

  useEffect(() => {
    const abortController = new AbortController();

    let orderIdFromUrl = '';
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 2) {
      orderIdFromUrl = pathParts[pathParts.length - 1];
    }

    const orderId = orderNumber || orderIdFromUrl;

    if (orderId) {
      dispatch(fetchOrderById(orderId as number));
    }

    return () => {
      abortController.abort();
    };
  }, [dispatch, orderNumber, location.pathname]);

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

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

export default OrderInfo;
