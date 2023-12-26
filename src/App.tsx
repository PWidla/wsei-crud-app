import { useState, useEffect } from "react";
import "./App.css";
import Header from "./Layout components/Header";
import Main from "./Layout components/Main";
import { User } from "./Common/types";
import Login from "./Layout components/Login";

function App() {
  let entities = ["Posts", "Comments"];

  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const handleSelectEntity = (entity: string) => {
    setSelectedEntity(entity);
  };

  const handleLogin = (user: User) => {
    setLoggedInUser(user);
  };

  useEffect(() => {
    if (entities.length > 0) {
      setSelectedEntity(entities[0]);
    }
  }, [loggedInUser]);

  return (
    <>
      {loggedInUser ? (
        <>
          <Header entities={entities} onSelectEntity={handleSelectEntity} />
          <Main selectedEntity={selectedEntity} />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
