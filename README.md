# standard-version (<https://github.com/conventional-changelog/standard-version>)

### Dependencies: included

```
package.json
```

```json
{
  "scripts": {
    "release": "standard-version"
  }
}
```

&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;

# husky (<https://github.com/typicode/husky>)

### Dependencies: included

```
.huskyrc.js
```

```javascript
// accepts any options to be deeply merged into config object
module.exports = require('typescript-base').husky.getBase({
  customOverride: true,
})
```

&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;

# commitlint (<https://github.com/conventional-changelog/commitlint>)

### Dependencies: included

```
commitlint.config.js
```

```javascript
// accepts any options to be deeply merged into config object
module.exports = require('typescript-base').commitlint.getBase({
  customOverride: true,
})
```

&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;

# Eslint (<https://github.com/eslint/eslint>)

```javascript
const {
  eslint: { getBase, getBaseReact },
} = require('typescript-base')
```

```
.eslintrc.js
```

## Non React config

### Dependencies: included

```javascript
const { join } = require('path')

const DIR_ROOT = __dirname
const FILE_TSCONFIG = join(DIR_ROOT, 'tsconfig.json')

// or getBase, accepts any options to be deeply merged into config object
module.exports = getBaseReact({
  packageDirs: [__dirname],
  pathFileTSConfig: FILE_TSCONFIG,

  env: {
    es6: true,
    jest: true,
    node: true,
  },

  globals: {
    customProp: 'readonly',
  },

  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/__mocks__/**/*', '**/__tests__/**/*', '**/jest.config.*'],
      },
    ],
  },
})
```

## React

### Dependencies

```console
npm i -D eslint-config-airbnb eslint-plugin-react eslint-plugin-react-hooks
```

```javascript
const { join } = require('path')

const DIR_ROOT = __dirname
const FILE_TSCONFIG = join(DIR_ROOT, 'tsconfig.json')

// or getBase, accepts any options to be deeply merged into config object
module.exports = getBaseReact({
  isReact: true,
  packageDirs: [__dirname],
  pathFileTSConfig: FILE_TSCONFIG,

  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },

  globals: {
    // puppeteer related if you are using that jest config, otherwise skip
    browser: 'readonly',
    context: 'readonly',
    jestPuppeteer: 'readonly',
    page: 'readonly',
  },

  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/__mocks__/**/*', '**/__tests__/**/*', '**/jest.config.*'],
      },
    ],
  },
})
```

&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;

# TypeScript (<https://github.com/microsoft/TypeScript>)

### Dependencies

```console
npm i -D typescript
```

```
tsconfig.json
```

Preferred

```json
{
  "extends": "./node_modules/typescript-base/tsconfig.base.declaration.json"
}
```

Or this config if project does not support declaration due to conflict

```json
{
  "extends": "./node_modules/typescript-base/tsconfig.base.json"
}
```

&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;

# Prettier (<https://github.com/prettier/prettier>)

### Dependencies: included

```javascript
// accepts any options to be deeply merged into config object
module.exports = require('typescript-base').prettier.getBase({
  customOverride: true,
})
```

&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;

# Stylelint (<https://github.com/stylelint/stylelint>)

### Dependencies

```console
npm i -D stylelint stylelint-config-recommended
```

```
.stylelintrc.js
```

```javascript
// accepts any options to be deeply merged into config object
module.exports = require('typescript-base').stylelint.getBase({
  customOverride: true,
})
```

&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;

# Jest (<https://github.com/facebook/jest>)

```
jest.config.js
```

&nbsp;
&nbsp;
&nbsp;

### General config

### Dependencies: optional, install a testEnvironment + others if needed

```javascript
const DIR_ROOT = __dirname

// accepts any options to be deeply merged into config object
module.exports = require('typescript-base').jest.getBase({
  rootDir: DIR_ROOT,
  testEnvironment: 'node',
})
```

&nbsp;
&nbsp;
&nbsp;

### React config

### Dependencies

```console
npm i -D @types/jest-image-snapshot @testing-library/jest-dom jest-environment-jsdom jest-environment-jsdom-global jest-image-snapshot
```

```javascript
const DIR_ROOT = __dirname

// accepts any options to be deeply merged into config object
module.exports = require('typescript-base').jest.getBase({
  isReact: true,
  rootDir: DIR_ROOT,
  testEnvironment: 'jest-environment-jsdom-global',
})
```

&nbsp;
&nbsp;
&nbsp;

### Integration with puppeteer

### Dependencies

```console
npm i -D @types/expect-puppeteer @types/jest-environment-puppeteer @types/puppeteer @types/jest-image-snapshot jest-puppeteer puppeteer @testing-library/jest-dom jest-image-snapshot
```

```
jest.integration.config.js
```

```javascript
const DIR_ROOT = __dirname

// accepts any options to be deeply merged into config object
module.exports = require('typescript-base').jest.getBaseIntegration({
  rootDir: DIR_ROOT,
})
```
