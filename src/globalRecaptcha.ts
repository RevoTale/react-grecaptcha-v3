export type GlobalRecaptchaExecuteProps = {
    action:string
}
export type GlobalReCaptcha = {
    ready:(callback:()=>void)=>void
    execute:(siteKey:string,props:GlobalRecaptchaExecuteProps)=>Promise<string>
}
