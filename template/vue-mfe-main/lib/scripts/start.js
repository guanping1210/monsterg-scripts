// @ts-nocheck
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { isReactBuild } = require("./utils");
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
      path: resolveApp("dist")
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
      contentBase: "./",
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
