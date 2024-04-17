import styles from './constructor-page.module.css';
import { BurgerIngredients, BurgerConstructor } from '../../components';
import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { fetchIngredients } from '../../slices/ingredientsSlice';
import { useDispatch } from '../../services/store';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = false;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};

export default ConstructorPage;
