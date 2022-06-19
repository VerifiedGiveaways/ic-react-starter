import React, { useEffect } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Home from "./home/home";
import { useAuthStore } from "../store/authStore";

const Routes = () => {
  return useRoutes([{ path: "/", element: <Home /> }]);
};

const App = () => {
  const getIdentity = useAuthStore((state) => state.getIdentity);

  // initialize auth state after refresh
  useEffect(() => {
    getIdentity();
  });

  return (
    <Router>
      <Routes />
    </Router>
  );
};

export default App;
