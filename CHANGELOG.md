# react-grecaptcha-v3

## 0.4.4

### Patch Changes

-   a7cfae4: Make CI more semantic.

## 0.4.3

### Patch Changes

-   055d4dd: Reduce complexity of build process. Gracefully reduce amount of dependenciec and package.json file size.
-   1d90b20: Reduced .eslintrc config size
-   055d4dd: Unnecesarry config removed.
-   055d4dd: Reduce scripts amount. Be eloquent in this question.
-   e5d580f: Upgrade rimraf
-   2b42f69: Fixed typo in Readme

## 0.4.2

### Patch Changes

-   02b449a: Make consistent naming between npm and github.

## 0.4.1

### Patch Changes

-   a9754dc: Add npm provenance as a feature in readme.

## 0.4.0

### Minor Changes

-   5ba0ac2: Breaking change! Package renamed from `@rusted/react-recaptcha-v3 to react-grecaptcha-v3.

## 0.3.8

### Patch Changes

-   80d4241: Improve documentation

## 0.3.7

### Patch Changes

-   5c589fd: Fix the ID-token permission to enable provenance

## 0.3.6

### Patch Changes

-   7634616: Fixed id-token permissions for CI release process

## 0.3.5

### Patch Changes

-   51f96f3: Add provenance

## 0.3.4

### Patch Changes

-   26d370c: Use peer dependencies for React.
-   da25f9a: Fix package to be compatible with older react versions.

## 0.3.3

### Patch Changes

-   7ff8e82: Improved documentation.

## 0.3.2

### Patch Changes

-   9b12da5: Fixed bug with not all actions sent on recaptcha load.

## 0.3.1

### Patch Changes

-   9389a2e: Fix cases when window.grecaptcha is set, but no `execute` function

## 0.3.0

### Minor Changes

-   9be3537: Bug fix. Recaptcha events registered during `injectionDelay` did not fire.

## 0.2.0

### Minor Changes

-   99e7932: New hook added. `useSkipInjectionDelay` allows to ignore timeout set by `injectionDelay`. It forces recaptcha to be loaded immediately.

## 0.1.8

### Patch Changes

-   1a0410a: Release management with changeset package. Publish to NPM with github action workflow.
