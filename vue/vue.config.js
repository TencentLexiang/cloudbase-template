const webpack = require('webpack');
require('dotenv').config({ path: '../.env'});

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          ENV_ID: JSON.stringify(process.env.ENV_ID)
        },
      }),
    ],
  },
};