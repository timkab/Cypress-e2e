import dotenv from "dotenv";

const cucumber = require('cypress-cucumber-preprocessor').default;
module.exports = (on, config) => {

  on('file:preprocessor', cucumber())
};

// Setting Auth0 variables from .env
dotenv.config({ path: ".env.local" });
dotenv.config();

export default (on, config) => {

  config.env.auth0_username = process.env.AUTH0_USERNAME
  config.env.auth0_password = process.env.AUTH0_PASSWORD
  config.env.auth0_domain = process.env.AUTH0_DOMAIN
  config.env.auth0_audience = process.env.AUTH0_AUDIENCE
  config.env.auth0_scope = process.env.AUTH0_SCOPE
  config.env.auth0_client_id = process.env.AUTH0_CLIENTID
  config.env.auth0_client_secret = process.env.AUTH0_CLIENT_SECRETD

  return config
};