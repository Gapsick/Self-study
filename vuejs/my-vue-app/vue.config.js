const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    headers: {
      "content_security_policy": "script-src 'self' https://accounts.google.com https://www.gstatic.com https://apis.google.com 'unsafe-inline' 'unsafe-eval'; object-src 'self'"

    }
  }
});
