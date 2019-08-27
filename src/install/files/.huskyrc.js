// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
module.exports = require('typescript-base').husky.getBase({
  hooks: {
    'pre-commit': 'concurrently "npm run test" "npm run lint"',
  },
})
