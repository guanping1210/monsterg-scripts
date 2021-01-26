#!/usr/bin/env node
"use strict";

var _commander = _interopRequireDefault(require("commander"));

var _portfinder = _interopRequireDefault(require("portfinder"));

var _crossSpawn = _interopRequireDefault(require("cross-spawn"));

var _package = _interopRequireDefault(require("../package.json"));

var _createApp = require("./create-app");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const program = new _commander.default.Command();
program.version(_package.default.version, '-v, --version');
program.command('test <projectName>').description('测试node命令').action(function (projectName, options) {
  console.log('success: ', projectName, options);
});
program.command('start').description('启动项目...').action(runStart);
program.command('create <projectName>').description('创建新项目').option('--react', '创建微服务react主应用模板').option('--vue', '创建微服务vue主应用模板').option('--sub-react', '创建微服务react子应用模板项目').option('--sub-vue', '创建微服务react子应用模板项目').action(function (projectName, options) {
  // 这儿匹配多个模板项目，所以用key值作为唯一值, 如果key为空，默认选用--react
  const templateName = Object.keys(options)[0] || 'react';
  (0, _createApp.createProject)(projectName, templateName);
}); // 加上这一句，才能打印出信息

program.parse(process.argv);

function runStart() {
  _portfinder.default.basePort = 3000;

  _portfinder.default.getPortPromise().then(port => {
    process.env.PORT = port + '';
    const projectPath = `${process.cwd()}/node_modules`;

    _crossSpawn.default.sync('cross-env', ['NODE_ENV=development', `${projectPath}/webpack-dev-server/bin/webpack-dev-server.js`, '--config', require.resolve("../scripts/start.js"), '--progress'], {
      stdio: 'inherit'
    });
  }).catch();
}