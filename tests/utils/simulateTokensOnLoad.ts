import simulateOnLoad, { Stats } from './simulateOnLoad';

const simulateTokensOnLoad = (
  promises: Promise<string>[],
  options?: { timeout?: number }
): { promise: Promise<string[]>; stats: Stats } => {
  const promise = Promise.all(promises);
  const stats = simulateOnLoad(options?.timeout);
  return { promise, stats };
};
export default simulateTokensOnLoad;
