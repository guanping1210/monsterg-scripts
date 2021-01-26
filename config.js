const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const appDirectory = fs.realpathSync(process.cwd())

const resolveApp = relativePath => {
    return path.resolve(appDirectory, relativePath)
}

const isProduction = process.env.NODE_ENV === 'production'

const resolve = {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', resolveApp('src')],
    alias: {
        '@': resolveApp('src'),
    }
}

const plugins = [
    new HtmlWebpackPlugin({
        template: resolveApp('hh/public/index.html')
    }),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
        React: 'react',
        ReactDOM: 'react-dom',
        Axios: 'axios'
    })
]

// 通用配置
const rules = [
    {
        test: /\.(css|less)$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    ident: 'postcss',
                    plugins: [require('autoprefixer')]
                }
            },{
                loader: 'less-loader',
                options: {
                    javascriptEnabled: true
                }
            }
        ]
    },
    {
        test: /\.svg$/,
        exclude: /node_modules\//,
        issuer: {
            test: /\.jsx?$/,
        },
        use: [
            'babel-loader',
            {
                loader: '@svgr/webpack',
                options: {
                    babel: false,
                    icon: true,
                    titleProp: 'title',
                },
            },
        ],
    },
    {
        test: /\.(jpg|jpeg|gif|png|svg)$/,
        loader: 'url-loader',
        options: {
            limit: 10000,
            // publicPath: '/',
            name: 'static/images/[name].[ext]?[hash:8]',
        },
    },
    {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
            limit: 10000,
            // publicPath: '/',
            name: 'static/fonts/[name].[ext]',
        },
    },
]

module.exports = {
    resolveApp,
    isProduction,
    resolve,
    plugins,
    rules,
}

/**
 * module.exports = {
 *  entry,
 *  output,
 *  module,
 *  plugins,
 *  resolve,
 * }
 */