import React, { FC, memo } from 'react';
import { useDispatch } from 'react-redux';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';

import styles from './feed.module.css';
import { FeedUIProps } from './type';
import { OrdersList, FeedInfo } from '@components';
import { fetchFeeds } from '../../../../slices/feedsSlice';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from 'src/services/store';

export const FeedUI: FC<FeedUIProps> = memo(({ orders }) => {
  const dispatch: ThunkDispatch<RootState, void, any> = useDispatch();

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  return (
    <main className={styles.containerMain}>
      <div className={`${styles.titleBox} mt-10 mb-5`}>
        <h1 className={`${styles.title} text text_type_main-large`}>
          Лента заказов
        </h1>
        <RefreshButton
          text='Обновить'
          onClick={handleGetFeeds}
          extraClass={'ml-30'}
        />
      </div>
      <div className={styles.main}>
        <div className={styles.columnOrders}>
          <OrdersList orders={orders} />
        </div>
        <div className={styles.columnInfo}>
          <FeedInfo />
        </div>
      </div>
    </main>
  );
});
