module.exports = {
  preset: './ts-jest-puppeteer.config.js',
  testRegex: './*\\.test\\.ts$',
  transformIgnorePatterns: [
    "node_modules/(?!variables/.*)"
  ]
}
