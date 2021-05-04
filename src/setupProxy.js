const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function Proxy(app) {
  app.use(createProxyMiddleware("/api", {
    target: "https://front-test.beta.aviasales.ru",
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/',
    },
  }));
}
