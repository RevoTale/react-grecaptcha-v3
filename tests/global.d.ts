import { GlobalReCaptcha } from '../src/global/globalRecaptcha';
import { GlobalStats } from './utils/simulateTokensOnLoad';

declare global {
  interface Window {
    grecaptcha: GlobalReCaptcha | undefined;
    ___grecaptcha_cfg?: { fns?: unknown[] };
    rusted_labs_recaptcha_callback?: () => void;
    grecaptcha_stats: GlobalStats;
  }
}
