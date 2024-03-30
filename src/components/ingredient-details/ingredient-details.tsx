import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'src/services/store';
import { fetchIngredients } from '../../slices/ingredientsSlice';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { ThunkDispatch } from 'redux-thunk';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const dispatch: ThunkDispatch<RootState, void, any> = useDispatch();
  const { ingredients, loading, error } = useSelector(
    (state: RootState) => state.ingredients
  );

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

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

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
