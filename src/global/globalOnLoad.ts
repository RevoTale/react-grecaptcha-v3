import { queueKey } from './globals'
const globalOnLoad = (): void => {
    const { [queueKey]: callbacks } = window
    if (callbacks !== undefined) {
        while (true) {
            const item = callbacks.shift()
            if (item === undefined) {
                break
            }
            item()
        }
    }
}
export default globalOnLoad
