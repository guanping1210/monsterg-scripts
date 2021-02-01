const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = relativePath => {
  return path.resolve(appDirectory, relativePath);
};

const resolveScriptPath = (relativePath) => {
  return path.resolve('node_modules/monsterg-scripts', relativePath)
}

const isProduction = process.env.NODE_ENV === "production";

const resolve = {
  extensions: [".js", ".jsx"],
  modules: ["node_modules", resolveApp("src")],
  alias: {
    src: resolveApp("src")
  }
};

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    template: resolveApp("public/index.html")
  }),
  new CleanWebpackPlugin()
];

// 通用配置
const rules = [
  {
    test: /\.svg$/,
    exclude: /node_modules\//,
    use: [
      "babel-loader",
      {
        loader: "@svgr/webpack",
        options: {
          babel: false,
          icon: true,
          titleProp: "title"
        }
      }
    ]
  },
  {
    test: /\.(jpg|jpeg|gif|png|svg)$/,
    loader: "url-loader",
    options: {
      limit: 10000,
      publicPath: "/",
      name: "static/images/[name].[ext]?[hash:8]"
    }
  },
  {
    test: /\.(eot|ttf|woff|woff2)$/,
    loader: "url-loader",
    options: {
      limit: 10000,
      publicPath: "/",
      name: "static/fonts/[name].[ext]"
    }
  }
];

module.exports = {
  resolveScriptPath,
  resolveApp,
  appDirectory,
  isProduction,
  resolve,
  plugins,
  rules
};
