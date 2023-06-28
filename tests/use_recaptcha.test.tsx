import { FunctionComponent, ReactNode } from 'react';
import ReCaptchaProvider from '../src/ReCaptchaProvider';
import useExecuteReCaptcha from '../src/useExecuteReCaptcha';
import { renderHook } from '@testing-library/react-hooks';

const TestWrapper: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <ReCaptchaProvider siteKey="TESTKEY">{children}</ReCaptchaProvider>;

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

describe('captcha call test', () => {
  it('prevent duplicate call and make sure valid parameters passed', async () => {
    const { result } = renderHook(() => useExecuteReCaptcha(), {
      wrapper: TestWrapper,
    });

    const actionCall = async (action: string) => {
      return await result.current(action);
    };
    let totalActionCalls = 0;
    // @ts-ignore
    window.grecaptcha = {
      execute: (siteKey, { action }) => {
        return new Promise(resolve => {
          totalActionCalls++;
          resolve(`fixture_token_228_${action}__${siteKey}`);
        });
      },
      ready: callback => {
        callback();
      },
    };
    await expect(actionCall('some_action')).resolves.toEqual(
      'fixture_token_228_some_action__TESTKEY'
    );
    await expect(actionCall('some_action_2')).resolves.toEqual(
      'fixture_token_228_some_action_2__TESTKEY'
    );
    await expect(actionCall('another_action')).resolves.toEqual(
      'fixture_token_228_another_action__TESTKEY'
    );
    expect(totalActionCalls).toEqual(3);
  });
});
