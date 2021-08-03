const path = require('path');
const common = require("./webpack.common");
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contentHash].css',
    })
    ],
  output: {
    path: path.join(__dirname, './app/dist'),
    filename: '[name].bundle.[contentHash].js',
  }
});