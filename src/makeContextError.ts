const makeContextError = (info: string) => {
  const msg = `Recaptcha context not injected.${info}`;
  console.warn(msg);
  return new Error(msg);
};
export default makeContextError;
