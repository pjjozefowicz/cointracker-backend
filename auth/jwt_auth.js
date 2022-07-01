const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const authConfig = {
  domain: "cointracker.eu.auth0.com",
  audience: "https://cointracker.eu.auth0.com/api/v2/"
};

module.exports =
  jwt({
    // Provide a signing key based on the key identifier in the header and the signing keys provided by your Auth0 JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
    }),

    // Validate the audience (Identifier) and the issuer (Domain).
    audience: authConfig.audience,
    issuer: `https://${authConfig.domain}/`,
    algorithms: ["RS256"]
  });

