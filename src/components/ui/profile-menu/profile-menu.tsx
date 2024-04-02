import React, { FC, SyntheticEvent } from 'react';
import styles from './profile-menu.module.css';
import { NavLink } from 'react-router-dom';
import { ProfileMenuUIProps } from './type';
import { useDispatch } from '../../../services/store';
import { logoutUser } from '../../../slices/authSlice';

export const ProfileMenuUI: FC<ProfileMenuUIProps> = ({ pathname }) => {
  const dispatch = useDispatch();

  const handleLogout = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(logoutUser())
      .then(() => {
        localStorage.clear();
      })
      .catch((error) => {
        console.error('Ошибка выполнения выхода:', error);
      });
  };

  return (
    <>
      <NavLink
        to={'/profile'}
        className={({ isActive }) =>
          `text text_type_main-medium text_color_inactive pt-4 pb-4 ${
            styles.link
          } ${isActive ? styles.link_active : ''}`
        }
        end
      >
        Профиль
      </NavLink>
      <NavLink
        to={'/profile/orders'}
        className={({ isActive }) =>
          `text text_type_main-medium text_color_inactive pt-4 pb-4 ${
            styles.link
          } ${isActive ? styles.link_active : ''}`
        }
      >
        История заказов
      </NavLink>
      <button
        className={`text text_type_main-medium text_color_inactive pt-4 pb-4 ${styles.button}`}
        onClick={handleLogout}
      >
        Выход
      </button>
      <p className='pt-20 text text_type_main-default text_color_inactive'>
        {pathname === '/profile'
          ? 'В этом разделе вы можете изменить свои персональные данные'
          : 'В этом разделе вы можете просмотреть свою историю заказов'}
      </p>
    </>
  );
};
