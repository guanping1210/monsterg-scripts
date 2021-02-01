const merge = require('webpack-merge').merge
const webpack = require('webpack')
const { resolveApp } = require('./utils')
const config = require('./webpack.common')

module.exports = merge([
    config, 
    {
        mode: 'development',
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
        },
        module: {
            rules: [
                {
                    test: /\.(css|less)$/,
                    use: [
                    // MiniCssExtractPlugin.loader,
                    'style-loader',
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
            new webpack.HotModuleReplacementPlugin(),
        ]
    }
])