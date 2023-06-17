import RecaptchaProvider, { defaultScriptId } from '../src/RecaptchaProvider';
import { render, waitFor } from '@testing-library/react';
const scriptId = `#${defaultScriptId}`;
describe('<RecaptchaProvider />', () => {
  it('inject google recaptcha script to the document', () => {
    render(
      <RecaptchaProvider siteKey="TESTKEY" useRecaptchaNet>
        <div />
      </RecaptchaProvider>
    );

    const scriptElm = document.querySelector(scriptId);
    expect(scriptElm).not.toBeNull();
  });

  it('remove google recaptcha script from the document when being unmounted', async () => {
    const { unmount } = render(
      <RecaptchaProvider siteKey="TESTKEY" useRecaptchaNet>
        <div />
      </RecaptchaProvider>
    );

    const scriptElm = document.querySelector(scriptId);
    expect(scriptElm).not.toBeNull();

    unmount();

    await waitFor(() => {
      const scriptElm = document.querySelector(scriptId);
      expect(scriptElm).toBeNull();
    });
  });

  it('accept a useRecaptchaNet prop to load recaptcha from recaptcha.net', () => {
    render(
      <RecaptchaProvider siteKey="TESTKEY" useRecaptchaNet>
        <div />
      </RecaptchaProvider>
    );

    const scriptElm = document.querySelector(scriptId);

    expect(scriptElm?.getAttribute('src')).toEqual(
      'https://recaptcha.net/recaptcha/api.js?render=TESTKEY'
    );
  });

  it('puts a nonce to the script if provided', () => {
    render(
      <RecaptchaProvider siteKey="TESTKEY" scriptProps={{ nonce: 'NONCE' }}>
        <div />
      </RecaptchaProvider>
    );

    const scriptElm = document.getElementById(defaultScriptId);

    expect(scriptElm?.getAttribute('nonce')).toEqual('NONCE');
  });

  it('puts a defer to the script if provided', () => {
    render(
      <RecaptchaProvider
        siteKey="TESTKEY"
        scriptProps={{
          nonce: 'NONCE',
          defer: true,
        }}
      >
        <div />
      </RecaptchaProvider>
    );

    const scriptElm = document.getElementById(defaultScriptId);

    expect(scriptElm?.getAttribute('defer')).toEqual('');
  });

  it('does not reload script if scriptProps object stays the same', async () => {
    const { rerender } = render(
      <RecaptchaProvider siteKey="TESTKEY" scriptProps={{ nonce: 'NONCE' }}>
        <div />
      </RecaptchaProvider>
    );

    const scriptElm = document.querySelector(scriptId);
    expect(scriptElm).not.toBeNull();

    rerender(
      <RecaptchaProvider siteKey="TESTKEY" scriptProps={{ nonce: 'NONCE' }}>
        <div />
      </RecaptchaProvider>
    );

    expect(scriptElm).toBe(document.querySelector(scriptId));
  });

  it('reloads script on scriptProps changes', async () => {
    const { rerender } = render(
      <RecaptchaProvider siteKey="TESTKEY" scriptProps={{ async: false }}>
        <div />
      </RecaptchaProvider>
    );

    const scriptElm = document.querySelector(scriptId);
    expect((scriptElm as HTMLScriptElement).async).toBe(false);
    expect(scriptElm).not.toBeNull();

    rerender(
      <RecaptchaProvider siteKey="TESTKEY" scriptProps={{ async: true }}>
        <div />
      </RecaptchaProvider>
    );

    expect(scriptElm).not.toBe(document.querySelector(scriptId));
    expect((scriptElm as HTMLScriptElement).async).toBe(true);
    expect((scriptElm as HTMLScriptElement).defer).toBe(true);
  });

  describe('when using enterprise version', () => {
    it('accept an enterprise prop to load recaptcha from enterprise source', () => {
      render(
        <RecaptchaProvider siteKey="TESTKEY" enterprise>
          <div />
        </RecaptchaProvider>
      );

      const scriptElm = document.getElementById(defaultScriptId);

      expect(scriptElm?.getAttribute('src')).toEqual(
        'https://www.google.com/recaptcha/enterprise.js?render=TESTKEY'
      );
    });

    it('should load recaptcha from recaptcha.net', () => {
      render(
        <RecaptchaProvider siteKey="TESTKEY" enterprise useRecaptchaNet>
          <div />
        </RecaptchaProvider>
      );

      const scriptElm = document.getElementById(scriptId);

      expect(scriptElm?.getAttribute('src')).toEqual(
        'https://recaptcha.net/recaptcha/enterprise.js?render=TESTKEY'
      );
    });
  });
});
