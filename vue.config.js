const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    host: "localhost",
    port: 8081,
    https: false,
    open: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        pathRewrite: {
          "^/api" : "/"
        },
        cookiePathRewrite: {
          '/api': '/'
        }
      },
      '/ws': {
        target: 'ws://127.0.0.1:8080',
        changeOrigin: true, //开启代理
        ws: false, // 是否启用websockets
        pathRewrite: {
          '^/ws': ''
        }
      }
    }
  }
})
