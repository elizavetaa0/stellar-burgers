import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../slices/authSlice';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from 'src/services/store';
import { Navigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [redirectToConstructor, setRedirectToConstructor] = useState(false);
  const dispatch: ThunkDispatch<RootState, void, any> = useDispatch();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(registerUser({ name: userName, email, password }));
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrorText(error.message || 'Failed to register');
    }
  };

  if (redirectToConstructor) {
    return <Navigate to='/' />;
  }

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
