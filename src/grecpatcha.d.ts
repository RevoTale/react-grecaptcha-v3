import { GlobalReCaptcha } from './globalRecaptcha';
declare global {
  interface Window {
    grecaptcha: GlobalReCaptcha | undefined;
    ___grecaptcha_cfg?: { fns?: unknown[] };
  }
}
