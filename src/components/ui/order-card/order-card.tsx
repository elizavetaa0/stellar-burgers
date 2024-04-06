import React, { FC, memo, useState, useEffect, useRef } from 'react';
import { useDispatch } from '../../../services/store';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';
import styles from './order-card.module.css';
import { OrderCardUIProps } from './type';
import { OrderStatus, Modal, OrderInfo } from '@components';
import { fetchOrderById } from '../../../slices/orderSlice';
import { Preloader } from '../preloader';

export const OrderCardUI: FC<OrderCardUIProps> = memo(
  ({ orderInfo, maxIngredients }) => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleOrderClick = () => {
      setSelectedOrderId(orderInfo.number);
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    const handleModalOpen = (orderId: number) => {
      setSelectedOrderId(orderId);
      setIsModalOpen(true);
    };

    const handleClickOutsideModal = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleCloseModal();
      }
    };

    useEffect(() => {
      if (isModalOpen) {
        document.addEventListener('mousedown', handleClickOutsideModal);
      } else {
        document.removeEventListener('mousedown', handleClickOutsideModal);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutsideModal);
      };
    }, [isModalOpen]);

    useEffect(() => {
      if (selectedOrderId !== null) {
        setLoading(true);
        dispatch(fetchOrderById(selectedOrderId))
          .then(() => {
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }
    }, [dispatch, selectedOrderId]);

    return (
      <>
        <div
          onClick={handleOrderClick}
          className={`p-6 mb-4 mr-2 ${styles.order}`}
        >
          <div className={styles.order_info}>
            <span className={`text text_type_digits-default ${styles.number}`}>
              #{String(orderInfo.number).padStart(6, '0')}
            </span>
            <span className='text text_type_main-default text_color_inactive'>
              <FormattedDate date={orderInfo.date} />
            </span>
          </div>
          <h4
            className={`pt-6 text text_type_main-medium ${styles.order_name}`}
          >
            {orderInfo.name}
          </h4>
          <div className={`pt-6 ${styles.order_content}`}>
            <ul className={styles.ingredients}>
              {orderInfo.ingredientsToShow.map((ingredient, index) => {
                let zIndex = maxIngredients - index;
                let right = 20 * index;
                return (
                  <li
                    className={styles.img_wrap}
                    style={{ zIndex: zIndex, right: right }}
                    key={index}
                  >
                    <img
                      style={{
                        opacity:
                          orderInfo.remains && maxIngredients === index + 1
                            ? '0.5'
                            : '1'
                      }}
                      className={styles.img}
                      src={ingredient.image_mobile}
                      alt={ingredient.name}
                    />
                    {maxIngredients === index + 1 ? (
                      <span
                        className={`text text_type_digits-default ${styles.remains}`}
                      >
                        {orderInfo.remains > 0 ? `+${orderInfo.remains}` : null}
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <div>
              <span
                className={`text text_type_digits-default pr-1 ${styles.order_total}`}
              >
                {orderInfo.total}
              </span>
              <CurrencyIcon type='primary' />
            </div>
          </div>
        </div>
        {isModalOpen && (
          <Modal title={'Информация о заказе'} onClose={handleCloseModal}>
            {loading ? (
              <Preloader />
            ) : (
              <>
                {selectedOrderId !== null ? (
                  <OrderInfo orderNumber={selectedOrderId} />
                ) : (
                  <Preloader />
                )}
              </>
            )}
          </Modal>
        )}
      </>
    );
  }
);

export default OrderCardUI;
