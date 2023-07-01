import { useContext } from 'react';
import makeContextError from './makeContextError';
import { Context, ExecuteRecaptcha } from './ReCaptchaProvider';

const useExecuteReCaptcha = (): ExecuteRecaptcha => {
  return (
    useContext(Context)?.executeRecaptcha ??
    (action => {
      return Promise.reject(makeContextError(`${action} missed`));
    })
  );
};
export default useExecuteReCaptcha;
