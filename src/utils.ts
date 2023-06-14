export const createScript = (siteKey: string, scriptId: string): HTMLScriptElement => {
    const el = document.createElement('script')
    el.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    el.id = scriptId
    return el
}

export const maybeInjectScript = (siteKey: string, scriptId: string): HTMLScriptElement => {
    const el = document.querySelector(`script[id=${scriptId}]`)
    if (null === el) {
        return document.head.appendChild(createScript(siteKey, scriptId))
    }
    return el as HTMLScriptElement
}
export const maybeRemoveScript = (scriptId: string):void => {
    const el = document.querySelector(`script[id=${scriptId}]`)
    if (null !== el) {
        document.head.removeChild(el)
    }
}
