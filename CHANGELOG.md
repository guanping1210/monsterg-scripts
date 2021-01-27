##### 1.0.1 发布上线测试

##### 1.0.0 搭建脚手架基本骨架

    实现的功能有：
        基础命令的开发；
        模板文件的复制；

##### 本地测试 CLI:

    npm install -g 可以发布到本地，本地就可以使用monsterg-scripts命令了

##### 本地项目内部依赖了 monsterg-scripts

    本地项目下新建一个lib/monsterg-scripts目录，把源码文件拷贝到该目录下；
    然后修改package.json的monsterg-scripts,把路径指向'file/lib/monsterg-scripts', 就能够测试本地开发的scripts了。
    这样执行yarn的时候，就会把拉取本地的monsterg-scripts到node_modules下面

    目前每个模板项目都建立一个lib文件夹，到时候把本地的scripts相关文件拷贝到lib下面，完成本地测试。（单独写一个执行文件更替的命令）
