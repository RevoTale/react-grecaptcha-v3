
export type ScriptProps = {
    siteKey: string, scriptId: string,useRecaptchaNet:boolean,enterprise:boolean
}
const getUrl = ({enterprise,useRecaptchaNet,siteKey}:ScriptProps):string=>{
    const hostname = useRecaptchaNet ? "recaptcha.net" : "www.google.com";
    if (enterprise) {
        return `https://${hostname}/recaptcha/enterprise.js?render=explicit`;
    }
    return `https://${hostname}/recaptcha/api.js?render=${siteKey}`
}
export const prepareGlobalObject =()=>{
    if(typeof window.grecaptcha === 'undefined') {
        window.grecaptcha = {
            execute:()=>{
            },
            ready(cb){
                if(typeof window.grecaptcha === 'undefined') {
                    // window.__grecaptcha_cfg is a global variable that stores reCAPTCHA's
                    // configuration. By default, any functions listed in its 'fns' property
                    // are automatically executed when reCAPTCHA loads.
                    const c = '___grecaptcha_cfg';
                    // @ts-ignore
                    window[c] = window[c] || {};
                    // @ts-ignore
                    (window[c]['fns'] = window[c]['fns']||[]).push(cb);
                } else {
                    cb();
                }
            }
        };
    }
}
export const createScript = (props:ScriptProps): HTMLScriptElement => {
    const el = document.createElement('script')
    el.id = props.scriptId
    el.async = true
    el.defer = true
    el.src = getUrl(props)
    return el
}

export const maybeInjectScript = (props:ScriptProps): HTMLScriptElement => {
    const el = document.querySelector(`script[id=${props.scriptId}]`)
    if (null === el) {
        return document.head.appendChild(createScript(props))
    }
    return el as HTMLScriptElement
}
export const maybeRemoveScript = (scriptId: string):void => {
    const el = document.querySelector(`script[id=${scriptId}]`)
    if (null !== el) {
        document.head.removeChild(el)
    }
}
