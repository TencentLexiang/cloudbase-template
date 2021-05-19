const webpack = require('webpack');
const path = require('path');
require('dotenv').config({ path: '../.env'});

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          ENV_ID: JSON.stringify(process.env.ENV_ID),
          LX_SUITE_ID: JSON.stringify(process.env.LX_SUITE_ID),
          LX_AUTH_URL: JSON.stringify(process.env.LX_AUTH_URL),
          PERSISTENCE: JSON.stringify(process.env.PERSISTENCE),
        },
      }),
    ],
  },
  lintOnSave: false,
};