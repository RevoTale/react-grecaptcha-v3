export type ReCaptchaProps = Readonly<{
  siteKey: string;
  useRecaptchaNet: boolean;
  enterprise: boolean;
}>;
export const getScriptSrc = ({
  enterprise,
  useRecaptchaNet,
  siteKey,
}: ReCaptchaProps): string => {
  const hostname = useRecaptchaNet ? 'recaptcha.net' : 'www.google.com';
  if (enterprise) {
    return `https://${hostname}/recaptcha/enterprise.js?render=explicit`;
  }
  return `https://${hostname}/recaptcha/api.js?render=${siteKey}`;
};
export const prepareGlobalObject = () => {
  if (typeof window.grecaptcha === 'undefined') {
    window.grecaptcha = {
      ready(cb) {
        if (typeof window.grecaptcha === 'undefined') {
          // window.__grecaptcha_cfg is a global variable that stores reCAPTCHA's
          // configuration. By default, any functions listed in its 'fns' property
          // are automatically executed when reCAPTCHA loads.
          const c = '___grecaptcha_cfg';
          // @ts-ignore
          window[c] = window[c] || {};
          // @ts-ignore
          (window[c]['fns'] = window[c]['fns'] || []).push(cb);
        } else {
          cb();
        }
      },
    };
  }
};
export type CreatScriptProps = Readonly<{
  id: string;
  async: boolean;
  defer: boolean;
  src: string;
  nonce?: string;
}>;

export type InjectScriptProps = CreatScriptProps & {
  appendTo: 'head' | 'body';
};
export const maybeInjectScript = ({
  appendTo,
  ...scriptProps
}: InjectScriptProps): HTMLScriptElement => {
  const el = document.querySelector(`script[id=${scriptProps.id}]`);
  if (el === null) {
    const el = document.createElement('script') as HTMLScriptElement;
    Object.assign(el, scriptProps);
    (appendTo === 'head' ? document.head : document.body).appendChild(el);
    return el;
  }
  Object.assign(el, scriptProps);

  return el as HTMLScriptElement;
};
export const maybeRemoveScript = (scriptId: string): void => {
  const el = document.querySelector(`script[id=${scriptId}]`);
  if (null !== el) {
    document.head.removeChild(el);
  }
};
