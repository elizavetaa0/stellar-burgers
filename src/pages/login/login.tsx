import React, { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../slices/authSlice';
import { Navigate } from 'react-router-dom';
import { setUser, userDataSelector } from '../../slices/authSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [redirectToConstructor, setRedirectToConstructor] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector(userDataSelector);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await dispatch(loginUser({ email, password }));
      if (response.payload) {
        dispatch(setUser(response.payload));
        setRedirectToConstructor(true);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorText(error.message || 'Failed to login');
    }
  };

  if (redirectToConstructor) {
    return <Navigate to='/' />;
  }

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

export default Login;
