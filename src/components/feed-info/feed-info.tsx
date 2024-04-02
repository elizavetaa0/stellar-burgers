import { FC } from 'react';
import { useSelector } from '../../services/store';
import {
  selectReadyOrders,
  selectPendingOrders,
  selectFeedInfo
} from '../../selectors/selectors';
import { FeedInfoUI } from '../ui/feed-info';

export const FeedInfo: FC = () => {
  const readyOrders = useSelector(selectReadyOrders);
  const pendingOrders = useSelector(selectPendingOrders);
  const feed = useSelector(selectFeedInfo);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};

export default FeedInfo;
