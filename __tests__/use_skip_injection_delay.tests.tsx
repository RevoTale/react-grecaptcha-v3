import { FunctionComponent, ReactNode } from 'react';
import { useSkipInjectionDelay } from '../src';
import { key } from '../src/global/globals';
import ReCaptchaProvider, { defaultScriptId } from '../src/ReCaptchaProvider';
import { renderHook } from '@testing-library/react-hooks';

const TestWrapper: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => (
  <ReCaptchaProvider siteKey="TESTKEY" injectionDelay={1000} useRecaptchaNet>
    {children}
  </ReCaptchaProvider>
);
describe('useSkipInjectionDelay hook', () => {
  it('Recaptcha immediately loaded', () => {
    const { result } = renderHook(() => useSkipInjectionDelay(), {
      wrapper: TestWrapper,
    });
    expect(document.getElementById(defaultScriptId)).toEqual(null);
    result.current();
    const script = document.getElementById(defaultScriptId);
    expect(typeof script).toEqual('object');
    expect(script?.getAttribute('src')).toEqual(
      `https://recaptcha.net/recaptcha/api.js?render=TESTKEY&onload=${key}`
    );
  });
});
