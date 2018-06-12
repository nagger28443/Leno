const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        use: ['eslint-loader'],
        exclude: path.join(__dirname, '../node_modules'),
      },
      /** 只使用js的文件后缀 减少正则表达式的匹配 */
      {
        test: /\.js$/,
        use: ['babel-loader?cacheDirectory=true'],
        exclude: path.join(__dirname, '../node_modules'),
      },
      {
        test: /\.css$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: { minimize: true },
        }],
        // exclude: path.join(__dirname, '../node_modules'),
      },
      {
        test: /\.less$/,
        use: ['style-loader',
          {
            loader: 'css-loader',
            options: { minimize: true },
          },
          {
            loader: 'less-loader',
            options: { javascriptEnabled: true },
          },
        ],
        // exclude: path.join(__dirname, '../node_modules'),
      },
      {
        test: /\.styl/,
        use: ['style-loader',
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
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]',
          },
        }],
        // exclude: path.join(__dirname, '../node_modules'),
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          minChunks: 2,
          chunks: 'all',
        },
        vendor: {
          test: /node_modules/,
          chunks: 'all',
          name: 'vendor',
          priority: 10,
          enforce: true,
        },
      },
    },
    runtimeChunk: true,
  },

  resolve: {
    modules: [path.join(__dirname, '../node_modules')],
    mainFields: ['jsnext:main', 'browser', 'main'],
  },
};
