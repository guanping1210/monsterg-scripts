##### monsterg-scripts 脚手架

- 提供命令行工具`monsterg-scripts`<br/>
- 提供全局的 webpack 配置文件，在模板项目里通过安装 scripts 来实现

##### 目前提供的功能

- 提供 Vue 和 React 项目的模板创建
- 运行项目的 start 命令已经开发完成
- react 模板项目利用 qiankun 完成微服务的搭建

##### TODOList

- 项目的 build 命令 待开发中
- vue 模板的微服务搭建 待开发中
- 微服务项目主应用的路由刷新问题 待修复中

##### 使用

1、全局安装

```
    yarn global add monsterg-scripts
    npm install -g monsterg-scripts
```

2、创建模板项目

该脚手架意在于能够创建 react 模板，也能够创建 vue 模板项目
提供如下命令参数：

- --react: react 主项目模板
- --subReact: react 子项目模板
- --vue: vue 主项目模板
- --subVue: vue 子项目模板

```
    monsterg-scripts create PROJECT_NAME
```

3、在项目根目录下安装依赖包

```
    yarn
    或者
    npm install
```

4、 启动项目

```
    yarn start
    或者
    npm run start
```
