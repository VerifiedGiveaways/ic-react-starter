import React, { useState } from "react";
import { getAccountActor } from "../../services/actors/actorService";

const Home = () => {
  const [name, setName] = useState("");
  const [greeeting, setGreeting] = useState("");

  const getGreeting = async () => {
    const actor = await getAccountActor();
    const value = await actor.greet(name);
    setGreeting(value);
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
        <div></div>
      </nav>
      <header></header>
      <main>
        <form action="#">
          <label htmlFor="name">Enter your name: &nbsp;</label>
          <input
            alt="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" onClick={getGreeting}>
            Click Me!
          </button>
        </form>
        <section id="greeting">{greeeting}</section>
      </main>
    </>
  );
};

export default Home;
