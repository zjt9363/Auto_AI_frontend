const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    host: "localhost",
    port: 8080,
    https: false,
    open: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8084",
        changeOrigin: true,
        pathRewrite: {
          "^/api" : "/"
        },
        cookiePathRewrite: {
          '/api': '/'
        }
      }
    }
  }
})
