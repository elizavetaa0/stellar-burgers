import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { RootState } from 'src/services/store';
import { useSelector, useDispatch } from '../../services/store';
import { clearConstructor, createOrder } from '../../slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(
    (state: RootState) => state.order.constructorItems
  );
  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.orderModalData);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    const ingredientIds = constructorItems.ingredients.map(
      (item: { _id: string }) => item._id
    );

    if (constructorItems.bun) {
      ingredientIds.push(constructorItems.bun._id);
    }

    dispatch(createOrder(ingredientIds))
      .then((response: any) => {
        if (response && response.error) {
          console.error('Ошибка при создании заказа:', response.error);
        } else {
          dispatch(clearConstructor());
        }
      })
      .catch((error: any) => {
        console.error('Ошибка при создании заказа:', error);
      });
  };

  const closeOrderModal = () => {
    setIsModalOpen(false);
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <>
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
    </>
  );
};
