import { key } from '../../src/global/globals';

const globalStatsKey = 'grecaptcha_stats' as const;
export type GlobalStats = {
  actions: string[];
  tokens: string[];
};
const recaptchaExecuteFixture = (
  siteKey: string,
  { action }: { action: string }
) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window[globalStatsKey].actions.push(action);
  return new Promise(resolve => {
    const resolveResult = () => {
      const token = `fixture_token_228_${action}__${siteKey}`;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window[globalStatsKey].tokens.push(token);
      resolve(token);
    };
    resolveResult();
  });
};
export const getSimulationStats = (): GlobalStats => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let globalStats = window[globalStatsKey];
  if (!globalStats) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window[globalStatsKey] = globalStats = {
      actions: [],
      tokens: [],
    };
  }
  return globalStats;
};
export const getStatSnapshot = (): GlobalStats => {
  const { tokens, actions } = getSimulationStats();
  return {
    tokens: [...tokens],
    actions: [...actions],
  };
};
const simulateTokensOnLoad = (
  promises: () => Promise<string>[]
): { promise: Promise<string[]>; stats: GlobalStats } => {
  const loadScript = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.grecaptcha = {
      execute: recaptchaExecuteFixture,
    };
    const onLoadCallback = window[key];
    if (!onLoadCallback) {
      throw new Error('No onload');
    }
    onLoadCallback();
  };

  const promise = Promise.all(promises());
  loadScript();
  return {
    promise,
    stats: getStatSnapshot(),
  };
};
export default simulateTokensOnLoad;
