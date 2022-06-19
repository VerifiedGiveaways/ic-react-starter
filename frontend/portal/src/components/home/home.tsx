import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

const Home = () => {
  // example for getting principal (not intended for production use)
  const [principalId, setPrincipalId] = useState("");

  const { loggedIn, getIdentity, login, logout } = useAuthStore((state) => ({
    loggedIn: state.loggedIn,
    getIdentity: state.getIdentity,
    login: state.login,
    logout: state.logout,
  }));

  useEffect(() => {
    const handleLoggedIn = async () => {
      const identity = await getIdentity();
      if (identity) {
        setPrincipalId(identity.getPrincipal().toString());
      }
    };

    if (loggedIn) {
      handleLoggedIn();
    }
  }, [loggedIn]);

  const onLogin = async () => {
    login();
  };

  const onLogout = async () => {
    logout();
    setPrincipalId("");
  };

  return (
    <>
      <nav style={{ alignItems: "center", margin: "10px" }}>
        <div>
          <img src="/images/logo.png" />
        </div>
        <div>
          <h1 style={{ margin: "0" }}>Verified Giveaways</h1>
        </div>
      </nav>
      <header></header>
      <main>
        <form action="#">
          {loggedIn ? (
            <button type="submit" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <button type="submit" onClick={onLogin}>
              Login with Internet Identity
            </button>
          )}
          <div>Principal: {principalId}</div>
          <div>LoggedIn: {loggedIn ? "true" : "false"}</div>
        </form>
      </main>
    </>
  );
};

export default Home;
