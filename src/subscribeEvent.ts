import globalOnLoad from './global/globalOnLoad';
import { key, queueKey } from './global/globals';

const subscribeEvent = (callback: () => void) => {
  if (window.grecaptcha?.execute) {
    callback();
    return;
  }
  window[key] = globalOnLoad;
  if (window[queueKey]) {
    window[queueKey].push(callback);
  } else {
    window[queueKey] = [callback];
  }
};
export default subscribeEvent;
