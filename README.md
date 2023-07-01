
# @rusted/react-recaptcha-v3

Tired of a bad [PageSpeed Insights](https://pagespeed.web.dev/) score? Take control of how your Google reCAPTCHA scripts are loaded without losing invisible reCAPTCHA benefits.

Best [React](https://reactjs.org/) library for integrating Google reCAPTCHA v3 to your app.

![type definition](https://img.shields.io/npm/types/@rusted/react-recaptcha-v3)
[![npm package](https://img.shields.io/npm/v/@rusted/react-recaptcha-v3/latest.svg)](https://www.npmjs.com/package/react-google-recaptcha-v3)



## Install
```bash
yarn add @rusted/react-recaptcha-v3
```
```bash
pnpm add @rusted/react-recaptcha-v3'
```
```bash
npm install @rusted/react-recaptcha-v3'
```

## Usage

#### Get a site key from your Google reCaptcha dashboard

To use `@rusted/react-recaptcha-v3`, you need to create a recaptcha key for your domain, you can get one from [here](https://www.google.com/recaptcha/intro/v3.html).

In case you are migrating to enterprice version Check the [migration guide](https://cloud.google.com/recaptcha-enterprise/docs/migrate-recaptcha)

#### Components

##### ReCaptchaProvider

`@rusted/react-recaptcha-v3` provides a `ReCaptchaProvider` provider component that should be used to wrap around your components.

`ReCaptchaProvider`'s responsibility is to load the necessary reCaptcha script and provide access to reCaptcha to the rest of your application.

Usually, your application only needs one provider. You should place it as high as possible in your React tree. It's to make sure you only have one instance of Google Recaptcha per page and it doesn't reload unecessarily when your components re-rendered.

Same thing applied when you use this library with framework such as Next.js or React Router and only want to include the script on a single page. Try to make sure you only have one instance of the provider on a React tree and to place it as high (on the tree) as possible.

| **Props**            |     **Type**     | **Default** | **Required?** | **Note**                                                                                                                                                                                                                                                        |
|----------------------|:----------------:| ----------: | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| siteKey         |      String / null    |             | Yes           | Your recaptcha key, get one from [here](https://www.google.com/recaptcha/intro/v3.html). In case `null` provided events still will be recorded. Those events will be sent when `siteKey` provided.     Also, google recaptcha script will not be loaded until `siteKey` provided.       This can be helpful in case you want take control of this process. For example, to reduce impact of recaptcha on your [pagespeed score](https://pagespeed.web.dev)   .                                                                                     |
| scriptProps          |      Object      |             | No            | The injected `script` tag can be customized with this prop. It allows you to add `async`, `defer`, `nonce` attributes to the script tag. `appendTo` attribute controls whether the injected script will be added to the document body or head with . |
| useRecaptchaNet      |     Boolean      |       false | No            | Load script from `recaptcha.net instead of google domain. This can help to workaround ad blockers.  https://developers.google.com/recaptcha/docs/faq#can-i-use-recaptcha-globally                                                                                         |
| enterprise        |     Boolean      |       false | No            | [Enterprise option](#enterprise)                                                                                                                                                                                                                                | 
| injectionDelay        |     Integer      |       false | No            | In case you don't want to blow up your [PageInsights Score](https://pagespeed.web.dev) you can defer script loading  by specifing threshold time. Events will be recorded and flushed at once on script load. Timeout should be specified in milliseconds. Plase note, that in case `injectionDelay` changed timeout is reseted.                                                                                                                                                 |   

```javascript
import { ReCaptchaProvider } from '@rusted/react-recaptcha-v3';

ReactDOM.render(
    <ReCaptchaProvider
        siteKey={ [string | null] } //Your Google reCaptcha key or null
        useRecaptchaNet={ [true | false | undefined] }
        enterprise={ [true | false | undefined] }
        scriptProps={{
            async: false, // optional, default to false,
            defer: false, // optional, default to false
            appendTo: 'head', // optional, default to "head", can be "head" or "body",
            nonce: undefined // optional, string or undefined
        }}
        injectionDelay={5000}
    >
        <AppLayout />
    </ReCaptchaProvider>,
    document.getElementById('app')
);
```




#### React Hook: useGoogleReCaptcha
There is only one way to call Google reCaptcha. Hook `useExecuteReCaptcha`.

The function returned by `useGoogleReCaptcha` returns promise with resolved reCaptcha token result. This token is used to validate protection score on your server-side and decide whether user is bot or not.
Please note, in case your parent component tree not wrapped by `ReCaptchaProvider` a consle error will be shown and event will be ignored.

Use the hook as provided in the following example.

```javascript
import { ReCaptchaProvider,useExecuteReCaptcha } from '@rusted/react-recaptcha-v3';

const GoogleReCaptchaValidatorComponent = () => {
    const executeRecaptcha = useExecuteReCaptcha();

    // Create an event handler so you can call the verification on button click event or form submit
    const handleReCaptchaVerify = useCallback(async () => {
        const token = await executeRecaptcha('userAction');
        // Do whatever you want with the token
    }, [executeRecaptcha]);

    // You can use useEffect to trigger the verification as soon as the component being loaded
    useEffect(() => {
        handleReCaptchaVerify();
    }, [handleReCaptchaVerify]);

    return <button onClick={handleReCaptchaVerify}>Verify recaptcha</button>;
};

ReactDOM.render(
    <ReCaptchaProvider siteKey="[Your recaptcha key]">
        <GoogleReCaptchaValidatorComponent />
    </ReCaptchaProvider>,
    document.getElementById('app')
);
```
#### useSkipInjectionDelay 
"I need my Google reCAPTCHA to be loaded now, regardless of the `injectionDelay` property. What should I do?"

There is a way to ignore the `injectionDelay` and load reCAPTCHA assets immediately. The `useSkipInjectionDelay` hook returns a callback that accomplishes this. See the following usage example.
```javascript
import { ReCaptchaProvider,useExecuteReCaptcha } from '@rusted/react-recaptcha-v3';

const GoogleReCaptchaValidatorComponent = () => {
    const forceRecaptchaLoad = useSkipInjectionDelay();

    // Create an event handler so you can call the verification on button click event or form submit
    const handleReCaptchaVerify = useCallback(async () => {
        forceRecaptchaLoad()//Load google recaptcha NOW!
        const token = await executeRecaptcha('someVeryImportantAction');
        // Do whatever you want with the token
    }, [executeRecaptcha]);

    // You can use useEffect to trigger the verification as soon as the component being loaded
    useEffect(() => {
        handleReCaptchaVerify();
    }, [handleReCaptchaVerify]);

    return <button onClick={handleReCaptchaVerify}>Verify recaptcha</button>;
};

ReactDOM.render(
    <ReCaptchaProvider siteKey="[Your recaptcha key]">
        <GoogleReCaptchaValidatorComponent />
    </ReCaptchaProvider>,
    document.getElementById('app')
);
```
In our example, we have shown an important action that requires a token as fast as possible. However, keep in mind that for invisible reCAPTCHA, such a case can be suspicious, leading to a worse score. It is better to prepare reCAPTCHA at an earlier stage.

For example, you can call `useSkipInjectionDelay` with some action triggered by the user earlier, when you do not need a token immediately.
