const SizePlugin = require('size-plugin')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
var glob = require("glob");

module.exports = {
	//devtool: 'source-map',
    stats: 'errors-only',
	entry: {
        background: glob.sync('./src/background/*.js'),
        index: './src/index.js',
        settings: glob.sync('./src/assets/*.js')
    },
	output: {
		path: path.join(__dirname, './dist'),
        filename: '[name].js'
    },
    mode: 'production',
	plugins: [
        new SizePlugin(),
		new CopyWebpackPlugin({
            patterns: [
                {
                    from: '**/*',
                    context: 'src',
                    filter: (path) => !path.endsWith('.js')
                },
                {
                    from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js'
                },
                {
                    from: 'cdn/**/*',
                    context: 'src',
                    to: '.'
                }
            ]
        })
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: false,
                    compress: false,
                    /*
					output: {
						beautify: true,
						indent_level: 2 // eslint-disable-line camelcase
                    }
                    */
                  
				}
            })
		]
	}
};