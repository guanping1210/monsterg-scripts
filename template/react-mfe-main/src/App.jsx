import { Link, BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <h4>react主应用</h4>
      <p>
        <Link to="/sub-app/about">子应用</Link>
      </p>
      <div id="sub-root"></div>
    </BrowserRouter>
  );
};

export default App;
