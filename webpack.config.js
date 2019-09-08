const path = require('path')
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  target: 'node',
  externals: [nodeExternals()],
  devtool: false,
  entry: "./src/app.js",
  output: {
    filename: "bundle.js"
  },
  node: {
    fs: 'empty',
    net: 'empty'
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
}
}