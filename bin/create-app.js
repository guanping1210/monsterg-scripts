"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProject = createProject;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _chalk = _interopRequireDefault(require("chalk"));

var _ncp = require("ncp");

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 系统fs模块的扩展
// 彩色信息
// 新建文件夹、复制文件
const templateProject = {
  'react': 'react-mfe-main',
  'vue': 'vue-mfe-main',
  'subReact': 'react-mfe-sub',
  'subVue': 'vue-mfe-sub'
}; // 复制template下面的指定模板到新项目下面去
// project表示项目文件夹名字，isSub表示复制的是子应用还是主应用

function createProject(projectName, templateName) {
  // 检测文件夹是否已经存在，存在则退出进程
  checkProjectExist(projectName);

  const appPath = _path.default.resolve(__dirname, '..');

  cloneTemplate(`${appPath}/template/${templateProject[templateName]}`, projectName);
}

function checkProjectExist(projectName) {
  if (_fsExtra.default.existsSync((0, _config.resolveApp)(projectName))) {
    console.log(_chalk.default.yellow(`${_chalk.default.blue(projectName)} 已经存在于当前目录`)); // 退出进程，后面的流程都不会执行

    process.exit(1);
  }
} // 复制模板文件到指定目录下


function cloneTemplate(source, dest) {
  console.log('clone', source, dest);
  (0, _ncp.ncp)(source, dest, function (err) {
    if (err) {
      return console.error(err);
    }

    console.log(_chalk.default.yellow('项目初始化完成'));
  });
}