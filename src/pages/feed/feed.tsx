import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/services/store';
import { fetchFeeds } from '../../slices/feedsSlice';
import { ThunkDispatch } from 'redux-thunk';

export const Feed: FC = () => {
  const dispatch: ThunkDispatch<RootState, void, any> = useDispatch();
  const { orders, loading } = useSelector((state: RootState) => state.feeds);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (loading || !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
