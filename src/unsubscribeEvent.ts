import { queueKey } from './global/globals'

const notExistsIndex = -1
const countToDelete = 1
const unsubscribeEvent = (item: () => void): void => {
    const callbacks = window[queueKey] ?? []
    const index = callbacks.indexOf(item)
    if (index > notExistsIndex) {
        callbacks.splice(index, countToDelete)
    }
}
export default unsubscribeEvent
