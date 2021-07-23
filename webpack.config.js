
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');

  module.exports = {
   mode: 'development',
   devtool: 'inline-source-map',
   devServer: {
     contentBase: './dist'
   },
    entry: {
      app: './development/index.js'
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'bigscreen-player'
      }),
    ],
    resolve: {
      alias: {
        bigscreenplayer: path.resolve(__dirname, 'script')
      }
    },
    devServer: {
	disableHostCheck: true, // fix "Invalid host header" response
	host: "0.0.0.0",
	port: 8080
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  };
