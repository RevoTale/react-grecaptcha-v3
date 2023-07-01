import {
  createContext,
  FunctionComponent,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import subscribeOnLoad from './subscribeOnLoad';
import unsubscribeOnLoad from './unsubscribeOnLoad';
import { getScriptSrc, maybeInjectScript, maybeRemoveScript } from './utils';

export type ExecuteRecaptcha = (action: string) => Promise<string>;
type ContextType = {
  executeRecaptcha: ExecuteRecaptcha;
  injectScript: RefObject<null | (() => void)>;
};
export const Context = createContext<ContextType | null>(null);
export type ScriptProps = {
  nonce?: string;
  defer?: boolean;
  async?: boolean;
  appendTo?: 'head' | 'body';
  id?: string;
};
export const defaultScriptId = 'rusted_labs_react_recaptcha_v3';
export type Props = Readonly<{
  siteKey: string | null;
  children: ReactNode;
  useRecaptchaNet?: boolean;
  enterprise?: boolean;
  scriptProps?: ScriptProps;
  injectionDelay?: number;
}>;
const ReCaptchaProvider: FunctionComponent<Props> = ({
  siteKey,
  children,
  scriptProps = {},
  useRecaptchaNet = false,
  enterprise = false,
  injectionDelay = null,
}) => {
  const injectCallbackRef = useRef<null | (() => void)>(null);
  const handleNextInQueue = useCallback(() => {
    queueRef.current.forEach(item => {
      const { action, onComplete, onError } = item;

      if (siteKey) {
        subscribeOnLoad(() => {
          queueRef.current = queueRef.current.filter(value => value !== item);
          if (window.grecaptcha?.execute) {
            window.grecaptcha
              .execute(siteKey, { action })
              .then(onComplete)
              .catch(err => {
                if (err instanceof Error) {
                  onError(err);
                  return;
                }
                onError(new Error('Unexpected error'));
              });
            return;
          }
          onError(new Error('Bad execute().'));
        });
      }
    });
  }, [siteKey]);
  useEffect(() => {
    const reCaptchaScriptId = scriptProps.id || defaultScriptId;

    if (null === siteKey) {
      maybeRemoveScript(reCaptchaScriptId);
    } else {
      const inject = () => {
        subscribeOnLoad(handleNextInQueue);
        maybeInjectScript({
          src: getScriptSrc({
            enterprise,
            useRecaptchaNet,
            siteKey,
          }),
          appendTo: scriptProps.appendTo ?? 'head',
          id: reCaptchaScriptId,
          async: scriptProps.async ?? true,
          defer: scriptProps.defer ?? true,
          nonce: scriptProps.nonce,
        });
      };
      injectCallbackRef.current = inject;
      if (injectionDelay === null) {
        inject();
      } else {
        const timeout = setTimeout(inject, injectionDelay);
        return () => {
          injectCallbackRef.current = null;
          maybeRemoveScript(reCaptchaScriptId);
          clearTimeout(timeout);
          unsubscribeOnLoad(handleNextInQueue);
        };
      }
    }
    return () => {
      maybeRemoveScript(reCaptchaScriptId);
    };
  }, [
    enterprise,
    handleNextInQueue,
    injectionDelay,
    scriptProps.appendTo,
    scriptProps.async,
    scriptProps.defer,
    scriptProps.id,
    scriptProps.nonce,
    siteKey,
    useRecaptchaNet,
  ]);
  const queueRef = useRef<
    {
      action: string;
      onComplete: (token: string) => void;
      onError: (reason: Error) => void;
    }[]
  >([]);

  const executeRecaptcha = async (action: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      queueRef.current.push({
        action,
        onComplete: resolve,
        onError: reject,
      });
      handleNextInQueue();
    });
  };

  return (
    <Context.Provider
      value={{
        executeRecaptcha,
        injectScript: injectCallbackRef,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default ReCaptchaProvider;
