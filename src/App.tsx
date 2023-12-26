import { useState } from "react";
import "./App.css";
import Header from "./Layout components/Header";
import Main from "./Layout components/Main";
import { LoginData } from "./Common/types";
import Login from "./Layout components/Login";

function App() {
  let entities = ["Posts", "Comments"];

  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const handleSelectEntity = (entity: string) => {
    setSelectedEntity(entity);
  };

  const [loggedInUser, setLoggedInUser] = useState<LoginData | null>(null); // Use LoginData

  const handleLogin = (user: LoginData) => {
    setLoggedInUser(user);
  };

  return (
    <>
      {!loggedInUser ? (
        <>
          <Login onLogin={handleLogin} />
        </>
      ) : (
        <>
          <Header entities={entities} onSelectEntity={handleSelectEntity} />
          <Main selectedEntity={selectedEntity} />
        </>
      )}
    </>
  );
}

export default App;
