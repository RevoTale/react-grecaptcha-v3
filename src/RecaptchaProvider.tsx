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
  useExecuteReCaptcha: () => ExecuteRecaptcha;
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
}>;
const RecaptchaProvider: FunctionComponent<Props> = ({
  siteKey,
  children,
  scriptProps = {},
  useRecaptchaNet = false,
  enterprise = false,
}) => {
  useEffect(() => {
    const reCaptchaScriptId = scriptProps.id || defaultScriptId;
    if (null === siteKey) {
      maybeRemoveScript(reCaptchaScriptId);
    } else {
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
    }
    return () => {
      maybeRemoveScript(reCaptchaScriptId);
    };
  }, [
    enterprise,
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
    queueRef.current.forEach(({ action, onComplete }) => {
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
        useExecuteReCaptcha: (): ExecuteRecaptcha => executeRecaptcha,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default RecaptchaProvider;
