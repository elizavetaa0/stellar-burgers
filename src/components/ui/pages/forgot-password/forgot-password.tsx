import React, { FC, useState } from 'react';
import { Input, Button } from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { PageUIProps } from '../common-type';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../../../slices/authSlice';
import { Link, Navigate } from 'react-router-dom';
import { RootState } from 'src/services/store';
import { ThunkDispatch } from 'redux-thunk';

export const ForgotPasswordUI: FC<PageUIProps> = ({
  errorText,
  email,
  setEmail
}) => {
  const [loading, setLoading] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const dispatch: ThunkDispatch<RootState, void, any> = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(forgotPassword(email));
      setResetRequested(true);
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (resetRequested) {
    return <Navigate to='/reset-password' />;
  }

  return (
    <main className={styles.container}>
      <div className={`pt-6 ${styles.wrapCenter}`}>
        <h3 className='pb-6 text text_type_main-medium'>
          Восстановление пароля
        </h3>
        <form
          className={`pb-15 ${styles.form}`}
          name='forgotPassword'
          onSubmit={handleSubmit}
        >
          <div className='pb-6'>
            <Input
              type='email'
              placeholder='Укажите e-mail'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name='email'
              error={false}
              errorText=''
              size='default'
              required
            />
          </div>
          <div className={`pb-6 ${styles.button}`}>
            <Button
              type='primary'
              size='medium'
              htmlType='submit'
              disabled={loading}
            >
              {loading ? 'Отправка...' : 'Восстановить'}
            </Button>
          </div>
          {errorText && (
            <p className={`${styles.error} text text_type_main-default pb-6`}>
              {errorText}
            </p>
          )}
        </form>
        <div className={`${styles.question} text text_type_main-default pb-6`}>
          Вспомнили пароль?
          <Link to={'/login'} className={`pl-2 ${styles.link}`}>
            Войти
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordUI;
