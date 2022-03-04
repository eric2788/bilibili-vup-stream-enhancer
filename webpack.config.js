const SizePlugin = require('size-plugin')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	//devtool: 'source-map',
    stats: 'errors-only',
	entry: {
        stream: './src/stream/stream.js',
        'stream-live': './src/stream/stream-live.js', 
        background: './src/background.js',
        index: './src/index.js',
        settings: './src/settings.js',
        'popup-jimaku': './src/popup-jimaku.js'
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
                    context: 'assets'
                },
                {
                    from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js'
                }
            ]
        })
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: false,
                    compress: true,
                    /*
					output: {
						beautify: true,
						indent_level: 2 // eslint-disable-line camelcase
                    }*/
            
				}
            })
		]
	}
};