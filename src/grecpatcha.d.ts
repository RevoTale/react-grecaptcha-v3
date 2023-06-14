import {GlobalReCaptcha} from "./globalRecaptcha";
declare global {
    interface Window { grecaptcha: GlobalReCaptcha|undefined; }
}

window.grecaptcha = window.grecaptcha || {};
