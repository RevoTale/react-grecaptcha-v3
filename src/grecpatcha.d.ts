import { GlobalReCaptcha } from './globalRecaptcha';
declare global {
  interface Window {
    grecaptcha: GlobalReCaptcha | undefined;
    ___grecaptcha_cfg?: { fns?: unknown[] };
    rusted_labs_recaptcha_callback?: () => void;
    rusted_labs_recaptcha_callbacks?: (() => void)[];
  }
}
