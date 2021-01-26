const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin }  = require('clean-webpack-plugin')

const { resolveApp } = require('../config')

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, '../template/react-mfe-main/src/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolveApp('template/react-mfe-main/public/index.html'),
        }),
        new CleanWebpackPlugin()
    ]
}

