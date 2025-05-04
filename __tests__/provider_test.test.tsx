import { key } from '../src/global/globals'
import ReCaptchaProvider, {
    defaultScriptId,
    type ScriptProps,
} from '../src/ReCaptchaProvider'
import { render, waitFor } from '@testing-library/react'
const scriptId = `#${defaultScriptId}`
describe('<RecaptchaProvider />', () => {
    it('inject google recaptcha script to the document', () => {
        render(
            <ReCaptchaProvider siteKey="TESTKEY" useRecaptchaNet>
                <div />
            </ReCaptchaProvider>
        )

        const scriptElm = document.querySelector(scriptId)
        expect(scriptElm).not.toBeNull()
    })

    it('remove google recaptcha script from the document when being unmounted', async () => {
        const { unmount } = render(
            <ReCaptchaProvider siteKey="TESTKEY" useRecaptchaNet>
                <div />
            </ReCaptchaProvider>
        )

        const scriptElm = document.querySelector(scriptId)
        expect(scriptElm).not.toBeNull()

        unmount()

        await waitFor(() => {
            const scriptElm = document.querySelector(scriptId)
            expect(scriptElm).toBeNull()
        })
    })

    it('accept a useRecaptchaNet prop to load recaptcha from recaptcha.net', () => {
        render(
            <ReCaptchaProvider siteKey="TESTKEY" useRecaptchaNet>
                <div />
            </ReCaptchaProvider>
        )

        const scriptElm = document.querySelector(scriptId)

        expect(scriptElm?.getAttribute('src')).toEqual(
            `https://recaptcha.net/recaptcha/api.js?render=TESTKEY&onload=${key}`
        )
    })

    it('accept a injectionDelay prop to delay recaptcha load', done => {
        render(
            <ReCaptchaProvider
                injectionDelay={500}
                siteKey="TESTKEY"
                useRecaptchaNet
            >
                <div />
            </ReCaptchaProvider>
        )

        const scriptElm = document.getElementById(defaultScriptId)

        expect(scriptElm).toEqual(null)
        setTimeout(() => {
            expect(scriptElm).toEqual(null) //Verify a little bit later script still nt loaded
            setTimeout(() => {
                expect(
                    document
                        .getElementById(defaultScriptId)
                        ?.getAttribute('src')
                ).toBe(
                    `https://recaptcha.net/recaptcha/api.js?render=TESTKEY&onload=${key}`
                )
                done()
            }, 300)
        }, 200)
    })

    it('puts a nonce to the script if provided', () => {
        render(
            <ReCaptchaProvider
                scriptProps={{ nonce: 'NONCE' }}
                siteKey="TESTKEY"
            >
                <div />
            </ReCaptchaProvider>
        )

        const scriptElm = document.getElementById(defaultScriptId)

        expect(scriptElm?.getAttribute('nonce')).toEqual('NONCE')
    })

    it('puts a defer to the script if provided', () => {
        render(
            <ReCaptchaProvider
                scriptProps={{
                    nonce: 'NONCE',
                    defer: true,
                }}
                siteKey="TESTKEY"
            >
                <div />
            </ReCaptchaProvider>
        )

        const scriptElm = document.getElementById(defaultScriptId)

        expect(scriptElm?.getAttribute('defer')).toEqual('')
    })

    it('does not reload script if scriptProps object stays the same', () => {
        const { rerender } = render(
            <ReCaptchaProvider
                scriptProps={{ nonce: 'NONCE' }}
                siteKey="TESTKEY"
            >
                <div />
            </ReCaptchaProvider>
        )

        const scriptElm = document.querySelector(scriptId)
        expect(scriptElm).not.toBeNull()

        rerender(
            <ReCaptchaProvider
                scriptProps={{ nonce: 'NONCE' }}
                siteKey="TESTKEY"
            >
                <div />
            </ReCaptchaProvider>
        )

        expect(scriptElm).toBe(document.querySelector(scriptId))
    })

    it('reloads script on scriptProps changes', () => {
        const { rerender } = render(
            <ReCaptchaProvider
                scriptProps={{ async: false, nonce: 'prev_nonce' }}
                siteKey="TESTKEY"
            >
                <div />
            </ReCaptchaProvider>
        )

        const scriptElm = document.querySelector(scriptId)
        expect((scriptElm as HTMLScriptElement).async).toBe(false)
        expect(scriptElm).not.toBeNull()

        rerender(
            <ReCaptchaProvider
                scriptProps={
                    { async: true, nonce: 'second_nonce' } as ScriptProps
                }
                siteKey="TESTKEY"
            >
                <div />
            </ReCaptchaProvider>
        )
        expect(
            (document.querySelector(scriptId)!).nonce
        ).toBe('second_nonce')

        expect(
            (document.querySelector(scriptId)!).async
        ).toBe(true)
        expect(
            (document.querySelector(scriptId)!).defer
        ).toBe(true)
    })

    describe('when using enterprise version', () => {
        it('accept an enterprise prop to load recaptcha from enterprise source', () => {
            render(
                <ReCaptchaProvider enterprise siteKey="TESTKEY">
                    <div />
                </ReCaptchaProvider>
            )

            const scriptElm = document.getElementById(defaultScriptId)

            expect(scriptElm?.getAttribute('src')).toEqual(
                `https://www.google.com/recaptcha/enterprise.js?render=TESTKEY&onload=${key}`
            )
        })

        it('should load recaptcha from recaptcha.net', () => {
            render(
                <ReCaptchaProvider enterprise siteKey="TESTKEY" useRecaptchaNet>
                    <div />
                </ReCaptchaProvider>
            )

            const scriptElm = document.getElementById(defaultScriptId)

            expect(scriptElm?.getAttribute('src')).toEqual(
                `https://recaptcha.net/recaptcha/enterprise.js?render=TESTKEY&onload=${key}`
            )
        })
    })
})
