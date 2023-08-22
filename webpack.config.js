const path = require('path'); // Import the 'path' module
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = [
	{
		// JavaScript entry
		entry: path.resolve(__dirname, './public/src/js/index.js'),
		output: {
			path: path.resolve(__dirname, 'public/dist'),
			filename: 'js/main.min.js'
		}
	},
	{
		// CSS entry
		entry: path.resolve(__dirname, './public/src/css/index.css'),
		output: {
			path: path.resolve(__dirname, 'public/dist'),
		},
		module: {
			rules: [
				{
					test: /\.css$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader'
					]
				}
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'css/main.min.css'
			}),
		],
		optimization: {
			minimizer: [
				new CssMinimizerPlugin(),
			],
			minimize: true,
		}
	}
];