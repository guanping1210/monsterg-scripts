#### TODO-LIST

- build 打包
- 开放配置文件
- 性能优化
  - 支持 css 独立打包 (mini-css-extract-plugin 提供抽离、引入；optimize-css-assets-webpack-plugin 实现 css 压缩)
  - thunk 分包（optimization.splitChunk）
  - 支持第三方插件独立打包
  - 支持 JS/CSS 压缩打包 (webpack-parallel-uglify-plugin 多线程打包 JS 文件)
  - 支持离线加载应用
  - 支持多线程打包
  - 实现 DLL 打包第三方插件
- 待添加功能
  - 路由配置
  - redux 状态管理
- 提供用户自定义配置
- 添加 eslint
- 支持 typescript
- 支持代理配置

#### 1.0.7 支持 eject 暴露配置文件

    问题：目前是暂时用webpack-dev-server和webpack跑起来文件的。需要用自定义的命令，实现项目的跑动

#### 1.0.6 支持 build 打包

    实现样式文件独立压缩打包；
    thunk分包；
    JS多线程打包；

##### 1.0.4 修复 npm 版本的 monsterg-scripts 指向

##### 1.0.2 新增本地测试 CLI 相关的脚本

    新增package.json的scripts命令：
        template：打包monsterg-scripts源码到模板项目的lib目录下，方便本地测试；
        clear：清空模板项目下的lib，修正模板下package.json中的脚手架路径，方便发布上线
    新增功能：
        - react相关模板融合了qiankun微服务框架，目前能够本地开发了。(但是主应用访问子应用然后刷新有问题，待修复)

##### 1.0.1 添加 vue 模板项目

##### 1.0.0 搭建脚手架基本骨架

    实现的功能有：
        基础命令的开发；
        模板文件的复制；

##### 本地测试 CLI:

    本地发布之前，需要先删除旧版本，也就是先执行npm uninstall monsterg-scripts -g

    再执行npm install -g 发布到本地，本地就可以使用monsterg-scripts命令了

##### 本地项目内部依赖了 monsterg-scripts

    本地项目下新建一个lib/monsterg-scripts目录，把源码文件拷贝到该目录下；
    然后修改package.json的monsterg-scripts,把路径指向'file/lib/monsterg-scripts', 就能够测试本地开发的scripts了。
    这样执行yarn的时候，就会把拉取本地的monsterg-scripts到node_modules下面

    目前每个模板项目都建立一个lib文件夹，到时候把本地的scripts相关文件拷贝到lib下面，完成本地测试。（单独写一个执行文件更替的命令）
