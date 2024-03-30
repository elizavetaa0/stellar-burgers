import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';
import { clearConstructor, createOrder } from '../../../slices/orderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/services/store';
import { ThunkDispatch } from 'redux-thunk';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  checkUserAuth,
  isAuthCheckedSelector,
  userDataSelector
} from '../../../slices/authSlice';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  price,
  closeOrderModal
}) => {
  const dispatch: ThunkDispatch<RootState, void, any> = useDispatch();
  const user = useSelector(userDataSelector);
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(checkUserAuth());
    }
  }, [dispatch, isAuthChecked]);

  const selectedBun = constructorItems.bun;
  const orderRequest = useSelector(
    (state: RootState) => state.order.orderRequest
  );
  const orderModalData = useSelector(
    (state: RootState) => state.order.orderModalData
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bunElement = selectedBun ? (
    <div className={`${styles.element} mb-4 mr-4`}>
      <ConstructorElement
        type='top'
        isLocked
        text={`${selectedBun.name} (верх)`}
        price={selectedBun.price}
        thumbnail={selectedBun.image}
      />
    </div>
  ) : (
    <div
      className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
    >
      Выберите булки
    </div>
  );

  const ingredientsList = constructorItems.ingredients.map(
    (item: TConstructorIngredient, index: number) => (
      <BurgerConstructorElement
        ingredient={item}
        index={index}
        totalItems={constructorItems.ingredients.length}
        key={`${item.id}_${index}`}
      />
    )
  );

  const bottomBunElement = selectedBun ? (
    <div className={`${styles.element} mt-4 mr-4`}>
      <ConstructorElement
        type='bottom'
        isLocked
        text={`${selectedBun.name} (низ)`}
        price={selectedBun.price}
        thumbnail={selectedBun.image}
      />
    </div>
  ) : (
    <div
      className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
    >
      Выберите булки
    </div>
  );

  const onOrderClick = () => {
    const ingredientIds = constructorItems.ingredients.map(
      (item: { _id: string }) => item._id
    );

    if (selectedBun) {
      ingredientIds.push(selectedBun._id);
      ingredientIds.push(selectedBun._id);
    }

    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(createOrder(ingredientIds))
      .then(() => {
        setIsModalOpen(true);
        dispatch(clearConstructor());
      })
      .catch((error: any) => {
        console.error('Ошибка при создании заказа:', error);
        if (error.response) {
          if (error.response.status === 403) {
            setError('У вас нет доступа к этому действию.');
          } else if (error.response.status === 401) {
            setError('Необходима авторизация для создания заказа.');
          } else {
            setError('Произошла ошибка при создании заказа.');
          }
        } else {
          setError('Произошла ошибка при создании заказа.');
        }
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    closeOrderModal();
    setError(null);
    navigate('/feed');
  };

  return (
    <section className={styles.burger_constructor}>
      {bunElement}

      <ul className={styles.elements}>
        {ingredientsList.length > 0 ? (
          ingredientsList
        ) : (
          <div
            className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
          >
            Выберите начинку
          </div>
        )}
      </ul>

      {bottomBunElement}

      <div className={`${styles.total} mt-10 mr-4`}>
        <div className={`${styles.cost} mr-10`}>
          <p className={`text ${styles.text} mr-2`}>{price}</p>
          <CurrencyIcon type='primary' />
        </div>
        <Button
          htmlType='button'
          type='primary'
          size='large'
          children='Оформить заказ'
          onClick={onOrderClick}
        />
      </div>

      {isModalOpen && orderModalData && (
        <Modal onClose={closeModal} title={''}>
          <OrderDetailsUI orderNumber={orderModalData.number} />
        </Modal>
      )}

      {orderRequest && (
        <Modal onClose={() => {}} title={'Оформляем заказ...'}>
          <Preloader />
        </Modal>
      )}

      {error && (
        <Modal onClose={() => setError(null)} title={'Ошибка'}>
          <p>{error}</p>
        </Modal>
      )}
    </section>
  );
};

export default BurgerConstructorUI;
