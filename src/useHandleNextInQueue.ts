import { type RefObject, useCallback } from 'react'
import subscribeEvent from './subscribeEvent'
import type { QueueItem } from './useQueueRef'
const unknownToError = (
    err: unknown,
    fallbackMsg = 'Unexpected error'
): Error => {
    const msg =
        err instanceof Error
            ? err.message
            : typeof err === 'string'
              ? err
              : fallbackMsg
    return new Error(msg)
}

const useHandleNextInQueue = (
    siteKey: string | null,
    queueRef: RefObject<QueueItem[]>
): (() => void) =>
    useCallback(() => {
        if (siteKey === null) {
            return
        }
        let item: QueueItem | undefined = undefined
        do {
            item = queueRef.current.shift()
            if (item === undefined) {
                break
            }
            const { action, onComplete, onError } = item

            subscribeEvent(() => {
                const execute = window.grecaptcha?.execute ?? null
                if (execute !== null) {
                    execute(siteKey, { action })
                        .then(onComplete)
                        .catch((err: unknown) => {
                            onError(unknownToError(err))
                        })
                    return
                }
                onError(new Error('Bad execute().'))
            })
        } while (true)
    }, [queueRef, siteKey])
export default useHandleNextInQueue
