import { renderHook } from '@testing-library/react'
import type { FunctionComponent, ReactNode } from 'react'
import useExecuteReCaptcha from '../../src/useExecuteReCaptcha'

const makeExecute = (wrapper: FunctionComponent<{ children: ReactNode }>) => {
    const { result } = renderHook(() => useExecuteReCaptcha(), {
        wrapper,
    })
    return async (action: string) => await result.current(action)
}

export default makeExecute
