const unsubscribeOnLoad = (item: () => void) => {
  const callbacks = window.rusted_labs_recaptcha_callbacks || [];
  const index = callbacks.indexOf(item);
  if (index > -1) {
    callbacks.splice(index, 1);
  }
};
export default unsubscribeOnLoad;
