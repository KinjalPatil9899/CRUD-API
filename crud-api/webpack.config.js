const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production', // Set mode to 'production' or 'development'
  entry: './app.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // Output bundled file name
  },
  target: 'node', // Set target to 'node'
  externals: [nodeExternals()], // Exclude Node.js core modules
};