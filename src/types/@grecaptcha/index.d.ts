declare interface Window {
    grecaptcha: GlobalReCaptcha | undefined
    ___grecaptcha_cfg?: { fns?: unknown[] }
    rusted_labs_recaptcha_callback?: () => void
    rusted_labs_recaptcha_callbacks?: Array<() => void>
}

declare interface GlobalRecaptchaExecuteProps {
    action: string
}
declare interface GlobalReCaptcha {
    ready: (callback: () => void) => void
    execute?: (
        siteKey: string,

        props: GlobalRecaptchaExecuteProps
    ) => Promise<string>
}
