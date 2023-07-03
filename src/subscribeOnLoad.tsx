import unsubscribeOnLoad from './unsubscribeOnLoad';

const subscribeOnLoad = (callback: () => void) => {
  if (window.grecaptcha?.execute) {
    callback();
    return;
  }
  const key = 'rusted_labs_recaptcha_callbacks' as const;
  window.rusted_labs_recaptcha_callback = () => {
    console.log('On load event triggered');
    const callbacks = window[key];
    if (callbacks) {
      callbacks.forEach(item => {
        item();
        unsubscribeOnLoad(item);
      });
    }
  };
  if (window[key]) {
    window[key].push(callback);
  } else {
    window[key] = [callback];
  }
};
export default subscribeOnLoad;
