const path = require('path')
const { clientServerPort } = require('./projectConfig.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  /* 入口 */
  entry: [path.join(__dirname, 'src/app.jsx')],
  mode: 'production',
  /* 输出到dist文件夹，输出文件名字为bundle.js */
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    port: clientServerPort,
  },
  resolve: {
    alias: {
      src: path.join(__dirname, 'src'),
      // component: path.join(__dirname, 'src/component'),
      // router: path.join(__dirname, 'src/router')
    },
    // modules: [path.resolve('./src'), path.resolve('./node_modules')],
    extensions: ['.js', '.jsx'],
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader?cacheDirectory=true'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { minimize: true },
          },
          'stylus-loader',
        ],
        exclude: path.join(__dirname, '../node_modules'),
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(txt|md)$/,
        use: 'raw-loader',
      },
    ],
  },
}
