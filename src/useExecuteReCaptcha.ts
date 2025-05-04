import { useContext } from 'react'
import makeContextError from './makeContextError'
import { Context } from './ReCaptchaProvider'
export type ExecuteRecaptcha = (action: string) => Promise<string>

const useExecuteReCaptcha = (): ExecuteRecaptcha => (
        useContext(Context)?.executeRecaptcha ??
        (async action => await Promise.reject(makeContextError(`${action} missed`)))
    )
export default useExecuteReCaptcha
