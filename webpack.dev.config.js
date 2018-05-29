const path = require('path')
const { clientServerPort } = require('./projectConfig.js')

module.exports = {
  /*入口*/
  entry: [path.join(__dirname, 'client/app.js')],

  /*输出到dist文件夹，输出文件名字为bundle.js*/
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    port: clientServerPort
  },
  resolve: {
    alias: {
      client: path.join(__dirname, 'client')
      // component: path.join(__dirname, 'src/component'),
      // router: path.join(__dirname, 'src/router')
    }
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader?cacheDirectory=true'],
        include: path.join(__dirname, 'client')
      },
      {
        test: /\.styl/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { minimize: true }
          },
          'stylus-loader'
        ],
        exclude: path.join(__dirname, '../node_modules')
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  }
}
