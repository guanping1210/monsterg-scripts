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

program
    .command('start')
    .description('启动项目...')
    .action(runStart)

program
    .command('create <projectName>')
    .description('创建新项目')
    .option('-s, --sub', '创建微服务子应用模板项目')
    .action(function(projectName, options) {
        createProject(projectName, options.sub)
    })

// 加上这一句，才能打印出信息
program.parse(process.argv)

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

