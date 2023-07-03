import { FunctionComponent, ReactNode } from 'react';
import { queueKey } from '../src/global/globals';
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
  <ReCaptchaProvider siteKey="TESTKEY" injectionDelay={500}>
    {children}
  </ReCaptchaProvider>
);
const TestEmptyWrapper: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <div>{children}</div>;

describe('useExecuteReCaptcha hook', () => {
  beforeEach(() => {
    const queue = window[queueKey];
    if (queue && queue.length > 0) {
      throw new Error('Global state not reset ' + queue.length);
    }
  });
  it('Return correct value', () => {
    const { result } = renderHook(() => useExecuteReCaptcha(), {
      wrapper: TestWrapper,
    });
    expect(typeof result.current).toEqual('function');
  });
  it('Fails on promise', async () => {
    const action = makeExecute(TestEmptyWrapper);
    expect(action('failed_action_reason_context')).rejects.toThrow(
      'Recaptcha context not injected. failed_action_reason_context missed'
    );
  });
  it('Event fired during injectionDelay timeout are sent', async () => {
    const actionCall = makeExecute(TestDelayWrapper);
    const promises: Promise<string>[] = [];
    const expectedResult: string[] = [];
    for (let i = 0; i < 4; i++) {
      promises.push(actionCall(`some_action_${i}`));
      expectedResult.push(`fixture_token_228_some_action_${i}__TESTKEY`);
    }
    const { stats } = simulateTokensOnLoad(promises);
    await new Promise<string>(resolve => {
      setTimeout(() => {
        resolve('nothing');
      }, 1000);
    }); //Wait until recaptcha loads

    expect(await Promise.all(promises)).toEqual(expectedResult);
    expect(stats.tokensResolved.current).toEqual(4);
    expect(stats.tokens).toEqual(expectedResult);
  });

  it('Prevent duplicate call and make sure valid parameters passed', async () => {
    console.log(window[queueKey]?.length);
    const actionCall = makeExecute(TestWrapper);
    console.error(window[queueKey]?.length);
    expect(window[queueKey]).toEqual([]);
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
    const actionCall = makeExecute(TestDelayWrapper);

    const { promise, stats } = simulateTokensOnLoad(
      [
        actionCall('delayed_action'),
        actionCall('delayed_action_2'),
        actionCall('delayed_action_3'),
      ],
      {
        timeout: 500,
      }
    );
    expect(stats.tokensResolved.current).toEqual(0);
    await new Promise(resolve => {
      setTimeout(resolve, 200);
    });
    expect(stats.tokensResolved.current).toEqual(0);
    expect(promise).resolves.toEqual([
      'fixture_token_228_delayed_action__TESTKEY',
      'fixture_token_228_delayed_action_2__TESTKEY',
      'fixture_token_228_delayed_action_3__TESTKEY',
    ]);
    await promise;
    expect(stats.tokensResolved.current).toEqual(3);
  });
});
