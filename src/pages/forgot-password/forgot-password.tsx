import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');
    setIsLoading(true);

    try {
      const response = await forgotPasswordApi({ email });

      if (response.success) {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      } else {
        setErrorText('Ошибка при восстановлении пароля');
      }
    } catch (error: any) {
      setErrorText(error.message || 'Ошибка при восстановлении пароля');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
