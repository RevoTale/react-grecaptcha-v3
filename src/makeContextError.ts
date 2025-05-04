const makeContextError = (info: string) => new Error(`Recaptcha context not injected. ${info}`)
export default makeContextError
