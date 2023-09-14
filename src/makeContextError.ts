const makeContextError = (info: string) => {
    return new Error(`Recaptcha context not injected. ${info}`)
}
export default makeContextError
