const webpack = require('webpack')

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
		filename: 'app.js',
	},
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
				test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader'
			},
    ]
  },
  devServer: {
		contentBase: './dist/',
    hot: false,
    progress: true
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}
