import { BrowserRouter, Route } from "react-router-dom";
import About from "./About.jsx";
import UserInfo from "./UserInfo.jsx";

const App = () => {
  return (
    <BrowserRouter
      basename={window.__POWERED_BY_QIANKUN__ ? "/my-react-app" : "/"}
    >
      <Route path="/about" component={About} />
      <Route path="/userinfo" component={UserInfo} />
    </BrowserRouter>
  );
};

export default App;
