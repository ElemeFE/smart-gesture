const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: [path.resolve(__dirname, './demo/index.js'), 'webpack-hot-middleware/client?reload=true'],
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
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0'],
        },
      },
      {
        test: /\.(scss|css)$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader',
      },
    ],
  },

  postcss() {
    return [autoprefixer];
  },

  status: {
    color: true,
  },


  resolve: {
    alias: {
      'dollarOne': path.join(__dirname, './src/dollarOne/dollar.js')
    }
  },

  devtool: 'source-map',

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './demo/index.html',
    }),
  ],
};
