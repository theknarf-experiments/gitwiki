const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
const { getGlobalCssLoader } = require('next/dist/build/webpack/config/blocks/css/loaders');
const MiniCssExtractPlugin = require('next/dist/build/webpack/plugins/mini-css-extract-plugin/src').default;

module.exports = {
	future: {
		webpack5: true,
	},

  webpack: (config, { dev, isServer, ...options }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

		// --- vanilla-extract config ---
		// based on: https://github.com/seek-oss/vanilla-extract/issues/4#issuecomment-810842869
		config.module.rules.push({
			test: /\.css$/i,
			sideEffects: true,
			use: dev
			? getGlobalCssLoader(
				{
					assetPrefix: options.config.assetPrefix,
					future: {
						webpack5: true,
					},
					isClient: !isServer,
					isServer,
					isDevelopment: dev,
				},
				[],
				[]
			)
			: [MiniCssExtractPlugin.loader, 'css-loader'],
		});

		config.plugins.push(
			new VanillaExtractPlugin()
		);

		if (!dev) {
			config.plugins.push(
				new MiniCssExtractPlugin({
					filename: 'static/css/[contenthash].css',
					chunkFilename: 'static/css/[contenthash].css',
					ignoreOrder: true,
				})
			);
		}

		config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.css.ts'];
		// ------------------------------

    return config;
  },

	async redirects() {
		return [
			{ source: '/', destination: '/index', permanent: true },
		]
	}
};
