import { key } from '../../src/global/globals';
import { Stats } from './simulateOnLoad';

const simulateTokensOnLoad = (
  promises: () => Promise<string>[],
  options?: { actionThrottle?: number; scriptThrottle?: number }
): { promise: Promise<string[]>; stats: Stats } => {
  const tokensResolved = {
    current: 0,
  };
  const { actionThrottle, scriptThrottle } = options ?? {};
  const tokens: string[] = [];
  const actions: string[] = [];
  const loadScript = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.grecaptcha = {
      execute: (siteKey: string, { action }: { action: string }) => {
        actions.push(action);
        return new Promise(resolve => {
          const resolveResult = () => {
            const token = `fixture_token_228_${action}__${siteKey}`;
            tokensResolved.current++;
            tokens.push(token);
            resolve(token);
          };
          if (actionThrottle) {
            setTimeout(resolveResult, actionThrottle);
          } else {
            resolveResult();
          }
        });
      },
    };
    const onLoadCallback = window[key];
    if (!onLoadCallback) {
      throw new Error('No onload');
    }
    onLoadCallback();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    //window.grecaptcha = undefined;
  };

  const promise = Promise.all(promises());
  if (scriptThrottle) {
    setTimeout(loadScript, scriptThrottle);
  } else {
    loadScript();
  }
  //window[queueKey] = undefined;
  return {
    promise,
    stats: {
      tokensResolved,
      tokens,
      actions,
    },
  };
};
export default simulateTokensOnLoad;
