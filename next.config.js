// const withSourceMaps = require("@zeit/next-source-maps");
//

// module.exports = withSourceMaps({
//   env: {
//     MONGO_URI:
//       "mongodb+srv://bo123:R5zXmXRfpksYE35I@cluster0-widtc.mongodb.net/test?retryWrites=true&w=majority",
//     ROLLBAR_SERVER_TOKEN: "c1acb444e1f145399e7802cb0a7ffd86"
//   },
//   webpack(config, options) {
//     return config;
//   }
// });
require("dotenv").config();

module.exports = {
  assetPrefix: process.env.BASE_PATH,
  basePath: process.env.BASE_PATH,
  env: {
    MONGO_URI: process.env.MONGO_URI,
    ROLLBAR_CLIENT_TOKEN: process.env.ROLLBAR_CLIENT_TOKEN,
    ROLLBAR_SERVER_TOKEN: process.env.ROLLBAR_SERVER_TOKEN,
    FIREBASE_API: process.env.FIREBASE_API,
    MAPBOX_KEY: process.env.MAPBOX_KEY,
    PROD_BASE_URL: process.env.PROD_BASE_URL,
    BASE_PATH: process.env.BASE_PATH,
  },
};
