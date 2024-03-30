import { createSelector } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from 'src/services/store';

export const selectOrders = (state: RootState) => state.feeds.orders;

export const selectReadyOrders = createSelector(selectOrders, (orders) =>
  getOrders(orders, 'done')
);

export const selectPendingOrders = createSelector(selectOrders, (orders) =>
  getOrders(orders, 'pending')
);

export const selectFeedInfo = (state: RootState) => ({
  total: state.feeds.total,
  totalToday: state.feeds.totalToday
});

export const selectOrderById = (state: RootState, orderId: number) =>
  state.feeds.orders.find((order) => order.number === orderId) || null;

const getOrders = (orders: TOrder[], status: string) =>
  orders
    .filter((item: { status: string }) => item.status === status)
    .map((item: { number: number }) => item.number)
    .slice(0, 20);
