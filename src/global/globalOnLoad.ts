import { queueKey } from './globals';
const globalOnLoad = () => {
  const callbacks = window[queueKey];
  if (callbacks) {
    let item;
    while ((item = callbacks.shift())) {
      item();
    }
  }
};
export default globalOnLoad;
