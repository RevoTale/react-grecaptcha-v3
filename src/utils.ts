import { GlobalReCaptcha } from './globalRecaptcha';

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
    return `https://${hostname}/recaptcha/enterprise.js?render=${siteKey}&onload=rusted_labs_recaptcha_callback`;
  }
  return `https://${hostname}/recaptcha/api.js?render=${siteKey}&onload=rusted_labs_recaptcha_callback`;
};
export const prepareGlobalObject = (): GlobalReCaptcha => {
  const { grecaptcha } = window;
  if (typeof grecaptcha === 'undefined') {
    return (window.grecaptcha = {
      ready(cb) {
        if (typeof window.grecaptcha?.execute === 'undefined') {
          // window.__grecaptcha_cfg is a global variable that stores reCAPTCHA's
          // configuration. By default, any functions listed in its 'fns' property
          // are automatically executed when reCAPTCHA loads.
          const c = '___grecaptcha_cfg' as const;
          window[c] = window[c] || {};
          (window[c]['fns'] = window[c]['fns'] || []).push(cb);
        } else {
          cb();
        }
      },
    });
  }
  return grecaptcha;
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
}: InjectScriptProps): void => {
  let el = document.querySelector(`script[id=${scriptProps.id}]`);
  if (el === null) {
    el = document.createElement('script') as HTMLScriptElement;
  }
  Object.assign(el, scriptProps);
  (appendTo === 'head' ? document.head : document.body).appendChild(el);
};
export const maybeRemoveScript = (scriptId: string): void => {
  const el = document.querySelector(`script[id=${scriptId}]`);
  if (null !== el) {
    document.head.removeChild(el);
  }
};
