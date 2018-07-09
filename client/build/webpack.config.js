// const ip = require('ip')
const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const webpackBaseConfig = require('./webpack.base.js')
// const { clientServerPort, serverHost, serverPort, projectName } = require('../projectConfig.js')

// const localIp = ip.address()
const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(webpackBaseConfig, {
  target: 'web',
  entry: {
    app: path.join(__dirname, '../src/app.jsx'),
  },
})

if (isDev) {
  config.mode = 'development'
  config.devtool = 'cheap-module-eval-source-map'
  config.plugins = [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require(path.join(__dirname, '../dll/vendor-manifest.json')),
    }),
    /** 自动生成 html 并插入 js, css */
    new HtmlWebpackPlugin({
      // title: '大屏',
      template: path.join(__dirname, '../dll/dll.template.html'),
    }),
    /* 将生成的vendor.dll.js 拷贝到目标输出目录 */
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../dll'),
        to: path.join(__dirname, '../dist'),
        // toType: 'file',
        ignore: ['*.json', '*.html'],
      },
    ]),
  ]
  config.output = {
    path: path.join(__dirname, '../dist'),
    filename: '[name].[hash:8].js',
    publicPath: '/asserts/',
  }
  config.devServer = {
    /** 通过启动时的命令行注入 --hot */
    // hot: true,
    host: '127.0.0.1',
    disableHostCheck: true,
    port: 7777,
    compress: true,

    overlay: {
      errors: true,
    },
    publicPath: '/asserts/',
    historyApiFallback: {
      index: '/asserts/index.html',
    },

    // proxy: {
    //   '/api': {
    //     // 测试环境
    //     target: `http://127.0.0.1:3000`, // 接口域名
    //     changeOrigin: true, // 是否跨域
    //     pathRewrite: {
    //       '^/api': '', // 需要rewrite重写的,
    //     },
    //     secure: false,
    //   },
    // },

    quiet: false,
    noInfo: false,
    inline: true,
    lazy: false,
    headers: { 'Access-Control-Allow-Origin': '*' },

    watchOptions: {
      ignored: path.join(__dirname, '../node_modules/'),
      aggregateTimeout: 500,
      poll: 100,
    },
  }
} else {
  config.mode = 'production'
  config.output = {
    path: path.join(__dirname, '../dist'),
    filename: '[name].[hash:8].js',
    publicPath: `./`,
  }
  config.plugins = [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/index.html'),
    }),
  ]
  config.output.filename = '[name].[chunkhash:8].js'
}

module.exports = config
