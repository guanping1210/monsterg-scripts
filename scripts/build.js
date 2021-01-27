/**
 * build 的 config配置
 */
const webpack = require('webpack')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin') // css分割
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin') // 多线程压缩代码
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin') // 动态引入DLL脚本
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin') // 优化压缩css资源
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // 资源分析工具 2.0.0 有兼容性问题，需要降低到1.0.0版本
const { isMefBuild, getWebpackMode, isReactBuild } = require('./utils')
const {
    resolveApp,
    isProduction,
    resolve,
    plugins,
    rules,
} = require('../config')

module.exports = function() {
    const mfeBuild = isMefBuild()
    const isReact = isReactBuild()

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
    )

    if(process.env.ANALYZER === 'true') {
        // @ts-ignore
        plugins.push(new BundleAnalyzerPlugin())
    }

    // 针对不同的框架要区分处理的loader
    // @ts-ignore
    if(isReact) {
        rules.push({
            test: /\.(js|jsx)$/,
            // @ts-ignore
            include: /(src|config.js)/,
            use: ['babel-loader'],
        })
        resolve.extensions = ['.js', 'jsx']
    } else {
        rules.push({
            test: /\.(js|vue)$/,
            // @ts-ignore
            include: /(src|config.js)/,
            use: ['vue-loader'],
        })
        resolve.extensions = ['.js', '.vue']
    }

    return {
        mode: getWebpackMode(mfeBuild),
        entry: {
            index: resolveApp("src")
        },
        plugins,
        resolve,
        stats: {
            colors: true,
            children: false
        },
        module: {
            rules
        }
    }
}
