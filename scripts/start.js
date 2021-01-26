const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin }  = require('clean-webpack-plugin')

const { isMefBuild, getWebpackMode, isReactBuild, getDevServerCustom } = require('./utils')
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

    // 针对不同的框架要区分处理的loader
    // 针对react和vue的配置的插件，应该从具体的项目中读取
    // @ts-ignore
    if(isReact) {
        rules.push({
            test: /\.(js|jsx)$/,
            // @ts-ignore
            include: /(src|config.js)/,
            use: {
                // @ts-ignore
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        '@babel/plugin-transform-react-jsx'
                    ]
                }
            },
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
        mode: 'development',
        entry: {
            index: resolveApp('hh/src/index.js')
        },
        output: {
            filename: '[name].[thunk:hash:8].js',
            path: resolveApp('hh/dist')
        },
        plugins,
        resolve,
        stats: {
            colors: true,
            children: false
        },
        // module: {
        //     rules,
        // },
        devServer: {
            proxy: getDevServerCustom()
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    // @ts-ignore
                    include: /(src|config.js)/,
                    use: {
                        // @ts-ignore
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-transform-react-jsx'],
                        },
                    },
                }
            ]
        }
    }
}
