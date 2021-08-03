const path = require('path');
const common = require("./webpack.common");
const merge = require("webpack-merge")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: "none",
  watch: true,
  plugins: [
  new MiniCssExtractPlugin()
  ],
  output: {
    path: path.join(__dirname, './app/dist'),
    filename: '[name].bundle.js',
  },
});