const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');

module.exports = {
	'stories': [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  'addons': [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
		'@storybook/addon-postcss',
  ],
	framework: '@storybook/react',
	core: {
		builder: 'webpack5',
		disableTelemetry: true,
	},
	webpackFinal: async (config, { configType }) => {

		config.plugins.push(new VanillaExtractPlugin());

		return config;
	}
};
