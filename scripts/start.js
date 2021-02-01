// @ts-nocheck
const path = require("path");
const { isReactBuild } = require("./utils");

module.exports = function() {
  const isReact = isReactBuild();
  return isReact ? require(`./react/webpack.dev`) : require('./vue/webpack.dev')
}
