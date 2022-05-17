import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Home from "./home/home";

const Routes = () => {
  return useRoutes([{ path: "/", element: <Home /> }]);
};

function App() {
  return (
    <Router>
      <Routes />
    </Router>
  );
}

export default App;
