type ExecuteCallback = (
  siteKey: string,
  action: string,
  resolve: (token: string) => void
) => void;
const prepareCaptchaFixture = (callback: ExecuteCallback) => {
  return () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.grecaptcha = {
      execute: (siteKey: string, { action }: { action: string }) => {
        return new Promise(resolve => {
          callback(siteKey, action, resolve);
        });
      },
    };
    // window.rusted_labs_recaptcha_callback();
  };
};

export default prepareCaptchaFixture;
