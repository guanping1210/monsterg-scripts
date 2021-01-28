import ReactDOM from "react-dom";
import App from "./App.jsx";

// 挂载的节点不同
function render(props) {
  const { container } = props;
  ReactDOM.render(
    <App />,
    container
      ? container.querySelector("#root")
      : document.querySelector("#root")
  );
}

// 不是微服务，挂载自己的节点
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log("qiankun sub app");
}

// 能够从主应用获取传递过来的state以及修改state的事件
export async function mount(props) {
  props.onGlobalStateChange((state, prev) => {
    console.log("子应用", state, prev);
  });

  props.setGlobalState({
    name: "hello qiankun "
  });

  render(props);
}

export async function unmount(props) {
  const { container } = props;

  ReactDOM.unmountComponentAtNode(
    container
      ? container.querySelector("#root")
      : document.querySelector("#root")
  );
}
