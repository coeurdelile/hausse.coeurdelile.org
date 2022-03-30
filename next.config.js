/* eslint no-undef: error */
const withPlugins = require("next-compose-plugins");
const fonts = require("next-fonts");
const optimizedImages = require("next-optimized-images");

module.exports = withPlugins(
  [
    () => ({
      webpack(cfg) {
        cfg.module.rules.push({
          test: /\.server\.js$/,
          use: [{ loader: "val-loader" }],
        });

        return cfg;
      },
    }),
    fonts,
    optimizedImages,
  ],
  {
    // react-swipeable-views uses legacy context (amongst other problems it has).
    // reactStrictMode: true,
  }
);
