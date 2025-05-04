import { useContext } from 'react'
import makeContextError from './makeContextError'
import { Context } from './ReCaptchaProvider'

const useSkipInjectionDelay = (): (() => null | Error) => {
    const context = useContext(Context)
    return () => {
        const forceInjectScript = context?.injectScript.current ?? null
        if (forceInjectScript !== null) {
            forceInjectScript()
            return null
        }
        return makeContextError('')
    }
}
export default useSkipInjectionDelay
