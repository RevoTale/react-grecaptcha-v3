import simulateOnLoad from './simulateOnLoad';

const simulateTokensOnLoad = (
  promises: Promise<string>[],
  options?: { timeout?: number }
) => {
  const promise = Promise.all(promises);
  const stats = simulateOnLoad(options?.timeout);
  return { promise, stats };
};
export default simulateTokensOnLoad;
