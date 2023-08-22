const path = require('path'); // Import the 'path' module
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

class Without {
	constructor(patterns) {
		this.patterns = patterns;
	}

	apply(compiler) {
		compiler.hooks.emit.tapAsync("WithoutPlugin", (compilation, callback) => {
			Object.keys(compilation.assets)
				.filter(asset => {
					let match = false,
						i = this.patterns.length
					;
					while (i--) {
						if (this.patterns[i].test(asset)) {
							match = true;
						}
					}
					return match;
				}).forEach(asset => {
				delete compilation.assets[asset];
			});

			callback();
		});
	}
}

module.exports = [
	{
		// JavaScript entry
		entry: {
			main: path.resolve(__dirname, './public/src/js/index.js'),
			clusterMap: path.resolve(__dirname, './public/src/js/clusterMap.js'),
			pageMap: path.resolve(__dirname, './public/src/js/showPageMap.js'),
		},
		output: {
			path: path.resolve(__dirname, 'public/dist'),
			filename: 'js/[name].min.js'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				}
			]
		}
	},
	{
		mode: process.env.NODE_ENV || 'development',
		resolve: {
			extensions: ['.css']
		},

		// CSS entry
		entry: {
			home: path.resolve(__dirname, './public/src/css/home.css'),
			main: path.resolve(__dirname, './public/src/css/index.css'),
		},
		output: {
			path: path.resolve(__dirname, 'public/dist'),
		},
		module: {
			rules: [
				{
					test: /\.css$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
					]
				}
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'css/[name].min.css' // Use [name] placeholder to generate separate filenames
			}),
			new Without([
				/[name]\.js(\.map)?$/, // Match empty js generated
			]),
		],
		optimization: {
			minimizer: [
				new CssMinimizerPlugin(),
			],
			minimize: true,
		}
	}
];