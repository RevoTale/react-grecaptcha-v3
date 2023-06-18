import { FunctionComponent, ReactNode } from 'react';
import RecaptchaProvider from '../src/RecaptchaProvider';
import useExecuteReCaptcha from '../src/useExecuteReCaptcha';
import { renderHook } from '@testing-library/react-hooks';

const TestWrapper: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <RecaptchaProvider siteKey="TESTKEY">{children}</RecaptchaProvider>;

const TestEmptyWrapper: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <div>{children}</div>;
describe('useExecuteReCaptcha hook', () => {
  it('return google recaptcha context value', () => {
    const { result } = renderHook(() => useExecuteReCaptcha(), {
      wrapper: TestWrapper,
    });

    expect(typeof result.current).toEqual('function');
  });
});

describe('useExecuteReCaptcha hook fail', () => {
  it('google recaptcha returns failed for promise', async () => {
    const failingContext = async () => {
      const { result } = renderHook(() => useExecuteReCaptcha(), {
        wrapper: TestEmptyWrapper,
      });
      return await result.current('some_action');
    };
    await expect(failingContext).rejects.toThrow(
      'Recaptcha context not injected. some_action missed'
    );
  });
});
