import { MutableRefObject, useCallback } from 'react';
import subscribeEvent from './subscribeEvent';
import { QueueItem } from './useQueueRef';

const useHandleNextInQueue = (
  siteKey: string | null,
  queueRef: MutableRefObject<QueueItem[]>
) => {
  return useCallback(() => {
    if (!siteKey) {
      return;
    }
    let item;
    while ((item = queueRef.current.shift())) {
      const { action, onComplete, onError } = item;

      subscribeEvent(() => {
        if (window.grecaptcha?.execute) {
          window.grecaptcha
            .execute(siteKey, { action })
            .then(onComplete)
            .catch((err: string | Error | undefined) => {
              if (err instanceof Error) {
                onError(err);
                return;
              }
              onError(new Error('Unexpected error'));
            });
          return;
        }
        onError(new Error('Bad execute().'));
      });
    }
  }, [siteKey]);
};
export default useHandleNextInQueue;
