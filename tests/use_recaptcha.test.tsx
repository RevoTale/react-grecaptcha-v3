import { FunctionComponent, ReactNode } from 'react';
import RecaptchaProvider from '../src/RecaptchaProvider';
import useExecuteReCaptcha from '../src/useExecuteReCaptcha';
import { renderHook } from '@testing-library/react-hooks';

const TestWrapper: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <RecaptchaProvider siteKey="TESTKEY">{children}</RecaptchaProvider>;

describe('useGoogleReCaptcha hook', () => {
  it('return google recaptcha context value', () => {
    const { result } = renderHook(() => useExecuteReCaptcha(), {
      wrapper: TestWrapper,
    });

    expect(result.current).not.toEqual(result);
  });
});
