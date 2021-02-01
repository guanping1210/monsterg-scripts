#!/usr/bin/env node
"use strict";

var _commander = _interopRequireDefault(require("commander"));

var _portfinder = _interopRequireDefault(require("portfinder"));

var _crossSpawn = _interopRequireDefault(require("cross-spawn"));

var _fsExtra = _interopRequireWildcard(require("fs-extra"));

var _package = _interopRequireDefault(require("../package.json"));

var _config = require("../config");

var _createApp = require("./create-app");

var _ncp = _interopRequireDefault(require("ncp"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 自动分配端口
const program = new _commander.default.Command();
program.version(_package.default.version, "-v, --version");
program.command("test <projectName>").description("测试node命令").action(function (projectName, options) {
  console.log("success: ", projectName, options);
}); // 新建模板项目

program.command("create <projectName>").description("创建新项目").option("--react", "创建微服务react主应用模板").option("--vue", "创建微服务vue主应用模板").option("--react-sub", "创建微服务react子应用模板项目").option("--vue-sub", "创建微服务react子应用模板项目").action(function (projectName, options) {
  // 这儿匹配多个模板项目，所以用key值作为唯一值
  let templateName = "react";

  if (options.vue) {
    templateName = "vue";
  } else if (options.subReact) {
    templateName = "subReact";
  } else if (options.subVue) {
    templateName = "subVue";
  }

  (0, _createApp.createProject)(projectName, templateName);
}); // 启动项目

program.command("start").description("启动项目...").action(runStart); // 构建项目

program.command("build").description("构建项目").option("--prod", "生产模式模式").action(runBuild);
program.command("eject").description("暴露配置文件").action(runEject);
program.command("analyzer").description("分析项目").action(runAnalyzer); // 加上这一句，才能打印出信息

program.parse(process.argv); // 执行start命令

function runStart() {
  // TODO：后续开放配置文件之后，需要读取用户自定义配置的端口号
  _portfinder.default.basePort = 3000;

  _portfinder.default.getPortPromise().then(port => {
    process.env.PORT = port + "";
    const projectPath = `${process.cwd()}/node_modules`;

    _crossSpawn.default.sync("cross-env", ["NODE_ENV=development", `${projectPath}/webpack-dev-server/bin/webpack-dev-server.js`, "--config", require.resolve("../scripts/start.js"), "--progress"], {
      stdio: "inherit"
    });
  }).catch();
} // 执行build命令


function runBuild(options) {
  const projectPath = `${process.cwd()}/node_modules`;
  const args = [`NODE_ENV=${options.dev ? "development" : "production"}`, `${projectPath}/webpack/bin/webpack.js`, "--config", require.resolve("../scripts/build.js")];

  _crossSpawn.default.sync("cross-env", args, {
    stdio: "inherit"
  });
} // 执行anzlyzer


function runAnalyzer() {
  const projectPath = `${process.cwd()}/node_modules`;
  const args = ["ANALYZER=true", "NODE_ENV=production", `${projectPath}/webpack/bin/webpack.js`, "--config", require.resolve("../scripts/build.js")];

  _crossSpawn.default.sync("cross-env", args, {
    stdio: "inherit"
  });
} // 执行eject --> 主要就是把配置文件搞个文件夹暴露出来,配置文件需要从node_modules下面去找寻到
// 需要把config和scripts都放出来，然后修改package.json里面的scripts


function runEject() {
  const {
    type = ''
  } = require(`${(0, _config.resolveApp)('')}/package.json`);

  const isReact = type.includes('react');
  (0, _ncp.default)(isReact ? (0, _config.resolveScriptPath)('scripts/react') : (0, _config.resolveScriptPath)('scripts/vue'), 'config', function (err) {
    if (err) {
      return console.error(err);
    }

    console.log('配置初始化完成');
  });
  ['build.js', 'utils.js'].forEach(filename => {
    if (!_fsExtra.default.existsSync('scripts')) {
      _fsExtra.default.ensureDir('scripts');
    }

    (0, _ncp.default)((0, _config.resolveScriptPath)(`scripts/${filename}`), `scripts/${filename}`, function (err) {
      if (err) {
        return console.error(err);
      }
    });
  });

  _fsExtra.default.outputFileSync('test/start.js', `
    const path = require("path");
    const { isReactBuild } = require("./utils");

    module.exports = function() {
      return require('../config/webpack.dev')
    }
  `); // ncp(resolveScriptPath('scripts/start.js') , 'scripts', function(err) {
  //   if(err) {
  //       return console.error(err)
  //   }
  //   console.log(('配置初始化完成'))
  // }) 

}