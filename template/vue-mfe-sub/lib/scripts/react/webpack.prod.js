const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const merge = require('webpack-merge').merge
const config = require('./webpack.common')

module.exports = merge([
    config, 
    {
        mode: 'production',
        optimization: {
            splitChunks: {
              chunks: 'all',
              minSize: 2, // 分割的chunk最小为2kb
              minChunks: 1, // 提取的chunk最少被引用一次
              name: 'common'
            }
        },
        module: {
            rules: [
                {
                    test: /\.(css|less)$/,
                    use: [
                    MiniCSSExtractPlugin.loader,
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
                },
            ]
        },
        plugins: [
            new MiniCSSExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[name].[chunhash:8].js'
              }),
              // 压缩css文件, 内部还可以有一些配置
              new OptimizeCssAssetsWebpackPlugin(),
        ]
    }
])