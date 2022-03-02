// Packages
const path = require('path')

// Plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')

// Paths
const src_path = path.join(__dirname, 'src')
const out_path = path.join(__dirname, 'docs') // github pages

module.exports = {
  mode: 'development',

  entry: path.join(src_path, 'index.js'),

  output: {
    filename: 'bundle.js',
    path: out_path
  },

  module: {
    rules: [
      {
        test: /\.js$/i,
        include: src_path,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
    ] // rules
  },

  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({ template: path.join(src_path, 'index.html') }),
  ],

  devtool: 'source-map',

  devServer: {
    static: {
      directory: out_path
    },
    hot: true
  }
}