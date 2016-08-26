const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: [path.resolve(__dirname, 'src/index.js')],
    'lib/dollarOne': [path.resolve(__dirname, 'src/dollarOne/dollar.js')]
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/',
    chunkFilename: '[name].js',
    libraryTarget: 'commonjs2'
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

  externals: {
    'dollarOne': 'smart-gesture/lib/dollarOne'
  },

  postcss() {
    return [autoprefixer];
  },

  status: {
    color: true,
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new CleanWebpackPlugin(['./dist'], {
      root: __dirname,
      verbose: true,
      dry: false,
    }),
  ],
};
