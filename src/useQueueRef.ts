import { type RefObject, useRef } from 'react'

export interface QueueItem {
    action: string
    onComplete: (token: string) => void
    onError: (reason: Error) => void
}
const useQueueRef = (): RefObject<QueueItem[]> => useRef<QueueItem[]>([])

export default useQueueRef
