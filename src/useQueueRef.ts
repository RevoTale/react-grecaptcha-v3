import { useRef } from 'react'

export interface QueueItem {
    action: string
    onComplete: (token: string) => void
    onError: (reason: Error) => void
}
const useQueueRef = () => useRef<QueueItem[]>([])

export default useQueueRef
