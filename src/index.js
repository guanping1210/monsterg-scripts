#!/usr/bin/env node

import commander from "commander";
import portfinder from "portfinder"; // 自动分配端口
import spawn from "cross-spawn";
import fs from 'fs-extra'

import packageJson from "../package.json";
import { resolveApp, resolveScriptPath, appDirectory } from '../config'
import { createProject } from "./create-app";
import ncp from "ncp";
import { fstat } from "fs-extra";

const program = new commander.Command();

program.version(packageJson.version, "-v, --version");

program
  .command("test <projectName>")
  .description("测试node命令")
  .action(function(projectName, options) {
    console.log("success: ", projectName, options);
  });

// 新建模板项目
program
  .command("create <projectName>")
  .description("创建新项目")
  .option("--react", "创建微服务react主应用模板")
  .option("--vue", "创建微服务vue主应用模板")
  .option("--react-sub", "创建微服务react子应用模板项目")
  .option("--vue-sub", "创建微服务react子应用模板项目")
  .action(function(projectName, options) {
    // 这儿匹配多个模板项目，所以用key值作为唯一值
    let templateName = "react";

    if (options.vue) {
      templateName = "vue";
    } else if (options.subReact) {
      templateName = "subReact";
    } else if (options.subVue) {
      templateName = "subVue";
    }

    createProject(projectName, templateName);
  });

// 启动项目
program
  .command("start")
  .description("启动项目...")
  .action(runStart);

// 构建项目
program
  .command("build")
  .description("构建项目")
  .option("--prod", "生产模式模式")
  .action(runBuild);

program
  .command("eject")
  .description("暴露配置文件")
  .action(runEject);

program
  .command("analyzer")
  .description("分析项目")
  .action(runAnalyzer);

// 加上这一句，才能打印出信息
program.parse(process.argv);

// 执行start命令
function runStart() {
  // TODO：后续开放配置文件之后，需要读取用户自定义配置的端口号
  portfinder.basePort = 3000;
  portfinder
    .getPortPromise()
    .then(port => {
      process.env.PORT = port + "";

      const projectPath = `${process.cwd()}/node_modules`;

      spawn.sync(
        "cross-env",
        [
          "NODE_ENV=development",
          `${projectPath}/webpack-dev-server/bin/webpack-dev-server.js`,
          "--config",
          require.resolve("../scripts/start.js"),
          "--progress"
        ],
        {
          stdio: "inherit"
        }
      );
    })
    .catch();
}

// 执行build命令
function runBuild(options) {
  const projectPath = `${process.cwd()}/node_modules`;
  const args = [
    `NODE_ENV=${options.dev ? "development" : "production"}`,
    `${projectPath}/webpack/bin/webpack.js`,
    "--config",
    require.resolve("../scripts/build.js")
  ];

  spawn.sync("cross-env", args, {
    stdio: "inherit"
  });
}

// 执行anzlyzer
function runAnalyzer() {
  const projectPath = `${process.cwd()}/node_modules`;
  const args = [
    "ANALYZER=true",
    "NODE_ENV=production",
    `${projectPath}/webpack/bin/webpack.js`,
    "--config",
    require.resolve("../scripts/build.js")
  ];

  spawn.sync("cross-env", args, {
    stdio: "inherit"
  });
}

// 执行eject --> 主要就是把配置文件搞个文件夹暴露出来,配置文件需要从node_modules下面去找寻到
// 需要把config和scripts都放出来，然后修改package.json里面的scripts
function runEject() {
    const { type = '' } = require(`${resolveApp('')}/package.json`)
    const isReact = type.includes('react');

    ncp(isReact ? resolveScriptPath('scripts/react') : resolveScriptPath('scripts/vue') , 'config', function(err) {
      if(err) {
          return console.error(err)
      }

      console.log(('配置初始化完成'))
  });

  [ 'build.js', 'utils.js'].forEach(filename => {
    if(!fs.existsSync('test')) {
      fs.ensureDir('test')
    }
    ncp(resolveScriptPath(`scripts/${filename}`) , `test/${filename}`, function(err) {
      if(err) {
          return console.error(err)
      }
    }) 
  })

  fs.outputFileSync('test/start.js', `
    const path = require("path");
    const { isReactBuild } = require("./utils");

    module.exports = function() {
      return require('../config/webpack.dev')
    }
  `)

  // 修改package.json中的scripts命令
  // TODO: 目前暂时用webpack-dev-server来替代项目的运行，后续需要自己写逻辑，来按照devServer的样子执行start
  // 修改每个模板项目下的package.json中的monsterg-script的地址
  const jsonPath = resolveApp('package.json')
  const data = fs.readJsonSync(jsonPath);
  data.scripts["start"] = 'webpack-dev-server --config ./config/webpack.dev.js';
  data.scripts["build"] = 'webpack --config ./config/webpack.dev.js';
  fs.outputJsonSync(jsonPath, data);
}
