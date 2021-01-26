const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())

const resolveApp = relativePath => {
    return path.resolve(appDirectory, relativePath)
}

module.exports = {
    resolveApp
}