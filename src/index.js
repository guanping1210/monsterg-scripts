#!/usr/bin/env node

import commander from 'commander'
import portfinder from 'portfinder'
import spawn from 'cross-spawn';
import packageJson from '../package.json'
import { createProject } from './create-app'

const program = new commander.Command()

program.version(packageJson.version, '-v, --version')

program
	.command('test <projectName>')
	.description('测试node命令')
	.action(function(projectName, options) {
		console.log('success: ', projectName, options)
	})

// 新建模板项目
program
    .command('create <projectName>')
    .description('创建新项目')
    .option('--react', '创建微服务react主应用模板')
    .option('--vue', '创建微服务vue主应用模板')
    .option('--sub-react', '创建微服务react子应用模板项目')
    .option('--sub-vue', '创建微服务react子应用模板项目')
    .action(function(projectName, options) {
        // 这儿匹配多个模板项目，所以用key值作为唯一值, 如果key为空，默认选用--react
        const templateName = Object.keys(options)[0] || 'react'
        createProject(projectName, templateName)
    })

// 利用monsterg-scripts启动项目
program
    .command('start')
    .description('启动项目...')
    .action(runStart)

// 利用monsterg-scripts 构建项目
program
    .command('build')
    .description("构建项目")
    .option('--dev', "开发模式")
    .action(runBuild)

program
    .command('analyzer')
    .description('分析项目')
    .action(runAnalyzer)

// 加上这一句，才能打印出信息
program.parse(process.argv)

// 执行start命令
function runStart() {
    portfinder.basePort = 3000
    portfinder
        .getPortPromise()
        .then(port => {
            process.env.PORT = port + ''

            const projectPath = `${process.cwd()}/node_modules`

            spawn.sync(
                'cross-env',
                [
                    'NODE_ENV=development',
                    `${projectPath}/webpack-dev-server/bin/webpack-dev-server.js`,
                    '--config',
                    require.resolve("../scripts/start.js"),
                    '--progress'
                ],
                {
                    stdio: 'inherit'
                }
            )
        })
        .catch()
}

// 执行build命令
function runBuild(options) {
    const projectPath = `${process.cwd()}/node_modules`
    const args = [
        `NODE_ENV=${options.dev ? 'development' : 'production'}`,
        `${projectPath}/webpack/bin/webpack.js`,
        '--config',
        require.resolve('../scripts/build.js')
    ]

    spawn.sync('cross-env', args, {
        stdio: 'inherit'
    })
}

// 执行anzlyzer
function runAnalyzer() {
    const projectPath = `${process.cwd()}/node_modules`
    const args = [
        'ANALYZER=true',
        'NODE_ENV=production',
        `${projectPath}/webpack/bin/webpack.js`,
        '--config',
        require.resolve('../scripts/build.js')
    ]

    spawn.sync('cross-env', args, {
        stdio: 'inherit'
    })
}

