/*
 * this entire file -- and any other files with a .server.js suffix that are
 * imported -- is evaluated at build-time using val-loader. next doesn't have a
 * built-in way to specify build-time site-wide data, only per-route data. we
 * don't want to pay the cost of loading this for every route, so by using
 * val-loader we can calculate it once and import it wherever needed.
 */

// @ts-check
const { join } = require("path");
const pkg = require(join(process.cwd(), "package.json"));

/** @type {string} */
let domain = pkg.homepage;
if (!domain) {
  throw new Error(
    "Expected domain to be specified in package.json 'homepage' field!"
  );
}

if (domain.endsWith("/")) {
  domain = domain.slice(0, -1);
}

/** @type {string} */
const twitter = pkg.twitter;
if (!twitter) {
  throw new Error(
    "Expected Twitter account to be specified in package.json 'twitter' field!"
  );
}

/** @type {{domain: string, twitter: string}} */
module.exports = () => ({
  cacheable: true,
  code: "module.exports = " + JSON.stringify({ domain, twitter }),
});
