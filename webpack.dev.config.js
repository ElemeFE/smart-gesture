const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: [path.resolve(__dirname, './index.js'), 'webpack-hot-middleware/client?reload=true'],
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/',
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: ['transform-runtime', 'transform-decorators-legacy', ['antd']],
          presets: ['es2015', 'stage-0', 'react'],
        },
      },
      {
        test: /\.(scss|css)$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader',
      },
      {
        test: /\.(jpg|png|svg|gif|eot|ttf|woff)$/,
        loader: 'url-loader?limit=8000!file-loader',
      },
    ],
  },

  postcss() {
    return [autoprefixer];
  },

  status: {
    color: true,
  },

  devtool: 'source-map',

  plugins: [
    // Webpack 1.0
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
    }),
  ],
};
