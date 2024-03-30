import { Preloader } from '@ui';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
  isAuthCheckedSelector,
  userDataSelector
} from '../../slices/authSlice';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(userDataSelector);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!user) {
    return <Navigate replace to='/login' />;
  }

  return children;
};

export default ProtectedRoute;
