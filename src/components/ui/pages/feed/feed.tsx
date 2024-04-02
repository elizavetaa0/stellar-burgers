import React, { FC, memo, useEffect, useState } from 'react';
import { useDispatch } from '../../../../services/store';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';

import styles from './feed.module.css';
import { FeedUIProps } from './type';
import { OrdersList, FeedInfo } from '@components';
import { fetchFeeds } from '../../../../slices/feedsSlice';

export const FeedUI: FC<FeedUIProps> = memo(({ orders }) => {
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFetching) {
      dispatch(fetchFeeds()).then(() => {
        setIsFetching(false);
      });
    }
  }, [dispatch, isFetching]);

  const handleClickRefresh = () => {
    setIsFetching(true);
  };

  return (
    <main className={styles.containerMain}>
      <div className={`${styles.titleBox} mt-10 mb-5`}>
        <h1 className={`${styles.title} text text_type_main-large`}>
          Лента заказов
        </h1>
        <RefreshButton
          text='Обновить'
          onClick={handleClickRefresh}
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
