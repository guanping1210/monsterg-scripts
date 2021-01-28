const { name } = require('./package.json')

module.exports = {
    webpack: config => {
        config.output.library = `${name}-[name]`
        config.output.libraryTarget = 'umd'
        config.output.jsonpFunction = `webpackJsonp_${name}`
        config.output.globalObject = 'window'

        return config
    },
    devServer: _ => {
        const config = _

        config.headers = {
            'Access-Control-Allow-Origin': '*'
        }

        config.historyApiFallback = true
        config.hot = true
        config.watchContentBase = false
        config.liveReload = false

        return config
    }
}