const makeContextError = (info: string):Error => new Error(`Recaptcha context not injected. ${info}`)
export default makeContextError
