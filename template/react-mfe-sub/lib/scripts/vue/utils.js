const fs = require('fs-extra')
const path = require('path')

const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = relativePath => {
  return path.resolve(appDirectory, relativePath);
};

function getSPASubAppName() {
    const { name } = require(`${resolveApp('')}/package.json`)
    return name
}

module.exports = {
    resolveApp,
    getSPASubAppName
}