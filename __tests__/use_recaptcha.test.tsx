import type { FunctionComponent, ReactNode } from 'react'
import ReCaptchaProvider from '../src/ReCaptchaProvider'
import useExecuteReCaptcha from '../src/useExecuteReCaptcha'
import { renderHook } from '@testing-library/react'
import makeExecute from './utils/makeExecute'
import simulateTokensOnLoad, {
    getStatSnapshot,
} from './utils/simulateTokensOnLoad'
const TestWrapper: FunctionComponent<{
    children: ReactNode
}> = ({ children }) => (
    <ReCaptchaProvider siteKey="TESTKEY">{children}</ReCaptchaProvider>
)
const TestDelayWrapper: FunctionComponent<{ children: ReactNode }> = ({
    children,
}) => (
    <ReCaptchaProvider injectionDelay={500} siteKey="TESTKEY">
        {children}
    </ReCaptchaProvider>
)
const TestEmptyWrapper: FunctionComponent<{ children: ReactNode }> = ({
    children,
}) => <div>{children}</div>

describe('useExecuteReCaptcha hook', () => {
    it('Return correct value', () => {
        const { result } = renderHook(() => useExecuteReCaptcha(), {
            wrapper: TestWrapper,
        })
        expect(typeof result.current).toEqual('function')
    })
    it('Fails on promise', async () => {
        const { promise } = simulateTokensOnLoad(() => {
            const action = makeExecute(TestEmptyWrapper)
            return [action('failed_action_reason_context')]
        })

        await expect(promise).rejects.toThrow(
            'Recaptcha context not injected. failed_action_reason_context missed'
        )
    })
    it('Event fired during injectionDelay timeout are sent', async () => {
        const expectedResult: string[] = []
        const before = getStatSnapshot()
        const { promise } = simulateTokensOnLoad(() => {
            const actionCall = makeExecute(TestDelayWrapper)

            const promises: Array<Promise<string>> = []
            for (let i = 0; i < 4; i++) {
                promises.push(actionCall(`some_action_${i}`))
                expectedResult.push(
                    `fixture_token_228_some_action_${i}__TESTKEY`
                )
            }
            return promises
        })
        await expect(promise).resolves.toEqual(expectedResult)
        expect(getStatSnapshot().tokens.splice(before.tokens.length)).toEqual(
            expectedResult
        )
        expect(getStatSnapshot().tokens.length - before.tokens.length).toEqual(
            4
        )
    })

    it('Prevent duplicate call and make sure valid parameters passed', async () => {
        const before = getStatSnapshot()
        const result = [
            'fixture_token_228_dup_call__TESTKEY',
            'fixture_token_228_dup_call_2__TESTKEY',
            'fixture_token_228_dup_call_3__TESTKEY',
        ]
        const { promise } = simulateTokensOnLoad(() => {
            const actionCall = makeExecute(TestWrapper)

            return [
                actionCall('dup_call'),
                actionCall('dup_call_2'),
                actionCall('dup_call_3'),
            ]
        })
        await expect(promise).resolves.toEqual(result)
        const stats = getStatSnapshot()
        expect([...stats.tokens].splice(before.tokens.length)).toEqual(result)
        expect(stats.tokens.length - before.tokens.length).toEqual(3)
    })
    it('Prevent duplicate call for delay', async () => {
        const actionCall = makeExecute(TestDelayWrapper)

        const before = getStatSnapshot().tokens

        const { promise } = simulateTokensOnLoad(() => [
            actionCall('delayed_action'),
            actionCall('delayed_action_2'),
            actionCall('delayed_action_3'),
        ])
        const result = [
            'fixture_token_228_delayed_action__TESTKEY',
            'fixture_token_228_delayed_action_2__TESTKEY',
            'fixture_token_228_delayed_action_3__TESTKEY',
        ]
        await expect(promise).resolves.toEqual(result)
        expect(getStatSnapshot().tokens.splice(before.length)).toEqual(result)
        expect(getStatSnapshot().tokens.length - before.length).toEqual(
            result.length
        )
    })
})
