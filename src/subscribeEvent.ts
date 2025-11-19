import globalOnLoad from './global/globalOnLoad'
import { key, queueKey } from './global/globals'

const subscribeEvent = (callback: () => void): void => {
    if (window.grecaptcha?.execute !== undefined) {
        callback()
        return
    }
    window[key] = globalOnLoad
    if (window[queueKey] === undefined) {
        window[queueKey] = [callback]
    } else {
        window[queueKey].push(callback)
    }
}
export default subscribeEvent
