const { resolveApp } = require('../config')

function isMefBuild(){
    const { type = '' } = require(`${resolveApp('')}/package.json`)
    return type.indexOf('sub') !== -1
}

function isReactBuild() {
    const { type = '' } = require(`${resolveApp('')}/package.json`)
    return type.indexOf('react') !== -1
}

function getSPASubAppName() {
    const { name } = require(`${resolveApp('')}/package.json`)
    return name
}

function getWebpackMode(isMfe) {
    if(process.env.NODE_ENV === 'development') {
        return 'development'
    }

    return isMfe ? 'none' : 'production'
}

function getCustomConfig() {
    try {
        return require(`${resolveApp('')}/config.js`)
    } catch(err) {
        console.log(err)
        console.error('请确保config.js配置文件存在')
        process.exit(1)
    }
}

function getDevServerCustom() {
    const customConfig = getCustomConfig()
    const { apiProxy } = customConfig
    const proxy = {}

    Object.keys(apiProxy).forEach(api => {
        const write = `^${api}`
        proxy[api] = {
            target: process.env.NODE_ENV === 'production' ? apiProxy[api].pro : apiProxy[api].dev,
            changeOrigin: true,
            secure: false,
            pathRewrite: {
                [write]: ''
            }
        }
    })
    console.log(4444, proxy)
    return proxy
}

module.exports = {
    isMefBuild,
    isReactBuild,
    getWebpackMode,
    getCustomConfig,
    getSPASubAppName,
    getDevServerCustom
}