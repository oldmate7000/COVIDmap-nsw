const path = require('path');
var HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
  context: path.join(__dirname, './app'),
  entry: {
    index: './src/index.jsx',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
  plugins: [
  new HtmlWebpackPlugin({
    template: "./src/index.html"
  }),
  new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ["@babel/plugin-proposal-object-rest-spread"]
        },
        exclude: /node_modules/,
        include: path.join(__dirname, './app/src'),
      },
      {
        test: /\.css$/,
        loader: [MiniCssExtractPlugin.loader, 'css-loader'],
        exclude: /node_modules/,
        include: path.join(__dirname, './app/src'),
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: ['file-loader'],
        exclude: /node_modules/,
        include: path.join(__dirname, './app/src/assets'),
        
        },
    ]
  },
};