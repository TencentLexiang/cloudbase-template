const webpack = require('webpack');
require('dotenv').config({ path: '../.env'});

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          ENV_ID: JSON.stringify(process.env.ENV_ID),
          PAGE_URL: JSON.stringify(process.env.PAGE_URL),
          LX_SUITE_ID: JSON.stringify(process.env.LX_SUITE_ID),
          LX_AUTH_URL: JSON.stringify(process.env.LX_AUTH_URL),
        },
      }),
    ],
  },
};