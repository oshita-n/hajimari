require('dotenv').config({path: ".env"})
module.exports = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.node = {
          fs: 'empty'
        };
      }
  
      return config;
    },
    env: {
        // Reference a variable that was defined in the .env file and make it available at Build Time
        NEXT_PUBLIC__APYKEY: process.env.NEXT_PUBLIC__APYKEY,
        NEXT_PUBLIC__DOMAIN: process.env.NEXT_PUBLIC__DOMAIN,
        NEXT_PUBLIC_ID: process.env.NEXT_PUBLIC_ID,
      },
  };