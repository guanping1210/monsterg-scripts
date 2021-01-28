import ReactDOM from "react-dom";
import { registerMicroApps, start, initGlobalState } from "qiankun";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));

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
// activeRule：子应用的前缀路径
registerMicroApps([
  {
    name: "appName",
    entry: "http://localhost:3000",
    container: "#sub-root",
    activeRule: "subName"
  }
]);

start();
