const webpack = require('webpack');
const path = require('path');
require('dotenv').config({ path: '../.env'});

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        'assets': path.resolve(__dirname, './src/assets'),
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          ENV_ID: JSON.stringify(process.env.ENV_ID),
          REGION: JSON.stringify(process.env.REGION),
          PAGE_URL: JSON.stringify(process.env.PAGE_URL),
          LX_SUITE_ID: JSON.stringify(process.env.LX_SUITE_ID),
          LX_AUTH_URL: JSON.stringify(process.env.LX_AUTH_URL),
          PERSISTENCE: JSON.stringify(process.env.PERSISTENCE),
        },
      }),
    ],
  },
};