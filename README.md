##### scripts 脚手架

- 提供命令行工具`scripts`<br/>
- 提供全局的 webpack 配置文件，在模板项目里通过安装 scripts 来实现

##### 使用

1、全局安装

```
    yarn global add monsterg-scripts
    npm install -g monsterg-scripts
```

2、创建模板项目

该脚手架意在于能够创建 react 模板，也能够创建 vue 模板
提供如下命令参数：
--react: react 主项目模板
--subReact: react 子项目模板
--vue: vue 主项目模板
--subVue: vue 子项目模板

```
    monsterg-scripts create PROJECT_NAME
```

3、在项目根目录下安装依赖包

```
    yarn
    或者
    npm install
```

<!--
    "test": "rm -rf hh && node ./bin/index.js create hh --react && node ./bin/index.js start"
 -->
