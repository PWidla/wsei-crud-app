import { useState, useEffect } from "react";
import "./App.css";
import Header from "./Layout components/Header";
import Main from "./Layout components/Main";
import { User } from "./Common/Types";
import Login from "./Layout components/Login";
import UsersProvider from "./Common/Context";

function App() {
  let entities = ["Posts", "Comments", "Albums", "Users"];

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
      setSelectedEntity(entities[1]);
    }
  }, [loggedInUser]);

  return (
    <UsersProvider>
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
    </UsersProvider>
  );
}

export default App;
