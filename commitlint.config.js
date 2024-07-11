// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [message => /\[skip ci\]/g.test(message)],
}
