const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

module.exports = withVanillaExtract({
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
			config.resolve.fallback.fs = false;
    }

    return config;
  },

	async redirects() {
		return [
			{ source: '/', destination: '/index', permanent: true },
		]
	}
});
