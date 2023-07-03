import { key } from '../../src/global/globals';

const simulateOnLoad = (timeout?: number) => {
  const callback = window[key];
  const tokensResolved = {
    current: 0,
  };
  const tokens: string[] = [];
  const actions: string[] = [];

  if (!callback) {
    throw new Error('No onload');
  }
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
        if (timeout) {
          setTimeout(resolveResult, timeout);
        } else {
          resolveResult();
        }
      });
    },
  };
  callback();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.grecaptcha = undefined;
  return {
    tokensResolved,
    tokens,
    actions,
  };
};
export default simulateOnLoad;
