import React, { FC, useState, useEffect } from 'react';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../components/ui/order-info/order-info.module.css';

export const IngredientDetails: FC = () => {
  const { ingredients, loading, error } = useSelector(
    (state) => state.ingredients
  );

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!loading && !error && ingredients.length > 0 && !redirected) {
      navigate(`/ingredients/${id}`);
      setRedirected(true);
    }
  }, [loading, error, ingredients, id, navigate, redirected]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <div>Нет информации об ингредиенте</div>;
  }

  return (
    <>
      <div className={styles.wrap}>
        <IngredientDetailsUI ingredientData={ingredientData} />
      </div>
    </>
  );
};
