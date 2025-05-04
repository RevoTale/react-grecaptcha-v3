import { queueKey } from './globals'
const globalOnLoad = ():void => {
    const {[queueKey]:callbacks} = window
    if (callbacks !== undefined) {
        let item:(()=>void)|undefined = undefined
        while (true) {
            item = callbacks.shift()
            if (item === undefined) {
                break;
            }
            item()
        }
    }
}
export default globalOnLoad
