import { useEffect } from 'react';
export const reCaptchaHiddenBadgeStyles = `.grecaptcha-badge { visibility: hidden; }`;
/**
 * Please read https://developers.google.com/recaptcha/docs/faq#id-like-to-hide-the-recaptcha-badge.-what-is-allowed
 * before doing this.
 */
const useHideRecaptchaBadge = () => {
  useEffect(() => {
    const styles = document.createElement('style');
    styles.textContent = reCaptchaHiddenBadgeStyles;
    document.head.appendChild(styles);
    return () => {
      document.head.removeChild(styles);
    };
  }, []);
};
export default useHideRecaptchaBadge;
