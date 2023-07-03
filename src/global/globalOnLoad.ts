import { queueKey } from './globals';
import unsubscribeEvent from '../unsubscribeEvent';

const globalOnLoad = () => {
  const callbacks = window[queueKey];
  if (callbacks) {
    callbacks.forEach(item => {
      item();
      unsubscribeEvent(item);
    });
  }
};
export default globalOnLoad;
