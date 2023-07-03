import { FunctionComponent, ReactNode } from 'react';
import ReCaptchaProvider from '../src/ReCaptchaProvider';
import useExecuteReCaptcha from '../src/useExecuteReCaptcha';
import { renderHook } from '@testing-library/react-hooks';
import makeExecute from './utils/makeExecute';
import simulateTokensOnLoad from './utils/simulateTokensOnLoad';
const TestWrapper: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  return <ReCaptchaProvider siteKey="TESTKEY">{children}</ReCaptchaProvider>;
};
const TestDelayWrapper: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => (
  <ReCaptchaProvider siteKey="TESTKEY" injectionDelay={1000}>
    {children}
  </ReCaptchaProvider>
);
const TestEmptyWrapper: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <div>{children}</div>;

describe('useExecuteReCaptcha hook', () => {
  it('Return correct value', () => {
    const { result } = renderHook(() => useExecuteReCaptcha(), {
      wrapper: TestWrapper,
    });
    expect(typeof result.current).toEqual('function');
  });
  it('Fails on promise', async () => {
    const action = makeExecute(TestEmptyWrapper);
    expect(action('failed_action_reason_context')).rejects.toThrow(
      'Recaptcha context not injected. some_action missed'
    );
  });
  it('Event fired during injectionDelay timeout are sent', async () => {
    const actionCall = makeExecute(TestDelayWrapper);
    const promises: Promise<string>[] = [];
    for (let i = 0; i < 4; i++) {
      promises.push(actionCall(`some_action_${i}`));
    }
    await new Promise<string>(resolve => {
      setTimeout(() => {
        resolve('nothing');
      }, 1000);
    }); //Wait until recaptcha loads
    for (let i = 0; i < 4; i++) {
      await expect(promises[i]).rejects.toEqual(
        `fixture_token_228_some_action_${i}__TESTKEY`
      );
    }
  });

  it('Prevent duplicate call and make sure valid parameters passed', async () => {
    const actionCall = makeExecute(TestWrapper);
    const { promise, stats } = simulateTokensOnLoad([
      actionCall('dup_call'),
      actionCall('dup_call_2'),
      actionCall('dup_call_3'),
    ]);
    const tokens = await promise;
    expect(tokens).toEqual([
      'fixture_token_228_dup_call__TESTKEY',
      'fixture_token_228_dup_call_2__TESTKEY',
      'fixture_token_228_dup_call_3__TESTKEY',
    ]);
    expect(stats.tokensResolved.current).toEqual(3);
  });
  it('Prevent duplicate call for delay', async () => {
    const totalActionCalls = 0;
    const actionCall = makeExecute(TestDelayWrapper);

    await expect(actionCall('some_action')).resolves.toEqual(
      'fixture_token_228_some_action__TESTKEY'
    );
    await expect(actionCall('some_action_2')).resolves.toEqual(
      'fixture_token_228_some_action_2__TESTKEY'
    );

    expect(totalActionCalls).toEqual(2);
    const action = actionCall('another_action');

    expect(totalActionCalls).toEqual(2);
    await new Promise(resolve => {
      setTimeout(resolve, 500);
    });
    await expect(action).resolves.toEqual(
      'fixture_token_228_another_action__TESTKEY'
    );
    expect(totalActionCalls).toEqual(3);
  });
});
