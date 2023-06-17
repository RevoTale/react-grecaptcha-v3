import { useContext } from 'react';
import { Context } from './RecaptchaProvider';

const useExecuteReCaptcha = () => {
  return (
    useContext(Context) ?? {
      useExecuteReCaptcha: () => {
        console.warn('Recaptcha context not injected.');
      },
    }
  );
};
export default useExecuteReCaptcha;
