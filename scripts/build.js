/**
 * build 的 config配置
 */
const path = require('path')
const webpack = require("webpack");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin"); // css分割
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin"); // 多线程压缩代码
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin"); // 动态引入DLL脚本
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin"); // 优化压缩css资源
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin; // 资源分析工具 2.0.0 有兼容性问题，需要降低到1.0.0版本
const { isMefBuild, getWebpackMode, isReactBuild } = require("./utils");
const {
  resolveApp,
  isProduction,
  resolve,
  plugins,
  rules
} = require("../config");

module.exports = function() {
  const mfeBuild = isMefBuild();
  const isReact = isReactBuild();

  // 多线程压缩JS
  plugins.push(
    new ParallelUglifyPlugin({
      uglifyES: {
        output: {
          beautify: false
        },
        compress: {
          drop_console: isProduction,
          collapse_vars: true,
          reduce_vars: true,
          unused: false
        }
      }
    })
  );

  if (process.env.ANALYZER === "true") {
    // @ts-ignore
    plugins.push(new BundleAnalyzerPlugin());
  }
  // 针对不同的框架要区分处理的loader
  // @ts-ignore
  if (isReact) {
    rules.push(
      {
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
      }
    );
    plugins.push(
      // 支持全局配置
      new webpack.ProvidePlugin({
        React: 'react',
        ReactDOM: 'react-dom'
      })
      // JS模块分包
    )
    resolve.extensions = [".js", "jsx"];
  } else {
    const VueLoaderPlugin = require("./vue/node_modules/vue-loader/lib/plugin");
    // @ts-ignore
    rules.push({
      test: /\.vue$/,
      loader: "vue-loader"
    });
    plugins.push(
      new VueLoaderPlugin(),
      new webpack.ProvidePlugin({
        Vue: 'vue'
      })
    )
    resolve.extensions = [".js", ".vue"];
  }

  return {
    mode: getWebpackMode(mfeBuild),
    entry: {
      index: resolveApp("src")
    },
    output: {
      filename: '[name].js',
      path: resolveApp('dist'),
      publicPath: '/',
      chunkFilename: '[name].[chunkhash:8].js'
    },
    // chunk分割
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 2, // 分割的chunk最小为2kb
        minChunks: 1, // 提取的chunk最少被引用一次
        name: 'common'
      }
    },
    plugins: [
      // 将单独提取的css文件，通过插件动态引入进来
      new MiniCSSExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].[chunhash:8].js'
      }),
      // 压缩css文件, 内部还可以有一些配置
      new OptimizeCssAssetsWebpackPlugin(),
      ...plugins
    ],
    resolve,
    stats: {
      colors: true,
      children: false
    },
    module: {
      rules: [
        // 抽离css为单独的文件
        {
          test: /\.(css|less)/,
          use: [
            MiniCSSExtractPlugin.loader,
            // 'style-loader',
            'css-loader',
            // {
            //   loader: 'postcss-loader',
            //   options: {
						// 		ident: 'postcss',
						// 		plugins: [require('autoprefixer')],
						// 	},
            // },
            {
              loader: 'less-loader',
              options: {
                javascriptEnable: true,
              }
            }
          ]
        },
        ...rules,
      ]
    }
  };
};
