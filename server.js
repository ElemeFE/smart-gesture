const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.dev.config.js');
const compiler = webpack(config);
const path = require('path');

const app = express();

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false,
  },
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(config.output.path));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

const server = app.listen(8000, (err) => {
  if (err) {
    console.log(err);
    return false;
  }
  const port = server.address().port;
  console.log(`Listening at http://localhost:${port}`);
  return true;
});
