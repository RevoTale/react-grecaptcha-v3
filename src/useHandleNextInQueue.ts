import { MutableRefObject, useCallback } from 'react';
import subscribeEvent from './subscribeEvent';
import { QueueItem } from './useQueueRef';

const useHandleNextInQueue = (
  siteKey: string | null,
  queueRef: MutableRefObject<QueueItem[]>
) => {
  return useCallback(() => {
    queueRef.current.forEach(item => {
      const { action, onComplete, onError } = item;

      if (siteKey) {
        subscribeEvent(() => {
          queueRef.current = queueRef.current.filter(value => value !== item);
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
    });
  }, [siteKey]);
};
export default useHandleNextInQueue;