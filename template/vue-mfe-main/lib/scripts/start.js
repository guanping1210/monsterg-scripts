// @ts-nocheck
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { isReactBuild, getSPASubAppName } = require("./utils");
const { resolveApp, resolve, plugins, rules } = require("../config");
const webpack = require("webpack");

module.exports = function() {
  const isReact = isReactBuild();
  // 针对不同的框架要区分处理的loader
  // 针对react和vue的配置的插件，应该从具体的项目中读取
  // module.rules + plugins + css-loader对应的，需要修改
  // @ts-ignore
  if (isReact) {
    setReactConfig();
  } else {
    setVueConfig();
  }

  return {
    mode: "development",
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
    plugins,
    resolve,
    stats: {
      colors: true,
      children: false
    },
    module: {
      rules
    },
    devServer: {
      hot: true,
      port: process.env.PORT,
      host: "0.0.0.0",
      contentBase: resolveApp("dist"),
      publicPath: "/",
      stats: "errors-only",
      // TODO: 测试qiankun时，加载子应用失败，存在跨域问题，暂时用以下配置解决
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      // true：项目任意404响应都可能被替换为index.html，但是这只适合独立项目
      // TODO：如果是微服务主应用上加载了子应用页面，F5刷新，会找不到页面
      // historyApiFallback: true,
      historyApiFallback: true,
      disableHostCheck: true
    }
  };
};

const setReactConfig = () => {
  rules.push({
    test: /\.(js|jsx)$/,
    // @ts-ignore
    include: /(src|config.js)/,
    use: {
      // @ts-ignore
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-transform-react-jsx"]
      }
    }
  });
  rules.push({
    test: /\.(css|less)$/,
    use: [
      MiniCssExtractPlugin.loader,
      "css-loader",
      {
        loader: "postcss-loader",
        options: {
          ident: "postcss",
          plugins: [require("autoprefixer")]
        }
      },
      {
        loader: "less-loader",
        options: {
          javascriptEnabled: true
        }
      }
    ]
  });
  plugins.push(
    new webpack.ProvidePlugin({
      React: "react",
      ReactDOM: "react-dom",
      QianKun: "qiankun"
    })
  );
  resolve.extensions = [".js", "jsx"];
  resolve.modules = ["node_modules"];
};

const setVueConfig = () => {
  const VueLoaderPlugin = require("vue-loader/lib/plugin");
  rules.push({
    test: /.vue$/,
    loader: "vue-loader"
  });
  plugins.push(
    new VueLoaderPlugin(),
    new webpack.ProvidePlugin({
      Vue: "vue",
      QianKun: "qiankun"
    })
  );
  resolve.extensions = [".vue", ".js"];
  resolve.modules = ["node_modules"];
  resolve.alias = {
    vue: "vue/dist/vue.min.js",
    "@": path.resolve("src")
  };
};
