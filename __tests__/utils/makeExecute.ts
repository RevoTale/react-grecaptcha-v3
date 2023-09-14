import { renderHook } from '@testing-library/react-hooks'
import { FunctionComponent, ReactNode } from 'react'
import useExecuteReCaptcha from '../../src/useExecuteReCaptcha'

const makeExecute = (wrapper: FunctionComponent<{ children: ReactNode }>) => {
    const { result } = renderHook(() => useExecuteReCaptcha(), {
        wrapper,
    })
    return async (action: string) => {
        return await result.current(action)
    }
}

export default makeExecute
