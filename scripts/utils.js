const { resolveApp } = require('../config')

function isMefBuild(){
    const { type } = require(`${resolveApp('')}/package.json`)

    return type === 'mfe'
}

module.exports = {
    isMefBuild
}