import React, { FC, memo, useState } from 'react';
import styles from './burger-ingredient.module.css';
import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';
import { TBurgerIngredientUIProps } from './type';
import { useDispatch, useSelector } from '../../../services/store';
import { addIngredientToConstructor } from '../../../slices/orderSlice';
import { Modal } from '../../../components/modal';
import { IngredientDetailsUI } from '../ingredient-details';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient }) => {
    const dispatch = useDispatch();
    const { image, price, name, _id } = ingredient;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const constructorItems = useSelector(
      (state) => state.order.constructorItems
    );

    const isInConstructor = constructorItems.ingredients.some(
      (item) => item._id === _id
    );

    const handleAdd = () => {
      dispatch(addIngredientToConstructor(ingredient));
    };

    let bunCount = 0;
    if (constructorItems.bun && constructorItems.bun._id === _id) {
      bunCount = 1;
    }

    const ingredientCount = constructorItems.ingredients.filter(
      (item) => item._id === _id
    ).length;

    let displayCount = 0;
    if (isInConstructor || bunCount > 0) {
      displayCount = ingredientCount + bunCount;
    }

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    return (
      <div
        className={styles.container}
        key={_id}
        data-testid='burger-ingredient'
      >
        <div className={styles.article} onClick={handleOpenModal}>
          {displayCount > 0 && <Counter count={displayCount} />}
          <img className={styles.img} src={image} alt='картинка ингредиента.' />
          <div className={`${styles.cost} mt-2 mb-2`}>
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>
          <p className={`text text_type_main-default ${styles.text}`}>{name}</p>
        </div>

        <AddButton
          text='Добавить'
          onClick={() => {
            if (ingredient.type === 'bun') {
              dispatch(addIngredientToConstructor(ingredient));
            } else {
              handleAdd();
            }
          }}
          extraClass={`${styles.addButton} mt-8`}
          data-testid='add-button'
        />

        {isModalOpen && (
          <Modal onClose={handleCloseModal} title={'Детали ингредиента'}>
            <IngredientDetailsUI ingredientData={ingredient} />
          </Modal>
        )}
      </div>
    );
  }
);

export default BurgerIngredientUI;
