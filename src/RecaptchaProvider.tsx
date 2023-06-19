import {
  createContext,
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import {
  getScriptSrc,
  maybeInjectScript,
  maybeRemoveScript,
  prepareGlobalObject,
} from './utils';

export type ExecuteRecaptcha = (action: string) => Promise<string>;
type ContextType = {
  executeRecaptcha: ExecuteRecaptcha;
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
const RecaptchaProvider: FunctionComponent<Props> = ({
  siteKey,
  children,
  scriptProps = {},
  useRecaptchaNet = false,
  enterprise = false,
  injectionDelay = null,
}) => {
  useEffect(() => {
    const reCaptchaScriptId = scriptProps.id || defaultScriptId;

    if (null === siteKey) {
      maybeRemoveScript(reCaptchaScriptId);
    } else {
      const inject = () => {
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
      if (injectionDelay === null) {
        inject();
      } else {
        const timeout = setTimeout(inject, injectionDelay);
        return () => {
          maybeRemoveScript(reCaptchaScriptId);
          clearTimeout(timeout);
        };
      }
    }
    return () => {
      maybeRemoveScript(reCaptchaScriptId);
    };
  }, [
    enterprise,
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
      onError: (reason: unknown) => void;
    }[]
  >([]);

  const handleNextInQueue = () => {
    const recaptcha = prepareGlobalObject();
    queueRef.current.forEach(item => {
      queueRef.current = queueRef.current.filter(value => value !== item);
      const { action, onComplete } = item;
      if (siteKey) {
        recaptcha.ready(() => {
          if (recaptcha.execute) {
            recaptcha.execute(siteKey, { action: action }).then(token => {
              onComplete(token);
            });
          }
        });
      }
    });
  };
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
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default RecaptchaProvider;
