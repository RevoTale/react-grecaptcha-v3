declare interface Window {
    grecaptcha: GlobalReCaptcha | undefined
    ___grecaptcha_cfg?: { fns?: unknown[] }
    rusted_labs_recaptcha_callback?: () => void
    rusted_labs_recaptcha_callbacks?: (() => void)[]
}

declare type GlobalRecaptchaExecuteProps = {
    action: string
}
declare type GlobalReCaptcha = {
    // eslint-disable-next-line no-unused-vars
    ready: (callback: () => void) => void
    execute?: (
        // eslint-disable-next-line no-unused-vars
        siteKey: string,
        // eslint-disable-next-line no-unused-vars
        props: GlobalRecaptchaExecuteProps
    ) => Promise<string>
}
