import { useRef } from 'react'

export type QueueItem = {
    action: string
    onComplete: (token: string) => void
    onError: (reason: Error) => void
}
const useQueueRef = () => {
    return useRef<QueueItem[]>([])
}

export default useQueueRef
