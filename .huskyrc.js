module.exports = require('./build/src').husky.getBase({
  hooks: {
    'pre-commit': 'npm run prepare-release',
  },
})
