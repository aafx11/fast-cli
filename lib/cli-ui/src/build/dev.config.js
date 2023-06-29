const path = require('path');
const merge = require('webpack-merge');
const base = require('./base.config');

const resolve = (filePath) => path.resolve(__dirname, filePath);

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: resolve('../tempDist'),
    hot: true,
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    },
  },
  output: {
    filename: '[name].bundle.js',
    path: resolve('../tempDist'),
  },
});
