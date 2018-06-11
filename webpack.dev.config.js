const path = require('path')
const { clientServerPort } = require('./projectConfig.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  /* 入口 */
  entry: {
    app: [path.join(__dirname, 'src/app.jsx')],
    vendor: ['react', 'react-router-dom', 'mobx', 'mobx-react', 'react-jss', 'react-dom', 'lodash'],
  },
  mode: 'production',
  /* 输出到dist文件夹，输出文件名字为bundle.js */
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].[chumlhash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
    }),
  ],
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    port: clientServerPort,
    historyApiFallback: true,
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
