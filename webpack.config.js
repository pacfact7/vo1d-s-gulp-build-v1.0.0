const config = {
	mode: 'production',
	entry: {
		index: './source/js/index.js',
		// contacts: './source/js/contacts.js',
		// about: './source/js/about.js',
	},
	output: {
		filename: '[name].bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};

module.exports = config;
