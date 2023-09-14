import { queueKey } from './global/globals'

const unsubscribeEvent = (item: () => void) => {
    const callbacks = window[queueKey] || []
    const index = callbacks.indexOf(item)
    if (index > -1) {
        callbacks.splice(index, 1)
    }
}
export default unsubscribeEvent
