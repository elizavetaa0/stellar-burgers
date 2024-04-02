import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import {
  isAuthCheckedSelector,
  userDataSelector
} from '../../slices/authSlice';
import { Preloader } from '@ui';
import { Location } from 'history';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(userDataSelector);
  const location = useLocation();
  const previousLocation = useRef<Location | null>(null);

  useEffect(() => {
    previousLocation.current = location;
  }, [location]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!user) {
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to='/login' />;
  }

  const redirectPath = localStorage.getItem('redirectPath');
  if (redirectPath) {
    localStorage.removeItem('redirectPath');
    return <Navigate to={redirectPath} />;
  }

  return children;
};

export default ProtectedRoute;
