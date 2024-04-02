import React, { FC, useState } from 'react';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { Modal } from '../modal';

export const IngredientDetails: FC = () => {
  const { ingredients, loading, error } = useSelector(
    (state) => state.ingredients
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = useParams<{ id: string }>();

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {isModalOpen && (
        <Modal onClose={handleCloseModal} title={'Детали ингредиента'}>
          <IngredientDetailsUI ingredientData={ingredientData} />
        </Modal>
      )}
    </>
  );
};
