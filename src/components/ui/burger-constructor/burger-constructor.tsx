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
import { useDispatch, useSelector } from '../../../services/store';
import { useNavigate } from 'react-router-dom';
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
  const dispatch = useDispatch();
  const user = useSelector(userDataSelector);
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(checkUserAuth());
    }
  }, [dispatch, isAuthChecked]);

  const selectedBun = constructorItems.bun;
  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.orderModalData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bunElement = selectedBun ? (
    <div
      className={`${styles.element} mb-4 mr-4`}
      data-testid='constructor-ingredient'
    >
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
      data-testid='constructor-bun-top'
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
        key={item.uniqueId}
      />
    )
  );

  const bottomBunElement = selectedBun ? (
    <div
      className={`${styles.element} mt-4 mr-4`}
      data-testid='constructor-ingredient'
    >
      <ConstructorElement
        type='bottom'
        isLocked
        text={`${selectedBun.name} (низ)`}
        price={selectedBun.price}
        thumbnail={selectedBun.image}
        key={selectedBun.uniqueId}
      />
    </div>
  ) : (
    <div
      className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
      data-testid='constructor-bun-bottom'
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

    console.log('Данные о пользователе:', user);

    dispatch(createOrder(ingredientIds))
      .then((response) => {
        console.log('Ответ на создание заказа:', response);
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
    console.log('Модальное окно закрыто:', isModalOpen);
  };

  return (
    <section className={styles.burger_constructor}>
      {bunElement}

      <ul className={styles.elements} data-testid='ingredients'>
        {ingredientsList.length > 0 ? (
          ingredientsList
        ) : (
          <div
            className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
            data-testid='constructor-ingredient'
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
        <Modal onClose={closeModal} title={''} data-testid='modal-order'>
          <OrderDetailsUI orderNumber={orderModalData.number} />
        </Modal>
      )}

      {orderRequest && (
        <Modal
          onClose={closeModal}
          title={'Оформляем заказ...'}
          data-testid='modal-order-process'
        >
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
