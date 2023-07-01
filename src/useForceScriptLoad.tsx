import { useContext } from 'react';
import makeContextError from './makeContextError';
import { Context } from './ReCaptchaProvider';

const useForceScriptLoad = (): (() => null | Error) => {
  const context = useContext(Context);
  return () => {
    const forceInjectScript = context?.injectScript.current;
    if (forceInjectScript) {
      forceInjectScript();
      return null;
    }
    return makeContextError('');
  };
};
export default useForceScriptLoad;
