import {createContext, FunctionComponent, ReactNode, useEffect, useRef} from "react";
import {maybeInjectScript, maybeRemoveScript} from "./utils";
type ExecuteRecaptcha =  (action: string) => Promise<string>
type ContextType = {
    useExecuteReCaptcha: () =>ExecuteRecaptcha
}
export const Context = createContext<ContextType|null>(null)
export type Props = {
    siteKey: string | null
    children: ReactNode
    reCaptchaScriptId?: string
    useRecaptchaNet?:boolean
    enterprise?:boolean
}
const RecaptchaProvider: FunctionComponent<Props> = ({
                                                         siteKey,
                                                         children,
                                                         reCaptchaScriptId = null,
                                                         useRecaptchaNet=false,
                                                         enterprise=false
                                                     }) => {
    useEffect(() => {
        if (reCaptchaScriptId === null) {
            reCaptchaScriptId = 'rusted_labs_react_recaptcha_v3'
        }
        if (null === siteKey) {
            maybeRemoveScript(reCaptchaScriptId)
        } else {
            maybeInjectScript({
                scriptId:reCaptchaScriptId,
                useRecaptchaNet,
                siteKey,
                enterprise
            })
        }
    }, [siteKey])
    const queueRef = useRef<{
        action:string
        onComplete:(token:string)=>void
        onError:(reason:unknown)=>void
    }[]>([])

    const handleNextInQueue = () => {
        queueRef.current.forEach(({action, onComplete}) => {
            const {grecaptcha} = window
            if (grecaptcha && siteKey) {
                grecaptcha.ready(function () {
                    if (grecaptcha.execute) {
                        grecaptcha.execute(siteKey, {action: action}).then(function (token) {
                            onComplete(token)
                        });
                    }
                });
            }

        })
    }
    const executeRecaptcha =async (action: string):Promise<string> => {
        return new Promise((resolve, reject)=>{
            queueRef.current.push({
                action,
                onComplete:resolve,
                onError:reject
            })
            handleNextInQueue()
        })

    }


    return <Context.Provider value={{
        useExecuteReCaptcha: ():ExecuteRecaptcha => executeRecaptcha
    }}>

        {children}
    </Context.Provider>
}
export default RecaptchaProvider
