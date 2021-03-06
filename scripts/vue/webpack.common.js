const { resolveApp, getSPASubAppName } = require('./utils')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require("vue-loader/lib/plugin")

module.exports = {
    entry: {
        index: resolveApp("src/index.js")
    },
    output: {
        filename: "[name].js",
        path: resolveApp("dist"),
        // 微服务子应用相关配置
        library: getSPASubAppName(), // 读取自定义package.name中的name
        libraryTarget: "umd", // 将子应用暴露为所有的模块定义下都可运行的放啊hi
        jsonpFunction: `webpackJsonp_${getSPASubAppName}` // 按需加载相关的
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
          template: resolveApp("public/index.html")
        }),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            Vue: "vue",
            QianKun: "qiankun"
        })
    ],
    stats: {
        colors: true,
        children: false
      },
    resolve: {
        extensions: [".js", ".vue"],
        modules: ["node_modules", resolveApp("src")],
        alias: {
            src: resolveApp("src")
        }
    },
    module: {
      rules: [
        {
           test: /\.vue$/,
           loader: 'vue-loader'
        },
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
    ]
  }
}