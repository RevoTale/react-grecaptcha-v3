import ReCaptchaProvider, { defaultScriptId } from '../src/ReCaptchaProvider';
import { render, waitFor } from '@testing-library/react';
const scriptId = `#${defaultScriptId}`;
describe('<RecaptchaProvider />', () => {
  it('inject google recaptcha script to the document', () => {
    render(
      <ReCaptchaProvider siteKey="TESTKEY" useRecaptchaNet>
        <div />
      </ReCaptchaProvider>
    );

    const scriptElm = document.querySelector(scriptId);
    expect(scriptElm).not.toBeNull();
  });

  it('remove google recaptcha script from the document when being unmounted', async () => {
    const { unmount } = render(
      <ReCaptchaProvider siteKey="TESTKEY" useRecaptchaNet>
        <div />
      </ReCaptchaProvider>
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
      <ReCaptchaProvider siteKey="TESTKEY" useRecaptchaNet>
        <div />
      </ReCaptchaProvider>
    );

    const scriptElm = document.querySelector(scriptId);

    expect(scriptElm?.getAttribute('src')).toEqual(
      'https://recaptcha.net/recaptcha/api.js?render=TESTKEY&onload=rusted_labs_recaptcha_callback'
    );
  });

  it('accept a injectionDelay prop to delay recaptcha load', done => {
    render(
      <ReCaptchaProvider siteKey="TESTKEY" injectionDelay={500} useRecaptchaNet>
        <div />
      </ReCaptchaProvider>
    );

    const scriptElm = document.getElementById(defaultScriptId);

    expect(scriptElm).toEqual(null);
    setTimeout(() => {
      expect(scriptElm).toEqual(null); //Verify a little bit later script still nt loaded
      setTimeout(() => {
        expect(
          document.getElementById(defaultScriptId)?.getAttribute('src')
        ).toBe(
          'https://recaptcha.net/recaptcha/api.js?render=TESTKEY&onload=rusted_labs_recaptcha_callback'
        );
        done();
      }, 300);
    }, 200);
  });

  it('puts a nonce to the script if provided', () => {
    render(
      <ReCaptchaProvider siteKey="TESTKEY" scriptProps={{ nonce: 'NONCE' }}>
        <div />
      </ReCaptchaProvider>
    );

    const scriptElm = document.getElementById(defaultScriptId);

    expect(scriptElm?.getAttribute('nonce')).toEqual('NONCE');
  });

  it('puts a defer to the script if provided', () => {
    render(
      <ReCaptchaProvider
        siteKey="TESTKEY"
        scriptProps={{
          nonce: 'NONCE',
          defer: true,
        }}
      >
        <div />
      </ReCaptchaProvider>
    );

    const scriptElm = document.getElementById(defaultScriptId);

    expect(scriptElm?.getAttribute('defer')).toEqual('');
  });

  it('does not reload script if scriptProps object stays the same', async () => {
    const { rerender } = render(
      <ReCaptchaProvider siteKey="TESTKEY" scriptProps={{ nonce: 'NONCE' }}>
        <div />
      </ReCaptchaProvider>
    );

    const scriptElm = document.querySelector(scriptId);
    expect(scriptElm).not.toBeNull();

    rerender(
      <ReCaptchaProvider siteKey="TESTKEY" scriptProps={{ nonce: 'NONCE' }}>
        <div />
      </ReCaptchaProvider>
    );

    expect(scriptElm).toBe(document.querySelector(scriptId));
  });

  it('reloads script on scriptProps changes', async () => {
    const { rerender } = render(
      <ReCaptchaProvider
        siteKey="TESTKEY"
        scriptProps={{ async: false, nonce: 'prev_nonce' }}
      >
        <div />
      </ReCaptchaProvider>
    );

    const scriptElm = document.querySelector(scriptId);
    expect((scriptElm as HTMLScriptElement).async).toBe(false);
    expect(scriptElm).not.toBeNull();

    rerender(
      <ReCaptchaProvider
        siteKey="TESTKEY"
        scriptProps={{ async: true, nonce: 'second_nonce' }}
      >
        <div />
      </ReCaptchaProvider>
    );
    expect((document.querySelector(scriptId) as HTMLScriptElement).nonce).toBe(
      'second_nonce'
    );

    expect((document.querySelector(scriptId) as HTMLScriptElement).async).toBe(
      true
    );
    expect((document.querySelector(scriptId) as HTMLScriptElement).defer).toBe(
      true
    );
  });

  describe('when using enterprise version', () => {
    it('accept an enterprise prop to load recaptcha from enterprise source', () => {
      render(
        <ReCaptchaProvider siteKey="TESTKEY" enterprise>
          <div />
        </ReCaptchaProvider>
      );

      const scriptElm = document.getElementById(defaultScriptId);

      expect(scriptElm?.getAttribute('src')).toEqual(
        'https://www.google.com/recaptcha/enterprise.js?render=TESTKEY&onload=rusted_labs_recaptcha_callback'
      );
    });

    it('should load recaptcha from recaptcha.net', () => {
      render(
        <ReCaptchaProvider siteKey="TESTKEY" enterprise useRecaptchaNet>
          <div />
        </ReCaptchaProvider>
      );

      const scriptElm = document.getElementById(defaultScriptId);

      expect(scriptElm?.getAttribute('src')).toEqual(
        'https://recaptcha.net/recaptcha/enterprise.js?render=TESTKEY&onload=rusted_labs_recaptcha_callback'
      );
    });
  });
});
