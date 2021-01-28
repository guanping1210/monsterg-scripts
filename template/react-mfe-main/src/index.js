import ReactDOM from "react-dom";
import { registerMicroApps, start, initGlobalState } from "qiankun";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));

/**
 * 下面的代码是根据qiankun这个库实现的微服务，如果不需要，注释掉或者删除以下代码即可
 */

// qiankun: 微服务框架
// 主应用中定义state, 可以传递给子应用使用
// 主应用中提供了修改state的方法，在子应用中可以使用
const initialState = { name: "微服务React主应用" };

const actions = initGlobalState(initialState);
actions.onGlobalStateChange((state, prev) => {
  console.log("主应用", state, prev);
});
actions.setGlobalState(initialState);
actions.offGlobalStateChange();

// 加载子应用，可以是react应用，也可以是vue应用，配置好基础信息就可以使用
// name: 子应用名字
// entry: 子应用访问路径
// container：子应用挂载到主应用的哪个DOM节点上
// activeRule：子应用代码所在的目录

// 本地开发的时候，activeRule一定要和子应用的文件夹名对应起来
registerMicroApps([
  {
    name: "subApp",
    entry: "http://localhost:3000",
    container: "#sub-root",
    activeRule: "react-mfe-sub"
  }
]);

start();
