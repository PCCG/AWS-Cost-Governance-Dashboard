const WindiCSSWebpackPlugin = require("windicss-webpack-plugin").default;

module.exports = {
	"transpileDependencies": ["vuetify"],
	configureWebpack: {
		plugins: [new WindiCSSWebpackPlugin()],
	},
};
