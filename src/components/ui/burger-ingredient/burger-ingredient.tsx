import React, { FC, memo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './burger-ingredient.module.css';
import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';
import { TBurgerIngredientUIProps } from './type';
import { useDispatch, useSelector } from 'react-redux';
import { addIngredientToConstructor } from '../../../slices/orderSlice';
import { RootState } from 'src/services/store';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, locationState }) => {
    const dispatch = useDispatch();
    const { image, price, name, _id } = ingredient;

    const [added, setAdded] = useState(false);
    const constructorItems = useSelector(
      (state: RootState) => state.order.constructorItems
    );

    const isInConstructor = constructorItems.ingredients.some(
      (item) => item._id === _id
    );

    const handleAdd = () => {
      dispatch(addIngredientToConstructor(ingredient));
      setAdded(true);
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

    return (
      <div className={styles.container} key={_id}>
        <Link
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={locationState}
        >
          <div className={styles.article}>
            {displayCount > 0 && <Counter count={displayCount} />}
            <img
              className={styles.img}
              src={image}
              alt='картинка ингредиента.'
            />
            <div className={`${styles.cost} mt-2 mb-2`}>
              <p className='text text_type_digits-default mr-2'>{price}</p>
              <CurrencyIcon type='primary' />
            </div>
            <p className={`text text_type_main-default ${styles.text}`}>
              {name}
            </p>
          </div>
        </Link>
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
        />
      </div>
    );
  }
);

export default BurgerIngredientUI;
