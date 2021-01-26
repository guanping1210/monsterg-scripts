import fs from 'fs-extra' // 系统fs模块的扩展
import path  from 'path'
import chalk from 'chalk' // 彩色信息
import { ncp } from 'ncp' // 新建文件夹、复制文件
import { resolveApp } from '../config'

const templateProject = {
    'react': 'react-mfe-main',
    'vue': 'vue-mfe-main',
    'subReact': 'react-mfe-sub',
    'subVue': 'vue-mfe-sub'
}

// 复制template下面的指定模板到新项目下面去
// project表示项目文件夹名字，isSub表示复制的是子应用还是主应用
export function createProject(projectName, templateName) {
    // 检测文件夹是否已经存在，存在则退出进程
    checkProjectExist(projectName)

    const appPath = path.resolve(__dirname, '..')

    cloneTemplate(
        `${appPath}/template/${templateProject[templateName]}`,
        projectName
    )
}

function checkProjectExist(projectName) {
    if(fs.existsSync(resolveApp(projectName))) {
        console.log(chalk.yellow(`${chalk.blue(projectName)} 已经存在于当前目录`))
        // 退出进程，后面的流程都不会执行
        process.exit(1)
    }
}

// 复制模板文件到指定目录下
function cloneTemplate(source, dest) {
    ncp(source, dest, function(err) {
        if(err) {
            return console.error(err)
        }

        console.log(chalk.yellow('项目初始化完成'))
    })
}