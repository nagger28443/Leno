const path = require('path');
const webpack = require('webpack');
const { dependencies } = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const config = {
  target: 'web',
  entry: {
    vendor: Object.keys(dependencies || []),
  },
  output: {
    path: path.join(__dirname, '../dll'),
    filename: '[name].[chunkhash:8].dll.js',
    library: '[name]_[chunkhash]',
    publicPath: '/asserts/',
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      name: '[name]_[chunkhash]',
      path: path.join(__dirname, '../dll/vendor-manifest.json'),
    }),
    /** 自动生成 html 并插入 js, css */
    new HtmlWebpackPlugin({
      title: 'dll过渡文件',
      // excludeChunks: ['ipad'],
      filename: 'dll.template.html',
      template: path.join(__dirname, '../src/index.html'),
    }),
  ],
};

if (isDev) {
  config.mode = 'development';
} else {
  config.mode = 'production';
}

module.exports = config;
