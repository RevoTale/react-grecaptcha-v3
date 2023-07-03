import { key } from '../../src/global/globals';
export type Stats = {
  tokens: string[];
  actions: string[];
  tokensResolved: { current: number };
};
const simulateOnLoad = (timeout?: number): Stats => {};
export default simulateOnLoad;
