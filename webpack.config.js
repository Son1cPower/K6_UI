const path = require("path");
const glob = require("webpack-glob-entries");

module.exports = {
  mode: "production",
  entry: glob("./tests/**/*.js"),
  output: {
    path: path.resolve(__dirname, "dist"), // eslint-disable-line
    libraryTarget: "commonjs",
    filename: "[name].bundle.js",
  },
  module: {
    rules: [{ test: /\.js$/, use: "babel-loader" }],
  },
  target: "web",
  externals: [/k6(\/.*)?/],
  performance: {
    hints: false,
  },
};
