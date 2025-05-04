import { key } from './global/globals'

export type ReCaptchaProps = Readonly<{
    siteKey: string
    useRecaptchaNet: boolean
    enterprise: boolean
}>
export const getScriptSrc = ({
    enterprise,
    useRecaptchaNet,
    siteKey,
}: ReCaptchaProps): string => {
    const hostname = useRecaptchaNet ? 'recaptcha.net' : 'www.google.com'
    if (enterprise) {
        return `https://${hostname}/recaptcha/enterprise.js?render=${siteKey}&onload=${key}`
    }
    return `https://${hostname}/recaptcha/api.js?render=${siteKey}&onload=${key}`
}

export type CreatScriptProps = Readonly<{
    id: string
    async: boolean
    defer: boolean
    src: string
    nonce?: string
}>

export type InjectScriptProps = CreatScriptProps & {
    appendTo: 'head' | 'body'
}
export const maybeInjectScript = ({
    appendTo,
    ...scriptProps
}: InjectScriptProps): void => {
    let el = document.querySelector(`script[id=${scriptProps.id}]`)
    if (el === null) {
        el = document.createElement('script')
    }
    Object.assign(el, scriptProps)
    ;(appendTo === 'head' ? document.head : document.body).appendChild(el)
}
export const maybeRemoveScript = (scriptId: string): void => {
    const el = document.querySelector(`script[id=${scriptId}]`)
    if (el !== null) {
        document.head.removeChild(el)
    }
}
