import {createContext, FunctionComponent, ReactNode, useEffect} from "react";
import {maybeInjectScript, maybeRemoveScript} from "./utils";

const Context = createContext<string | null>(null)
export type Props = {
    siteKey: string | null
    children: ReactNode
    reCaptchaScriptId?: string
}
const RecaptchaProvider: FunctionComponent<Props> = ({
                                                         siteKey,
                                                         children,
                                                         reCaptchaScriptId = null
                                                     }) => {
    useEffect(() => {
        if (reCaptchaScriptId === null) {
            reCaptchaScriptId = 'rusted_labs_react_recaptcha_v3'
        }
        if (null === siteKey) {
            maybeRemoveScript(reCaptchaScriptId)
        } else {
            maybeInjectScript(siteKey, reCaptchaScriptId)
        }
    }, [siteKey])
    return <Context.Provider value={siteKey}>

        {children}
    </Context.Provider>
}
export default RecaptchaProvider
